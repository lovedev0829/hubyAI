import os, sys
from flask import Flask, render_template, redirect, url_for, request, json, jsonify
from flask_cors import CORS, cross_origin
from bson.json_util import dumps
from flask import send_from_directory
from time import time
from pymongo import MongoClient
import urllib.parse
from database import Database
from bson.objectid import ObjectId
import bcrypt
import uuid
from configparser import ConfigParser
sys.path.insert(0, 'utils')
from email_util import EmailUtil
from cloud_storage import CloudStorage
from oauth2 import OAuth2 
from authorization import Authorization 
import requests #---- For calling 3rd party APIs e.g. validate Google toen.

class Users:
    #------ constructor using the Flask app coming in as a referenc. For unit tests we will have to create app before testing this class
    def __init__(self, app, request, dbCon):
        self.app            = app
        self.request        = request
        self.collectionName = "users"
        self.dbCon          = dbCon
        self.oauth2         = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        if "API_DOMAIN" in os.environ:
            self.API_DOMAIN  =   os.getenv("API_DOMAIN")
        else:
            self.API_DOMAIN  = "http://localhost"
        config      = ConfigParser()
        configFile  = os.getenv("WorkingDirectory") + "/huby.cfg"
        config.read(configFile) 
        self.from_email = config.get('Default', 'from_email')
        if self.from_email   == "":
            self.from_email  = "support@huby.ai"
        # URL for external/sso validations
        self.google_token_validation_url    = config.get('Google', 'token_validation_url')
        self.slack_token_validation_url     = config.get('Slack', 'token_validation_url')
        self.office365_token_validation_url = config.get('Office365', 'token_validation_url')
        self.office365_tenant_id            = config.get('Office365', 'tenant_id')   
        return
    #-- The function below is called only internally to help other model programs; hence no access_token here. 
    def get_user_name_by_id(self, user_id):
        # This function is for internal use; for example to get the name of the user who created/updated an object.
        # There's no token or access check here
        user_name = ""
        if user_id =="":
            return 
        fieldName   = "_id"
        fieldValue  = ObjectId(user_id)
        users  = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
        if len(users) > 0:
            return users[0]["first_name"] + " " + users[0]["last_name"]

    def validate_user_email(self, fieldName, fieldValue):
        users  = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
        if len(users) > 0:
            user = users[0]
            
            if "_id" in user:
                del(user["_id"])
            if "password" in user:
                del(user["password"])
            print("user found now is:", user)
            return jsonify({"user":user}),200
        else:
            return ({"error": "No user with this email."}), 400

    def get_user_info(self, user_id):
        # This function is for internal use; for example to get the name of the user who created/updated an object.
        # There's no token or access check here
        user_name = ""
        if user_id =="":
            return 
        fieldName   = "_id"
        fieldValue  = ObjectId(user_id)
        users  = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
        if len(users) > 0:
            return users[0]

    def get_user_by_id(self, user_id, access_token):
        # convert the user_id string to an ObjectId 
        self.app.logger.info("processing get_user_by_id in users for user_id={}".format(user_id))
        if user_id is None:
            self.app.logger.error('No user_id  provided for find request')
            return jsonify({'error': 'No input user_id provided'}), 400
        if access_token is None:
            self.app.logger.error('No access_token  provided for find request')
            return jsonify({'error': 'No access_token provided'}), 400
        #print("user_id received:", user_id)
        #print("access_token received:", access_token)
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, self.collectionName, user_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing read permissions on user with id {}".format(user_id))
            return jsonify({"error":"Missing read permissions on user with id ".format(user_id)}),400

        crud_permissions = permissions["permissions"]
        if crud_permissions[1] != "1":
            self.app.logger.error("Missing read permissions on user with id {}".format(user_id))
            return jsonify({"error":"Missing read permissions on user with id ".format(user_id)}),400
        fieldName   = "_id"
        fieldValue  = ObjectId(user_id)
        users  = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
        print("read access available and users received = ", users)
        if len(users) > 0:
            user = users[0]
            print("result from database:", user)
        else:
            return(jsonify({"error": "No user record found."}))
        # --- drop the non required information before sending the response
        
        user["user_id"] = str(user.get("_id")) # Access the embedded objectid
        if "_id" in user:
            del user["_id"] 
        if "password" in user:
            del user["password"]
    
        return jsonify(user), 200

        ''' 
        if dict_permissions["user_id"] == user_id:
            if "collection_roles" in dict_permissions and self.collectionName in dict_permissions["collection_roles"]:
                role = dict_permissions["collection_roles"][self.collectionName][user_id]
                print("users.get_user_by_field: role:", role )
                perms = self.authorization.get_collection_role_permissions(self.collectionName, role)
                print("user perms:", perms)
                if perms[1] == "1":   # Read allowed allowed in CRUD
                    users  = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
                    print("read access available and users received = ", users)
                    if len(users) > 0:
                        user = users[0]
                        print("result from database:", user)
                    else:
                        return(jsonify({"error": "No user record found."}))
                    # --- drop the non required information before sending the response
                    
                    user["user_id"] = str(user.get("_id")) # Access the embedded objectid
                    if "_id" in user:
                        del user["_id"] 
                    if "password" in user:
                        del user["password"]
                
                    return jsonify(user), 200
                else:
                    return jsonify({"error": "Access denied to query a user."})
            else:
                return jsonify({"error": "Missing access permission for this operation."})
        else:
            return jsonify({"error": "User not allowed to retrieve this user"})
        '''
    #--- TODO: Do we need the function below to modularize the code?  This function is now in OAuth2.get_permissions_from_access_token ---#
    def get_user_permissions_from_token(self, user_id, access_token):
        self.app.logger.info("Accessing user permissions for user_id {} using the access_token {}.".format(user_id, access_token))
        return 
    
    #------- update user: update everything other than email and password (separate process)
    def update_user(self, user_id, access_token):
        print("in update_user function of Users")
        self.app.logger.info('Preparing the user record for update in users')
        data = self.request.get_json()
        # convert the user_id string to an ObjectId 
        self.app.logger.info("processing get_user_by_id in users for user_id={}".format(user_id))

        # validating token part of get_permissions_from_access_token 
        dict_collection_doc_role = self.oauth2.get_permissions_from_access_token(access_token)
        print("type of dict_permissions = {}".format(type(dict_collection_doc_role)))
        if "error" in dict_collection_doc_role:
            return jsonify(dict_collection_doc_role),400
        print(" In users.update_user: token permissions (role by collection and doc id): {}".format(dict_collection_doc_role))
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, self.collectionName, user_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing update permissions on user with id {}".format(user_id))
            return jsonify({"error":"Missing update permissions on user with id ".format(user_id)}),400

        crud_permissions = permissions["permissions"]
        if crud_permissions[2] != "1":
            self.app.logger.error("Missing update permissions on user with id {}".format(user_id))
            return jsonify({"error":"Missing update permissions on user with id ".format(user_id)}),400
        fieldName   = "_id"
        #--- if user_id is invalid (must be 12 bytes or 24 char hex string ), handle the ObjectId() call error
        try:
            fieldValue  = ObjectId(user_id)
            users       = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on user id {} with error {}".format(user_id, e))
            return jsonify({"error": format(e) }), 400
        if len(users) > 0:
            user    = users[0]
            # -- Sanitize the input and update the user record
            if "first_name" in data and data["first_name"] != "":
                user["first_name"] = data["first_name"]
            if "last_name" in data and data["last_name"] != "":
                user["last_name"] = data["last_name"]
            if "phone" in data and data["phone"] != "":
                user["phone"] = data["phone"]
            if "user_icon_url" in data and data["user_icon_url"] != "":
                user["user_icon_url"] = data["user_icon_url"]
            # we need to add the privilege field if not there.
            if "privilege" not in data and "privilege" not in user:
                user["privilege"] = ""   
            try:
                result = self.dbCon.update_document_by_field(self.collectionName, fieldName, fieldValue,  user)
            except Exception as e:
                return jsonify({"error": "User update failed with exception {}".format(e) }), 400
            user["user_id"] = str(user.get("_id")) # Access the embedded objectid
            if "_id" in  user:
                del user["_id"]
            if "password" in user and user["password"] != "": 
                del user["password"]
            return jsonify(user), 201
        else:
            return jsonify({"error": "No record found"}), 400
        '''
        #TODO check permissions in dict_permissions before returning the record.
        if self.collectionName in dict_collection_doc_role["collection_roles"]:
            if user_id in dict_collection_doc_role["collection_roles"][self.collectionName]:
                role = dict_collection_doc_role["collection_roles"][self.collectionName][user_id]
                perms = self.authorization.get_collection_role_permissions(self.collectionName, role)
                print("user perms:", perms)
                if perms[2] == "1":   # Update allowed in CRUD
                    fieldName   = "_id"
                    #--- if user_id is invalid (must be 12 bytes or 24 char hex string ), handle the ObjectId() call error
                    try:
                        fieldValue  = ObjectId(user_id)
                        users       = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
                    except Exception as e:
                        self.app.logger.error("bson operation ObjectId() failed on user id {} with error {}".format(user_id, e))
                        return jsonify({"error": format(e) }), 400
                    if len(users) > 0:
                        user    = users[0]
                        # -- Sanitize the input and update the user record
                        if "first_name" in data and data["first_name"] != "":
                            user["first_name"] = data["first_name"]
                        if "last_name" in data and data["last_name"] != "":
                            user["last_name"] = data["last_name"]
                        if "phone" in data and data["phone"] != "":
                            user["phone"] = data["phone"]
                        if "user_icon_url" in data and data["user_icon_url"] != "":
                            user["user_icon_url"] = data["user_icon_url"]
                        try:
                            result = self.dbCon.update_document_by_field(self.collectionName, fieldName, fieldValue,  user)
                        except Exception as e:
                            return jsonify({"error": "User update failed with exception {}".format(e) }), 400
                        user["user_id"] = str(user.get("_id")) # Access the embedded objectid
                        if "_id" in  user:
                            del user["_id"] 
                        del user["password"]
                        return jsonify(user), 201
                    else:
                        return jsonify({"error": "No record found"}), 400
                else:
                    return jsonify({"error": "Access denied to retrieve user record"}), 403
            else:
                return jsonify({"error": "user not found in permission role associated with this token"}),400
        else:
            return jsonify({"error": "This access_token has some wrong permission settings"}),400
        '''


    #------- Get a particular user by a field in users collections --- 
    def get_user_by_field(self, fieldName, fieldValue, access_token):
        #dict_permissions = self.get_permissions_from_access_token(access_token)
        dict_permissions = self.oauth2.get_permissions_from_access_token(access_token)
        if "error" in dict_permissions:
            return jsonify(dict_permissions),400
        #print("users.get_user_by_field: perms from access token dict_permissions = {} and type of dict_permissions = {}".format(dict_permissions,type(dict_permissions)))
        if "error" in dict_permissions:
            return jsonify(dict_permissions),400
        if fieldName == "":
            self.app.logger.error('No fieldName  provided for find request')
            return jsonify({'error': 'No input field provided'}), 400
        if fieldValue == "":
            self.app.logger.error('No Value  provided for field {}.'.format(fieldName))
            return jsonify({'error': 'No Value  provided for input field {}.'.format(fieldName)}), 400
        users   = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
        if len(users) > 0:
            user    = users[0]
            #print("User record from database is {} and has type {}".format(user, type(user)))
            user_id =  str(user.get("_id"))
            permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, self.collectionName, user_id)
            #print("permissions in get_user_by_field for user {} are: {}".format(user_id, permissions))
            if permissions is None or "success" not in permissions or permissions["success"] is not True:
                self.app.logger.error("Missing read permissions on user with id {}".format(user_id))
                return jsonify({"error":"Missing read permissions on user with id ".format(user_id)}),400

            crud_permissions = permissions["permissions"]
            if crud_permissions[1] != "1":
                self.app.logger.error("Missing read permissions on user with id {}".format(user_id))
                return jsonify({"error":"Missing read permissions on user with id ".format(user_id)}),400
            for user in users:
                user["user_id"] = str(user.get("_id")) # Access the embedded objectid
                if user["_id"]:
                    del user["_id"] 
                if "password" in user and user["password"] != "":
                    del user["password"]
        
            return jsonify(users), 200
        else:
            return jsonify({"error": "No user found for the supplied {} with a value of {}.".format(fieldName, fieldValue)})

    #--------- Get a list of users using a field from users collection

    def get_users_by_field(self, fieldName, fieldValue, access_token):
        dict_permissions = self.oauth2.get_permissions_from_access_token(access_token)
        if "error" in dict_permissions:
            return jsonify(dict_permissions),400
        #print("users.get_users_by_field: perms from access token dict_permissions = {} and type of dict_permissions = {}".format(dict_permissions,type(dict_permissions)))
        if "error" in dict_permissions:
            return jsonify(dict_permissions),400
        if fieldName is None:
            self.app.logger.error('No fieldName  provided for find request')
            return jsonify({'error': 'No input field provided'}), 400
        if fieldValue is None:
            self.app.logger.error('No Value  provided for field {}.'.format(fieldName))
            return jsonify({'error': 'No Value  provided for field {}.'.format(fieldName)}), 400
        
        users   = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
        if len(users) < 1:
            return jsonify({"error": "No users with the provided information."}), 400
        #--- Build a list of users from this list that this access_token has access to
        list_users  = []
        for user in users:
            user_id =  str(user.get("_id"))
            permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, self.collectionName, user_id)
            #print("permissions for user {} are: {}".format(user_id, permissions))
            if permissions is None or "success" not in permissions or permissions["success"] is not True:
                continue
            crud_permissions = permissions["permissions"]
            if crud_permissions[1] != "1":
                continue
            user["user_id"] = str(user.get("_id"))
            del user["_id"]
            if "password" in user and user["password"] != "":
                del user["password"]
            list_users.append(user)
        if len(list_users) < 1:
            self.app.logger.info("No user records for {}={}".format(fieldName, fieldValue))
        return jsonify(list_users), 200



    #---------  Save a user record / signup -----
    #--- Either provide a password (manual signup) or sso_source (3rd party identity), not both (otherwise it assumes manual password based signup)
    def create_user(self):
        self.app.logger.info('Preparing the user record for writing in users')
        data = self.request.get_json()
        #print("users.create_user data:", data)
        #------- Sanitize the data: required fields email and (passord or sso_user_id)
        if not data["email"]:   
            response = {"error": "Email address is required for saving all user records."}
            self.app.logger.error("Email address not supplied for creating a user ")
            return jsonify(response), 400
        elif "password" not in data and "sso_source" not in data:
            response = {"error": "Either a 3rd party authentication or a password is required for signup."}
            self.app.logger.error("Either a 3rd party authentication or a password is required for signup.")
            return jsonify(response), 400
        elif ("password" in data and "sso_source" in data and data["password"].strip() == "" and data["sso_source"].strip() == "" ):
            response = {"error": "Either a 3rd party authentication or a password is required for signup. Both can't be blank."}
            self.app.logger.error("Either a 3rd party authentication or a password is required for signup. Both can't be blank.")
            return jsonify(response), 400
        elif ("password" in data and data["password"].strip() == "") or ("sso_source" in data and data["sso_source"].strip() == "") :
            response = {"error": "Either a 3rd party authentication or a password is required for signup."}
            self.app.logger.error("Either a 3rd party authentication or a password is required for signup.")
            return jsonify(response), 400
       
        #--- Check if a user with this email already exists
        users = self.dbCon.get_documents_by_field(self.collectionName, fieldName="email", fieldValue=data['email'])
        if len(users) > 0:
            if "sso_source" in data and data["sso_source"] != "":
                result  = {"user_id": str(users[0]["_id"])}
                status  = 200
                self.app.logger.info("SSO user already exists")
                return jsonify(result), status
            else:
                self.app.logger.info("User with email address tried to signup with the  same email {} tried signing up.".format(data['email']))
                return jsonify({"error": "A user with this email already exists"}), 400
        
        if "password" in data and data["password"].strip() != "":
            password = data["password"]
            # Adding the salt to password
            salt = bcrypt.gensalt()
            data["password"]        = bcrypt.hashpw(password.encode('utf-8'), salt)
            data["verification"]    = str(uuid.uuid4())  #--- unverified; will change to V once email verified
        if "privilege" not in data:
            data["privilege"] = ""
        # Following statement is useful if a sso user later tries to login with email and some password; we need a password field.
        # We cannot have the password field coming in as empty from front end otherwise existing check would fail.
        if "password" not in data:
            password    = ""
            salt        = bcrypt.gensalt()
            data["password"] = bcrypt.hashpw(password.encode('utf-8'), salt)
        user_id     = ""
        user_id  = self.create_user_internal(data)
        if user_id == "":
            result = {"Error": "User creation failed. Check for the input."}
            status = 400
        result = {"user_id": user_id}
        status = 201
        # ----- send the account confirmation email
        if "sso_source" not in data or data["sso_source"] == "":
            self.app.logger.info("Non SSO user signup, sending verification email")
            resp    = self.send_verification_email(user_id=user_id, email_address=data["email"], verification_hash=data["verification"])
        return jsonify(result), status
        
    def forgot_password(self, email):
        # if a user with this email exists, send out an email with a URL that has the link to change password and userid.
        # what if the user did not request => email no harm; no change to user record. regular login will work.
        # check if the user exists with this email first
        self.app.logger.info("users.forgot_password() using email {}".format(email))
        users = self.dbCon.get_documents_by_field(self.collectionName, fieldName="email", fieldValue=email)
        if len(users) < 1:
            return jsonify({"error": "No user with this email"}),400
        user    = users[0]
        user_id = str(user["_id"])
        # form an email and send it.
        to_email    = email
        subject     = "Follow up on your request to change your huby account"
        body        =  "Please click at the link below to change your Huby password. <br>"
        body        += self.API_DOMAIN + "/api/users/change_password?user_id=" + user_id +  " <br>"
        body        += "<br><br> Please contact support@huby.ai if you have any questions. <br>Thank you!"
        self.send_email(self.from_email, to_email, subject, body)
        return jsonify({"status": "success", "message": "Password change email sent."}), 200

    def change_password(self, user_id):
        self.app.logger.info("users.change_password() using user_id {}".format(user_id))
        data    = self.request.json
        if "new_password" not in data or data["new_password"] == "":
            self.app.logger.info("Bad password change request. New password is required for changing password.")
            return jsonify({"error": "Passord change request failed. New password is required for changing password"}),400
        new_password    = data["new_password"]
        users = self.dbCon.get_documents_by_field(self.collectionName, fieldName="_id", fieldValue=ObjectId(user_id))
        if len(users) < 1:
            self.app.logger.info("Bad password change request. No user with the user_id {}".user_id)
            return jsonify({"error": "Passord change request failed."}),400
        user = users[0]
        if not self.validate_password_rules(new_password):
            return jsonify({"error": "Passord did not meet the criteria for a good password."}),400
        salt        = bcrypt.gensalt()
        password        = bcrypt.hashpw(new_password.encode('utf-8'), salt)
        last_updated    = round(time())
        fieldName       = "_id"
        fieldValue      = ObjectId(user_id)
        dict_query      = {fieldName: fieldValue}
        dict_updates    = {"password": password, "last_updated": last_updated, "last_updated_by": user_id }
        self.dbCon.update_document_fields_by_query( self.collectionName, dict_query,  dict_updates)
        #print("user record updated successfully")
        self.app.logger.info("Successfully verified the user")
        return jsonify({"status": "success", "message": "Password change succeeded."}),200
    
    def validate_password_rules(self, password):
        # Currently bare bone; TODO: Add additional complex rules later.
        if len(password) < 8:
            return False
        else:
            return True

    def create_user_internal(self, data):
        user_id = ""
        try:
            user_id = self.dbCon.insert_document(self.collectionName, data)
            # --- Set the user permission record in user_document_role collection
            targetCollection    = "users"
            user_role           = "user"
            #user_perms          = {"user_id": documentId, "collection_roles": {targetCollection: {"users": user_role} }}
            access_token        = ""  # There is no access token until login but need to pass it for consistency with other ops
            self.authorization.add_permission(access_token, user_id, targetCollection, user_id, user_role)
            self.app.logger.info("updated user permissions ")
        except Exception as e:
            self.app.logger.error('Error inserting users: %s', e)
            return
        return user_id

    #-------- user login using email and password ---------------
    def login(self):
        self.app.logger.info("Users class, login() method ")
        #print("In Users class, login method and request is:".format(self.request))
        #email = self.request.json.get('email')
        data = self.request.json
        #print("data in user login function:", data)
        if "email" not in data:
            return jsonify({"error": "email is required for all login requests."}),400
        if not data["email"]:   
            response = {"error": "Email address is required for login"}
            self.app.logger.error("Email address not supplied for login ")
            return jsonify(response), 400
        # get the user record for this email
        result = self.dbCon.get_documents_by_field(self.collectionName, "email", data["email"])
        #print("result from database:", result)
        if len(result) < 1:
            # check if it's a SSO based login. In that case create a user record. We should not differentiate signup and login for SSO users.
            if "sso_source" in data or data["sso_source"] != "":
                # Verify that the 3rd party authenticated access_token is valid and belongs to the provided email address
                if not self.validate_external_oauth_token(data["sso_source"], data["access_token"], data["email"] ):
                    self.app.logger.error("3rd party authenticated access_token is invalid or belongs to some other email address.")
                    return jsonify({"error": "3rd party authenticated access_token is invalid or belongs to some other email address."}), 400
                else: 
                    new_user                    = {}
                    new_user["email"]           = data["email"]
                    new_user["first_name"]      = ""
                    new_user["last_name"]       = ""
                    new_user["phone"]           = ""
                    if "first_name" in data:
                        new_user["first_name"]      = data["first_name"]
                    if "last_name" in data:
                        new_user["last_name"]       = data["last_name"]
                    if "phone" in data:
                        new_user["phone"]           = data["phone"]
                    if "sso_source" in data:
                        new_user["sso_source"]      = data["sso_source"]
                    if "sso_user_id"  in data:
                        new_user["sso_user_id"]     = data["sso_user_id"]
                    if "user_icon_url"  in data:
                        new_user["user_icon_url"]     = data["user_icon_url"]
                    if "privilege" in data:
                        new_user["privilege"]       = data["privilege"]
                    if "verification" in data:
                        new_user["verification"]    = data["verification"] 
                    # Following statement is useful if a sso user later tries to login with email and some password; we need a password field.
                    # We cannot have the password field coming in as empty from front end otherwise existing check would fail.
                    if "password" not in data:
                        password    = ""
                        salt        = bcrypt.gensalt()
                        new_user["password"] = bcrypt.hashpw(password.encode('utf-8'), salt)           
                    new_user["created"]             = round(time())
                    new_user["created_by"]          = ""
                    new_user["updated"]             = ""
                    new_user["updated_by"]          = ""
                    user_id     = self.create_user_internal(new_user)
                    if user_id == "":
                        response = {"error": "Failed to create the user record for sso user with email {} with error {}.".format(new_user["email"], e)}
                        self.app.logger.error("user.login() Failed to create the user record for sso user with email {} with error {}.".format(new_user["email"], e))
                        return jsonify(response), 400
                    authorization_code  = self.oauth2.generate_authorization_code(user_id)
                    fResult = {"status": "success", "user_id": user_id, "authorization_code": authorization_code}
                    #print("login result:", fResult)
                    response = self.app.response_class(
                        response = json.dumps(fResult),
                        status = 200,
                        mimetype = 'application/json'
                    )
                    # before returning the response, we want to fire and forget a process that updates the login history and client information
                    self.update_login_history( user_id)
                    return response
            else:    
                response = {"error": "No user for this email address"}
                return jsonify(response), 400
        else:
            #print("result:", result[0])
            user_id             = str(result[0]["_id"])

        if "sso_source" in data and "access_token" in data:
            # Verify that the 3rd party authenticated access_token is valid and belongs to the provided email address
            if not self.validate_external_oauth_token(data["sso_source"], data["access_token"], data["email"] ):
                self.app.logger.error("3rd party authenticated access_token is invalid or belongs to some other email address.")
                return jsonify({"error": "3rd party authenticated access_token is invalid or belongs to some other email address."}), 400
            authorization_code  = self.oauth2.generate_authorization_code(user_id)
            fResult = {"status": "success", "user_id": str(result[0]["_id"]), "authorization_code": authorization_code}
            #print("login result:", fResult)
            response = self.app.response_class(
                response = json.dumps(fResult),
                status = 200,
                mimetype = 'application/json'
            )
            # before returning the response, we want to fire and forget a process that updates the login history and client information
            self.update_login_history( user_id)
            return response

        if "password" not in data:
            return jsonify({"error": "password is required for login requests that aren't 3rd party authenticated."}),400
        
        if not data["password"]:
            response = {"error": "A valid password is required for login"}
            self.app.logger.error("Password not supplied for login ")
            return jsonify(response), 400
        
        try:
            #print("comparing passwords now, result ={}".format(result[0]))
            
            # in case there are more than one user records for this email, we will consider the first.
            if bcrypt.checkpw(data["password"].encode("utf-8"), result[0]["password"]):
                # retrieve client_id and client_secret from request header and validate
                client_id       = self.request.headers.get('oauth2_client_id')
                client_secret   = self.request.headers.get('oauth2_client_secret')
                rc              = self.oauth2.validate_client_id_secret(client_id, client_secret)
                if rc < 0:
                    return jsonify({"error": "Invalid Oauth2 client id and/or client_secret"}), 400
                #---- generate the authorization code for this user
                user_id             = str(result[0]["_id"])
                authorization_code  = self.oauth2.generate_authorization_code(user_id)
                #print("authorization_code received from oauth2.generate_authorization_code() is ", authorization_code)
                #------ TODO --------generate an access token 
                #fResult = {"status": "success", "user_id": str(result[0]["_id"]), "access_token": "0abex5675d97xly", "token_ttl": 900, "refresh_token": "dcadtfkcmn123"}
                fResult = {"status": "success", "user_id": str(result[0]["_id"]), "authorization_code": authorization_code}
                #print("users.login() function has fResult as {}".format(fResult))
                #return json.dumps(fResult), 200
                #print("jsonified  response from users.login() is:", jsonify(fResult))
                #return jsonify(fResult), 200
                response = self.app.response_class(
                    response = json.dumps(fResult),
                    status = 200,
                    mimetype = 'application/json'
                )
                # before returning the response, we want to fire and forget a process that updates the login history and client information
                self.update_login_history(user_id)
                return response
            else:
                self.app.logger.error("Login failed, incorrect email and/or password; received email = " + data["email"])
                return jsonify({"error": "Login failed, incorrect email and/or password"}), 400
        except Exception as e:
            self.app.logger.error('Error file: %s', e)
            return jsonify({'error': 'Login operation failed with error: {}'.format(e)}), 500 

    #-- Update Login history along with the client machine information
    def update_login_history(self, user_id):
        from multiprocessing import Process
        from user_agents import parse 
        #print("user_id received in update_login_history is:", user_id)
        ip_address = self.request.remote_addr
        user_agent_string = self.request.headers.get('User-Agent')
        user_agent = parse(user_agent_string)

        client = user_agent.browser.family
        client_version = user_agent.browser.version_string
        client_os = user_agent.os.family
        client_os_version = user_agent.os.version_string
        time_logged_in = round(time())
        d_login_data = {"user_id": user_id, "ip_address": ip_address, "client": client, "client_version": client_version, "client_os": client_os, "client_os_version": client_os_version, "time_logged_in": time_logged_in, "time_logged_out": 0}
        #print("d_login_data is:", d_login_data)
        proc  = Process(target=update_login_history_async, args=(d_login_data,))
        proc.start()
        return
    
    
