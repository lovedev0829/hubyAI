import os, sys
from flask import Flask, render_template, redirect, url_for, request, json, jsonify
from bson.objectid import ObjectId
from oauth2 import OAuth2
from authorization import Authorization 
from time import time # for timestamping
class ApplicationRuntime:
    def __init__(self, app, request, dbCon):
        self.app        = app
        self.request    = request
        self.dbCon      = dbCon
        self.oauth2     = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        self.collection = "application_runtime"

    def create_application_runtime(self):
         #-- Assume that validation of incoming app/prototype runtime will happen in some sort of a controller.
        # check that a runtime record with this appid does not already exist... If it dowesn't then simply add crud fields and write it.
        self.app.logger.info('Preparing the app/prototype runtime record for adding it application_runtime collection')
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
            self.app.logger.error('Invalid app runtime request. No application_id supplied.')
            return jsonify({'error': 'Invalid app runtime request. No application_id supplied.'}), 400
        application_id      = data["application_id"]
        print("data received is {}".format(data))
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["created"] = round(time())
        if user_id:
            data["created_by"] = user_id
               
        # Check that there's no runtime record for this application 
        fieldName   = "application_id"
        fieldValue  = application_id
        try:
            runtime       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Retrieval of app runtime failed on application id {} with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(runtime) > 0:
            self.app.logger.error('Application Runtime information for this app already exists.')
            return jsonify({'error': 'Bad request: Application Runtime information for this app already exists.'}), 400

        #--- Do basic validation for required info:
        if "operating_system" not in data or len(data["operating_system"]) == 0:
            self.app.logger.error('App/Prototype runtime operating_system is required')
            return jsonify({'error': 'Bad request: application runtime operating_system is required'}), 400
        if "gpu" not in data and "cpu" not in data:
            self.app.logger.error('App/Prototype runtime gpu/cpu is required')
            return jsonify({'error': 'Bad request: application runtime gpu/cpu is required'}), 400
        
        targetCollection    = "applications"
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, targetCollection, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing ownership permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions on application with id ".format(application_id)}),400
        crud_permissions = permissions["permissions"]
        if crud_permissions[0] != "1":
            self.app.logger.error("Missing ownership permissions for application id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions for application id ".format(application_id)}),400
        data["created"] = round(time())
        if user_id:
            data["created_by"] = user_id
        # we don't need to validate the values in the application json since it's already done in the controller
        try:
            runtime_id = self.dbCon.insert_document(self.collection, data)
        except Exception as e:
            self.app.logger.error('Error inserting app runtime information: %s', e)
            result = {'error': 'Failed to insert the app runtime information'}
            status = 400
            return jsonify(result), status

        if runtime_id is None:
                result = {"Error": "Application runtime record creation failed. Check for the input."}
                status = 400
                return jsonify(result), status
        else: 
            result  = {"runtime_id": runtime_id}
            status = 201
            user_id     = self.oauth2.get_user_id_from_access_token(access_token)
            # --- Set the user permission record in user_document_role collection
            user_role           = "owner"
            #user_perms          = {"user_id": documentId, "collection_roles": {targetCollection: {"users": user_role} }}
            self.authorization.add_permission(access_token, user_id, self.collection, runtime_id, user_role)
            self.app.logger.info("updated app/prototype runtime permissions ")    
            return jsonify(result), status

    def get_runtime_by_runtime_id(self, runtime_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('ApplicationRuntime.get_runtime_by_runtime_id: get runtime for runtime id '. format(runtime_id))
        fieldName   = "_id"
        fieldValue = ObjectId(runtime_id)
        runtimes = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(runtimes) > 0:
            runtime     = runtimes[0]
        else:
            return jsonify({"error": "No runtime information found for the provided runtime id.".format(runtime_id)}), 400
        runtime["_id"] = str(runtime.get("_id"))
        if "_id" in runtime:
            del runtime["_id"]
        return jsonify(runtime), 200
   
    def get_runtime_by_application_id(self, application_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('Applications.get_runtime_by_application_id: get application runtime for application id '. format(application_id))
        fieldName   = "application_id"
        #fieldValue = ObjectId(application_id)
        fieldValue          = application_id
        runtimes = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(runtimes) > 0:
            runtime     = runtimes[0]
            if "_id" in runtime:
                runtime["runtime_id"] = str(runtime["_id"])
                del(runtime["_id"])
        else:
            return jsonify({"error": "No runtime record found for the provided application id.".format(application_id)}), 400
        return jsonify(runtime), 200
                               
    
    def update_application_runtime(self, application_id):
        #---TODO: We need to create a module that validates the access token and then checks/validates the permission. This operation is needed for most update/delete operations.
        # The validation code below will move to the controller once we've the code refactored.
        self.app.logger.info('Preparing the runtime record for updating the application_runtime collection')
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
        #--- We don't need to check the permission to create an application but assign permission to this user as owner once app is created
        #--- Since any logged in user can submit an app; we need not validate their permission
        data = self.request.get_json()
        print("data received is {}".format(data))
        data = self.request.get_json()
        if "application_id" not in data:
            self.app.logger.error('Invalid app runtime request. No application_id supplied.')
            return jsonify({'error': 'Invalid app runtime request. No application_id supplied.'}), 400
        # Check that there's a runtime record for this application 
        fieldName   = "application_id"
        fieldValue  = application_id
        try:
            runtimes       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Retrieval of app runtime failed on application id {} with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(runtimes) < 1:
            self.app.logger.error('Application Runtime information for this app does not exist.')
            return jsonify({'error': 'Bad request: Application Runtime information for this app does not exist.'}), 400
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
        data["last_updated"] = round(time())
        if user_id:
            data["last_updated_by"] = user_id
        runtime    = runtimes[0]
        if "_id" in runtime:
            runtime_id    = str(runtime["_id"])
        # we don't need to validate the values in the application json since it's already done in the controller
        if "hardware" in data:
            runtime["hardware"]     = data["hardware"]
        if "os" in data:
            runtime["os"]     = data["os"]
        if "gpu" in data:
            runtime["gpu"]     = data["gpu"]
        if "cpu" in data:
            runtime["cpu"]     = data["cpu"]
        if "memory" in data:
            runtime["memory"]     = data["memory"]
        if "disk" in data:
            runtime["disk"]     = data["disk"]
        try:
            self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue, runtime)    
        except Exception as e:
            return jsonify({"error": "Application runtime update failed with exception {}".format(e) }), 400
        return jsonify({"application_id": application_id, "runtime_id": runtime_id}), 200


    def update_application_runtime_by_runtime_id(self, runtime_id):
        self.app.logger.info('Preparing the runtime record for updating the application_runtime collection')
        #--- First authenticate the request with access token ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        data = self.request.get_json()
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["last_updated"] = round(time())
        if user_id:
            data["last_updated_by"] = user_id
        #--- We don't need to check the permission to create an application but assign permission to this user as owner once app is created
        #--- Since any logged in user can submit an app; we need not validate their permission
        data = self.request.get_json()
        if "application_id" not in data:
            self.app.logger.error('Invalid app runtime request. No application_id supplied.')
            return jsonify({'error': 'Invalid app runtime request. No application_id supplied.'}), 400
        # Check that there's a runtime record for this application 
        fieldName   = "_id"
        fieldValue  = ObjectId(runtime_id)
        try:
            runtimes       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Retrieval of app runtime failed on runtime id {} with error {}".format(runtime_id, e))
            return jsonify({"error": format(e) }), 400
        if len(runtimes) < 1:
            self.app.logger.error('Application Runtime information for this app does not exist.')
            return jsonify({'error': 'Bad request: Application Runtime information for this app does not exist.'}), 400
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
        data["last_updated"] = round(time())
        if user_id:
            data["last_updated_by"] = user_id
        runtime    = runtimes[0]
        if "_id" in runtime:
            runtime_id    = str(runtime["_id"])
        # we don't need to validate the values in the application json since it's already done in the controller
        if "hardware" in data:
            runtime["hardware"]     = data["hardware"]
        if "os" in data:
            runtime["os"]     = data["os"]
        if "gpu" in data:
            runtime["gpu"]     = data["gpu"]
        if "cpu" in data:
            runtime["cpu"]     = data["cpu"]
        if "memory" in data:
            runtime["memory"]     = data["memory"]
        if "disk" in data:
            runtime["disk"]     = data["disk"]
        try:
            self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue, runtime)    
        except Exception as e:
            return jsonify({"error": "Application runtime update failed with exception {}".format(e) }), 400
        return jsonify({"application_id": application_id, "runtime_id": runtime_id}), 200



