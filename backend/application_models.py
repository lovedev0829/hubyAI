import os, sys
from flask import Flask, render_template, redirect, url_for, request, json, jsonify
from bson.objectid import ObjectId
from oauth2 import OAuth2
from authorization import Authorization 
from time import time # for timestamping
class ApplicationModels:
    def __init__(self, app, request, dbCon):
        self.app        = app
        self.request    = request
        self.dbCon      = dbCon
        self.oauth2     = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        self.collection = "application_models"

    def create_application_models(self):
         #-- Assume that validation of incoming app/prototype models will happen in some sort of a controller.
        # check that a models record with this appid does not already exist... If it dowesn't then simply add crud fields and write it.
        self.app.logger.info('Preparing the app/prototype models record for adding it application_models collection')
        #--- First authenticate the request with access token. See if this can be modularized. ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        data = self.request.get_json()
        if "application_id" not in data:
            self.app.logger.error('Invalid app models request. No application_id supplied.')
            return jsonify({'error': 'Invalid app models request. No application_id supplied.'}), 400
        application_id      = data["application_id"]
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["created"] = round(time())
        if user_id:
            data["created_by"] = user_id
        targetCollection    = "applications"
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, targetCollection, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing ownership permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions on application with id ".format(application_id)}),400
        crud_permissions = permissions["permissions"]
        if crud_permissions[2] != "1":
            self.app.logger.error("Missing ownership permissions for application id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions for application id ".format(application_id)}),400
               
               
        # Check that there's no models record for this application 
        fieldName   = "application_id"
        fieldValue  = application_id
        try:
            models       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Retrieval of app models failed on application id {} with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(models) > 0:
            self.app.logger.error('Application Models information for this app already exists.')
            return jsonify({'error': 'Bad request: Application Models information for this app already exists.'}), 400
        #--- Do basic validation for required info:
        if "models" not in data or len(data["models"]) == 0:
            self.app.logger.error('Application models fieled is required')
            return jsonify({'error': 'Bad request: application models field is required'}), 400

        fieldName   = "_id"
        try:
            fieldValue          = ObjectId(application_id)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on application id {} with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        try:   
            applications       = self.dbCon.get_documents_by_field(targetCollection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Data retrieval for application with application id {} failed with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(applications) > 0:
            # we don't need to validate the values in the application json since it's already done in the controller
            try:
                models_id = self.dbCon.insert_document(self.collection, data)
            except Exception as e:
                self.app.logger.error('Error inserting app models information: %s', e)
                result = {'error': 'Failed to insert the app models information'}
                status = 400
                return jsonify(result), status
        else:
            return jsonify({"error": "Application with the suppplied application id does not exist."}),400
    

        #--- update the permissions for this app by making this submitting user as the owner
        if models_id is None:
                result = {"Error": "Application models record creation failed. Check for the input."}
                status = 400
                return jsonify(result), status
        else: 
            result  = {"models_id": models_id}
            status = 201
            user_id     = self.oauth2.get_user_id_from_access_token(access_token)
            # --- Set the user permission record in user_document_role collection
            user_role           = "owner"
            #user_perms          = {"user_id": documentId, "collection_roles": {targetCollection: {"users": user_role} }}
            self.authorization.add_permission(access_token, user_id, self.collection, models_id, user_role)
            self.app.logger.info("updated app/prototype models permissions ")    
            return jsonify(result), status

    def get_models_by_models_id(self, models_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('ApplicationModels.get_models_by_models_id: get models for models id '. format(models_id))
        fieldName   = "_id"
        fieldValue = ObjectId(models_id)
        modelss = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(modelss) > 0:
            models     = modelss[0]
        else:
            return jsonify({"error": "No models information found for the provided models id.".format(models_id)}), 400
        models["_id"] = str(models.get("_id"))
        if "_id" in models:
            del models["_id"]
        return jsonify(models), 200
   
    def get_models_by_application_id(self, application_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('Applications.get_models_by_application_id: get application models for application id '. format(application_id))
        fieldName   = "application_id"
        #fieldValue = ObjectId(application_id)
        fieldValue          = application_id
        modelss = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(modelss) > 0:
            models     = modelss[0]
            if "_id" in models:
                models["models_id"] = str(models["_id"])
                del(models["_id"])
        else:
            return jsonify({"error": "No models record found for the provided application id.".format(application_id)}), 400
        return jsonify(models), 200
                               
    
    def update_application_models(self, application_id):
        #---TODO: We need to create a module that validates the access token and then checks/validates the permission. This operation is needed for most update/delete operations.
        # The validation code below will move to the controller once we've the code refactored.
        self.app.logger.info('Preparing the models record for updating the application_models collection')
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
        targetCollection    = "applications"
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, targetCollection, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing ownership permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions on application with id ".format(application_id)}),400
        crud_permissions = permissions["permissions"]
        if crud_permissions[2] != "1":
            self.app.logger.error("Missing ownership permissions for application id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions for application id ".format(application_id)}),400
               
        fieldName   = "application_id"
        fieldValue  = application_id
        #--- if user_id is invalid (must be 12 bytes or 24 char hex string ), handle the ObjectId() call error
        try:
            modelss       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on application models id {} with error {}".format(models_id, e))
            return jsonify({"error": format(e) }), 400
        if len(modelss) < 1:
            return jsonify({"error": "Invalid request: No models record found for provided application."}),400
        models    = modelss[0]
        if "_id" in models:
            models_id    = str(models["_id"])
        if "models" in data:
            models["models"]    = data["models"]
            models["last_updated_by"]   = user_id
            models["last_updated"]      = round(time())
        else:
            return jsonify({"error": "Invalid data. Models information is required for update."}),400
        # we don't need to validate the values in the application json since it's already done in the controller
        try:
            self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue, models)    
        except Exception as e:
            return jsonify({"error": "Application update failed with exception {}".format(e) }), 400
        return jsonify({"application_id": application_id, "models_id": models_id}), 200


    def update_application_models_by_models_id(self, models_id):
        self.app.logger.info('Preparing the models record for updating the application_models collection')
        #--- First authenticate the request with access token ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        data = self.request.get_json()
        if "application_id" in data and data["application_id"] != "":
            application_id = data["application_id"]
        else:
            self.app.logger.error("Missing application id in the update request.")
            return jsonify({"error":"Missing application id in the update request." }),400
        targetCollection    = "applications"
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, targetCollection, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing ownership permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions on application with id ".format(application_id)}),400
        crud_permissions = permissions["permissions"]
        if crud_permissions[2] != "1":
            self.app.logger.error("Missing ownership permissions for application id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions for application id ".format(application_id)}),400
        user_id = self.oauth2.get_user_id_from_access_token(access_token)

        fieldName   = "_id"
        try:
            fieldValue  = ObjectId(models_id)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on application models id {} with error {}".format(models_id, e))
            return jsonify({"error": format(e) }), 400
        #--- if user_id is invalid (must be 12 bytes or 24 char hex string ), handle the ObjectId() call error
        try:
            modelss       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Data retrieval failed on application models id {} with error {}".format(models_id, e))
            return jsonify({"error": format(e) }), 400
        if len(modelss) > 0:
            models    = modelss[0]
            if "_id" in models:
                models_id    = str(models["_id"])
            # we don't need to validate the values in the application json since it's already done in the controller
            if "models" in data:
                models["models"] = data["models"]
                models["last_updated_by"]   = user_id
                models["last_updated"]      = round(time())
                try:
                    self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue,  data)    
                except Exception as e:
                    return jsonify({"error": "Application update failed with exception {}".format(e) }), 400
                return jsonify({"models_id": models_id}), 200
            else:
                return jsonify({"error": "Invalid data. Models information is required for update."}),400
        else:
            return jsonify({"error": "No models record found for the supplied models id {}".format(models_id)}),400