#-- Validate a 3rd party issued access_token --------
    def validate_external_oauth_token(self, sso_source, access_token, email ):
        print("sso_source is {} and access_token is {}:".format(sso_source, access_token))
        self.app.logger.info("sso_source is {} and access_token is {}:".format(sso_source, access_token))
        if sso_source.lower() == "google":
            try:
                #response = requests.get("https://oauth2.googleapis.com/tokeninfo?access_token=" + access_token)
                token_validation_url = self.google_token_validation_url + access_token
                response    = requests.get(token_validation_url)
                result      = response.json()
                if "email" in result and result["email"] == email:
                    return True
                else:
                    return False
            except Exception as e:
                self.app.logger.error('Error verifying the Google access_token: %s', e)
                return False
        elif sso_source.lower() == "slack":
            # here we can only validate if the token is valid.
            try:
                headers = {"Authorization": f"Bearer {access_token}"}
                token_validation_url = self.slack_token_validation_url
                response        = requests.get(token_validation_url, headers=headers)
                response_data   = json.loads(response.text)
                print("slack token verification response is  ", response.text)
                self.app.logger.info("slack token verification response text is {} ".format(response.text))
                self.app.logger.info("slack token verification response data is {} ".format(response_data))
                if response_data["ok"] :
                    return True
                    self.app.logger.info("slack token is valid")
                else:
                    return False              
            except Exception as e:
                self.app.logger.error('Error verifying the Slack access_token: %s', e)
                return False
        elif sso_source.lower() == "office365":
            try:
                headers = {"Authorization": f"Bearer {access_token}"}
                token_validation_url    = self.office365_token_validation_url
                token_validation_url    = token_validation_url.replace('{tenant_id}', self.office365_tenant_id)
                response        = requests.get(token_validation_url, headers=headers)
                response_data   = json.loads(response.text)
                print("office token verification response is  ", response.text)
                self.app.logger.info("Office 365 token verification response text is {} ".format(response.text))
                self.app.logger.info("Office 365 token verification response data is {} ".format(response_data))
                if response_data.status_code == 200:
                    return True
                else:
                    self.app.logger.info("Office 365 token is invalid")
                    return False              
            except Exception as e:
                self.app.logger.error('Error verifying the Office access_token: %s', e)
                return False
        else:
            # for now return True until we have the validation for other sso_source
            return True 
            #return False
                #return jsonify({"error": "Invalid 3rd paty authentication token: {}".format(e)})



