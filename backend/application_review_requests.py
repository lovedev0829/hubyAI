import os, sys
from flask import Flask, render_template, redirect, url_for, request, json, jsonify
from bson.objectid import ObjectId
from oauth2 import OAuth2
from authorization import Authorization 
from time import time # for timestamping
#sys.path.insert(0, 'utils')
from utils.email_util import EmailUtil
class ApplicationReviewRequests:
    def __init__(self, app, request, dbCon):
        self.app        = app
        self.request    = request
        self.dbCon      = dbCon
        self.oauth2     = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        self.collection = "application_review_requests"
        if "API_DOMAIN" in os.environ:
            self.API_DOMAIN  =   os.getenv("API_DOMAIN")
        else:
            self.API_DOMAIN  = "http://localhost"

    def create_application_review_request(self):
         #-- Assume that validation of incoming app/prototype review requests will happen in some sort of a controller.
        self.app.logger.info('Preparing the app/prototype review requests record for adding it application_review_requests collection')
        #--- First authenticate the request with access token. See if this can be modularized. ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data = self.request.get_json()
        print("data in review request creation (check for application_id, review_topics, reviewer_emails): ", data)
        if "application_id" not in data or "review_topics" not in data or "reviewer_emails" not in data:
            self.app.logger.error('Invalid app user review request;  application_id, review_topics and reviewer_emalls  are required.')
            return jsonify({'error': 'Invalid app user review requests request;application_id, review_topics and reviewer_emalls are required.'}), 400
        if len(data["review_topics"]) < 1  or len(data["reviewer_emails"]) < 1:
            self.app.logger.error('Invalid app user review request; There needs to be at least one review topic from at least one person.')
            return jsonify({'error': 'Invalid app user review requests request; There needs to be at least one review topic from at least one person.'}), 400
        application_id      = data["application_id"]
        appCollection       = "applications"
        fieldName           = "_id"
        fieldValue          = ObjectId(application_id)
        try:
            apps = self.dbCon.get_documents_by_field(appCollection, fieldName, fieldValue)
        except Exception as e: 
            self.app.logger.error("Data retrieval for application with application id {} failed with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(apps) < 1:   #application not found.
            #---  check that this user is an owner of this application. If not, reject the request.
            self.app.logger.error("No application found for the supplied application id {} ".format(application_id))
            return jsonify({"error":"No application found for the supplied application id {}".format(application_id)}),400

        appCollection       = "applications"
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, appCollection, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing ownership permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions on application with id ".format(application_id)}),400

        crud_permissions = permissions["permissions"]
        if crud_permissions[0] != "1":
            self.app.logger.error("Missing ownership permissions for application id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions for application id ".format(application_id)}),400


            '''
            ownership_collection    = "application_ownership"
            fieldName               = "application_id"
            fieldValue              = application_id
            try:
                ownerships              = self.dbCon.get_documents_by_field(ownership_collection, fieldName, fieldValue)
            except Exception as e:
                self.app.logger.error("Retrieval of app ownership failed on application id {} with error {}".format(application_id, e))
                return jsonify({"error":"Retrieval of app ownership failed on application id {} with error {}".format(application_id, e)})
        else:
            self.app.logger.error('Invalid review request. No application found for the supplied application id.')
            return jsonify({'error': 'Invalid review request. No application found for the supplied application id..'}), 400
        print("ownership: {}".format(ownerships))
        if len(ownerships) < 1:
            self.app.logger.error('Invalid review request. No ownership record found for this application. One needs to be an application owner to request reviews.')
            return jsonify({'error': 'Invalid review request. No ownership record found for this application. One needs to be an application owner to request reviews.'}), 400
        ownership   = ownerships[0]
        if user_id != ownership["owner_id"] and user_id != ownership["secondary_owner_id"]: 
            self.app.logger.error('Invalid review request. One needs to be an application owner to request reviews.')
            return jsonify({'error': 'Invalid review request. No ownership record found for this application. One needs to be an application owner to request reviews.'}), 400
        '''

        data["created"] = round(time())
        if user_id:
            data["created_by"] = user_id
               
        # we don't need to validate the values in the application json since it's already done in the controller
        result = {}
        try:
            reveiew_request_id = self.dbCon.insert_document(self.collection, data)
            result  = {"reveiew_request_id": reveiew_request_id}
            status = 201
        except Exception as e:
            self.app.logger.error('Error inserting app user review requests information: %s', e)
            result = {'error': 'Failed to insert the app user review requests information'}
            status = 400
            return jsonify(result), status
        #TODO Generate email notifications with a link to the review page of this application; with email as a param; user should not be required to login 
        requester_name  = ""
        user    = self.oauth2.get_user_from_access_token(access_token)
        #print("user in application_review_requests.create:", user)
        if "first_name" in user and "last_name" in user:
            requester_name =  user["first_name"] + " " + user["last_name"]
        subject     = "Your friend " + requester_name + " needs your help reviewing their application " + apps[0]["application"]
        common_body = "Your friend " + requester_name + " has the following request for you:<br><br>" + data["request_note"] + "<br> Please take a few moments to do that by clicking the following link:<br>"
        try:
            email_util = EmailUtil()
            for reviewer_email in data["reviewer_emails"]:
                # changed the URL for embeded email
                #url    =  http://huby.ai/application/review/response?application_id=66b3230f3b79b56348aac434&reviewer_email=piwegor662@vasomly.com
                url     =  self.API_DOMAIN + "/application/review/response?application_id=" + application_id + "&reviewer_email=" + reviewer_email 
                body    = common_body + url + " <br>"
                body    += "<br><br> Please contact support@huby.ai if you have any questions. <br> Thank you!"

                response  = email_util.send_email(reviewer_email, subject, body)
                print("response from sending email:", response)
                if "success" in response and response["success"] != 1:
                    if "more" in result:
                        result["more"] += "Sending email had an issue: " + response["error"]
                    else:
                        result["more"]  =  "Sending email had an issue: " + response["error"]
                    self.app.logger.error('Error sending review request emails: %s', response["error"])
        except Exception as e:
            self.app.logger.error('Exception sending review request emails: %s', e)
            return jsonify({"error": "Exception sending review request emails: {}".format(e) }), 400
        return jsonify(result), status


    def get_review_request_by_review_request_id(self, reveiew_request_id):
        # We do need to check the token here and see if the request belongs to an app owned by the token user
        self.app.logger.info('ApplicationReviewRequests.get_review_requests_by_reveiew_request_id: get review requests for review requests id '. format(reveiew_request_id))
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        print("request: {}".format)
        print("access_token:", access_token)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        print("user_id:", user_id)
        fieldName   = "_id"
        fieldValue = ObjectId(reveiew_request_id)
        review_requests = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(review_requests) > 0:
            review_request     = review_requests[0]
        else:
            return jsonify({"error": "No review requests information found for the provided review requests id.".format(reveiew_request_id)}), 400
        # -- check that the application ownership belongs to this user
        if "application_id" not in review_request:
            self.app.logger.error("Invalid request: No application associated with this review request id {}".format(review_request_id))
            return jsonify({"error":"No application associated with this review request id {} ".format(review_request_id)}),400
        application_id      = review_request["application_id"]
        appCollection       = "applications"
        fieldName           = "_id"
        fieldValue          = ObjectId(application_id)
        try:
            apps = self.dbCon.get_documents_by_field(appCollection, fieldName, fieldValue)
        except Exception as e: 
            self.app.logger.error("Data retrieval for application with application id {} failed with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(apps) < 1:   #application not found.
            #---  check that this user is an owner of this application. If not, reject the request.
            self.app.logger.error("No application found for the supplied application id {} ".format(application_id))
            return jsonify({"error":"No application found for the supplied application id {}".format(application_id)}),400

        appCollection       = "applications"
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, appCollection, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing ownership permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions on application with id ".format(application_id)}),400

        crud_permissions = permissions["permissions"]
        if crud_permissions[1] != "1":
            self.app.logger.error("Missing ownership permissions for application id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions for application id ".format(application_id)}),400
        review_request["_id"] = str(review_request.get("_id"))
        if "_id" in review_request:
            del review_request["_id"]
        return jsonify(review_request), 200
    
        #--- This functionality is for product owners to see who all they've requested reviews from ----#
    def get_review_requests_by_application_id(self, application_id):
        # Here we need to check the token and app ownership of the provided application_id
        self.app.logger.info('ApplicationReviewRequests.get_review_requests_by_application_id: get application review requests for application id '. format(application_id))
        if application_id == "":
            jsonify({"error": "Application id is required for retrieving the review request."}), 400
        # - validate the token and application ownership
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        appCollection       = "applications"
        fieldName           = "_id"
        fieldValue          = ObjectId(application_id)
        try:
            apps = self.dbCon.get_documents_by_field(appCollection, fieldName, fieldValue)
        except Exception as e: 
            self.app.logger.error("Data retrieval for application with application id {} failed with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(apps) < 1:   #application not found.
            #---  check that this user is an owner of this application. If not, reject the request.
            self.app.logger.error("No application found for the supplied application id {} ".format(application_id))
            return jsonify({"error":"No application found for the supplied application id {}".format(application_id)}),400

        appCollection       = "applications"
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, appCollection, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing ownership permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions on application with id ".format(application_id)}),400

        crud_permissions = permissions["permissions"]
        if crud_permissions[1] != "1":
            self.app.logger.error("Missing ownership permissions for application id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions for application id ".format(application_id)}),400

        fieldName   = "application_id"
        fieldValue          = application_id
        sortFields             = ""             # It can be a list of tuples but we don't need this data sorted 
        review_requests = self.dbCon.get_documents_by_field_sorted(self.collection, fieldName, fieldValue, sortFields)
        if len(review_requests) < 1:
            return jsonify({"error": "No review requests record found for the provided application id.".format(application_id)}), 400
        # send the review request that was sent to this particular reviewer_email
        # Since this endpoint is not authenticated, in case the email is not supplied, we don't want to send all the records. 
        reviewer_email_found    = False        
        for review_request in review_requests:
            review_request["review_request_id"] = str(review_request["_id"])
            del review_request["_id"]
        return jsonify(review_requests), 200


    def get_review_requests_by_application_id_and_email(self, application_id, reviewer_email = ""):
        # No need to check token here if reviewer_email is provided but make sure it's one of the emails app owner entered
        self.app.logger.info('ApplicationReviewRequests.get_review_requests_by_application_id_and_email: get application review requests for application id '. format(application_id))
        if reviewer_email == "":
            jsonify({"error": "Email addressed is required as a query parameter to retrieve the review request."}), 400
        fieldName   = "application_id"
        fieldValue          = application_id
        sortFields             = ""             # It can be a list of tuples but we don't need this data sorted 
        review_requests = self.dbCon.get_documents_by_field_sorted(self.collection, fieldName, fieldValue, sortFields)
        if len(review_requests) < 1:
            return jsonify({"error": "No review requests record found for the provided application id.".format(application_id)}), 400
        # send the review request that was sent to this particular reviewer_email
        # Since this endpoint is not authenticated, in case the email is not supplied, we don't want to send all the records. 
        reviewer_email_found    = False        
        for review_request in review_requests:
            if reviewer_email in review_request["reviewer_emails"]:
                reviewer_email_found = True
                break 
        if not reviewer_email_found:
            self.app.logger.error("ApplicationReviews.get_review_requests_by_application_id_and_email(): Error - reviewer email {} not found in application review requests for application {}".format(reviewer_email, application_id))
            return jsonify({"error": "Reviewer email {} not found in application review requests for application {}".format(reviewer_email, application_id)}), 400

        if "_id" in review_request:
            review_request["reveiew_request_id"] = str(review_request["_id"])
            del(review_request["_id"])
        print("review request now: ".format(review_request))
        return jsonify(review_request), 200                              
    
    def get_review_topics_by_application(self, application_id):
        #-- Get a distinct list of topics for the application to be presented to users who are interested in writing reviews
        self.app.logger.info('Preparing the list of review topics from the application_review_requests collection to be used by unsolicited users')
        if application_id == "":
            self.app.logger.error("ApplicationReviews.get_review_topics_by_application(): Error - application_id is required.")
            return jsonify({"error": "Valid application_id is required." }), 400
        review_topics = []
        fieldName   = "application_id"
        fieldValue          = application_id
        sortFields             = ""             # It can be a list of tuples but we don't need this data sorted 
        review_requests = self.dbCon.get_documents_by_field_sorted(self.collection, fieldName, fieldValue, sortFields)
        #print("review_requests:", review_requests)
        if len(review_requests) > 0:
            for review_request in review_requests:
                if "review_topics" in review_request and len(review_request["review_topics"]) > 0 :
                    for review_topic in review_request["review_topics"]:
                        if review_topic not in review_topics:
                            review_topics.append(review_topic)
        return jsonify({"review_topics": review_topics}), 200
        

    def update_review_request_by_review_request_id(self, reveiew_request_id):
        self.app.logger.info('Preparing the review requests record for updating the application_review_requests collection')
        #--- First authenticate the request with access token ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400

        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data = self.request.get_json()
        #perform basic data validations
        if "application_id" not in data or "review_topics" not in data or "reviewer_emails" not in data:
            self.app.logger.error('Invalid app user review request;  application_id, review_topics and reviewer_emalls  are required.')
            return jsonify({'error': 'Invalid app user review requests request; application_id, review_topics and reviewer_emalls  are required.'}), 400
        if len(data["review_topics"]) < 1  or len(data["reviewer_emails"]) < 1:
            self.app.logger.error('Invalid app user review request; There needs to be at least one review topic from at least one person.')
            return jsonify({'error': 'Invalid app user review requests request; There needs to be at least one review topic from at least one person.'}), 400
        application_id      = data["application_id"]
        appCollection       = "applications"
        fieldName           = "_id"
        fieldValue          = ObjectId(application_id)
        try:
            apps = self.dbCon.get_documents_by_field(appCollection, fieldName, fieldValue)
        except Exception as e: 
            self.app.logger.error("Data retrieval for application with application id {} failed with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(apps) > 0:   #application found.
            #---  check that this user is an owner on this application. If not, reject the request.
            appCollection       = "applications"
            permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, appCollection, application_id)
            if permissions is None or "success" not in permissions or permissions["success"] is not True:
                self.app.logger.error("Missing ownership permissions on application with id {}".format(application_id))
                return jsonify({"error":"Missing ownership permissions on application with id ".format(application_id)}),400

            crud_permissions = permissions["permissions"]
            if crud_permissions[2] != "1":
                self.app.logger.error("Missing ownership permissions for application id {}".format(application_id))
                return jsonify({"error":"Missing ownership permissions for application id ".format(application_id)}),400
        else:
            self.app.logger.error("Review request update failed because no application found for review requests id {}.".format(reveiew_request_id))
            return jsonify({"error": "Review request update failed because no application found for review requests id {}.".format(reveiew_request_id) }), 400

        data["last_updated"] = round(time())
        if user_id:
            data["last_updated_by"] = user_id
        #--- We don't need any permission check here. All we need is that this record belongs to the user who created it and required values are supplied.
        fieldName   = "_id"
        try:
            fieldValue  = ObjectId(reveiew_request_id)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on application review requests id {} with error {}".format(reveiew_request_id, e))
            return jsonify({"error": format(e) }), 400
        fieldName   = "_id"
        fieldValue = ObjectId(reveiew_request_id)
        review_requests = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(review_requests) < 1:
            self.app.logger.error("No review requests information found for the provided review requests id.".format(reveiew_request_id))
            return jsonify({"error": "No review requests information found for the provided review requests id.".format(reveiew_request_id)}), 400
        review_request     = review_requests[0]
        if "review_topics" in data and data["review_topics"] != review_request["review_topics"]:
            review_request["review_topics"] = data["review_topics"]
        if "reviewer_emails" in data and data["reviewer_emails"] != review_request["reviewer_emails"]:
            review_request["reviewer_emails"] = data["reviewer_emails"]
        if "request_note" in data and data["request_note"] != review_request["request_note"]:
            review_request["request_note"] = data["request_note"]
        try:
            self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue, review_request)
            #print("update record in collection {} using field {} with field value {} and data {}".format(self.collection, fieldName, fieldValue, review_request))
        except Exception as e:
            self.app.logger.error("Review request update failed on application review requests id {} with error {}".format(reveiew_request_id, e))
            return jsonify({"error": format(e) }), 400
        return jsonify({"review_request_id": reveiew_request_id}), 200
               
        #TODO Generate email notifications with a link to the review page of this application; with email as a param; user should not be required to login 
        requester_name  = ""
        user    = self.oauth2.get_user_from_access_token(access_token)
        print("user in application_review_requests.update:", user)
        if "first_name" in user and "last_name" in user:
            requester_name =  user["first_name"] + " " + user["last_name"]
        subject     = "Your friend " + requester_name + " needs your help reviewing their application " + apps[0]["application"]
        common_body = "Your friend " + requester_name + " has the following request:\<br><br>" + data["request_note"] + "<br> Please take a few moments to do that by clicking the following link:<br>"
        result = {}
        try:
            email_util = EmailUtil()
            for reviewer_email in data["reviewer_emails"]:
                body    = common_body + self.API_DOMAIN + "/api/applications/" + application_id + "/review_responses?reviewer_email=" + reviewer_email  + " <br>"
                body    += "<br><br> Please contact support@huby.ai if you have any questions. <br> Thank you!"

                response  = email_util.send_email(reviewer_email, subject, body)
                print("response from sending email:", response)
                if "success" in response and response["success"] != 1:
                    if "more" in result:
                        result["more"] += "Sending email had an issue: " + response["error"]
                    else:
                        result["more"]  =  "Sending email had an issue: " + response["error"]
                    self.app.logger.error('Error sending review request emails: %s', response["error"])
        except Exception as e:
            self.app.logger.error('Exception sending review request emails: %s', e)
        return jsonify(result), status


    



