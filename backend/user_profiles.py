import os, sys
from flask import Flask, render_template, redirect, url_for, request, json, jsonify
from bson.objectid import ObjectId
from oauth2 import OAuth2
from authorization import Authorization 
from time import time # for timestamping
from application_user_comments import ApplicationUserComments
class UserProfiles:
    def __init__(self, app, request, dbCon):
        self.app        = app
        self.request    = request
        self.dbCon      = dbCon
        self.oauth2     = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        self.collection = "user_profiles"
        if "API_DOMAIN" in os.environ:
            self.API_DOMAIN  =   os.getenv("API_DOMAIN")
        else:
            self.API_DOMAIN  = "http://localhost"

    def create_user_profile(self, user_id = ""):
        #here we generate the user_profile_url and send the user_id, user_profile_id, and user_profile_url as response
        self.app.logger.info('Preparing the user_profile record for adding it to the user_profiles collection')
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        user = self.oauth2.get_user_from_access_token(access_token)

        data = self.request.get_json()
        # As such we can get the user_id from the access_token but we may need a company admin/support person update it too. So, keep the user_id as an arg.
        if user_id == "":  # not supplied in the endpoint (only in payload)
            if "user_id" in data and data["user_id"] != "":
                user_id = data["user_id"]
        if user_id == "": 
            self.app.logger.error('Invalid user profile submission;  user_id (a required field) missing in the request.')
            return jsonify({'error': 'Invalid user profile submission;  user_id (a required field) missing in the request'}), 400
        
        #Check that the user_profile record doesn't already exist.
        fieldName       = "user_id"
        fieldValue      = user_id
        try:
            user_profiles     = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue )
        except Exception as e:
            self.app.logger.error("UserProfiles.create_create_user_profile(): Error checking user profile for user id " + user_id + " with error {}". format(e))
            return jsonify({"error": "Error checking user profile for user id " + user_id + " with error {}". format(e)}), 400
        if len(user_profiles) > 0:
            self.app.logger.error('Invalid user profile submission; User profile for this user {} already exists. Nothing saved.'.format(user_id))
            return jsonify({'error': 'Invalid user profile submission; User profile for this user {} already exists. Nothing saved.'.format(user_id)}), 400

        #TODO: Add a check for company_id in the payload and validation against companies collection.
        if "company_id" in data and data["company_id"] != "":
            company_id      = data["compaany_id"]
            tmp_collection  = "companies"
            fieldName       = "_id"
            fieldValue      = ObjectId(company_id)
            try:
                companies     = self.dbCon.get_documents_by_field(tmp_collection, fieldName, fieldValue )
            except Exception as e:
                self.app.logger.error("UserProfiles.create_create_user_profile(): Error retrieving company for company id " + company_id + " with error {}". format(e))
                return jsonify({"error": "Error retrieving company for company id " + company_id + " with error {}". format(e)}), 400

        
        if "user_location" not in data or len(data["user_location"]) < 1:
            self.app.logger.error('Invalid user profile submission; There needs to be city, state, and country in user_location. Nothing saved.')
            return jsonify({'error': 'Invalid user profile submission; There needs to be city, state, and country in user_location. Nothing saved'}), 400
        if "user_expertise" not in data or len(data["user_expertise"]) < 1:
            self.app.logger.error('Invalid user profile submission; User expertise is required. Nothing saved.')
            return jsonify({'error': 'Invalid user profile submission; User expertise is required. Nothing saved'}), 400       
        if "user_interests" not in data or len(data["user_interests"]) < 1:
            self.app.logger.error('Invalid user profile submission; User Interests is required. Nothing saved.')
            return jsonify({'error': 'Invalid user profile submission; User Interests is required. Nothing saved'}), 400       
        # For now let's keep user_reputation_score and user_badges as optional fields; they will be calculated by a batch script.
        # Reputation score = (# of likes-# of dislikes/# of likes + # of dislikes)
        app_user_comments   = ApplicationUserComments(self.app, self.request, self.dbCon)
        data["user_reputation_score"]   = "diamond"
        data["user_badges"]   = ["diamond", "gold", "silver", "bronze", "kudos" ]
        #validate the ownership of user object to create the profile
        tmp_collection = "users"
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, tmp_collection, user_id)
        print("permissions are: ", permissions)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing required permissions on user with id {}".format(user_id))
            return jsonify({"error":"Missing required permissions on user with id ".format(user_id)}),400

        crud_permissions = permissions["permissions"]
        #--- Let's just test for update privilege on user
        if crud_permissions[2] != "1":
            self.app.logger.error("Missing create permissions on user with id {}".format(user_id))
            return jsonify({"error":"Missing create permissions on user with id ".format(user_id)}),400
        try:
            user_profile_id = self.dbCon.insert_document(self.collection, data)
            user_profile_url = self.API_DOMAIN + "/user_profiles/" + user_profile_id 
            result  = {"user_profile_id": user_profile_id, "user_id": user_id, "user_profile_url": user_profile_url}
            status = 201
        except Exception as e:
            self.app.logger.error('Error inserting app user review: %s', e)
            result = {'error': 'Failed to insert the app user review.'}
            status = 400

        return jsonify(result), status


    def get_user_profile_by_user_id(self, user_id):
        self.app.logger.info('UserProfiles.get_user_profile_by_user_id: user id '. format(user_id))
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on user profile request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        # application review can only be viewed by application owner.
        fieldName           = "user_id"
        fieldValue          = user_id
        try:
            user_profiles = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e: 
            self.app.logger.error("Data retrieval for user profile with user id {} failed with error {}".format(user_id, e))
            return jsonify({"error": format(e) }), 400
        if len(user_profiles) < 1:   #application not found.
            #---  check that this user is an owner of this application. If not, reject the request.
            self.app.logger.error("No user profile found for the supplied user id {} ".format(user_id))
            return jsonify({"error":"No user profile found for the supplied user id {}".format(user_id)}),400
        # We can simply check the permission at user object level instead of down to user profile level; since admin ownership will be at user level
        user_collection     = "users"
        permissions         = self.oauth2.get_document_permissions_using_access_token(access_token, user_collection, user_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing ownership permissions on user with id {}".format(user_id))
            return jsonify({"error":"Missing ownership permissions on user with id ".format(user_id)}),400

        crud_permissions = permissions["permissions"]
        if crud_permissions[1] != "1":
            self.app.logger.error("Missing ownership permissions for user id {}".format(user_id))
            return jsonify({"error":"Missing ownership permissions for user id ".format(user_id)}),400
        
        fieldName       = "user_id"
        fieldValue      = user_id
        user_profiles   = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(user_profiles) > 0:
            user_profile     = user_profiles[0]
        else:
            return jsonify({"error": "No profile information found for the provided user id.".format(user_id)}), 400
        user_profile["_id"] = str(user_profile.get("_id"))
        if "_id" in user_profile:
            del user_profile["_id"]
        return jsonify(user_profile), 200
   
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
            return jsonify({"error": "No review requests record found for the provided application id.".format(application_id)}), 400

        for review in reviews:
            if "_id" in review:
                review["reveiew_id"] = str(review["_id"])
                del(review["_id"])
        print("review now: ".format(reviews))
        return jsonify(reviews), 200
                               
    
#--- Currently there's no update functionality for review responses since reviewers may not be users on the platform.
    