# ---------- Get the access token for the logged in user --------
    def create_access_token(self):
        data = self.request.get_json()
        #print("data in user create_access_token function:", data)
 
        if "user_id" not in data or data["user_id"] == "null" or data["user_id"] == "" or data["user_id"] is None:   
            response = {"error": "user_id is required for generating the access_token"}
            self.app.logger.error("user_id not supplied for access_token creation ")
            return jsonify(response), 400
        elif "authorization_code" not in data or data["authorization_code"] == "null" or data["authorization_code"] == "" or data["authorization_code"] is None:
            response = {"error": "authorization_code is required for generating the access_token"}
            self.app.logger.error("authorization_code not supplied for access_token creation ")
            return jsonify(response), 400
        #----- get access permissions list for this user
        dict_permissions = self.authorization.get_permissions(data["user_id"])
        #print("dict_permissions before user record:", dict_permissions)
        # get the user record from users collection
        fieldName   = "_id"
        fieldValue  = ObjectId(data["user_id"])
        try:
            users   = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
            if len(users) > 0:
                user            = users[0]
                user["user_id"] = data["user_id"]
                del user["_id"]
                if "password" in user and user["password"] != "":
                    del user["password"]
                dict_permissions["user"] = user
                #print("dict_permission after adding user:", dict_permissions)
        except Exception as e:
            self.app.logger.error("Users.create_access_token Failed to retrieve the user record with Error: {}".format(e))
            return jsonify({"error": "Failed to retrieve the user record while creating access token with the following message: {}".format(e) }), 400
        #print("dict_permissions received from authorization = {} and type = {}:", dict_permissions, type(dict_permissions))
        #----- check that there is a cache record with this user_id and the authorization_code matches ---#
        result = self.oauth2.create_access_token(data["user_id"], data["authorization_code"], dict_permissions)
        if "error" not in result.keys():
            return jsonify(result), 200
        else:
            return jsonify(result), 400
        
    #--- Generate a new access token from a refresh_toen which has not yet expired 
    def generate_access_token_from_refresh_token(self, refresh_token):
        user_id     = self.oauth2.get_user_id_from_refresh_token(refresh_token)
        if not user_id:
            self.app.logger.error("refresh_token provided does not have a user_id associated. Supplied refresh_token is either invalid or expired. ")
            return jsonify({"error": "refresh_token provided does not have a user_id associated. Supplied refresh_token is either invalid or expired."}), 400
        dict_permissions      =  self.authorization.get_permissions(user_id)
        # get the user record from users collection
        fieldName   = "_id"
        fieldValue  = ObjectId(user_id)
        try:
            users   = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
            if len(users) > 0:
                user            = users[0]
                user["user_id"] = user_id
                del user["_id"]
                if "password" in user and user["password"] != "":
                    del user["password"]
                dict_permissions["user"] = user
                #print("dict_permission after adding user:", dict_permissions)
        except Exception as e:
            self.app.logger.error("Users.create_access_token Failed to retrieve the user record with Error: {}".format(e))
            return jsonify({"error": "Failed to retrieve the user record while creating access token with the following message: {}".format(e) }), 400

        return self.oauth2.generate_access_token_from_refresh_token(user_id, refresh_token, dict_permissions)

