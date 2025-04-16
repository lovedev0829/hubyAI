import os, sys
from flask import Flask, render_template, redirect, url_for, request, json, jsonify
from flask_cors import CORS, cross_origin
from bson.json_util import dumps
from bson.objectid import ObjectId
from database import Database
from oauth2 import OAuth2
from authorization import Authorization 
from time import time, strftime, localtime # for timestamping
import requests #---- For calling 3rd party APIs e.g. validate Google APIs.
import re
from json import JSONDecodeError
from configparser import ConfigParser
from utils.email_util import EmailUtil
from utils.cloud_storage import CloudStorage
from users import Users

class Applications:
    def __init__(self, app, request, dbCon):
        self.app            = app
        self.request        = request
        self.collectionName = "applications"
        self.dbCon          = dbCon
        self.oauth2         = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        config      = ConfigParser()
        configFile  = os.getenv("WorkingDirectory") + "/huby.cfg"
        config.read(configFile) 
        self.from_email = config.get('Default', 'from_email')
        if self.from_email   == "":
            self.from_email  = "support@huby.ai"
        self.max_pages_to_scrape = config.get('CrawlScrape', 'max_pages_to_scrape')
        # initialize the applications class
        return
    def create_application(self, type):
        self.app.logger.info('Preparing the application record for writing to applications collection')
        #--- First authenticate the request with access token ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        #--- We don't need to check the permission to create an application but assign permission to this user as owner once app is created
        #--- Since any logged in user can submit an app; we need not validate their permission
        data = self.request.get_json()
        #print("data received is {}".format(data))
        #--- Do basic validation for required info:
        if "application" not in data or "description" not in data:
            self.app.logger.error('Application name (application) and description are required')
            return jsonify({'error': 'Bad request: Application name (application) and description are required'}), 400
        # Make sure that application is not already there (avoid duplicates)

        search_text = data["application"]
        field_name  = "application"
        query       = {field_name: {"$regex": f"^{search_text}$", "$options": "i"}}
        res_fields  = ["application"]
        apps        = self.dbCon.get_collection_docs_using_logical_query(self.collectionName, query, res_fields)
        if len(apps) > 0:
            return jsonify({f"error": "A product with name {search_text} already exists"}),400
        
        if data["application"] == "" or data["description"] == "":
           self.app.logger.error('Application name (application) and description are required')
           return jsonify({'error': 'Bad request: Application name (application) and description are required'}), 400
        data["type"] = type
        data["status"]  = "draft"
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["created"] = round(time())
        if user_id:
            data["created_by"] = user_id
        try:
            application_id = self.dbCon.insert_document(self.collectionName, data)
        except Exception as e:
            self.app.logger.error('Error inserting application: %s', e)
            result = {'error': 'Failed to insert the application'}
            status = 400
            return jsonify(result), status
        #--- update the permissions for this app by making this submitting user as the owner
        if application_id is None:
                result = {"Error": "Application creation failed. Check for the input."}
                status = 400
                return jsonify(result), status

        if type == "H":
            result  = {"prototype_id": application_id}
        else:
            result  = {"application_id": application_id}
        status = 201
        user     = self.oauth2.get_user_from_access_token(access_token)
        user_id = first_name = last_name = email = phone = ""
        # --- Set the user permission record in user_document_role collection
        user_role           = "owner"
        if "user_id" in user and user["user_id"] != "":
            user_id         = user["user_id"]
            #user_perms          = {"user_id": documentId, "collection_roles": {targetCollection: {"users": user_role} }}
            self.authorization.add_permission(access_token, user_id, self.collectionName, application_id, user_role)
            #self.app.logger.info("updated user permissions ")
            #--- Add the user to application_ownership collection too

            if "first_name" in user and user["first_name"] != "":
                first_name  =  user["first_name"]
            if "last_name" in user and user["last_name"] != "":
                last_name   =  user["last_name"]
            if "email" in user and user["email"] != "":
                email       =  user["email"]
            if "phone" in user and user["phone"] != "":
                phone       =  user["phone"]
            ownership_record    = {}
            ownership_record["application_id"]          = application_id 
            ownership_record["owner_company"]           = "To be provided" 
            ownership_record["company_url"]             =  "To be provided" 
            ownership_record["product_url"]             =  "To be provided"
            ownership_record["owner_id"]                =  user_id
            ownership_record["owner_name"]              =  first_name + " " + last_name  
            ownership_record["owner_email"]             =  email
            ownership_record["owner_phone"]             =  phone 
            ownership_record["secondary_owner_name"]    =  "To be provided"
            ownership_record["secondary_owner_id"]      =  "To be provided" 
            ownership_record["secondary_owner_email"]   =  "To be provided" 
            ownership_record["secondary_owner_phone"]   =  "To be provided"
            ownershipCollection                         = "application_ownership"  # ideally this should be a global var
            ownership_id    = self.dbCon.insert_document(ownershipCollection, ownership_record)
            #print("ownership_id ", ownership_id, " and ownership record: ", ownership_record)
        # send an email to the user on successful creation
        subject = "Congratulations on submitting " + data["application"]
        body = "Dear " + first_name +  ",<br>" + " Congratulations on submitting <b>" + data["application"] + "</b>. <br>"
        body += "Your submission confirmation number is <b>" + application_id + "</b>.<br>"
        body += "A background job is already at work to gather any publicly available information on this product and update it on huby marketplace.<br>"
        body += "As a next step, we recommend you to review/update detailed information on " + data["application"] + " using huby's burger menu. "
        body += " Among other things, this includes marketing information, demo videos/how tos, system requirements, AI technology used, etc."
        body += " This information is used by our curation process as well as for the visibility of your product to your target users. <br>"
        body += "Simply click https://huby.ai/application/marketing to enter the rest of information. <br>"
        body += "You can also preview your application by simply clicking https://huby.ai/appdetails?application_id=" + application_id + "  <br>"
        body += "Thank you! <br>"
        body += "huby support team <br>"
        body += "support@huby.ai"
        try:
            email_util = EmailUtil(self.from_email)
            response  = email_util.send_email(email, subject, body)
            self.app.logger.info("successfully sent the product submission email for product %s.", application_id)
            #print("response from sending email:", response)
        except Exception as e:
            self.app.logger.error('Exception sending the product submission email: %s', e)
            return jsonify({"error": "Exception sending  the product submission email: {}".format(e) }), 206
        #-- initiate a separate process to scrape the details of this product and populate different sections if they don't already exist.
        from multiprocessing import Process
        proc  = Process(target=update_app_using_llm_async, args=(application_id,))
        proc.start()
        self.app.logger.info("successfully fired the async process for updating the product (using LLM search) with id %s.", application_id)
        # another process for updating the app using website scraping
        if "product_url" in data and data["product_url"] != "":
            product_id  = application_id
            product_url = data["product_url"].strip().lower()
            media_urls_file = application_id + ".json"
            args = (product_id, product_url, media_urls_file, self.max_pages_to_scrape)
            proc  = Process(target=update_app_webscrape_async, args=(args,))
            proc.start()
            self.app.logger.info("successfully fired the async process for webscraping the product with id %s.", application_id)
            self.app.logger.info("Starting an independent process to collect and update media URLs using update_app_webscrape_async with process id: " + str(proc.pid))
            #proc.join()  # Do not Wait for the child process to finish
        self.app.logger.info("Now returning the response to the API call")
        return jsonify(result), status

    def get_curated_applications_with_skip_limit(self):
        # Here we get a chunk of curated apps from a starting point for infinite scroll
        fieldName   = "status"
        fieldValue  = "approved"
        skip        = int(self.request.args.get("skip", 0)) # number of records to skip from the beginning
        limit       = int(self.request.args.get("limit", 10))
        try:
            applications = self.dbCon.get_documents_by_field_with_skip_limit(self.collectionName, fieldName, fieldValue, skip, limit)
        except Exception as e:
            print(e)
            self.app.logger.error("Applications.get_curated_applications_with_skip_limit() error in retrieving curated products: %s", e)
            return
        for app in applications:
            app["application_id"] = str(app["_id"])
            del app["_id"]
        #print("skip = {} limit = {} retrieved product count {} and actual products are: {}".format(skip, limit, len(applications), applications))
        return jsonify(applications), 200

    def get_application_by_id(self, application_id):
        # 
        self.app.logger.info('Applications.get_application_by_id: get application for id '. format(application_id))
        fieldName   = "_id"
        fieldValue  = ObjectId(application_id)
        try:
            applications = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
        except Exception as e:
            print(e)
            self.app.logger.error("Applications.get_application_by_id() error in retrieval: %s", e)
            return
        if len(applications) > 0:
            application     = applications[0]
        else:
           return jsonify({"error": "No user application found for the provided application id.".format(application_id)}), 400
        application["application_id"] = str(application.get("_id"))
        # if search_text is received in request params then get usage instructions 
        data     = self.request.args
        application["detailed_steps"] = ""
        if "search_text" in data and data["search_text"] != "":
            application["detailed_steps"] = self.get_llm_usage_instructions_by_app_name(application["application"], data["search_text"]) 
        # get the application rating across different categories
        #print("application ids are: ", application_id, application["application_id"])
        ratings  = self.get_ratings_by_application_id(application_id)
        application["ratings"] = ratings
        if "_id" in application:
            del application["_id"]
        return jsonify(application), 200
    
    def get_llm_usage_instructions_by_app_name(self, app_name, activity):
        # Here we expect a request like /api/search/applications?search_terms="fitness+tracking"+"fair+and+lovely"
        if app_name == "" or activity == "":
            return
        # we need to capture this data for further curation; If there's an access_token on header get the user_id from it
        user_id = ""
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token:
            user = self.oauth2.get_user_from_access_token(access_token)
            print("user from access_token:", user)
            if user and "user_id" in user and user["user_id"] != "":
                user_id = user["user_id"]
        
        data = {"user_id": user_id, "application": app_name, "search_prompt": activity, "created": round(time()) }
        collection = "uncurated_applications"
        try:
            unc_app_id = self.dbCon.insert_document(collection, data)
        except Exception as e:
            self.app.logger.error('Error inserting uncurated app: %s', e)

        llm_url     = self.app.config["LLM_URL"].strip() +  self.app.config["LLM_KEY"].strip()
        llm_prompt  = self.app.config["LLM_PROMPT_STEPS"].replace("{}", app_name)
        llm_prompt  += " " + activity
        headers     = {"Content-Type": "Application/json"}
        data        = {"contents":[{"parts":[{"text": llm_prompt}]}]} 
        #print("llm_url", llm_url)
        #print("llm_prompt", llm_prompt)
        #print("payload:", data)
        try:
            results  = requests.post(url=llm_url, json=data, headers=headers)
            #print("returned status code from LLM:", results.status_code)
            #print("results from LLM: {}".format(results))
            resp    = json.loads(results.text)
            #json_str = resp['candidates'][0]['content']['parts'][0]['text']
            #json_str = json_str.replace('```json\n', '').replace('```', '')
            #json_str = json_str.replace('\n', '')
            json_str = resp['candidates'][0]['content']['parts'][0]['text']
            #print("resp:", resp)
            #print("json_str:", json_str)
            '''
            if json_str:
                json_str = re.sub(r'\n+', '\n', json_str).strip()
                json_str = json_str.strip().replace('\r\n', '\n').replace('\r', '\n')
                json_end = json_str.rindex(']')
                #print('json_end:', json_end, ' and len of json_str: ', len(json_str))
                if json_end < len(json_str) - 1:
                    json_str = json_str[:json_end +1]
                    #print('json_str after cleanup:', json_str)
                try:
                    arr_results = json.loads(json_str)
                except JSONDecodeError as e:
                    #print("json.loads(arr_results) failed in Applications.search_llm_applications() with error: ", e)
                    self.app.logger.error("json.loads(arr_results) failed in Applications.search_llm_applications() with error: %s", e)
                    return jsonify({"error" : "System error in semantic search of other applications with code {}.".format(results.status_code)}), 400
            else:
                self.app.logger.error("LLM call either did not return a response or it was malformed.")
                return jsonify([])
            '''
        except requests.exceptions.ConnectionError as e:
            print(e)
            self.app.logger.error("Applications.get_llm_usage_instructions_by_app_name() error in performing semantic search: %s", e)
            return
        except requests.exceptions.HTTPError as e:
            print(e)
            self.app.logger.error("Applications.get_llm_usage_instructions_by_app_name() error in performing semantic search: %s", e)
            return
        except Exception as e:
            print(e)
            self.app.logger.error("Applications.get_llm_usage_instructions_by_app_name() error in performing semantic search: %s", e)
            return
        #print("arr_results:", arr_results)       
        return json_str
        
    #---------- Update the status to reviewed (R) or approved (A)
    def update_application_submission_status(self, application_id):
        self.app.logger.info("Applications.update_application_submission_status() - update submission status for app id {}".format(application_id))
        if application_id == "":
            return jsonify({"error": "Application id is required for updating the submission status"}),400
        #--- get the access token and check that this user owns the application before returning the status ---
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('Invalid request: No access_token  provided.')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        fieldName       = "_id"
        fieldValue      = ObjectId(application_id)
        applications    = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
        if len(applications) < 1 :
            return jsonify({"error": "No application found for the supplied application."}), 400
        data = self.request.get_json()
        if "status" not in data or data["status"] == "":
            self.app.logger.error('Invalid request: status is a required field with allowed values as draft|reviewed|approved.')
            return jsonify({"error": "Invalid request: status is a required field with allowed values as draft|reviewed|approved."}), 400
        status = data["status"]
        user        = self.oauth2.get_user_from_access_token(access_token)
       #print("user:", user)
        if "privilege" not in user or user["privilege"] not in ["sysadmin", "admin", "support"]:
            return jsonify({"error": "You don't have the required privilege to update the application status."}), 400
        application = applications[0]
        user_id = ""
        if "user_id" not in user or user["user_id"] == "":
            return jsonify({"error": "Invalid token (not associated with at user)."}), 400
        user_id     = user["user_id"]
        if status.lower() == "approved":
            application["status"]       = "approved"
            application["approved_by"]  = user_id
            application["approved"]     = round(time())
            application["type"]         = "P"      #-- once approved change it to P - Published/Public/Production/
        elif status.lower() == "reviewed":
            application["status"]       = "reviewed"
            application["last_reviewed_by"]  = user_id
            application["last_reviewed"]     = round(time())
        elif status.lower() == "draft":
            application["status"]       = "draft"
        else:
            self.app.logger.error("Invalid status {} was provided to update application submission status. Valid values are: draft|reviewed|approved".format(status))
            return jsonify({"error": "Invalid status {} was provided to update application submission status. Valid values are: draft|reviewed|approved".format(status) }),400
        
        try:
                self.dbCon.update_document_by_field(self.collectionName, fieldName, fieldValue,  application)    
        except Exception as e:
            self.app.logger.error("Application update failed with exception {}".format(e))
            return jsonify({"error": "Application update failed with exception {}".format(e) }), 400
        return jsonify({"status": "success", "application_id": application_id}), 200


    def get_application_submission_status(self, application_id):
        self.app.logger.info("Applications.application_submission_status() - retrieving submission status for app id {}".format(application_id))
        if application_id == "":
            return jsonify({"error": "Application id is required for retrieving the submission status"}),400
        #--- get the access token and check that this user owns the application before returning the status ---
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('Invalid request: No access_token  provided.')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        fieldName       = "_id"
        fieldValue      = ObjectId(application_id)
        applications    = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
        if len(applications) < 1 :
            return jsonify({"error": "No application found for the supplied application."}), 400
        application = applications[0]
        user     = self.oauth2.get_user_from_access_token(access_token)
        user_id = ""
        if "user_id" not in user or user["user_id"] == "":
            return jsonify({"error": "Invalid token (not associated with at user)."}), 400
        user_id         = user["user_id"]
        collectionName = "application_ownership"
        fieldName       = "application_id"
        fieldValue      = application_id
        owners = self.dbCon.get_documents_by_field(collectionName, fieldName, fieldValue)
        if len(owners) < 1:
            return jsonify({"error": "Supplied application doesn't have any associated ownership information."}), 400
        
        owner     = owners[0]
        if user["privilege"] not in ("admin", "sysadmin", "support") and user_id != owner["owner_id"] and user_id != owner["secondary_owner_id"] :
            return jsonify({"error": "You don't own this application. Only primary or secondary owners of an application can review its status."}), 400
        # now build the status query from application record.
        #print("application:", application)
        submitted_date      = strftime("%m/%d/%Y %H:%M:%S", localtime(application["created"]))
        submitted_by        = ""
        try:
            fieldName   = "_id"
            fieldValue  = ObjectId(application["created_by"])
            collection  = "users"
            data = self.dbCon.get_documents_by_field(collection, fieldName, fieldValue)
            if len(data) > 0:
                submitted_by   = data[0]["first_name"] + " " + data[0]["last_name"]
        except Exception as e:
            self.app.logger.error("Error trying to retrieve user record for user id {} with exception {}".format(application["approved_by"], e))

        approved_date       = ""
        approved_by         = ""
        reviewed_date       = ""
        reviewed_by         = ""
        last_reviewed_date  = ""
        last_reviewed_by    = ""
        approved_date      = ""
        approved_by        = ""
        
        if "approved" in application and application["approved"] > 0:
            approved_date   = strftime("%m/%d/%Y %H:%M:%S", localtime(application["approved"]))
        if "approved_by" in application and application["approved_by"] != "" :
            approved_by     = application["approved_by"]
            #--- get the approved by user name from the database
            try:
                fieldName   = "_id"
                fieldValue  = ObjectId(application["approved_by"])
                collection  = "users"
                data = self.dbCon.get_documents_by_field(collection, fieldName, fieldValue)
                if len(data) > 0:
                    approved_by   = data[0]["first_name"] + " " + data[0]["last_name"]
            except Exception as e:
                self.app.logger.error("Error trying to retrieve user record for user id {} with exception {}".format(application["approved_by"], e))
        if "reviewed" in application and application["reviewed"] > 0:
            reviewed_date = strftime("%m/%d/%Y %H:%M:%S", localtime(application["reviewed"]))
        if "reviewed_by" in application and application["reviewed_by"] != "" :
            reviewed_by   = application["reviewed_by"]
            try:
                fieldName   = "_id"
                fieldValue  = ObjectId(application["reviewed_by"])
                collection  = "users"
                data = self.dbCon.get_documents_by_field(collection, fieldName, fieldValue)
                if len(data) > 0:
                    reviewed_by   = data[0]["first_name"] + " " + data[0]["last_name"]
            except Exception as e:
                self.app.logger.error("Error trying to retrieve user record for user id {} with exception {}".format(application["last_reviewed_by"], e))
        if "approved" in application and application["approved"] > 0:
            approved_date = strftime("%m/%d/%Y %H:%M:%S", localtime(application["approved"]))
        if "approved_by" in application and application["approved_by"] != "" :
            approved_by   = application["approved_by"]
            try:
                fieldName   = "_id"
                fieldValue  = ObjectId(application["approved_by"])
                collection  = "users"
                data = self.dbCon.get_documents_by_field(collection, fieldName, fieldValue)
                if len(data) > 0:
                    approved_by   = data[0]["first_name"] + " " + data[0]["last_name"]
            except Exception as e:
                self.app.logger.error("Error trying to retrieve user record for user id {} with exception {}".format(application["last_reviewed_by"], e))

        if "last_reviewed" in application and application["last_reviewed"] > 0:
            last_reviewed_date = strftime("%m/%d/%Y %H:%M:%S", localtime(application["last_reviewed"]))
        if "last_reviewed_by" in application and application["last_reviewed_by"] != "" :
            last_reviewed_by   = application["last_reviewed_by"]
            try:
                fieldName   = "_id"
                fieldValue  = ObjectId(application["last_reviewed_by"])
                collection  = "users"
                data = self.dbCon.get_documents_by_field(collection, fieldName, fieldValue)
                if len(data) > 0:
                    last_reviewed_by   = data[0]["first_name"] + " " + data[0]["last_name"]
            except Exception as e:
                self.app.logger.error("Error trying to retrieve user record for user id {} with exception {}".format(application["last_reviewed_by"], e))
        
        #--- submission reviews
        fieldName   = "application_id"
        #fieldValue = ObjectId(application_id)
        fieldValue          = application_id
        collectionName      = "application_submission_reviews"
        sortFields             = [("path", 1)]  # It can be a list of tuples 
        submission_reviews = self.dbCon.get_documents_by_field_sorted(collectionName, fieldName, fieldValue, sortFields)
        #print("submission_reviews:", submission_reviews)

        users   = Users(self.app, self.request, self.dbCon)
        for submission_review in submission_reviews:
            if "_id" in submission_review:
                submission_review["submission_review_id"] = str(submission_review["_id"])
                del(submission_review["_id"])
            submission_review["user_name"]      = "" 
            submission_review["user_icon_url"]  = ""   
            reviewer_id                         = ""                         
            if "user_id" in submission_review and submission_review["user_id"] != "":
                reviewer_id = submission_review["user_id"]
            elif "created_by" in submission_review and submission_review["created_by"] != "":
                reviewer_id    = submission_review["created_by"]
            elif "last_updated_by" in submission_review and submission_review["last_updated_by"] != "":
                reviewer_id    = submission_review["last_updated_by"]
            if reviewer_id != "":
                user    = users.get_user_info(reviewer_id)
                if "first_name" in user:
                    submission_review["user_name"] = user["first_name"]
                if "last_name" in user:
                    submission_review["user_name"] += " " + user["last_name"]
                if "user_icon_url" in user:
                    submission_review["user_icon_url"] = user["user_icon_url"]
            
            if "created" in submission_review:
                submission_review["created"] = strftime("%m/%d/%Y %H:%M:%S", localtime(submission_review["created"]))
                        
        result = {"submitted_by": submitted_by, "submitted_date": submitted_date, "last_reviewed_date": last_reviewed_date, "last_reviewed_by": last_reviewed_by  ,"approved_date": approved_date, "approved_by": approved_by, "submission_reviews": submission_reviews}
        return jsonify(result), 200

        
        


    #-------- get applications (only headers) that are owned by the logged in user ----------
    def get_applications_user_owned(self):
        #--- Here we are going to pull the list of applications where the current user is either a primary or secondary owner.
        #--- Note that even at the time of app submission the user gets added to the ownership collection.
        #--- if the user has admin roles then give all the apps (later we need to add sub search etc.)
        #--- Here we first need to validate the token and get the user_id
        self.app.logger.info('Started Applications.get_applications_user_owned(): ')
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        user        = self.oauth2.get_user_from_access_token(access_token)
        user_id     = ""
        if "user_id" in user:
            user_id     = user["user_id"]
        if "privilege" in user and user["privilege"] in ["sysadmin", "admin", "support"]:
            dquery   = {}
        else:       
            dquery  = { "$or": [{"owner_id": user_id }, {"secondary_owner_id": user_id }] }
        collectionName = "application_ownership"
        list_result_fields = [ "application_id"]
        list_app_ids_dict    = self.dbCon.get_collection_docs_using_logical_query(collectionName, dquery, list_result_fields)
        #print("list_app_ids_dict", list_app_ids_dict)
        if len(list_app_ids_dict) < 1:
            return jsonify([]), 200
        
        # deduped app list
        list_app_ids_final = []
        list_app_objectIds = []
        for app in list_app_ids_dict:
            for key, application_id in app.items():
                if application_id not in list_app_ids_final:
                    list_app_ids_final.append(application_id)
                    list_app_objectIds.append(ObjectId(application_id))
        #print("list_app_ids_final", list_app_ids_final)
                
        # get the applications for these app_ids
        fieldName           = "_id"
        list_result_fields  = ["_id", "application", "description", "features", "integrations", "type", "version" , "category"]
        apps = self.dbCon.get_documents_for_field_in_list(self.collectionName, fieldName, list_app_objectIds, list_result_fields)
        return jsonify(apps), 200

    def update_application(self, application_id):
        #---TODO: We need to create a module that validates the access token and then checks/validates the permission. This operation is needed for most update/delete operations.
        # The validation code below will move to the controller once we've the code refactored.
        self.app.logger.info('Preparing the application record for updating the applications collection')
        #--- First authenticate the request with access token ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        data = self.request.get_json()
        #print("data received is {}".format(data))
        #--- We don't need to check the permission to create an application but assign permission to this user as owner once app is created
        #--- Since any logged in user can submit an app; we need not validate their permission
        data = self.request.get_json()
        #print("data received is {}".format(data))
        # Use the new permission check method here. 
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, self.collectionName, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing update permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing update permissions on application with id ".format(application_id)}),400

        crud_permissions = permissions["permissions"]
        if crud_permissions[2] != "1":
            self.app.logger.error("Missing update permissions for application id {}".format(application_id))
            return jsonify({"error":"Missing update permissions for application id ".format(application_id)}),400

        fieldName   = "_id"
        #--- if user_id is invalid (must be 12 bytes or 24 char hex string ), handle the ObjectId() call error
        try:
            fieldValue  = ObjectId(application_id)
            applications       = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on application id {} with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(applications) > 0:
            user_id = self.oauth2.get_user_id_from_access_token(access_token)
            data["last_updated"] = round(time())
            if user_id:
                data["last_updated_by"] = user_id
            # we don't need to validate the values in the application json since it's already done in the controller
            try:
                self.dbCon.update_document_by_field(self.collectionName, fieldName, fieldValue,  data)    
            except Exception as e:
                return jsonify({"error": "Application update failed with exception {}".format(e) }), 400
            return jsonify({"application_id": application_id}), 200
        else:
            return jsonify({"error": "Unusual situation; more than one applications with the same id"}),400
    
        '''
        dict_collection_doc_role = self.oauth2.get_permissions_from_access_token(access_token)
        print("Applications.update_appplication(): type of dict_permissions = {}".format(type(dict_collection_doc_role)))
        if "error" in dict_collection_doc_role:
            return jsonify(dict_collection_doc_role),400
        if self.collectionName in dict_collection_doc_role["collection_roles"]:
            #print("collection name found", self.collectionName )
            #print("look for application_id in ", dict_collection_doc_role["collection_roles"][self.collectionName])
            if application_id in dict_collection_doc_role["collection_roles"][self.collectionName]:
                role = dict_collection_doc_role["collection_roles"][self.collectionName][application_id]
                perms = self.authorization.get_collection_role_permissions(self.collectionName, role)
                print("role is {} and user perms: {}".format(role, perms))
                if perms[2] == "1":   # Update allowed in CRUD
                    #TODO: Incomplete currently
                    fieldName   = "_id"
                    #--- if user_id is invalid (must be 12 bytes or 24 char hex string ), handle the ObjectId() call error
                    try:
                        fieldValue  = ObjectId(application_id)
                        applications       = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
                    except Exception as e:
                        self.app.logger.error("bson operation ObjectId() failed on application id {} with error {}".format(application_id, e))
                        return jsonify({"error": format(e) }), 400
                    if len(applications) > 0:
                        user_id = self.oauth2.get_user_id_from_access_token(access_token)
                        data["last_updated"] = round(time())
                        if user_id:
                            data["last_updated_by"] = user_id
                        # we don't need to validate the values in the application json since it's already done in the controller
                        try:
                            self.dbCon.update_document_by_field(self.collectionName, fieldName, fieldValue,  data)    
                        except Exception as e:
                            return jsonify({"error": "Application update failed with exception {}".format(e) }), 400
                        return jsonify({"application_id": application_id}), 200
                    else:
                        return jsonify({"error": "Unusual situation; more than one applications with the same id"}),400
                else:
                    return jsonify({"error": "permission to update the application denied"}),400
            else:
                return jsonify({"error": "Update role to update this application is not available to you."}),400
        else:
            return jsonify({"error": "Application collection missing among permissions available on this access  token."}),400
    '''
        #--- Save application logo ---#
    def save_application_logo(self, application_id):
        #-- Following 2 lines of code were useful only when we were saving to server filesystem.
        #application_logo_path_from_root    = "/dist/assets/images/applications" 
        #UPLOAD_FOLDER = self.app.root_path + application_logo_path_from_root # path to flask app ie. location of huby.py
        #--- TODO: Above setting can possibly move to a config file; possibly the one below too. ---#
        #-- Validate the application id:
        field_name  = "_id"
        field_value = ObjectId(application_id)
        try:
            apps = self.dbCon.get_documents_by_field(self.collectionName, field_name, field_value)
        except Exception as e:
            self.app.logger.error("Applications.save_application_logo(): Failed to retrieve data for id {} with error {}".format(application_id, e))
            return jsonify({"error": "Error retrieving the supplied application."}), 400
        if len(apps) < 1 :
            return jsonify({"error": "Invalid application. No application found for the supplied id."}), 400

        app = apps[0]
        ALLOWED_EXTENSIONS = set([ 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'])
        if 'file' not in self.request.files:
            return jsonify({"error": "No file in the submission"}),400
        file = self.request.files['file']
        if file.filename == '':
            return jsonify({"Error": "No selected file"}), 400
        extension = file.filename.rsplit('.', 1)[1].lower()
        if extension not in ALLOWED_EXTENSIONS:
            self.app.logger.erro("File extension {} is not supported. Allowed extensions are {}.".format(extension, ALLOWED_EXTENSIONS))
            return jsonify({"error": "File extension {} is not supported. Allowed extensions are {}.".format(extension, ALLOWED_EXTENSIONS) }),400
        filename    = application_id + '.' + extension
        '''
        # old code
        if file and extension in ALLOWED_EXTENSIONS:
            #print("ready to save the file")
            try:
                file.save(os.path.join(UPLOAD_FOLDER, filename))
                return jsonify({"application_logo_url":  "/assets/images/applications/" + filename, "file_name": filename, "path": UPLOAD_FOLDER}),201
            except Exception as e:
                self.app.logger.error('Error file: %s', e)
                return jsonify({'error': 'Failed to save the file with error: {}'.format(e)}), 500 
        else:
            return jsonify({"error": "Failed to save the file"}),400
        '''
        # New code to save the file stream to cloud bucket
        try:
            cs = CloudStorage()
            #print("CS created")
            source_file_stream = file
            destination_blob_name = f"images/applications/{filename}"
            #print("source file pathe and destination blob name are: ", source_file_stream, destination_blob_name)
            file_url = cs.save_object_stream(source_file_stream, destination_blob_name)
            #print("file_url from saved object:", file_url)
        except Exception as e:
            print(e)
            self.app.logger.error("Applications.save_application_logo() error in saving logo: %s", e)
            return jsonify({"error" : "System error in saving the product logo."}), 400
        #--- now we need to update the application logo url for this application
        app["application_logo_url"]  = file_url
        try:
            self.dbCon.update_document_by_field(self.collectionName, field_name, field_value,  app)    
        except Exception as e:
            self.app.logger.error("Application.save_application_logo() failed with exception {}".format(e))
            return jsonify({"error": "Application update for logo failed with exception {}".format(e) }), 400
        return jsonify({"application_logo_url": file_url}),201

    def search_applications(self):
        # Here we expect a request like /api/search/applications?search_terms="fitness+tracking"+"fair+and+lovely"
        search_text     = self.request.args.get("search_terms")
        #print("request.args: ", request.args)
        result_count    = self.request.args.get("result_count")
        #print("result_count:", result_count)
        #print("data type is {} and data = {}".format(type(data), data))
        if search_text is None or search_text == "":
            return jsonify({"error": "Search terms are required for this operation. "}), 400
        self.app.logger.info("Applications.search_applications with search terms: {}".format(search_text))
        if result_count is None or result_count == 0 or result_count == "":
            result_count    = 5
        else:
            result_count = int(result_count)
        list_app_ids         = []
        url     = "http://" + self.app.config["VECTOR_DB_SERVER"] + "/api/search"
        headers = {"Content-Type": "Application/Json"}
        params = {"search_text": search_text, "result_count": result_count}
        try:
            results  = requests.get(url, params=params, headers=headers)
            #print("result from vdb for search text {}: {}".format(search_text, results.text))
            resp    = json.loads(results.text)
        #print("resp:", resp)
            arr_results = json.loads(resp["result"])
        except requests.exceptions.ConnectionError as e:
            print(e)
            self.app.logger.error("Applications.search_applications() error in performing semantic search: %s", e)
            return jsonify({"error" : "System (connection) error in semantic search of applications."}), 400
        except requests.exceptions.HTTPError as e:
            print(e)
            self.app.logger.error("Applications.search_applications() error in performing semantic search: %s", e)
            return jsonify({"error" : "System error in semantic search of applications with code {}.".format(results.status_code)}), 400
        except Exception as e:
            print(e)
            self.app.logger.error("Applications.search_applications() error in performing semantic search: %s", e)
            return jsonify({"error" : "System error in semantic search of applications."}), 400
        #print("arr_results from vector database:", arr_results)
        for result in arr_results:
            #print("result item in arr:", result)
            list_app_ids.append(result["application_id"])
        # Now get all the applications' header information for these application ids after converting them to ObjectId
        #print("final searched app ids list_app_ids :", list_app_ids)
        fieldName   = "_id"
        list_field_values = []
        
        for app_id in list_app_ids:
            list_field_values.append(ObjectId(app_id))
        #dExcludeFields  = {"_id": 0}
        #print("list_field_values:", list_field_values)
        try:
            apps        = self.dbCon.get_documents_for_field_in_list_ordered(self.collectionName, fieldName, list_field_values)
        except Exception as e:
            print(e)
            self.app.logger.error("Applications.search_applications() error in dbCon.get_documents_for_field_in_list: %s", e)
            return jsonify({"error" : "System error in serarching applications."}), 400

        final_apps  =    []
        #print("list field values are: {}  and resulting apps: {}".format(list_field_values, apps))
        #print("# of applications: ", len(apps))
        #print("final list of apps: {}".format(apps))
        # Only choose production apps
        for app in apps:
            if "_id" in app:
                app["application_id"] =  str(app.get("_id"))
                del app["_id"]
            try:
                app["ratings"] = self.get_ratings_by_application_id(app["application_id"])
            except Exception as e:
                print(e)
                self.app.logger.error("Applications.search_applications() error in get_ratings_by_application_id: %s", e)
                return jsonify({"error" : "System error in serarching applications."}), 400
            final_apps.append(app) 
        #print("final apps are: ", final_apps) 
        return jsonify(final_apps), 200

    def search_applications_uncurated(self):
        # This function is similar to search_applications except that it searches apps that have not been curated on our platform.
        # We have separate model/index on the same vector database for uncurated apps
        # Here we expect a request like /api/search/applications?search_terms="fitness+tracking"+"fair+and+lovely"
        search_text     = self.request.args.get("search_terms")
        #print("request.args: ", request.args)
        result_count    = self.request.args.get("result_count")
        #return jsonify({"msg": "working", "search_text": search_text}), 200
        if search_text is None or search_text == "":
            return jsonify({"error": "Search terms are required for this operation. "}), 400
        search_text = search_text.replace('\n', '')   #--- Get rid off any newline char to avoid vector db complaining
        self.app.logger.info("Applications.search_applications_uncurated() with search terms: {}".format(search_text))
        if result_count is None or result_count == 0 or result_count == "":
            result_count    = 5
        else:
            result_count = int(result_count)
        list_app_ids         = []
        url     = "http://" + self.app.config["VECTOR_DB_SERVER"] + "/api/search/uncurated"
        headers = {"Content-Type": "Application/Json"}
        params = {"search_text": search_text, "result_count": result_count}
        try:
            results  = requests.get(url, params=params, headers=headers)
            #print("result from vdb for search text {}: {}".format(search_text, results.text))
            resp    = json.loads(results.text)
        #print("resp:", resp)
            arr_results = json.loads(resp["result"])
        except requests.exceptions.ConnectionError as e:
            print(e)
            self.app.logger.error("Applications.search_applications_uncurated() error in performing semantic search: %s", e)
            return jsonify({"error" : "System (connection) error in semantic search of applications."}), 400
        except requests.exceptions.HTTPError as e:
            print(e)
            self.app.logger.error("Applications.search_applications_uncurated() error in performing semantic search: %s", e)
            return jsonify({"error" : "System error in semantic search of applications with code {}.".format(results.status_code)}), 400
        except Exception as e:
            print(e)
            self.app.logger.error("Applications.search_applications_uncurated() error in performing semantic search: %s", e)
            return jsonify({"error" : "System error in semantic search of applications."}), 400
        #print("arr_results from vector database:", arr_results)
        for result in arr_results:
            #print("result item in arr:", result)
            list_app_ids.append(result["application_id"])
        # Now get all the applications' header information for these application ids after converting them to ObjectId
        #print("final searched app ids list_app_ids :", list_app_ids)
        fieldName   = "_id"
        list_field_values = []
        
        for app_id in list_app_ids:
            list_field_values.append(ObjectId(app_id))
        #dExcludeFields  = {"_id": 0}
        #print("list_field_values:", list_field_values)
        try:
            apps        = self.dbCon.get_documents_for_field_in_list_ordered(self.collectionName, fieldName, list_field_values)
        except Exception as e:
            print(e)
            self.app.logger.error("Applications.search_applications_uncurated() error in dbCon.get_documents_for_field_in_list: %s", e)
            return jsonify({"error" : "System error in serarching applications."}), 400

        final_apps  =    []
        #print("list field values are: {}  and resulting apps: {}".format(list_field_values, apps))
        #print("# of applications: ", len(apps))
        #print("final list of apps: {}".format(apps))
        # Only choose production apps
        for app in apps:
            if "_id" in app:
                app["application_id"] =  str(app.get("_id"))
                del app["_id"]
            try:
                app["ratings"] = self.get_ratings_by_application_id(app["application_id"])
            except Exception as e:
                print(e)
                self.app.logger.error("Applications.search_applications_uncurated() error in get_ratings_by_application_id: %s", e)
                return jsonify({"error" : "System error in serarching applications."}), 400
            final_apps.append(app) 
        #print("final apps are: ", final_apps) 
        return jsonify(final_apps), 200


    def search_llm_applications(self, search_text, list_exclude_apps=[], result_count=10):
        # Here we expect a request like /api/search/applications?search_terms="fitness+tracking"+"fair+and+lovely"
        #print("search_text: ", search_text)
        #print("list_exclude_apps:", list_exclude_apps)
        #print("result_count: ", result_count)
        llm_url     = self.app.config["LLM_URL"].strip() +  self.app.config["LLM_KEY"].strip()
        llm_prompt  = self.app.config["LLM_PROMPT"].replace("{}", str(result_count))
        llm_prompt  += " " + "```" + search_text + "``` "
        llm_prompt  += " " + "````" + ", ".join(list_exclude_apps) + "```` "
        headers     = {"Content-Type": "Application/json"}
        data        = {"contents":[{"parts":[{"text": llm_prompt}]}]} 
        #print("llm_url", llm_url)
        #print("llm_prompt", llm_prompt)
        #print("payload:", data)
        try:
            results  = requests.post(url=llm_url, json=data, headers=headers)
            #print("returned status code from LLM:", results.status_code)
            #print("results from LLM: {}".format(results.text))
            resp    = json.loads(results.text)
            #json_str = resp['candidates'][0]['content']['parts'][0]['text']
            #json_str = json_str.replace('```json\n', '').replace('```', '')
            #json_str = json_str.replace('\n', '')
            json_str = resp['candidates'][0]['content']['parts'][0]['text'].split('```json')[1].strip().strip('`')
            #print("resp:", resp)
            #print("json_str:", json_str)
            if json_str:
                json_str = re.sub(r'\n+', '\n', json_str).strip()
                json_str = json_str.strip().replace('\r\n', '\n').replace('\r', '\n')
                json_end = json_str.rindex(']')
                #print('json_end:', json_end, ' and len of json_str: ', len(json_str))
                if json_end < len(json_str) - 1:
                    json_str = json_str[:json_end +1]
                    #print('json_str after cleanup:', json_str)
                try:
                    arr_results = json.loads(json_str)
                except JSONDecodeError as e:
                    #print("json.loads(arr_results) failed in Applications.search_llm_applications() with error: ", e)
                    self.app.logger.error("json.loads(arr_results) failed in Applications.search_llm_applications() with error: %s", e)
                    return jsonify({"error" : "System error in semantic search of other applications with code {}.".format(results.status_code)}), 400
            else:
                self.app.logger.error("LLM call either did not return a response or it was malformed.")
                return jsonify([])
        except requests.exceptions.ConnectionError as e:
            print(e)
            self.app.logger.error("Applications.search_llm_applications() error in performing semantic search: %s", e)
            return jsonify({"error" : "System (connection) error in search of other applications."}), 400
        except requests.exceptions.HTTPError as e:
            print(e)
            self.app.logger.error("Applications.search_llm_applications() error in performing semantic search: %s", e)
            return jsonify({"error" : "System error in semantic search of other applications with code {}.".format(results.status_code)}), 400
        except Exception as e:
            print(e)
            self.app.logger.error("Applications.search_llm_applications() error in performing semantic search: %s", e)
            return jsonify({"error" : "System error in semantic search of other applications."}), 400
        #print("arr_results:", arr_results)       
        return jsonify(arr_results), 200

    def search_applications_old(self):
        # Here we expect a request like /api/search/applications?search_terms="fitness+tracking"+"fair+and+lovely"
        data  = self.request.args.get("search_terms")
        #print("data type is {} and data = {}".format(type(data), data))
        if data is None or data == "":
            return jsonify({"error": "Search terms are required for this operation. "}), 400
        #sanitize the data
        data                = data.replace('"', '')
        data                = data.replace("'", "")
        list_search_terms   = data.split()
        #print("search_terms: ", data, "and type", type(data))
        self.app.logger.info("Applications.search_applications with search terms: {}".format(list_search_terms))
        #--- Go through each collection for generic search and find the application ids and store them in an array.
        #--- In the second pass, find all the application records and send them as a list of json.
        #--- Since applications collection is different (no application_id field), we will look at that first
        list_collections    = ["application_marketing", "application_models", "application_ownership", "application_ratings", "application_runtime", "application_source" ]
        list_app_ids         = []
        list_result_fields1   = ["_id"]
        list_result_fields2   = ["application_id"]
        for search_term_str in list_search_terms:
            resultset1   = self.dbCon.search_collection_get_fields(self.collectionName, search_term_str, list_result_fields1)
            #print("resultset1 count for search term {} is {}: ".format(search_term_str, len(resultset1)))
            for result in resultset1:
                for key, value in result.items():
                    if value not in list_app_ids:
                        list_app_ids.append(value)
            #print("list_app_ids now (part 1):", list_app_ids)
            for collection in list_collections:
                resultset2   = self.dbCon.search_collection_get_fields(collection, search_term_str, list_result_fields2)
                print("collection: {} and resultset2: {}".format(collection, resultset2))
                for result in resultset2:
                    for key, value in result.items():
                        if key == "application_id" and value not in list_app_ids:
                            list_app_ids.append(value)
        # Now get all the applications' header information for these application ids after converting them to ObjectId
        #print("list_app_ids count:", len(list_app_ids))
        fieldName   = "_id"
        list_field_values = []
        for app_id in list_app_ids:
            list_field_values.append(ObjectId(app_id))
        #dExcludeFields  = {"_id": 0}
        try:
            apps        = self.dbCon.get_documents_for_field_in_list(self.collectionName, fieldName, list_field_values)
        except Exception as e:
            print(e)
            self.app.logger.error("Applications.search_applications() error in dbCon.get_documents_for_field_in_list: %s", e)
            return jsonify({"error" : "System error in serarching applications."}), 400

        final_apps  =    []
        #print("list field values are: {}  and resulting apps: {}".format(list_field_values, apps))
        #print("# of applications: ", len(apps))
        # Only choose production apps
        for app in apps:
            if app["type"] == "P":      # take only production apps (P), not prototypes (H for hacks)
                if "_id" in app:
                    app["application_id"] =  str(app.get("_id"))
                    del app["_id"]
                try:
                    app["ratings"] = self.get_ratings_by_application_id(app["application_id"])
                except Exception as e:
                    print(e)
                    self.app.logger.error("Applications.search_applications() error in get_ratings_by_application_id: %s", e)
                    return jsonify({"error" : "System error in serarching applications."}), 400
                final_apps.append(app)  
        return jsonify(final_apps), 200
        
    
    def create_prototype_ownership(self):
        #-- Assume that validation of incoming prototype ownership will happen in some sort of a controller.
        # check that a record with this appid does not already exist... If it dowesn't then simply add system fields
        self.app.logger.info('Preparing the prototype ownership record for updating the applications collection')
        #--- First authenticate the request with access token ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        data = self.request.get_json()
        print("data received is {}".format(data))
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["created"] = round(time())
        if user_id:
            data["created_by"] = user_id
        #--- We don't need to check the permission to create an application but assign permission to this user as owner once app is created
        #--- Since any logged in user can submit an app; we need not validate their permission
        #--- Do basic validation for required info:
        if "owner_company" not in data or "owner_name" not in data:
            self.app.logger.error('Prototype owner company and prototype owner name are required')
            return jsonify({'error': 'Bad request: Prototype owner company and prototype owner name are required'}), 400
        if data["owner_company"] == "" or data["owner_name"] == "":
           self.app.logger.error('Prototype owner company and prototype owner name are required')
           return jsonify({'error': 'Bad request: Prototype owner company and prototype owner name are required'}), 400
        
        targetCollection = "application_ownership"
        try:
            ownership_id = self.dbCon.insert_document(targetCollection, data)
        except Exception as e:
            self.app.logger.error('Error inserting prototype ownership information: %s', e)
            result = {'error': 'Failed to insert the prototype ownership information'}
            status = 400
            return jsonify(result), status


        #--- update the permissions for this app by making this submitting user as the owner
        if ownership_id is None:
                result = {"Error": "Application creation failed. Check for the input."}
                status = 400
                return jsonify(result), status
        else: 
            result  = {"ownership_id": ownership_id}
            status = 201
            user_id     = self.oauth2.get_user_id_from_access_token(access_token)
            # --- Set the user permission record in user_document_role collection
            user_role           = "owner"
            #user_perms          = {"user_id": documentId, "collection_roles": {targetCollection: {"users": user_role} }}
            self.authorization.add_permission(access_token, user_id, targetCollection, ownership_id, user_role)
            self.app.logger.info("updated prototype ownership permissions ")
            return jsonify(result), status

    def get_ownership_by_ownership_id(self, ownership_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('Applications.get_prototype_ownership_by_ownership_id: get prototype owner for ownership id '. format(ownership_id))
        fieldName   = "_id"
        fieldValue = ObjectId(ownership_id)
        targetCollection = "application_ownership"
        ownerships = self.dbCon.get_documents_by_field(targetCollection, fieldName, fieldValue)
        if len(ownerships) > 0:
            ownership     = ownerships[0]
        else:
            return jsonify({"error": "No owner information found for the provided ownershp id.".format(ownership_id)}), 400
        ownership["_id"] = str(ownership.get("_id"))
        if "_id" in ownership:
            del ownership["_id"]
        return jsonify(ownership), 200
           
    def get_prototype_ownership_by_prototype_id(self, prototype_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('Applications.get_prototype_ownership_by_prototype_id: get prototype ownership for prototype id '. format(prototype_id))
        fieldName   = "application_id"
        #fieldValue = ObjectId(prototype_id)
        fieldValue          = prototype_id
        targetCollection    = "application_ownership"
        prototypes = self.dbCon.get_documents_by_field(targetCollection, fieldName, fieldValue)
        if len(prototypes) > 0:
            prototype     = prototypes[0]
            if "_id" in prototype:
                prototype["ownership_id"] = str(prototype["_id"])
                del(prototype["_id"])
        else:
            return jsonify({"error": "No user prototype found for the provided prototype id.".format(prototype_id)}), 400
        #application["application_id"] = str(application.get("_id"))
        #if "_id" in application:
        #    del application["_id"]
        return jsonify(prototype), 200
                               
    
    def update_application_ownership(self, application_id):
        # The validation code below will move to the controller once we've the code refactored.
        self.app.logger.info('Preparing the application record for updating the applications collection')
        #--- First authenticate the request with access token ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        data = self.request.get_json()
        print("data received is {}".format(data))
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["last_updated"] = round(time())
        if user_id:
            data["last_updated_by"] = user_id
        #--- We don't need to check the permission to create an application but assign permission to this user as owner once app is created
        #--- Since any logged in user can submit an app; we need not validate their permission
        data = self.request.get_json()
        print("data received is {}".format(data))

        dict_collection_doc_role = self.oauth2.get_permissions_from_access_token(access_token)
        print("Applications.update_application_ownership(): type of dict_permissions = {}".format(type(dict_collection_doc_role)))
        if "error" in dict_collection_doc_role:
            return jsonify(dict_collection_doc_role),400
        print(" In Applications.update_application_ownership(): user_id is {} and token permissions (role by collection and doc id): {}".format(user_id, dict_collection_doc_role))
        if self.collectionName in dict_collection_doc_role["collection_roles"]:
            print("collection name found", self.collectionName )
            print("look for application_id in ", dict_collection_doc_role["collection_roles"][self.collectionName])
            if application_id in dict_collection_doc_role["collection_roles"][self.collectionName]:
                role = dict_collection_doc_role["collection_roles"][self.collectionName][application_id]
                perms = self.authorization.get_collection_role_permissions(self.collectionName, role)
                print("role is {} and user perms: {}".format(role, perms))
                if perms[2] == "1":   # Update allowed in CRUD
                    #TODO: Incomplete currently
                    fieldName   = "application_id"
                    fieldValue  = application_id
                    #--- if user_id is invalid (must be 12 bytes or 24 char hex string ), handle the ObjectId() call error
                    targetCollection = "application_ownership"
                    try:
                        ownerships       = self.dbCon.get_documents_by_field(targetCollection, fieldName, fieldValue)
                    except Exception as e:
                        self.app.logger.error("Error in applications.update_application_ownership while retrieving the ownership info for an application. Error: {}".format(e))
                        return jsonify({"error": format(e) }), 400
                    if len(ownerships) > 0:
                        ownership       = ownerships[0]
                        ownership_id    = str(ownership["_id"])
                        # we don't need to validate the values in the application json since it's already done in the controller
                        try:
                            #print("updating the application ownership info with data: {}".format(data))
                            self.dbCon.update_document_by_field(targetCollection, fieldName, fieldValue,  data)    
                        except Exception as e:
                            return jsonify({"error": "Application update failed with exception {}".format(e) }), 400
                        return jsonify({"application_id": application_id, "ownership_id": ownership_id}), 200
                    else:
                        return jsonify({"error": "Unusual situation; more than one ownership records with the same id"}),400
                else:
                    return jsonify({"error": "permission to update the prototoype denied"}),400
            else:
                return jsonify({"error": "Update role to update this prototype'w ownership is not available to you."}),400
        else:
            return jsonify({"error": "Application (Prototype) collection missing among permissions available on this access  token."}),400

# Note that this function is for internal use only
    def get_ratings_by_application_id(self, application_id):
        fieldName           = "application_id"
        fieldValue          = application_id
        rating_collection   = "application_ratings"
        cnt_proto_impact_rating         = 0
        cnt_proto_practicality_rating   = 0
        cnt_app_practicality_rating     = 0
        cnt_app_performance_rating      = 0
        cnt_app_ux_rating               = 0
        cnt_app_ecosystem_rating        = 0
        val_proto_impact_rating         = 0
        val_proto_practicality_rating   = 0
        val_app_practicality_rating     = 0
        val_app_performance_rating      = 0
        val_app_ux_rating               = 0
        val_app_ecosystem_rating        = 0
        result                          = {}
        result["proto_impact_rating"]       = 0
        result["proto_practicality_rating"] = 0
        result["app_practicality_rating"]   = 0
        result["app_performance_rating"]    = 0
        result["app_ux_rating"]             = 0
        result["app_ecosystem_rating"]      = 0
        ratings = self.dbCon.get_documents_by_field(rating_collection, fieldName, fieldValue)

        for rating in ratings:
            #print("application is {} and rating record is {}".format(application_id, rating))
            if "proto_impact_rating" in rating and rating["proto_impact_rating"] and rating["proto_impact_rating"] != '':
                val_proto_impact_rating         += int(rating["proto_impact_rating"])
                cnt_proto_impact_rating         += 1
            if "proto_practicality_rating" in rating  and rating["proto_practicality_rating"] and rating["proto_practicality_rating"]  != '':
                val_proto_practicality_rating         += int(rating["proto_practicality_rating"])
                cnt_proto_practicality_rating         += 1
            if "app_practicality_rating" in rating and rating["app_practicality_rating"] and rating["app_practicality_rating"] != '':
                val_app_practicality_rating         += int(rating["app_practicality_rating"])
                cnt_app_practicality_rating         += 1
            if "app_performance_rating" in rating and rating["app_performance_rating"]  and rating["app_performance_rating"]  != '':
                val_app_performance_rating         += int(rating["app_performance_rating"])
                cnt_app_performance_rating         += 1
            if "app_ux_rating" in rating and rating["app_ux_rating"] and rating["app_ux_rating"]  != '':
                val_app_ux_rating         += int(rating["app_ux_rating"])
                cnt_app_ux_rating         += 1
            if "app_ecosystem_rating" in rating and rating["app_ecosystem_rating"] and rating["app_ecosystem_rating"] != '':
                val_app_ecosystem_rating         += int(rating["app_ecosystem_rating"])
                cnt_app_ecosystem_rating         += 1
        if cnt_proto_impact_rating > 0:
            result["proto_impact_rating"]           = val_proto_impact_rating/cnt_proto_impact_rating
        if cnt_proto_practicality_rating > 0:
            result["proto_practicality_rating"]     = val_proto_practicality_rating/cnt_proto_practicality_rating
        if cnt_app_practicality_rating > 0:
            result["app_practicality_rating"]       = val_app_practicality_rating/cnt_app_practicality_rating
        if cnt_app_performance_rating > 0: 
            result["app_performance_rating"]        = val_app_performance_rating/cnt_app_performance_rating
        if cnt_app_ux_rating > 0:
            result["app_ux_rating"]                 = val_app_ux_rating/cnt_app_ux_rating
        if cnt_app_ecosystem_rating > 0:
            result["app_ecosystem_rating"]          = val_app_ecosystem_rating/cnt_app_ecosystem_rating
        return result 


#-- The function below is outside the application class because it gets spawned as a separate process.
def update_app_using_llm_async(application_id):
    import os
    from bson.objectid import ObjectId
    from configparser import ConfigParser
    import requests
    import json
    import time
    import logging
    from database import Database
    config      = ConfigParser()
    configFile  = os.getenv("WorkingDirectory") + "/huby.cfg"
    #print("configFile:", configFile)
    config.read(configFile)
    logFile     = config.get('Default', 'log_file')
    logLevel    = config.get('Default', 'log_level')
    if logFile      == "":
        logFile     = "/var/log/huby/huby_api.log"
    if logLevel     == "":
        logLevel    = "INFO" 
    logging.basicConfig(format='%(asctime)s.%(msecs)03d  %(levelname)-s %(message)s', datefmt='%Y-%m-%d %H:%M:%S %Z', filename=logFile, level=logLevel, filemode='a')
    logger = logging.getLogger(logFile)
    if 'webscraping' in os.environ and os.environ.get("webscraping").lower() in ('false', '0', 'no'):
        logger.info("Webscraping is currently disabled for the environment. Exiting....")
        return

    dbCon   = Database(logFile)
    if application_id == "":
        logger.error("Error in applications.update_app_using_llm_async(), no application_id passed")
        return
    #get the application name and product URL
    logger.info("Web scraping the application information for " + application_id)
    webscrape_prompt = config.get('LLM', 'prompt_webscrape')
    collection = "applications"
    fieldName  = "_id"
    fieldValue = ObjectId(application_id)
    try:
        apps = dbCon.get_documents_by_field(collection, fieldName, fieldValue)
    except Exception as e:
        logger.error("Error in applications.update_app_using_llm_async() while trying to retrieve the application for id {} with error {}".format(application_id, e))
        return
    if len(apps) < 1:
        logger.error("Error in applications.update_app_using_llm_async() no application forund for the application id {}".format(application_id))
        return
    app = apps[0]
    if "application" not in app or app["application"] == "":
        logger.error("Error in applications.update_app_using_llm_async(); stopped webscraping as no application name forund for the application id {}".format(application_id))
        return
    if "product_url" not in app or app["product_url"] == "":
        logger.error("Error in applications.update_app_using_llm_async(); stopped webscraping as no product_url found for the application id {}".format(application_id))
        return
    webscrape_prompt = webscrape_prompt.replace('{1}', app["application"])
    webscrape_prompt = webscrape_prompt.replace('{2}', app["product_url"])
    #print("The final webscraping prompt is : ", webscrape_prompt)
    llm_url     = config.get("LLM", "URL").strip() +  config.get("LLM", "KEY").strip()
    llm_prompt  = webscrape_prompt
    headers     = {"Content-Type": "Application/json"}
    data        = {"contents":[{"parts":[{"text": llm_prompt}]}]} 
    #print("llm_url", llm_url)
    #print("llm_prompt", llm_prompt)
    #print("payload:", data)
    try:
        results  = requests.post(url=llm_url, json=data, headers=headers)
        #print("returned status code from LLM:", results.status_code)
        #print("results from LLM: {}".format(results))
        resp    = json.loads(results.text)
        #json_str = resp['candidates'][0]['content']['parts'][0]['text']
        #json_str = json_str.replace('```json\n', '').replace('```', '')
        #json_str = json_str.replace('\n', '')
        json_str = resp['candidates'][0]['content']['parts'][0]['text']
        #print("resp:", resp)
        #print("json_str:", json_str)
    except requests.exceptions.ConnectionError as e:
        print(e)
        logger.error("Applications.update_app_using_llm_async() error in performing semantic search: %s", e)
        return
    except requests.exceptions.HTTPError as e:
        print(e)
        logger.error("Applications.update_app_using_llm_async() error in performing semantic search: %s", e)
        return
    except Exception as e:
        print(e)
        logger.error("Applications.update_app_using_llm_async() error in performing semantic search: %s", e)
        return
    
    #return json_str
    #logger.info("obtained the json string")
    json_str = json_str.replace('json', '')
    json_str = json_str.replace('```', '')
    #logger.info("json string after replace is: {}".format(json_str))
    try:
        d_prod_data = json.loads(json_str)
    except Exception as e:
        print(e)
        logger.error("Applications.update_app_using_llm_async() error in performing semantic search: %s", e)
        logger.error("json.loads() failed while trying to convert the string %s to Json.", json_str)
        return
    # TODO:  Add time stamps too
    #print("the final response dictionary is: ", d_prod_data)
    #logger.info("Starting processing the owner info")
    if "owner" in d_prod_data:
        d_owner = d_prod_data["owner"]
        #logger.info("Now processing the owner information")
        # Ownership record is auto generated at product creation time; so this needs to be an update
        if "owner_company" in d_owner and "owner_name" in d_owner and "owner_email" in d_owner:
            # There should be a better way to validate the schema
            d_owner["application_id"] = application_id
            try:
                #  check  first if there's a record for this app
                owners = dbCon.get_documents_by_field("application_ownership", "application_id", application_id)
                if len(owners) < 1:
                    owner_id = dbCon.insert_document("application_ownership", d_owner)
                else:
                    owner = owners[0]
                    if d_owner["owner_company"]:
                        owner["owner_company"] = d_owner["owner_company"]
                    if d_owner["owner_name"]:
                        owner["owner_name"] = d_owner["owner_name"]
                    if d_owner["owner_email"]:
                        owner["owner_email"] = d_owner["owner_email"]
                    if d_owner["owner_phone"]:
                        owner["owner_phone"] = d_owner["owner_phone"]
                    owner["last_updated"] = round(time.time())
                    logger.info("Updating the owner information")
                    owner_id = dbCon.update_document_by_field("application_ownership", "application_id", application_id, owner)
            except Exception as e:
                logger.error("Error in applications.update_app_using_llm_async() while trying to insert owner info for  application with id {} and with owner info as {} with error {}".format(application_id, d_prod_data["owner"], e))
                # no need to return, try capturing the rest
    #logger.info("Starting processing runtime info")
    if "runtime" in d_prod_data:
        #logger.info("Now processing the runtime information")
        # check for required runtime fields
        d_runtime = d_prod_data["runtime"]
        if "hardware" in d_runtime and "operating_system" in d_runtime and "memory" in d_runtime:
            #logger.info("runtime condition met")
            # There should be a better way to validate the schema
            d_runtime["application_id"]     = application_id
            d_runtime["created"]            = round(time.time())
            try:
                #logger.info("Now retrieving the runtime information")
                runtimes = dbCon.get_documents_by_field("application_runtime", "application_id", application_id)
                if len(runtimes) < 1:
                    logger.info("Now inserting the runtime information")
                    runtime_id = dbCon.insert_document("application_runtime", d_runtime)
            except Exception as e:
                logger.error("Error in applications.update_app_using_llm_async() while trying to insert runtime info for  application with id {} and with runtime info as {} with error {}".format(application_id, d_prod_data["runtime"], e))
                # no need to return, try capturing the rest
    #logger.info("Starting processing source info")
    if "source" in d_prod_data:
        d_source = d_prod_data["source"]
        #logger.info("Now processing the source information: {}".format(d_source))
    # check for required source fields
        #logger.info("Now processing the source information")
        if "source_type" in d_prod_data["source"] :
            # There should be a better way to validate the schema
            d_source["application_id"]  = application_id
            d_source["created"]         = round(time.time())
            try:
                sources = dbCon.get_documents_by_field("application_source", "application_id", application_id)
                if len(sources) < 1:
                    logger.info("Now inserting the source information")
                    source_id = dbCon.insert_document("application_source", d_source)
            except Exception as e:
                logger.error("Error in applications.update_app_using_llm_async() while trying to insert source info for application with id {} and with source info as {} with error {}".format(application_id, d_prod_data["source"], e))
                # no need to return, try capturing the rest
    #logger.info("Starting processing models info")
    if "models" in d_prod_data:
        # check for required owner fields
        #logger.info("Now processing the models information")
        d_models    = d_prod_data["models"]
        #logger.info("Now processing the models information: {}".format(d_models))
        if len(d_prod_data["models"]) > 0: 
            #perhaps there is a better way to validate this
            try:
                models = dbCon.get_documents_by_field("application_models", "application_id", application_id)
                if len(models) < 1:
                    logger.info("Now inserting the models information")
                    d_doc_models = {}
                    d_doc_models["application_id"] = application_id
                    d_doc_models["created"]        = round(time.time())
                    d_doc_models["models"]         = d_models
                    model_id = dbCon.insert_document("application_models", d_doc_models)
            except Exception as e:
                logger.error("Error in applications.update_app_using_llm_async() while trying to insert models info for application with id {} and with models info as {} with error {}".format(application_id, d_doc_models, e))
                # no need to return, try capturing the rest
    #logger.info("Starting processing marketing info")
    if "marketing" in d_prod_data:
        #logger.info("Now processing the marketing information")
        d_marketing = d_prod_data["marketing"]
        #logger.info("Now processing the marketing information: {}".format(d_marketing))
        # check for required owner fields
        if "industry" in d_marketing and "pricing_type" in d_marketing and "privacy" in d_marketing:
            d_marketing["application_id"]   = application_id
            d_marketing["created"]          = round(time.time())
            try:
                marketings = dbCon.get_documents_by_field("application_marketing", "application_id", application_id)
                if len(marketings) < 1:
                    logger.info("Now inserting the marketing information")
                    marketing_id = dbCon.insert_document("application_marketing", d_marketing)
            except Exception as e:
                logger.error("Error in applications.update_app_using_llm_async() while trying to insert marketing info for  application with id {} and with marketing info as {} with error {}".format(application_id, d_prod_data["marketing"], e))
                # no need to return, try capturing the rest
    # Call different functions to add 
    #print("arr_results:", arr_results)       
    return json_str
#


# add functions for webscraping the product website for URLs of media files
def update_app_webscrape_async (args): 
    import subprocess
    #product_id, product_url, json_file, max_pages = args
    try:
        subprocess.run(["python3", "website_crawler_media_files.py"] + list(args))
    except Exception as e:
        print(f"Error occurred while running website_crawler_media_files.py: {e}")

