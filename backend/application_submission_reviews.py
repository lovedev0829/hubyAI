import os, sys
from flask import Flask, render_template, redirect, url_for, request, json, jsonify
from bson.objectid import ObjectId
from oauth2 import OAuth2
from authorization import Authorization 
from time import time # for timestamping
from users import Users
#--- Application submission reviews functionality will be used by both the application submitter(owner) and huby admin. -----
#--- Currently our authorization model is based on the role of a user on a collection document. But we bypass these checks for a Huby support/sysadmin privilege.
class ApplicationSubmissionReviews:
    def __init__(self, app, request, dbCon):
        self.app        = app
        self.request    = request
        self.dbCon      = dbCon
        self.oauth2     = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        self.collection = "application_submission_reviews"

    def create_application_submission_reviews(self):
         #-- Assume that validation of incoming app/prototype submission_reviews will happen in some sort of a controller.
        # check that a submission_reviews record for this app with this path does not already exist... If it doesn't then simply add crud fields and write it.
        self.app.logger.info('Preparing the app/prototype submission_reviews record for adding it application_submission_reviews collection')
        #--- First authenticate the request with access token. See if this can be modularized. ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        #print("access_token in create_app_sub_review:", access_token)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        data = self.request.get_json()
        if "application_id" not in data or "path" not in data:
            self.app.logger.error('Invalid app submission reviews request;  application_id and path are required.')
            return jsonify({'error': 'Invalid app submission reviews request; application_id and path are required.'}), 400
        application_id      = data["application_id"]
        #print("data received is {}".format(data))
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["created"] = round(time())
        if user_id:
            data["created_by"] = user_id
               
        # Check that there's no submission_reviews record for this application and path
        filterDict = {"application_id": application_id, "path": data['path']}
        sortOrder   = ""  # No sorting needed here since we're looking for a specific record.
        try:
            submission_reviews       = self.dbCon.get_documents_by_fields(self.collection, filterDict, sortOrder)
        except Exception as e:
            self.app.logger.error("Retrieval of app submission reviews failed on application id {} with error {}".format(application_id, e))
            return jsonify({"error": format(e) }), 400
        if len(submission_reviews) > 0:
            self.app.logger.error('Application Submission Reviews information for this app and path already exists.')
            return jsonify({'error': 'Bad request: Application SubmissionReviews information for this app and path already exists.'}), 400

        #--- Do basic validation for required info:
        if "comment" not in data or len(data["comment"]) == 0:
            self.app.logger.error('Application submission reviews comment is required')
            return jsonify({'error': 'Bad request: application submission reviews comment is required'}), 400
        
         #--- Before we create permission we need to check the application level rights. We do not need to check at ownership level. 
        #dict_collection_doc_role = self.oauth2.get_permissions_from_access_token(access_token)
        #print("ApplicationSubmissionReviews.create_application_submission_reviews(): type of dict_permissions = {}".format(type(dict_collection_doc_role)))
        #if "error" in dict_collection_doc_role:
        #    return jsonify(dict_collection_doc_role),400
        targetCollection    = "applications"
        #--- Here we're checking application level update access to create the submission_reviews record. -----#
        #--- But to update/delete the submission_reviews record, the user can have update access either at application level or at just submission_reviews record level --#
        #--- It is possible that a different user creates the submission_reviews record; For update/delete should we check for application collection or applicatioin_submission_reviews?
        #--- In updating the submission_reviews by application; we will just be checking at the application level since we don't have the submission_review_id.
        #--- Then should we be inserting a record for submission_reviews in the role_collection_permission. Could there be a possibility of updating this record by submission_reviews id?
        # --- Something worth discussing/debating. For now I will add the application_submission_reviews ownership to role_collection_permission ----
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, targetCollection, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing owner permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing owner permissions on application with id ".format(application_id)}),400

        crud_permissions = permissions["permissions"]
        if crud_permissions[0] != "1":
            self.app.logger.error("Missing owner permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing owner permissions on application with id ".format(application_id)}),400
        try:
            submission_review_id = self.dbCon.insert_document(self.collection, data)
        except Exception as e:
            self.app.logger.error('Error inserting app submission reviews information: %s', e)
            result = {'error': 'Failed to insert the app submission reviews information'}
            status = 400
            return jsonify(result), status

        '''
        if targetCollection in dict_collection_doc_role["collection_roles"]:
            print("collection name applications found for the associated token", targetCollection )
            print("look for application_id in ", dict_collection_doc_role["collection_roles"][targetCollection])
            if application_id in dict_collection_doc_role["collection_roles"][targetCollection]:
                role = dict_collection_doc_role["collection_roles"][targetCollection][application_id]
                perms = self.authorization.get_collection_role_permissions(targetCollection, role)
                print("role is {} and user perms: {}".format(role, perms))
                if perms[2] == "1":   # Update allowed in CRUD
                    # validate that there actually is a record for this application_id in applications collection
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
                        user_id = self.oauth2.get_user_id_from_access_token(access_token)
                        data["created"] = round(time())
                        if user_id:
                            data["created_by"] = user_id
                        # we don't need to validate the values in the application json since it's already done in the controller
                        try:
                            submission_review_id = self.dbCon.insert_document(self.collection, data)
                        except Exception as e:
                            self.app.logger.error('Error inserting app submission reviews information: %s', e)
                            result = {'error': 'Failed to insert the app submission reviews information'}
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

        if submission_review_id is None:
                result = {"Error": "Application submission_reviews record creation failed. Check for the input."}
                status = 400
                return jsonify(result), status
        else: 
            result  = {"submission_review_id": submission_review_id}
            status = 201
            # --- Set the user permission record in user_document_role collection for this particular submission_id? I think it's an overkill.
            # --- For creating submissoin reviews, we should just check the authorization at application level only.
            # --- For updating a submission review, a comment, or an app review we should just check the created_by otherwise it can get overwhelming.
            #user_role           = "owner"
            #user_perms          = {"user_id": documentId, "collection_roles": {targetCollection: {"users": user_role} }}
            #self.authorization.add_permission(access_token, user_id, self.collection, submission_review_id, user_role)
            #self.app.logger.info("updated app/prototype submission_reviews permissions ")    
            return jsonify(result), status

    def get_submission_reviews_by_submission_review_id(self, submission_review_id):
        # Do we need to check token here because it will require finding application_id first. 
        self.app.logger.info('ApplicationSubmissionReviews.get_submission_reviews_by_submission_review_id: get submission_reviews for submission_reviews id '. format(submission_review_id))
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
       
        fieldName   = "_id"
        fieldValue = ObjectId(submission_review_id)
        submission_reviews = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(submission_reviews) > 0:
            submission_review     = submission_reviews[0]
        else:
            return jsonify({"error": "No submission_reviews information found for the provided submission_reviews id.".format(submission_review_id)}), 400
        submission_review["_id"] = str(submission_review.get("_id"))
        # Keep it simple just check the permission at application level; We're not adding submission review id to collect document role collection.
        targetCollection    = "applications"
        if "application_id" not in submission_review:
            self.app.logger.error("Missing application id in the submission review with submission review id {}".format(submission_review_id))
            return jsonify({"error":"Missing application id in the submission review with submission review id {} ".format(submission_review_id)}),400
        
        application_id  = submission_review["application_id"]
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, targetCollection, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing owner permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing owner permissions on application with id ".format(application_id)}),400

        crud_permissions = permissions["permissions"]
        if crud_permissions[0] != "1":
            self.app.logger.error("Missing owner permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing owner permissions on application with id ".format(application_id)}),400
        # Now simply return the submission_review record
        if "_id" in submission_review:
            del submission_review["_id"]
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
            users   = Users(self.app, self.request, self.dbCon)
            user    = users.get_user_info(reviewer_id)
            if "first_name" in user:
                submission_review["user_name"] = user["first_name"]
            if "last_name" in user:
                submission_review["user_name"] += " " + user["last_name"]
            if "user_icon_url" in user:
                submission_review["user_icon_url"] = user["user_icon_url"]
        return jsonify(submission_review), 200
   
    def get_submission_reviews_by_application_id(self, application_id):
        # Here we need to check the app ownership since this info is limited to either the app owner or huby sysadmin/support
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
       
        targetCollection    = "applications"
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, targetCollection, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing owner permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing owner permissions on application with id ".format(application_id)}),400

        crud_permissions = permissions["permissions"]
        if crud_permissions[0] != "1":
            self.app.logger.error("Missing owner permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing owner permissions on application with id ".format(application_id)}),400

        self.app.logger.info('ApplicationSubmissionReviews.get_submission_reviews_by_application_id: get application submission_reviews for application id '. format(application_id))
        fieldName   = "application_id"
        #fieldValue = ObjectId(application_id)
        fieldValue          = application_id
        sortFields             = [("path", 1)]  # It can be a list of tuples 
        submission_reviews = self.dbCon.get_documents_by_field_sorted(self.collection, fieldName, fieldValue, sortFields)
        if len(submission_reviews) < 1:
            return jsonify({"error": "No submission_reviews record found for the provided application id.".format(application_id)}), 400
        # Attatch the submission reviewer information
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
        #print("submission_reviews now: ".format(submission_reviews))
        return jsonify(submission_reviews), 200
                               
    
#---def update_application_submission_reviews(self, application_id):
#---- We cannot allow update of all submission reviews of an application in one go. Update has to be for individual submission comment/review

    def update_application_submission_reviews_by_submission_review_id(self, submission_review_id):
        self.app.logger.info('Preparing the submission_reviews record for updating the application_submission_reviews collection')
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
        if "application_id" not in data:
            self.app.logger.error("Missing application id in the submission review with submission review id {}".format(data["application_id"]))
            return jsonify({"error":"Missing application id in the submission review with submission review id {} ".format(data["application_id"])}),400
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        data["last_updated"] = round(time())
        if user_id:
            data["last_updated_by"] = user_id
        #--- We don't need to check the permission to create an application but assign permission to this user as owner once app is created
        #--- Since any logged in user can submit an app; we need not validate their permission
        data = self.request.get_json()
        #print("data received is {}".format(data))
        if "application_id" not in data or data["application_id"] == "":
            self.app.logger.error("Missing application id on the request")
            return jsonify({"error":"Missing application id on the request"}),400

        application_id  = data["application_id"]

        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, self.collection, application_id)
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing owner permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing owner permissions on application with id ".format(application_id)}),400

        crud_permissions = permissions["permissions"]
        if crud_permissions[2] != "1":
            self.app.logger.error("Missing owner permissions on application with id {}".format(application_id))
            return jsonify({"error":"Missing owner permissions on application with id ".format(application_id)}),400
        fieldName   = "_id"
        try:
            fieldValue  = ObjectId(submission_review_id)
        except Exception as e:
            self.app.logger.error("bson operation ObjectId() failed on application submission_reviews id {} with error {}".format(submission_review_id, e))
            return jsonify({"error": format(e) }), 400
        #--- if user_id is invalid (must be 12 bytes or 24 char hex string ), handle the ObjectId() call error
        try:
            submission_reviews       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Data retrieval failed on application submission_reviews id {} with error {}".format(submission_review_id, e))
            return jsonify({"error": format(e) }), 400
        if len(submission_reviews) > 0:
            submission_review    = submission_reviews[0]
            if "_id" in submission_review:
                submission_review_id    = str(submission_review["_id"])
            # we need to update only certain fields or the submission_review record/document.
            submission_review["comment"]    = data["comment"]
            submission_review["path"]       = data["path"]
            try:
                self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue,  submission_review)    
            except Exception as e:
                return jsonify({"error": "Application update failed with exception {}".format(e) }), 400
            return jsonify({"submission_review_id": submission_review_id}), 200
        else:
            return jsonify({"error": "Unusual situation; more than one submission_reviews records with the same id"}),400
        '''
        dict_collection_doc_role = self.oauth2.get_permissions_from_access_token(access_token)
        print("ApplicationSubmissionReviews.update_application_submission_reviews_by_submission_review_id(): type of dict_permissions = {}".format(type(dict_collection_doc_role)))
        if "error" in dict_collection_doc_role:
            return jsonify(dict_collection_doc_role),400
        print(" In ApplicationSubmissionReviews.update_application_submission_reviews_by_submission_review_id(): user_id is {} and token permissions (role by collection and doc id): {}".format(user_id, dict_collection_doc_role))
        # Since this update is by submission_review_id, we will check for the user in collection_roles for submission_review_id
        # instead of application_id in application_submission_reviews collection.
        if self.collection in dict_collection_doc_role["collection_roles"]:
            print("collection name found", self.collection)
            print("look for submission_review_id in ", dict_collection_doc_role["collection_roles"][self.collection])
            if submission_review_id in dict_collection_doc_role["collection_roles"][self.collection]:
                role = dict_collection_doc_role["collection_roles"][self.collection][submission_review_id]
                perms = self.authorization.get_collection_role_permissions(self.collection, role)
                print("role is {} and user perms: {}".format(role, perms))
                if perms[2] == "1":   # Update allowed in CRUD
                    #TODO: Incomplete currently
                    fieldName   = "_id"
                    try:
                        fieldValue  = ObjectId(submission_review_id)
                    except Exception as e:
                        self.app.logger.error("bson operation ObjectId() failed on application submission_reviews id {} with error {}".format(submission_review_id, e))
                        return jsonify({"error": format(e) }), 400
                    #--- if user_id is invalid (must be 12 bytes or 24 char hex string ), handle the ObjectId() call error
                    try:
                        submission_reviews       = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
                    except Exception as e:
                        self.app.logger.error("Data retrieval failed on application submission_reviews id {} with error {}".format(submission_review_id, e))
                        return jsonify({"error": format(e) }), 400
                    if len(submission_reviews) > 0:
                        submission_review    = submission_reviews[0]
                        if "_id" in submission_review:
                            submission_review_id    = str(submission_review["_id"])
                        # we don't need to validate the values in the application json since it's already done in the controller
                        try:
                            self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue,  data)    
                        except Exception as e:
                            return jsonify({"error": "Application update failed with exception {}".format(e) }), 400
                        return jsonify({"submission_review_id": submission_review_id}), 200
                    else:
                        return jsonify({"error": "Unusual situation; more than one submission_reviews records with the same id"}),400
                else:
                    return jsonify({"error": "permission to update the prototoype denied"}),400
            else:
                return jsonify({"error": "Update role to update this application's submission_reviews is not available to you."}),400
        else:
            return jsonify({"error": "Application collection missing among permissions available on this access  token."}),400

        '''

