import os, sys
from flask import Flask, render_template, redirect, url_for, request, json, jsonify
from bson.objectid import ObjectId
from oauth2 import OAuth2
from authorization import Authorization 
from time import time # for timestamping
#sys.path.insert(0, 'utils')
from utils.cloud_storage import CloudStorage

class ApplicationMarketing:
    def __init__(self, app, request, dbCon):
        self.app        = app
        self.request    = request
        self.dbCon      = dbCon
        self.oauth2     = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        self.collection = "application_marketing"

    def create_application_marketing(self):
         #-- Assume that validation of incoming app/prototype marketing will happen in some sort of a controller.
        # check that a marketing record with this appid does not already exist... If it dowesn't then simply add crud fields and write it.
        self.app.logger.info('Preparing the app/prototype marketing record for adding it application_marketing collection')
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
            self.app.logger.error('Invalid app marketing request. No application_id supplied.')
            return jsonify({'error': 'Invalid app marketing request. No application_id supplied.'}), 400
        application_id      = data["application_id"]
        print("data received is {}".format(data))
        targetCollection    = "applications"
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, targetCollection, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing ownership permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions on application with id ".format(application_id)}),400
        crud_permissions = permissions["permissions"]
        if crud_permissions[0] != "1":
            self.app.logger.error("Missing ownership permissions for application id {}".format(application_id))
            return jsonify({"error":"Missing ownership permissions for application id ".format(application_id)}),400
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["created"] = round(time())
        if user_id:
            data["created_by"] = user_id
               
        # Check that there's no marketing record for this application 
        fieldName   = "application_id"
        fieldValue  = application_id
        try:
            marketing       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Retrieval of app marketing failed on application id {} with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(marketing) > 0:
            self.app.logger.error('Application Marketing information for this app already exists.')
            return jsonify({'error': 'Bad request: Application Marketing information for this app already exists.'}), 400

        #--- Do basic validation for required info:
        if "industry" not in data or len(data["industry"]) == 0:
            self.app.logger.error('Application marketing industry is required')
            return jsonify({'error': 'Bad request: application marketing industry is required'}), 400
        if "pricing_type" not in data and "pricing" not in data:
            self.app.logger.error('Application marketing pricing or pricing_typer is required')
            return jsonify({'error': 'Bad request: Application marketing pricing or pricing_typer is required'}), 400
        
        try:
            marketing_id = self.dbCon.insert_document(self.collection, data)
        except Exception as e:
            self.app.logger.error('Error inserting app marketing information: %s', e)
            result = {'error': 'Failed to insert the app marketing information'}
            status = 400
            return jsonify(result), status

        #--- update the permissions for this app by making this submitting user as the owner
        if marketing_id is None:
                result = {"Error": "Application marketing record creation failed. Check for the input."}
                status = 400
                return jsonify(result), status
        else: 
            result  = {"marketing_id": marketing_id}
            status = 201
            # --- Set the user permission record in user_document_role collection
            user_role           = "owner"
            #user_perms          = {"user_id": documentId, "collection_roles": {targetCollection: {"users": user_role} }}
            self.authorization.add_permission(access_token, user_id, self.collection, marketing_id, user_role)
            self.app.logger.info("updated app/prototype marketing permissions ")    
            return jsonify(result), status

    def get_marketing_by_marketing_id(self, marketing_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('ApplicationMarketing.get_marketing_by_marketing_id: get marketing for marketing id '. format(marketing_id))
        fieldName   = "_id"
        fieldValue = ObjectId(marketing_id)
        marketings = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(marketings) > 0:
            marketing     = marketings[0]
        else:
            return jsonify({"error": "No marketing information found for the provided marketing id.".format(marketing_id)}), 400
        marketing["_id"] = str(marketing.get("_id"))
        if "_id" in marketing:
            del marketing["_id"]
        return jsonify(marketing), 200
   
    def get_marketing_by_application_id(self, application_id):
        # No need to check token here because this is public  information available even without login.
        self.app.logger.info('ApplicationMarketing.get_marketing_by_application_id: get application marketing for application id '. format(application_id))
        fieldName   = "application_id"
        #fieldValue = ObjectId(application_id)
        fieldValue          = application_id
        marketings = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(marketings) > 0:
            marketing     = marketings[0]
            if "_id" in marketing:
                marketing["marketing_id"] = str(marketing["_id"])
                del(marketing["_id"])
        else:
            return jsonify({"error": "No marketing record found for the provided application id.".format(application_id)}), 400
        return jsonify(marketing), 200
                               
    
    def update_application_marketing(self, application_id):
        #---TODO: We need to create a module that validates the access token and then checks/validates the permission. This operation is needed for most update/delete operations.
        # The validation code below will move to the controller once we've the code refactored.
        self.app.logger.info('Preparing the marketing record for updating the application_marketing collection')
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
            self.app.logger.error('Invalid app marketing request. No application_id supplied.')
            return jsonify({'error': 'Invalid app marketing request. No application_id supplied.'}), 400
        application_id      = data["application_id"]
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
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["last_updated"] = round(time())
        if user_id:
            data["last_updated_by"] = user_id
        fieldName   = "application_id"
        fieldValue  = application_id
        #--- if user_id is invalid (must be 12 bytes or 24 char hex string ), handle the ObjectId() call error
        try:
            marketings       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on application marketing id {} with error {}".format(marketing_id, e))
            return jsonify({"error": format(e) }), 400
        if len(marketings) == 1:
            marketing    = marketings[0]
            if "_id" in marketing:
                marketing_id    = str(marketing["_id"])
            # we don't need to validate the values in the application json since it's already done in the controller
            if "industry" in data:
                marketing["industry"]   = data["industry"]
            if "external_media_links" in data:
                marketing["external_media_links"]   = data["external_media_links"]
            if "brochure" in data:
                marketing["brochure"]   = data["brochure"]
            if "demo" in data:
                marketing["demo"]   = data["demo"]
            if "pricing" in data:
                marketing["pricing"]   = data["pricing"]
            if "price" in data:
                marketing["price"]   = data["price"]
            if "communities" in data:
                marketing["communities"]   = data["communities"]
            if "introduction" in data:
                marketing["introduction"]   = data["introduction"]
            if "featured_page" in data:
                marketing["featured_page"]   = data["featured_page"]
            if "privacy" in data:
                marketing["privacy"]   = data["privacy"]
            if "ethics" in data:
                marketing["ethics"]   = data["ethics"]
            #others
            try:
                self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue, marketing)    
            except Exception as e:
                return jsonify({"error": "Application update failed with exception {}".format(e) }), 400
            return jsonify({"application_id": application_id, "marketing_id": marketing_id}), 200
        else:
            return jsonify({"error": "Unusual situation; more than one marketing records with the same id"}),400

    def save_application_marketing_asset(self, application_id, marketing_id, asset_type, asset_prefix):
        asset_type      = asset_type.lower()
        asset_prefix    = asset_prefix.lower()
        # The validation code below will move to the controller once we've the code refactored.
        self.app.logger.info('Preparing the marketing record for uploading the media files')
        #--- First authenticate the request with access token ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        if "application_id" == "":
            self.app.logger.error('Invalid app marketing request. No application_id supplied.')
            return jsonify({'error': 'Invalid app marketing request. No application_id supplied.'}), 400
        if "marketing_id" == "":
            self.app.logger.error('Invalid app marketing request. No marketing_id supplied.')
            return jsonify({'error': 'Invalid app marketing request. No markting_id supplied.'}), 400
        if  asset_type not in ["images", "videos"] or asset_prefix == "":
            self.app.logger.error('Invalid request; asset_type can only be "images" or "videos".')
            return jsonify({'error': 'Invalid request; asset_type can only be "images" or "videos".'}), 400
        #-- check that this user actually owns this application
        user     = self.oauth2.get_user_from_access_token(access_token)
        user_id = ""
        if "user_id" not in user or user["user_id"] == "":
            return jsonify({"error": "Invalid token (not associated with a user)."}), 400
        user_id         = user["user_id"]
        collectionName = "application_ownership"
        fieldName       = "application_id"
        fieldValue      = application_id
        owners = self.dbCon.get_documents_by_field(collectionName, fieldName, fieldValue)
        if len(owners) < 1:
            return jsonify({"error": "Supplied application doesn't have any associated ownership information."}), 400
        
        owner     = owners[0]
        if user["privilege"] not in ("admin", "support", "sysadmin") and user_id != owner["owner_id"] and user_id != owner["secondary_owner_id"] :
            return jsonify({"error": "You don't own this application. Only primary or secondary owners of an application can review its status."}), 400
       
        # TODO: For now it's ok to save these media files to file system but in the longer they should really go to some cheap object store like S3
        media_file_path_from_root    = "dist/assets/" + asset_type + "/applications" 
        UPLOAD_FOLDER = self.app.root_path + "/" + media_file_path_from_root # path to flask app ie. location of huby.py
        #--- TODO: Above setting can possibly move to a config file; possibly the one below too. ---#
        ALLOWED_EXTENSIONS = set([ 'png', 'jpg', 'jpeg', 'gif', 'mp4', 'wav', 'mov', '.avi', 'pdf'])
        if 'file' not in self.request.files:
            return jsonify({"error": "No file in the submission"}),400
        file = self.request.files['file']
        category    = ""
        title       = ""
        if "category" in self.request.form:
            category    = self.request.form['category']
        if "title" in self.request.form:
            title    = self.request.form['title']
        
        extension = file.filename.rsplit('.', 1)[1].lower()
        filename    = asset_prefix + "_" + application_id + '.' + extension
        asset_info  = ""  # in the marketing record
        #print("filename and extension are: ", filename, extension)
        if file and extension in ALLOWED_EXTENSIONS:
            try:
                # -- old code
                # file.save(os.path.join(UPLOAD_FOLDER, filename))
                # file_url    = media_file_path_from_root + "/" + filename 
                # path        = UPLOAD_FOLDER
                # New code to save the file stream to cloud bucket
                cs = CloudStorage()
                #print("CS created")
                source_file_stream = file
                destination_blob_name = f"{asset_type}/applications/{filename}"
                #print("source file pathe and destination blob name are: ", source_file_stream, destination_blob_name)
                file_url = cs.save_object_stream(source_file_stream, destination_blob_name)
                #print("file_url from saved object:", file_url)
            except Exception as e:
                print(e)
                self.app.logger.error("ApplicationsMarketing.save_application_marketing_asset() error in saving logo: %s", e)
                return jsonify({"error" : "System error in saving the marketing media file.".format(file)}), 400
                #update the marketing record with this information.
            if category != "" and title != "":
                fieldName = "application_id"
                fieldValue = application_id
                try:
                    marketings       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
                except Exception as e:
                    self.app.logger.error("File saved but No marketing record to update the file metadata for the application id {} with error {}".format(application_id, e))
                    return jsonify({"error": format(e) }), 400
                if len(marketings) > 0:
                    marketing    = marketings[0]
                    #if category in marketing and any(title in keys for keys in marketing[category]):
                    updated = False
                    if category in marketing :
                        for items in marketing[category]:
                            if title in items:
                                items[title] = file_url
                                updated = True
                        if not updated:
                            marketing[category].append({title: file_url})
                    else:
                        marketing[category] = []
                        marketing[category].append({title: file_url})
                    asset_info = {category:[{title: file_url}]}
                    try:
                        self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue, marketing)    
                    except Exception as e:
                        return jsonify({"error": "Marketing update for asset category/title failed with exception {}".format(e) }), 400
            return jsonify({"asset_info": asset_info,"file_url": file_url, "file_name": filename, 
                            "application_id": application_id, "marketing_id": marketing_id}),201
        else:
            return jsonify({"error": "Failed to save the file; provided file extension not allowed."}),400
        
    #------- delete an uploaded marketing media file from the GCS bucket -------
    def delete_application_marketing_asset(self, application_id, marketing_id, gcs_url):
        # let's validate the token and make sure that this user actually owns this application.
        # We should also make sure that this file actually exists in the file system.
        # Before deleting let's also make sure that the file name contains the application_id.
        self.app.logger.info('Preparing to delete the marketing media file')
        #--- First authenticate the request with access token ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        if "application_id" == "":
            self.app.logger.error('Invalid app marketing request. No application_id supplied.')
            return jsonify({'error': 'Invalid app marketing request. No application_id supplied.'}), 400
        if "marketing_id" == "":
            self.app.logger.error('Invalid app marketing request. No marketing_id supplied.')
            return jsonify({'error': 'Invalid app marketing request. No markting_id supplied.'}), 400
        if gcs_url == "":
            self.app.logger.error('Invalid app marketing request. A non blank value is required for file_url.')
            return jsonify({'error': 'Invalid app marketing request. file_url value not supplied.'}), 400
        #-- check that this user actually owns this application
        user     = self.oauth2.get_user_from_access_token(access_token)
        user_id = ""
        if "user_id" not in user or user["user_id"] == "":
            return jsonify({"error": "Invalid token (not associated with a user)."}), 400
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
        cs  = CloudStorage()
        try:
            cs.delete_object(gcs_url)
            return jsonify({"status": True, "application_id": application_id, "marketing_id": marketing_id, "file_url": gcs_url}), 200
        except OSError as e:
            return jsonify({"status": False, "error": "Media object deletion failed with error: {}".format(e) })


    # 
    #     
    def delete_application_marketing_asset_old(self, application_id, marketing_id, file_path_from_home):
        # let's validate the token and make sure that this user actually owns this application.
        # We should also make sure that this file actually exists in the file system.
        # Before deleting let's also make sure that the file name contains the application_id.
        self.app.logger.info('Preparing to delete the marketing media file')
        #--- First authenticate the request with access token ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        if "application_id" == "":
            self.app.logger.error('Invalid app marketing request. No application_id supplied.')
            return jsonify({'error': 'Invalid app marketing request. No application_id supplied.'}), 400
        if "marketing_id" == "":
            self.app.logger.error('Invalid app marketing request. No marketing_id supplied.')
            return jsonify({'error': 'Invalid app marketing request. No markting_id supplied.'}), 400
        abs_file_path = self.app.root_path + "/" + file_path_from_home # path to flask app ie. location of huby.py

        if  file_path_from_home == "" :
            self.app.logger.error('Invalid request; File name does not appear to belong to this application.')
            return jsonify({'error': 'Invalid request; File name does not appear to belong to this application.'}), 400
        if  abs_file_path.find(application_id) == -1:
            self.app.logger.error('Invalid request; File name does not appear to belong to this application.')
            return jsonify({'error': 'Invalid request; File name does not appear to belong to this application.'}), 400
        #-- check that this user actually owns this application
        user     = self.oauth2.get_user_from_access_token(access_token)
        user_id = ""
        if "user_id" not in user or user["user_id"] == "":
            return jsonify({"error": "Invalid token (not associated with a user)."}), 400
        #print("file_path_from_home:", file_path_from_home)
        #print("current working directory:", os.getcwd())
        #print("listing of files in curr dir: {}".format(os.listdir(os.getcwd() + "/dist")))
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
        try:
            os.remove(abs_file_path)
            return jsonify({"status": True, "application_id": application_id, "marketing_id": marketing_id, "file_path_from_home": file_path_from_home}), 200
        except OSError as e:
            return jsonify({"status": False, "error": "File deletion failed with error: {}".format(e) })


    def update_application_marketing_by_marketing_id(self, marketing_id):
        self.app.logger.info('Preparing the marketing record for updating the application_marketing collection')
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
        #--- We don't need to check the permission to create an application but assign permission to this user as owner once app is created
        #--- Since any logged in user can submit an app; we need not validate their permission
        if "application_id" not in data:
            self.app.logger.error('Invalid app marketing request. No application_id supplied.')
            return jsonify({'error': 'Invalid app marketing request. No application_id supplied.'}), 400
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
            fieldValue  = ObjectId(marketing_id)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on application marketing id {} with error {}".format(marketing_id, e))
            return jsonify({"error": format(e) }), 400
        #--- if user_id is invalid (must be 12 bytes or 24 char hex string ), handle the ObjectId() call error
        try:
            marketings       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Data retrieval failed on application marketing id {} with error {}".format(marketing_id, e))
            return jsonify({"error": format(e) }), 400
        if len(marketings) == 1:
            marketing    = marketings[0]
            if "_id" in marketing:
                marketing_id    = str(marketing["_id"])
            # we don't need to validate the values in the application json since it's already done in the controller
            if "industry" in data:
                marketing["industry"]   = data["industry"]
            if "external_media_links" in data:
                marketing["external_media_links"]   = data["external_media_links"]
            if "brochure" in data:
                marketing["brochure"]   = data["brochure"]
            if "demo" in data:
                marketing["demo"]   = data["demo"]
            if "pricing" in data:
                marketing["pricing"]   = data["pricing"]
            if "price" in data:
                marketing["price"]   = data["price"]
            if "communities" in data:
                marketing["communities"]   = data["communities"]
            if "introduction" in data:
                marketing["introduction"]   = data["introduction"]
            if "featured_page" in data:
                marketing["featured_page"]   = data["featured_page"]
            if "privacy" in data:
                marketing["privacy"]   = data["privacy"]
            if "ethics" in data:
                marketing["ethics"]   = data["ethics"]
            if user_id:
                marketing["last_updated_by"]    = user_id
            marketing["last_updated"]       = round(time())
            try:
                self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue,  marketing)    
            except Exception as e:
                return jsonify({"error": "Application update failed with exception {}".format(e) }), 400
            return jsonify({"marketing_id": marketing_id}), 200
        else:
            return jsonify({"error": "Unusual situation; more than one marketing records with the same id"}),400



