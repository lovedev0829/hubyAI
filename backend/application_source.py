import os, sys
from flask import Flask, render_template, redirect, url_for, request, json, jsonify
from bson.objectid import ObjectId
from oauth2 import OAuth2
from authorization import Authorization 
from time import time # for timestamping
class ApplicationSource:
    def __init__(self, app, request, dbCon):
        self.app        = app
        self.request    = request
        self.dbCon      = dbCon
        self.oauth2     = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        self.collection = "application_source"

    def create_application_source(self):
         #-- Assume that validation of incoming app/prototype source will happen in some sort of a controller.
        # check that a source record with this appid does not already exist... If it dowesn't then simply add crud fields and write it.
        self.app.logger.info('Preparing the app/prototype source record for adding it application_source collection')
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
            self.app.logger.error('Invalid app source request. No application_id supplied.')
            return jsonify({'error': 'Invalid app source request. No application_id supplied.'}), 400
        application_id      = data["application_id"]
        print("data received is {}".format(data))
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["created"] = round(time())
        if user_id:
            data["created_by"] = user_id
               
        # Check that there's no source record for this application 
        fieldName   = "application_id"
        fieldValue  = application_id
        try:
            source       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Retrieval of app source failed on application id {} with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(source) > 0:
            self.app.logger.error('Application Source information for this app already exists.')
            return jsonify({'error': 'Bad request: Application Source information for this app already exists.'}), 400

        #--- Do basic validation for required info:
        if "programming_languages" not in data or len(data["programming_languages"]) == 0:
            self.app.logger.error('Application source programming_languages is required')
            return jsonify({'error': 'Bad request: application source programming_languages is required'}), 400
        if "source_type" not in data and "repo" not in data:
            self.app.logger.error('Application source type and repo are required')
            return jsonify({'error': 'Bad request: Application source type and repo are required'}), 400
        
         #--- Before we create permission we need to check the application level rights. We do not need to check at ownership level. 
        dict_collection_doc_role = self.oauth2.get_permissions_from_access_token(access_token)
        print("ApplicationSource.create_application_source(): type of dict_permissions = {}".format(type(dict_collection_doc_role)))
        if "error" in dict_collection_doc_role:
            return jsonify(dict_collection_doc_role),400
        targetCollection    = "applications"
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, targetCollection, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing ownership permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions on application with id ".format(application_id)}),400
        crud_permissions = permissions["permissions"]
        if crud_permissions[0] != "1":
            self.app.logger.error("Missing ownership permissions for application id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions for application id ".format(application_id)}),400
        # we don't need to validate the values in the application json since it's already done in the controller
        try:
            source_id = self.dbCon.insert_document(self.collection, data)
        except Exception as e:
            self.app.logger.error('Error inserting app source information: %s', e)
            result = {'error': 'Failed to insert the app source information'}
            status = 400
            return jsonify(result), status
        #--- Here we're checking application level update access to create the source record. -----#
        #--- But to update/delete the source record, the user can have update access either at application level or at just source record level --#
        #--- It is possible that a different user creates the source record; For update/delete should we check for application collection or applicatioin_source?
        #--- In updating the source by application; we will just be checking at the application level since we don't have the source_id.
        #--- Then should we be inserting a record for source in the role_collection_permission. Could there be a possibility of updating this record by source id?
        # --- Something worth discussing/debating. For now I will add the application_source ownership to role_collection_permission ----
    

        #--- update the permissions for this app by making this submitting user as the owner
        if source_id is None:
                result = {"Error": "Application source record creation failed. Check for the input."}
                status = 400
                return jsonify(result), status
        else: 
            result  = {"source_id": source_id}
            status = 201
            # --- Set the user permission record in user_document_role collection
            user_role           = "owner"
            self.authorization.add_permission(access_token, user_id, self.collection, source_id, user_role)
            self.app.logger.info("updated app/prototype source permissions ")    
            return jsonify(result), status

    def get_source_by_source_id(self, source_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('ApplicationSource.get_source_by_source_id: get source for source id '. format(source_id))
        fieldName   = "_id"
        fieldValue = ObjectId(source_id)
        sources = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(sources) > 0:
            source     = sources[0]
        else:
            return jsonify({"error": "No source information found for the provided source id.".format(source_id)}), 400
        source["_id"] = str(source.get("_id"))
        if "_id" in source:
            del source["_id"]
        return jsonify(source), 200
   
    def get_source_by_application_id(self, application_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('Applications.get_source_by_application_id: get application source for application id '. format(application_id))
        fieldName   = "application_id"
        #fieldValue = ObjectId(application_id)
        fieldValue          = application_id
        sources = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(sources) > 0:
            source     = sources[0]
            if "_id" in source:
                source["source_id"] = str(source["_id"])
                del(source["_id"])
        else:
            return jsonify({"error": "No source record found for the provided application id.".format(application_id)}), 400
        return jsonify(source), 200
                               
    
    def update_application_source(self, application_id):
        #---TODO: We need to create a module that validates the access token and then checks/validates the permission. This operation is needed for most update/delete operations.
        # The validation code below will move to the controller once we've the code refactored.
        self.app.logger.info('Preparing the source record for updating the application_source collection')
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
        #print("data received is {}".format(data))
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
            sources       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on application source id {} with error {}".format(source_id, e))
            return jsonify({"error": format(e) }), 400
        if len(sources) > 0:
            source    = sources[0]
            if "_id" in source:
                source_id    = str(source["_id"])
            # update only the relevant user editable fields
            if "source_type" in data:
                source["source_type"]   = data["source_type"]
            if "programming_languages" in data:
                source["programming_languages"]   = data["programming_languages"]
            if "repo" in data:
                source["repo"]   = data["repo"]
            if "dependencies" in data:
                source["dependencies"]   = data["dependencies"]
            try:
                self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue, source)    
            except Exception as e:
                return jsonify({"error": "Application update failed with exception {}".format(e) }), 400
            return jsonify({"application_id": application_id, "source_id": source_id}), 200
        else:
            return jsonify({"error": "Unusual situation; more than one source records with the same id"}),400


    def update_application_source_by_source_id(self, source_id):
        self.app.logger.info('Preparing the source record for updating the application_source collection')
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
        #check that application id is there and valid
        if "application_id" not in data or data["application_id"] == "":
            self.app.logger.error("Missing field application_id in the supplied data")
            return jsonify({"error":"Missing field application_id in the supplied data"}),400
        application_id      = data["application_id"]
        targetCollection    = "applications"
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, targetCollection, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing ownership permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions on application with id ".format(application_id)}),400
        crud_permissions = permissions["permissions"]
        if crud_permissions[2] != "1":
            self.app.logger.error("Missing ownership permissions for application id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions for application id ".format(application_id)}),400

        fieldName   = "_id"
        try:
            fieldValue  = ObjectId(source_id)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on application source id {} with error {}".format(source_id, e))
            return jsonify({"error": format(e) }), 400
        #--- if user_id is invalid (must be 12 bytes or 24 char hex string ), handle the ObjectId() call error
        try:
            sources       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Data retrieval failed on application source id {} with error {}".format(source_id, e))
            return jsonify({"error": format(e) }), 400
        if len(sources) > 0:
            source    = sources[0]
            if "_id" in source:
                source_id    = str(source["_id"])
            # we don't need to validate the values in the application json since it's already done in the controller
            # update only the relevant user editable fields
            if "source_type" in data:
                source["source_type"]   = data["source_type"]
            if "programming_languages" in data:
                source["programming_languages"]   = data["programming_languages"]
            if "repo" in data:
                source["repo"]   = data["repo"]
            if "dependencies" in data:
                source["dependencies"]   = data["dependencies"]
            try:
                self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue,  source)    
            except Exception as e:
                return jsonify({"error": "Application update failed with exception {}".format(e) }), 400
            return jsonify({"source_id": source_id}), 200
        else:
            return jsonify({"error": "Unusual situation; more than one source records with the same id"}),400



