import os, sys
from flask import Flask, render_template, redirect, url_for, request, json, jsonify
from bson.objectid import ObjectId
from oauth2 import OAuth2
from authorization import Authorization 
from time import time # for timestamping
from users import Users
class ApplicationRatings:
    def __init__(self, app, request, dbCon):
        self.app        = app
        self.request    = request
        self.dbCon      = dbCon
        self.oauth2     = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        self.collection = "application_ratings"

    def create_application_ratings(self):
         #-- Assume that validation of incoming app/prototype ratings will happen in some sort of a controller.
        # check that a ratings record with this appid does not already exist... If it dowesn't then simply add crud fields and write it.
        self.app.logger.info('Preparing the app/prototype ratings record for adding it application_ratings collection')
        #--- First authenticate the request with access token. See if this can be modularized. ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        data = self.request.get_json()

        if ("application_id" not in data) or ("comment" not in data):
            self.app.logger.error('Invalid app user ratings request;  application_id and comment are required.')
            return jsonify({'error': 'Invalid app user ratings request; application_id and comment are required.'}), 400
        application_id      = data["application_id"]
        if application_id   == "":
            self.app.logger.error('Invalid app user ratings request;  application_id cannot be blank.')
            return jsonify({'error': 'Invalid app user ratings request; application_id cannot be blank.'}), 400
 
        appCollection       = "applications"
        fieldName           = "_id"
        fieldValue          = ObjectId(application_id)
        proto_app           = ""     # H for prototype and P for apps
        try:
            apps = self.dbCon.get_documents_by_field(appCollection, fieldName, fieldValue)
        except Exception as e: 
            self.app.logger.error("Data retrieval for application with application id {} failed with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(apps) > 0:
            proto_apps  = apps[0]["type"]       
        #--- Validate for prototype and application specific required fields.
        if "proto_impact_rating" not in data and "proto_practicality_rating" not in data and "app_practicality_rating" not in data and "app_performance_rating" not in data and "app_ux_rating" not in data and "app_ecosystem_rating" not in data:
            self.app.logger.error('Invalid app user ratings request;  Rating are required.')
            return jsonify({'error': 'Invalid app user ratings request; Ratings are required.'}), 400
        #TODO - Add more validations e.g. values of ratings between 1 and 5; using the application_id to check if it's a prototype or application
        if proto_app    == "H" and "proto_impact_rating" not in data and "proto_practicality_rating" not in data:
            self.app.logger.error('Invalid app user ratings request;  Prototype Ratings are required.')
            return jsonify({'error': 'Invalid app user ratings request; Prototype Ratings are required.'}), 400
        if proto_app    == "P" and "app_practicality_rating" not in data and "app_performance_rating" not in data and "app_ux_rating" not in data and "app_ecosystem_rating" not in data:
            self.app.logger.error('Invalid app user ratings request;  Application ratings are required.')
            return jsonify({'error': 'Invalid app user ratings request; Application Ratings are required.'}), 400

        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["created"] = round(time())
        if user_id:
            data["created_by"] = user_id
               
        # Check that there's no ratings record for this application and user_id
        filterDict = {"application_id": application_id, "created_by": user_id}
        sortOrder   = ""  # No sorting needed here since we're looking for a specific record.
        try:
            ratings       = self.dbCon.get_documents_by_fields(self.collection, filterDict, sortOrder)
        except Exception as e:
            self.app.logger.error("Retrieval of app user ratings failed on application id {} with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(ratings) > 0:
            # If rating already exists for this app by this user, then simply update the rating and return
            data["last_updated"] = round(time())
            data["last_updated_by"] = user_id
            try:
                self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue,  data)    
            except Exception as e:
                return jsonify({"error": "Application rating update failed with exception {}".format(e) }), 400
            return jsonify({"rating_id": rating_id}), 200
            #self.app.logger.error('Application User Rating information for this app and app by this user already exists.')
            #return jsonify({'error': 'Bad request: Application User Rating information for this app and by this user already exists.'}), 400
        
        #--- Since any logged in user can enter ratings on app; we need not check any permissions for creating a ratings record -----#
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["created"] = round(time())
        data["created_by"] = user_id
        # we don't need to validate the values in the application json since it's already done in the controller
        try:
            rating_id = self.dbCon.insert_document(self.collection, data)
            result  = {"rating_id": rating_id}
            status = 201
            return jsonify(result), status
        except Exception as e:
            self.app.logger.error('Error inserting app user ratings information: %s', e)
            result = {'error': 'Failed to insert the app user ratings information'}
            status = 400
            return jsonify(result), status
        #--- We also don't need to add permissions here for this ratings record. On update we can check if the created_by user is same as the one on token


    def get_ratings_by_rating_id(self, rating_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('ApplicationRatings.get_ratings_by_rating_id: get ratings for ratings id '. format(rating_id))
        fieldName   = "_id"
        fieldValue = ObjectId(rating_id)
        ratings = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(ratings) > 0:
            rating     = ratings[0]
        else:
            return jsonify({"error": "No ratings information found for the provided ratings id.".format(rating_id)}), 400
        users   = Users(self.app, self.request, self.dbCon)
        rating["_id"] = str(rating.get("_id"))
        # get the name of the user who provided the rating
        rating["user_name"]     = ""   
        rating["user_icon_url"] = ""
        rater_id                = ""                         
        if "user_id" in rating and rating["user_id"] != "":
            rater_id = rating["user_id"]
        elif "created_by" in rating and rating["created_by"] != "":
            rater_id    = rating["created_by"]
        elif "last_updated_by" in rating and rating["last_updated_by"] != "":
            rater_id    = rating["last_updated_by"]
        if rater_id != "":
            users   = Users(self.app, self.request, self.dbCon)
            user    = users.get_user_info(rater_id)
            if "first_name" in user:
                rating["rater_name"] = user["first_name"]
            if "last_name" in user:
                rating["rater_name"] += " " + user["last_name"]
            if "user_icon_url" in user:
                rating["user_icon_url"] = user["user_icon_url"]

        return jsonify(rating), 200
   
    def get_ratings_by_application_id(self, application_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('ApplicationRatings.get_ratings_by_application_id: get application ratings for application id '. format(application_id))
        fieldName   = "application_id"
        fieldValue          = application_id
        sortFields             = ""             # It can be a list of tuples but we don't need this data sorted 
        ratings = self.dbCon.get_documents_by_field_sorted(self.collection, fieldName, fieldValue, sortFields)
        if len(ratings) < 1:
            return jsonify({"error": "No ratings record found for the provided application id.".format(application_id)}), 400
        users   = Users(self.app, self.request, self.dbCon)
        for rating in ratings:
            if "_id" in rating:
                rating["rating_id"] = str(rating["_id"])
                del(rating["_id"])
            # get the name of the user who provided the rating
            rating["rater_name"]    = ""   
            rater_id                = ""                         
            if "user_id" in rating and rating["user_id"] != "":
                rater_id = rating["user_id"]
            elif "created_by" in rating and rating["created_by"] != "":
                rater_id    = rating["created_by"]
            elif "last_updated_by" in rating and rating["last_updated_by"] != "":
                rater_id    = rating["last_updated_by"]
            if rater_id != "":
                user = users.get_user_info(rater_id)
                if "first_name" in user:
                    rating["user_name"] = user["first_name"]
                if "last_name" in user:
                    rating["user_name"] += " " + user["last_name"]
                if "user_icon_url" in user:
                    rating["user_icon_url"] = user["user_icon_url"]

            rating["rater_name"]  = ""
            if "last_modified_by" in rating and rating["last_modified_by"] != "":
                rating["rater_name"]  = users.get_user_name_by_id(rating["last_modified_by"])
            elif "created_by" in rating and rating["created_by"] != "":
                rating["rater_name"]  = users.get_user_name_by_id(rating["created_by"])
        #print("ratings now: ".format(ratings))
        return jsonify(ratings), 200
                               
    
#---def update_application_ratings(self, application_id):
#---- We cannot allow update of all user ratings of an application in one go. Update has to be for individual  user rating.

    def update_application_ratings_by_rating_id(self, rating_id):
        self.app.logger.info('Preparing the ratings record for updating the application_ratings collection')
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
        #--- We don't need any permission check here. All we need is that this record belongs to the user who created it and required values are supplied.
        fieldName   = "_id"
        try:
            fieldValue  = ObjectId(rating_id)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on application ratings id {} with error {}".format(rating_id, e))
            return jsonify({"error": format(e) }), 400
        #--- if user_id is invalid (must be 12 bytes or 24 char hex string ), handle the ObjectId() call error
        try:
            ratings       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Data retrieval failed on application ratings id {} with error {}".format(rating_id, e))
            return jsonify({"error": format(e) }), 400
        if len(ratings) > 0:
            rating    = ratings[0]
            # Do NOT change the rating reply here even if the rater somehow managed to change it.
            data["owner_comment_reply"] = rating["owner_comment_reply"]
            if rating["created_by"]  == user_id:
                if "_id" in rating:
                    rating_id    = str(rating["_id"])
                # we don't need to validate the values in the application json since it's already done in the controller
                # --- Do not change the values of fields that can potentially be exploited e.g. created_by
                data["created_by"]  = rating["created_by"]
                data["created"]     = rating["created"]
                try:
                    self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue,  data)    
                except Exception as e:
                    return jsonify({"error": "Application update failed with exception {}".format(e) }), 400
                return jsonify({"rating_id": rating_id}), 200
            else:
                return jsonify({"error": "You cannot update this record since it wasn't created by you."}),400
        else:
            return jsonify({"error": "No existing record for this application rating to update."}),400
    
    # Add update owner_comment Reply only
    def update_application_rating_reply(self, rating_id):
        self.app.logger.info('Preparing the owner_comment_reply record for updating the application_ratings collection')
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
        user = self.oauth2.get_user_from_access_token(access_token)
        if "user_id" in user:
            user_id = user["user_id"]
        #Validate the application id and rating_ids 
        if "application_id" not in data:
            self.app.logger.error('Invalid  request. No application_id supplied.')
            return jsonify({'error': 'Invalid request. No application_id supplied.'}), 400
        if "rating_id" == "":
            self.app.logger.error('Invalid  request. No rating_id supplied.')
            return jsonify({'error': 'Invalid request. No rating_id supplied.'}), 400
        if "owner_comment_reply" not in data or data["owner_comment_reply"] == "":
            self.app.logger.error('Invalid  request, owner_comment_reply not supplied.')
            return jsonify({'error': 'Invalid request, owner_comment_reply not supplied.'}), 400
        application_id  = data["application_id"]
        fieldName   = "_id"
        fieldValue  = ObjectId(application_id)
        targetCollection = "applications"
        applications = self.dbCon.get_documents_by_field(targetCollection, fieldName, fieldValue)
        if len(applications) > 0:
            application     = applications[0]
        else:
           self.app.logger.error('Invalid  request. Invalid application_id supplied.')
           return jsonify({"error": "No user application found for the provided application id.".format(application_id)}), 400

        fieldName   = "_id"
        try:
            fieldValue  = ObjectId(rating_id)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on application ratings id {} with error {}".format(rating_id, e))
            return jsonify({"error": format(e) }), 400
        #--- if user_id is invalid (must be 12 bytes or 24 char hex string ), handle the ObjectId() call error
        try:
            ratings       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Data retrieval failed on application ratings id {} with error {}".format(rating_id, e))
            return jsonify({"error": format(e) }), 400
        ratings = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(ratings) > 0:
            rating     = ratings[0]
        else:
           self.app.logger.error('Invalid  request. Invalid rating_id supplied.')
           return jsonify({"error": "No rating found for the provided rating id.".format(rating_id)}), 400
        # Let's now check the ownership 
        collectionName = "application_ownership"
        fieldName       = "application_id"
        fieldValue      = application_id
        owners = self.dbCon.get_documents_by_field(collectionName, fieldName, fieldValue)
        if len(owners) < 1:
            return jsonify({"error": "Supplied application doesn't have any associated ownership information."}), 400
        
        owner     = owners[0]
        #print("Owners records for user {} application {} are {} ".format(user_id, application_id, owners))
        if  user_id != owner["owner_id"] and user_id != owner["secondary_owner_id"] :
            return jsonify({"error": "You don't own this application. Only primary or secondary owners of an application can add/update a reply."}), 400
        if rating["owner_comment_reply"] == data["owner_comment_reply"]:
            self.app.logger.error('Invalid  request. No change in owner_comment_reply')
            return jsonify({"error": "Invalid  request. No change in owner_comment_reply"}), 400
        else:
            rating["owner_comment_reply"] = data["owner_comment_reply"]
            fieldName   = "_id"
            try:
                fieldValue  = ObjectId(rating_id)
            except Exception as e:
                self.app.logger.error("bson operation ObjectId() failed on application ratings id {} with error {}".format(rating_id, e))
                return jsonify({"error": format(e) }), 400
            try:
                self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue,  rating)    
            except Exception as e:
                return jsonify({"error": "Rating owner_comment reply failed with exception {}".format(e) }), 400
            return jsonify({"rating_id": rating_id}), 200


