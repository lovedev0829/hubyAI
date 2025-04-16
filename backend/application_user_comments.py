import os, sys
from flask import Flask, render_template, redirect, url_for, request, json, jsonify
from bson.objectid import ObjectId
from oauth2 import OAuth2
from authorization import Authorization 
from time import time # for timestamping
from user_comment_votes import UserCommentVotes # to get votes by comment
from users import Users
class ApplicationUserComments:
    def __init__(self, app, request, dbCon):
        self.app        = app
        self.request    = request
        self.dbCon      = dbCon
        self.oauth2     = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        self.collection = "application_user_comments"

    def create_application_user_comments(self):
         #-- Assume that validation of incoming app/prototype comments will happen in some sort of a controller.
        # check that a comments record with this appid does not already exist... If it dowesn't then simply add crud fields and write it.
        self.app.logger.info('Preparing the app/prototype user comments record for adding it application_user_comments collection')
        #--- First authenticate the request with access token. See if this can be modularized. ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        data = self.request.get_json()
        if "application_id" not in data or "path" not in data:
            self.app.logger.error('Invalid app user comments request;  application_id and path are required.')
            return jsonify({'error': 'Invalid app user comments request; application_id and path are required.'}), 400
        
        application_id      = data["application_id"]
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["created"] = round(time())
        if user_id:
            data["created_by"] = user_id
               
        # Check that there's no comments record for this application and user_id
        filterDict = {"application_id": application_id, "path": data['path']}
        sortOrder   = ""  # No sorting needed here since we're looking for a specific record.
        try:
            user_comments       = self.dbCon.get_documents_by_fields(self.collection, filterDict, sortOrder)
        except Exception as e:
            self.app.logger.error("Retrieval of app user comments failed on application id {} with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(user_comments) > 0:
            self.app.logger.error('Application User Comment information for this app and path already exists.')
            return jsonify({'error': 'Bad request: Application User Comment information for this app and path already exists.'}), 400

        #--- Do basic validation for required info:
        if "comment" not in data or len(data["comment"]) == 0:
            self.app.logger.error('Application user comments comment is required')
            return jsonify({'error': 'Bad request: application user comments comment is required'}), 400


        #--- Since any logged in user can enter comments on app; we need not check any permissions for creating a comments record -----#
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["user_id"] = user_id
        data["created"] = round(time())
        data["created_by"] = user_id
        # we don't need to validate the values in the application json since it's already done in the controller
        try:
            user_comment_id = self.dbCon.insert_document(self.collection, data)
            result  = {"user_comment_id": user_comment_id}
            status = 201
            return jsonify(result), status
        except Exception as e:
            self.app.logger.error('Error inserting app user comments information: %s', e)
            result = {'error': 'Failed to insert the app user comments information'}
            status = 400
            return jsonify(result), status
        #--- We also don't need to add permissions here for this comments record. On update we can check if the created_by user is same as the one on token


    def get_user_comments_by_user_comment_id(self, user_comment_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('ApplicationUserComments.get_user_comments_by_user_comment_id: get comments for comments id '. format(user_comment_id))
        fieldName   = "_id"
        fieldValue = ObjectId(user_comment_id)
        comments = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(comments) > 0:
            comment    = comments[0]
        else:
            return jsonify({"error": "No comments information found for the provided comments id.".format(user_comment_id)}), 400
        comment["_id"] = str(comment.get("_id"))
        if "_id" in comment:
            del comment["_id"]
        comment["user_name"]    = ""   
        commenter_id            = ""                         
        if "user_id" in comment and comment["user_id"] != "":
            commenter_id = comment["user_id"]
        elif "created_by" in comment and comment["created_by"] != "":
            commenter_id    = comment["created_by"]
        elif "last_updated_by" in comment and comment["last_updated_by"] != "":
            commenter_id    = comment["last_updated_by"]
        if commenter_id != "":
            users   = Users(self.app, self.request, self.dbCon)
            user    = users.get_user_info(commenter_id)
            if "first_name" in user:
                comment["user_name"] = user["first_name"]
            if "last_name" in user:
                comment["user_name"] += " " + user["last_name"]
            if "user_icon_url" in user:
                comment["user_icon_url"] = user["user_icon_url"]
        return jsonify(comment), 200
   
    def get_user_comments_by_application_id(self, application_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('ApplicationUserComments.get_user_comments_by_application_id: get application comments for application id '. format(application_id))
        fieldName   = "application_id"
        fieldValue          = application_id
        sortFields             = ""             # It can be a list of tuples but we don't need this data sorted 
        comments = self.dbCon.get_documents_by_field_sorted(self.collection, fieldName, fieldValue, sortFields)
        if len(comments) < 1:
            return jsonify({"error": "No comments record found for the provided application id.".format(application_id)}), 400

        # for each comment get the commenter name and comment votes and send them back
        user_comment_votes  = UserCommentVotes(self.app, self.request, self.dbCon)
        users               = Users(self.app, self.request, self.dbCon)
        for comment in comments:
            comment["user_name"]    = ""   
            commenter_id            = ""                         
            if "user_id" in comment and comment["user_id"] != "":
                commenter_id = comment["user_id"]
            elif "created_by" in comment and comment["created_by"] != "":
                commenter_id    = comment["created_by"]
            elif "last_updated_by" in comment and comment["last_updated_by"] != "":
                commenter_id    = comment["last_updated_by"]
            if commenter_id != "":
                user = users.get_user_info(commenter_id)
                if "first_name" in user:
                    comment["user_name"] = user["first_name"]
                if "last_name" in user:
                    comment["user_name"] += " " + user["last_name"]
                if "user_icon_url" in user:
                    comment["user_icon_url"] = user["user_icon_url"]
                if "_id" in comment:
                    comment["user_comment_id"] = str(comment["_id"])
                    del(comment["_id"])
            comment["votes"]    = user_comment_votes.get_user_comment_votes_by_comment_id_internal(comment["user_comment_id"])
                
        #print("comments now: ".format(comments))
        return jsonify(comments), 200
                               
    
#---def update_application_user_comments(self, application_id):
#---- We cannot allow update of all user comments of an application in one go. Update has to be for individual  user comment.

    def update_application_user_comments_by_user_comment_id(self, user_comment_id):
        self.app.logger.info('Preparing the comments record for updating the application_user_comments collection')
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
            fieldValue  = ObjectId(user_comment_id)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on application comments id {} with error {}".format(user_comment_id, e))
            return jsonify({"error": format(e) }), 400
        #--- if user_id is invalid (must be 12 bytes or 24 char hex string ), handle the ObjectId() call error
        try:
            comments       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Data retrieval failed on application comments id {} with error {}".format(user_comment_id, e))
            return jsonify({"error": format(e) }), 400
        if len(comments) > 0:
            comment    = comments[0]
            if comment["created_by"]  == user_id:
                if "_id" in comment:
                    user_comment_id    = str(comment["_id"])
                # we don't need to validate the values in the application json since it's already done in the controller
                # --- Do not change the values of fields that can potentially be exploited e.g. created_by
                data["created_by"]  = comment["created_by"]
                data["created"]     = comment["created"]
                try:
                    self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue,  data)    
                except Exception as e:
                    return jsonify({"error": "Application update failed with exception {}".format(e) }), 400
                return jsonify({"user_comment_id": user_comment_id}), 200
            else:
                return jsonify({"error": "You cannot update this record since it wasn't created by you."}),400
        else:
            return jsonify({"error": "No existing record for this application comment to update."}),400
    