# ----------------- Miscellaneous user functions called above
    #def get_dict_permissions(self, user_id):
        #-- TODO - need to create a CRUD type of permissions on each object available to this user
        #-- Here we will instantiate the Authorization class and retrieve the permissions for this user and return them.
        #return {"users": {"user_id":user_id, "permissions": "0110"}, "applications": {"application_id": "abc", "permissions": "1111"}}
    
    
    def send_verification_email(self, user_id, email_address, verification_hash):
        #--- Prepare the verification email body
        to_email    = email_address
        subject     = "Please verify your sign up to activate your Huby account"
        body        =  "Thank you for your huby signup! <br>Please click at the link below to verify your account at Huby with this email. <br><br>"
        body        += self.API_DOMAIN + "/api/users/verify?user_id=" + user_id + "&verification=" + verification_hash + "<br>"
        body        += "<br><br> Please contact support@huby.ai if you have any questions. <br>Thank you!"
        self.send_email(self.from_email, to_email, subject, body)
        return 
    #--- Send the email 
    def send_email(self, from_email, to_emails, subject, body ):
        # we need to use sendgrid or mailgun services to send emails.
        response = ""
        try:
            email_util = EmailUtil(from_email)
            response  = email_util.send_email(to_emails, subject, body)
            #print("response from sending email:", response)
        except Exception as e:
            self.app.logger.error('Exception sending the verification email: %s', e)
            return {"error": "Exception sending  the verification email: {}".format(e) }
        return response

    def verify_email(self, user_id, verification):
        # get the user record using field name/value pair; verify that verification matches
        # update the user record for verification = "V" 
        # redirect the user to login screen 
        fieldName   = "_id"
        fieldValue  = ObjectId(user_id)
        try:
            self.app.logger.info("Retrieving the user from db with id {} for email verification".format(user_id))
            users       = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
            if len(users) > 0:
                user    = users[0]
            else:
                return jsonify({"error": "Verification failed. No record found"}), 400
            if (user["verification"].strip().upper() == "V"):
                self.app.logger.info("You have already verified your email successfully")
                return jsonify({"msg": "You have already verified your email successfully."}), 200
            if (user["verification"].strip() == verification.strip()):
                #print("verification hash matched")
                self.app.logger.info("Verification hashes matched")
                dict_query      = {fieldName: fieldValue}
                dict_updates    = {"verification": "V"}
                self.dbCon.update_document_fields_by_query( self.collectionName, dict_query,  dict_updates)
                #print("user record updated successfully")
                self.app.logger.info("Successfully verified the user")
                #newValue    = {"$set": {"verification": "V"}}
                #self.dbCon.update_one(query, newValue)
                self.app.logger.info('User %s email address verified', user_id)
                return jsonify({'message': 'Email verified successfully!', 'redirect_url': 'http://huby.ai'}), 200
            else:
                return jsonify({'error': 'Verification failed due to the mismatch of the verification code.'}), 400
        except Exception as e:
                self.app.logger.error('Error verifying user email: %s', e)
                self.app.logger.error('User record update action had the query {} and updates as {}'.format(dict_query,  dict_updates))
                return jsonify({'error': 'Failed to verify the user email.'}), 400
    
    #--- Save user profile picture ---#
    def save_profile_picture(self, user_id):
        # UPLOAD_FOLDER = os.getcwd() + "/static/images/users" # -- doesn't work gives root directory
        profile_picture_path_from_root    = "/dist/assets/images/users" 
        UPLOAD_FOLDER = self.app.root_path + profile_picture_path_from_root # path to flask app ie. location of huby.py
        #--- TODO: Above setting can possibly move to a config file; possibly the one below too. ---#
        ALLOWED_EXTENSIONS = set([ 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'])
        if 'file' not in self.request.files:
            return jsonify({"error": "No file in the submission"}),400
        file = self.request.files['file']
        extension = file.filename.rsplit('.', 1)[1].lower()
        filename    = user_id + '.' + extension
        if file and extension in ALLOWED_EXTENSIONS:
            #print("ready to save the file")
            #-- old code
            '''
            try:
                file.save(os.path.join(UPLOAD_FOLDER, filename))
                return jsonify({"filename": filename, "path": UPLOAD_FOLDER}),201
            except Exception as e:
                self.app.logger.error('Error file: %s', e)
                return jsonify({'error': 'Failed to save the file with error: {}'.format(e)}), 500 
            '''
            # -- new code
            asset_type = "images"
            try:
                cs = CloudStorage()
                #print("CS created")
                source_file_stream = file
                destination_blob_name = f"{asset_type}/users/{filename}"
                #print("source file pathe and destination blob name are: ", source_file_stream, destination_blob_name)
                file_url = cs.save_object_stream(source_file_stream, destination_blob_name)
                return jsonify({"filename": filename, "file_url": file_url}),201
                #print("file_url from saved object:", file_url)
            except Exception as e:
                print(e)
                self.app.logger.error("Users.save_profile_picture() error in saving file: %s", e)
                return jsonify({"error" : "System error in saving the user profile picture.".format(file)}), 400
        else:
            return jsonify({"error": "Failed to save the file"}),400

#-- This function is outside the scope of the class Users for two reasons:
#------ 1. Flask applications rely heavily on context, which includes information about the current request, session, and configuration. 
#          This context is not easily serializable and cannot be directly shared between processes.
#------ 2. binding self.update_login_history_async to target in multiprocessing Process gives python pickle error.
#          Python's pickle module, used for serializing objects, has limitations when it comes to serializing functions and objects that rely on the current execution environment.
def update_login_history_async(d_login_log):
    #print("d_login_log in update_login_history_async is and type: ", d_login_log, type(d_login_log))
    from configparser import ConfigParser
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
    dbCon   = Database(logFile)
    #self.app.logger.info("Starting the async process")

    collection = "login_history"
    try:
        login_history_id = dbCon.insert_document(collection, d_login_log)
        #print("login_history_id: ", login_history_id)
    except Exception as e:
            print(('Error inserting login_history reecord: %s', e))
            logger.error('Error inserting login_history reecord: %s', e)

    return

def test():
    users = Users("/var/log/huby/huby_api.log")
    result =  users.get_user_by_field("users", "email", "donna@huby.ai")
    print(result)
    print("\n\n Now test updating the user")
    collectionName = "users"
    return

if __name__ == "__main__":
    test()

