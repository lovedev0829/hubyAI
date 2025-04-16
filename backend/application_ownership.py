import os, sys
from flask import Flask, render_template, redirect, url_for, request, json, jsonify
from bson.objectid import ObjectId
from oauth2 import OAuth2
from authorization import Authorization 
from time import time # for timestamping
class ApplicationOwnership:
    def __init__(self, app, request, dbCon):
        self.app        = app
        self.request    = request
        self.dbCon      = dbCon
        self.oauth2     = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        self.collection = "application_ownership"

    def create_application_ownership(self):
         #-- Assume that validation of incoming prototype ownership will happen in some sort of a controller.
        # check that a record with this appid does not already exist... If it dowesn't then simply add system fields
        self.app.logger.info('Preparing the app/prototype ownership record for updating the applications collection')
        #--- First authenticate the request with access token ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        data = self.request.get_json()
        if "application_id" not in data:
            self.app.logger.error('Invalid app ownership request. No application_id supplied.')
            return jsonify({'error': 'Invalid app ownership request. No application_id supplied.'}), 400
        application_id      = data["application_id"]
        print("data received is {}".format(data))
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["created"] = round(time())
        if user_id:
            data["created_by"] = user_id
               
        # Check that there's no ownership record for this application 
        fieldName   = "application_id"
        fieldValue  = application_id
        try:
            ownership       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on application id {} with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(ownership) > 0:
            self.app.logger.error('Ownership for this app already exists.')
            return jsonify({'error': 'Bad request: Ownership for this app already exists.'}), 400

        #--- Do basic validation for required info:
        if "owner_company" not in data or "owner_name" not in data:
            self.app.logger.error('App/Prototype owner company and app/prototype owner name are required')
            return jsonify({'error': 'Bad request: application owner company and application owner name are required'}), 400
        if data["owner_company"] == "" or data["owner_name"] == "":
           self.app.logger.error('App/Prototype owner company and application owner name are required')
           return jsonify({'error': 'Bad request: application owner company and application owner name are required'}), 400
        
        #--- Before we create permission we need to check the application level rights. We do not need to check at ownership level. 
        '''
        dict_collection_doc_role = self.oauth2.get_permissions_from_access_token(access_token)
        #print("Applications.update_appplication(): type of dict_permissions = {}".format(type(dict_collection_doc_role)))
        if "error" in dict_collection_doc_role:
            return jsonify(dict_collection_doc_role),400
        targetCollection    = "applications"
        if targetCollection in dict_collection_doc_role["collection_roles"]:
            #print("collection name found", targetCollection )
            #print("look for application_id in ", dict_collection_doc_role["collection_roles"][targetCollection])
            if application_id in dict_collection_doc_role["collection_roles"][targetCollection]:
                role = dict_collection_doc_role["collection_roles"][targetCollection][application_id]
                perms = self.authorization.get_collection_role_permissions(targetCollection, role)
                print("role is {} and user perms: {}".format(role, perms))
                if perms[2] == "1":   # Update allowed in CRUD
                    fieldName   = "_id"
                    fieldValue          = ObjectId(application_id)
                    try:
                        applications       = self.dbCon.get_documents_by_field(targetCollection, fieldName, fieldValue)
                    except Exception as e:
                        self.app.logger.error("ApplicationOwnership.create_application_ownership(): Error retrieving application with application id {} with error {}".format(application_id, e))
                        return jsonify({"error": format(e) }), 400
                    if len(applications) > 0:
                        user_id = self.oauth2.get_user_id_from_access_token(access_token)
                        data["created"] = round(time())
                        if user_id:
                            data["created_by"] = user_id
                        # we don't need to validate the values in the application json since it's already done in the controller
                        try:
                            ownership_id = self.dbCon.insert_document(self.collection, data)
                        except Exception as e:
                            self.app.logger.error('Error inserting app/prototype ownership information: %s', e)
                            result = {'error': 'Failed to insert the app/prototype ownership information'}
                            status = 400
                            return jsonify(result), status
                    else:
                        return jsonify({"error": "Unusual situation; more than one applications with the same id"}),400
                else:
                    return jsonify({"error": "permission to add/update the application ownership denied"}),400
            else:
                return jsonify({"error": "Update role to update this application is not available to you."}),400
        else:
            return jsonify({"error": "Application collection missing among permissions available on this access  token."}),400
        '''

        appCollection       = "applications"
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, appCollection, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing ownership permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions on application with id ".format(application_id)}),400

        crud_permissions = permissions["permissions"]
        if crud_permissions[0] != "1":
            self.app.logger.error("Missing ownership permissions for application id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions for application id ".format(application_id)}),400
        #-- Add the ownership record to the application_owner collection now
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["created"] = round(time())
        if user_id:
            data["created_by"] = user_id
        # we don't need to validate the values in the application json since it's already done in the controller
        try:
            ownership_id = self.dbCon.insert_document(self.collection, data)
        except Exception as e:
            self.app.logger.error('Error inserting app/prototype ownership information: %s', e)
            result = {'error': 'Failed to insert the app/prototype ownership information'}
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
            #Add the owner_id and secondary_owner_id if any in both applications and application_ownership collections.
            # TODO: Although this is redundant; Perhaps we should just add to applications collection. Need to revisit.
            user_role           = "owner"
            if "owner_id" in data and data["owner_id"] != "":
                self.authorization.add_permission(access_token, data["owner_id"], self.collection, ownership_id, user_role)
                  
            if "secondary_owner_id" in data and data["secondary_owner_id"] != "":
                self.authorization.add_permission(access_token, data["secondary_owner_id"], self.collection, ownership_id, user_role)

            self.app.logger.info("updated app/prototype ownership permissions ")    
            return jsonify(result), status

    def get_ownership_by_ownership_id(self, ownership_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('ApplicationOwnership.get_ownership_by_ownership_id: get owner for ownership id '. format(ownership_id))
        fieldName   = "_id"
        fieldValue = ObjectId(ownership_id)
        ownerships = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(ownerships) > 0:
            ownership     = ownerships[0]
        else:
            return jsonify({"error": "No owner information found for the provided ownershp id.".format(ownership_id)}), 400
        ownership["_id"] = str(ownership.get("_id"))
        if "_id" in ownership:
            del ownership["_id"]
        return jsonify(ownership), 200
   
    def get_ownership_by_application_id(self, application_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('Applications.get_ownership_by_application_id: get application ownership for application id '. format(application_id))
        fieldName   = "application_id"
        #fieldValue = ObjectId(application_id)
        fieldValue          = application_id
        targetCollection    = "application_ownership"
        owners = self.dbCon.get_documents_by_field(targetCollection, fieldName, fieldValue)
        if len(owners) > 0:
            owner     = owners[0]
            if "_id" in owner:
                owner["ownership_id"] = str(owner["_id"])
                del(owner["_id"])
        else:
            return jsonify({"error": "No user application found for the provided application id.".format(application_id)}), 400
        #application["application_id"] = str(application.get("_id"))
        #if "_id" in application:
        #    del application["_id"]
        return jsonify(owner), 200
                               
    
    def update_application_ownership(self, application_id):
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
        print("data received is {}".format(data))
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["last_updated"] = round(time())
        if user_id:
            data["last_updated_by"] = user_id
        #--- We don't need to check the permission to create an application but assign permission to this user as owner once app is created
        #--- Since any logged in user can submit an app; we need not validate their permission
        data = self.request.get_json()
        #print("data received is {}".format(data))

        appCollection       = "applications"
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, appCollection, application_id)
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
        targetCollection = "application_ownership"
        try:
            ownerships       = self.dbCon.get_documents_by_field(targetCollection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on application ownership id {} with error {}".format(ownership_id, e))
            return jsonify({"error": format(e) }), 400
        if len(ownerships) > 0:
            ownership    = ownerships[0]
            if "_id" in ownership:
                ownership_id    = str(ownership["_id"])
            # we don't need to validate the values in the application json since it's already done in the controller
            try:
                self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue,  data)    
            except Exception as e:
                return jsonify({"error": "Application update failed with exception {}".format(e) }), 400
            return jsonify({"application_id": application_id, "ownership_id": ownership_id}), 200
        else:
            return jsonify({"error": "Unusual situation; more than one ownership records with the same id"}),400
        #TODO after testing the create ownership change the logic below to use Oauth2.get_permissions_from_access_token()



