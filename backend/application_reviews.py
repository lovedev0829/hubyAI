import os, sys
from flask import Flask, render_template, redirect, url_for, request, json, jsonify
from bson.objectid import ObjectId
from oauth2 import OAuth2
from authorization import Authorization 
from time import time # for timestamping
from configparser import ConfigParser
#sys.path.insert(0, 'utils')
from utils.email_util import EmailUtil
class ApplicationReviews:
    def __init__(self, app, request, dbCon):
        self.app        = app
        self.request    = request
        self.dbCon      = dbCon
        self.oauth2     = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        self.collection = "application_reviews"
        config      = ConfigParser()
        configFile  = os.getenv("WorkingDirectory") + "/huby.cfg"
        config.read(configFile)
        from_email  = config.get('Default', 'from_email')
        if from_email   == "":
            from_email  = "support@huby.ai"
        self.from_email = from_email

    #--- This function allows reviewers who get an email link to provide application reviews.    -----------#
    #--- What happens if the reviewer getting the link is logged in on huby?  For now let's ignore that.
    #--- We will have a separate function for logged in users who want to give f/b w/o email link - involves application selection etc. --#
    def create_application_reviews(self, application_id = ""):
         #-- Assume that validation of incoming app/prototype review requests will happen in some sort of a controller.
        self.app.logger.info('Preparing the app/prototype review requests record for adding it to application_reviews collection')
        #--- No authentication needed here. But verify that application id and email are there and they exist in app review_requests too ---#
        if application_id == "":
            self.app.logger.error('Invalid app review submission;  application_id (a required field) missing in review submission.')
            return jsonify({'error': 'Invalid app review submission;  application_id (a required field) missing in review submission.'}), 400
        
        data = self.request.get_json()
        if "reviews" not in data or len(data["reviews"]) < 1:
            self.app.logger.error('Invalid app reiview submission; There needs to be at least one review in the submission. Nothing saved.')
            return jsonify({'error': 'Invalid app reiview submission; There needs to be at least one review in the submission. Nothing saved.'}), 400
        
        if "reviewer_email" not in data:
            self.app.logger.error('Invalid app reiview submission; The reviewer_email is required in the submission. Nothing saved.')
            return jsonify({'error': 'Invalid app reiview submission; The reviewer_email is required in the submission. Nothing saved.'}), 400
       
        reviewer_email  = data["reviewer_email"]
        if reviewer_email == "":
            self.app.logger.error('Invalid app review submission;  reviewer_email (a required field) missing in review submission.')
            return jsonify({'error': 'Invalid app review submission; reviewer_email (a required field) missing in review submission.'}), 400
        # now validate that reviewer_email in the review_submission is one of those requested in application_review_requests
        app_review_requests_collection       = "application_review_requests"
        fieldName                   = "application_id"
        fieldValue                  = application_id
        try:
            app_review_requests     = self.dbCon.get_documents_by_field(app_review_requests_collection, fieldName, fieldValue )
        except Exception as e:
            self.app.logger.error("ApplicationReviews.create_application_reviews(): Error retrieving application review requests for application id " + application_id + " with error {}". format(e))
            return jsonify({"error": "Error retrieving application review requests for application id " + application_id + " with error {}". format(e)}), 400
        reviewer_email_found    = False
        for app_review_request in app_review_requests:
            if reviewer_email in app_review_request["reviewer_emails"]:
                reviewer_email_found = True
        if not reviewer_email_found:
            self.app.logger.error("ApplicationReviews.create_application_reviews(): Error - email {} not found in application review requests for application {}".format(reviewer_email, application_id))
            return jsonify({"error": "email {} not found in application review requests for application {}".format(reviewer_email, application_id)}), 400
        #validate the application
        appCollection       = "applications"
        fieldName           = "_id"
        fieldValue          = ObjectId(application_id)
        try:
            apps = self.dbCon.get_documents_by_field(appCollection, fieldName, fieldValue)
        except Exception as e: 
            self.app.logger.error("Data retrieval for application with application id {} failed with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(apps)    < 1:
            self.app.logger.error("ApplicationReview.create_application_review: No appplication found for the application id {}".format(application_id))
            return jsonify({"error": "No appplication found for the application id {}".format(application_id)}), 400 

        # we don't need to validate the values in the application json since it's already done in the controller
        try:
            reveiew_id = self.dbCon.insert_document(self.collection, data)
            result  = {"reveiew_id": reveiew_id}
            status = 201
        except Exception as e:
            self.app.logger.error('Error inserting app user review: %s', e)
            result = {'error': 'Failed to insert the app user review.'}
            status = 400
            return jsonify(result), status
        #TODO Generate email notification to the application owner 
        appOwnerCollection  = "application_ownership"
        fieldName           = "application_id"
        fieldValue          = application_id
        try:
            ownerships = self.dbCon.get_documents_by_field(appOwnerCollection, fieldName, fieldValue)
        except Exception as e: 
            self.app.logger.error("ApplicationReview.create_application_review: Data retrieval for application ownership with application id {} failed with error {}".format(application_id, e))
            return jsonify({"error": "Error in getting application ownership for notification" + format(e) }), 400
        if len(ownerships)    < 1:
            self.app.logger.error("ApplicationReview.create_application_review: No appplication ownership found for notification on the application id {}".format(application_id))
            return jsonify({"error": "No appplication found for the application id {}".format(application_id)}), 400 
        ownership   = ownerships[0]
        if "owner_email" in ownership:
            try:
                email_util = EmailUtil()
                subject     = "You just received a review for your application " 
                common_body = "Click the link below to view the review for your application. <br><br>"
                body    = common_body + self.API_DOMAIN + "/api/applications/" + application_id + "/reviews/" + reveiew_id + " <br>"
                body    += "<br><br> Please contact support@huby.ai if you have any questions. <br> Thank you!"

                response  = email_util.send_email(ownership["owner_email"], subject, body)
                if "success" in response and response["success"] != 1:
                    if "more" in result:
                        result["more"] += "Sending email to app owner had an issue: " + response["error"]
                    else:
                        result["more"]  =  "Sending email to app owner had an issue: " + response["error"]
                    self.app.logger.error('Error sending review notification email to the app owner: %s', response["error"])
            except Exception as e:
                self.app.logger.error('Exception sending review notification email to the app owner: %s', e)
        return jsonify(result), status

    def create_application_review_promoted(self, application_id):
        # This review is by a huby user promoted by huby. It does require the access_token because we want to be able to obtain the user_id for it.
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided for review topics.')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        user = self.oauth2.get_user_from_access_token(access_token)
        user_id = ""
        email   = ""
        if "user_id" in user and user["user_id"] != "":
            user_id = user["user_id"]
        if "email" in user and user["email"] != "":
            email = user["email"]
        data = self.request.get_json()
        if "reviews" not in data or len(data["reviews"]) < 1:
            self.app.logger.error('Invalid app reiview submission; There needs to be at least one review in the submission. Nothing saved.')
            return jsonify({'error': 'Invalid app reiview submission; There needs to be at least one review in the submission. Nothing saved.'}), 400
        #validate the application
        appCollection       = "applications"
        fieldName           = "_id"
        fieldValue          = ObjectId(application_id)
        try:
            apps = self.dbCon.get_documents_by_field(appCollection, fieldName, fieldValue)
        except Exception as e: 
            self.app.logger.error("Data retrieval for application with application id {} failed with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(apps)    < 1:
            self.app.logger.error("ApplicationReview.create_application_review: No appplication found for the application id {}".format(application_id))
            return jsonify({"error": "No appplication found for the application id {}".format(application_id)}), 400 
        data["user_id"]     = user_id
        data["email"]       = email
        data["created_by"]  = user_id
        data["created"]     = round(time())
        # we don't need to validate the values in the application json since it's already done in the controller
        try:
            reveiew_id = self.dbCon.insert_document(self.collection, data)
            result  = {"reveiew_id": reveiew_id}
            status = 201
        except Exception as e:
            self.app.logger.error('Error inserting app user review: %s', e)
            result = {'error': 'Failed to insert the app user review.'}
            status = 400
            return jsonify(result), status
        #TODO Generate email notification to the application owner 
        appOwnerCollection  = "application_ownership"
        fieldName           = "application_id"
        fieldValue          = application_id
        try:
            ownerships = self.dbCon.get_documents_by_field(appOwnerCollection, fieldName, fieldValue)
        except Exception as e: 
            self.app.logger.error("ApplicationReview.create_application_review_promoted: Data retrieval for application ownership with application id {} failed with error {}".format(application_id, e))
            return jsonify({"error": "Error in getting application ownership for notification" + format(e) }), 400
        if len(ownerships)    < 1:
            self.app.logger.error("ApplicationReview.create_application_review_promoted: No appplication ownership found for notification on the application id {}".format(application_id))
            return jsonify({"error": "No appplication found for the application id {}".format(application_id)}), 400 
        ownership   = ownerships[0]
        if "owner_email" in ownership:
            try:
                email_util = EmailUtil()
                subject     = "You just received a review for your application " 
                common_body = "Click the link below to view the review for your application. <br><br>"
                body    = common_body + self.API_DOMAIN + "/api/applications/" + application_id + "/reviews/" + reveiew_id + " <br>"
                body    += "<br><br>Please contact " + self.from_email + " if you have any questions. <br> Thank you!"

                response  = email_util.send_email(ownership["owner_email"], subject, body)
                if "success" in response and response["success"] != 1:
                    if "more" in result:
                        result["more"] += "Sending email to app owner had an issue: " + response["error"]
                    else:
                        result["more"]  =  "Sending email to app owner had an issue: " + response["error"]
                    self.app.logger.error('Error sending review notification email to the app owner: %s', response["error"])
            except Exception as e:
                self.app.logger.error('Exception sending review notification email to the app owner: %s', e)
        return jsonify(result), status


    def get_review_by_reveiew_id(self, application_id, reveiew_id):
        self.app.logger.info('ApplicationReviews.get_review_by_reveiew_id: get reviews for review id '. format(reveiew_id))
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        # application review can only be viewed by application owner.
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
        
        fieldName   = "_id"
        fieldValue  = ObjectId(reveiew_id)
        reviews     = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(reviews) > 0:
            review     = reviews[0]
        else:
            return jsonify({"error": "No review information found for the provided review id.".format(reveiew_id)}), 400
        review["_id"] = str(review.get("_id"))
        if "_id" in review:
            del review["_id"]
        return jsonify(review), 200
   
    def get_reviews_by_application_id(self, application_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('ApplicationReviews.get_reviews_by_application_id: get application reviews for application id '. format(application_id))
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        # application review can only be viewed by application owner.
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
        reviews = self.dbCon.get_documents_by_field_sorted(self.collection, fieldName, fieldValue, sortFields)
        if len(reviews) < 1:
            return jsonify({"error": "No review response records found for the provided application id.".format(application_id)}), 400

        for review in reviews:
            if "_id" in review:
                review["reveiew_id"] = str(review["_id"])
                del(review["_id"])
        print("review now: ".format(reviews))
        return jsonify(reviews), 200
                               
    
#--- Currently there's no update functionality for review responses since reviewers may not be users on the platform.
    
