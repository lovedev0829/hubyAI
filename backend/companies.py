import os, sys
from flask import Flask, render_template, redirect, url_for, request, json, jsonify
from bson.objectid import ObjectId
from oauth2 import OAuth2
from authorization import Authorization 
from time import time # for timestamping
class Companies:
    def __init__(self, app, request, dbCon):
        self.app        = app
        self.request    = request
        self.dbCon      = dbCon
        self.oauth2     = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        self.collection = "companies"
        '''
        if "API_DOMAIN" in os.environ:
            self.API_DOMAIN  =   os.getenv("API_DOMAIN")
        else:
            self.API_DOMAIN  = "http://localhost"
        '''
    def create_company(self):
        #create a new company and return the company_id; any logged in user should be able to create a company.
        self.app.logger.info('Preparing the company record for adding it to the companies collection')
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token == "":
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        user = self.oauth2.get_user_from_access_token(access_token)
        user_id = ""
        if "user_id" not in user or user["user_id"] == "":
            self.app.logger.error("Invalid request; access token doesn't have an associated user_id")
            return jsonify({"error": "Invalid request; access token doesn't have an associated user_id"}), 400
        else:
            user_id = user["user_id"]

        data = self.request.get_json()
        # As such we can get the user_id from the access_token but we may need a company admin/support person update it too. So, keep the user_id as an arg.
        if "company" not in data or data["company"] == "":  # not supplied in the endpoint (only in payload)
            self.app.logger.error('Invalid company submission;  company (a required field) missing in the request.')
            return jsonify({'error': 'Invalid company submission;  company (a required field) missing in the request'}), 400
        if "company_description" not in data or data["company_description"] == "":  # not supplied in the endpoint (only in payload)
            self.app.logger.error('Invalid company submission;  company description (a required field) missing in the request.')
            return jsonify({'error': 'Invalid company submission;  company description (a required field) missing in the request'}), 400
        company = data["company"]
        #Check that the companyrecord doesn't already exist.
        fieldName       = "company"
        fieldValue      = company
        try:
            companies    = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue )
        except Exception as e:
            self.app.logger.error("Companies.create_company(): Error checking for company " + company + " with error {}". format(e))
            return jsonify({"error": "Error checking company with company name " + company + " with error {}". format(e)}), 400
        if len(companies) > 0:
            self.app.logger.error('Invalid company submission; A company with name {} already exists. Nothing saved.'.format(company))
            return jsonify({'error': 'Invalid company submission; A company with this name {} already exists. Nothing saved.'.format(company)}), 400
        data["created_by"]  = user_id
        data["created"]     = round(time())
        try:
            company_id = self.dbCon.insert_document(self.collection, data)
            result  = {"company_id": company_id}
            status = 201
            # assign the ownership of this company to this user
            user_role           = "owner"
            #user_perms          = {"user_id": documentId, "collection_roles": {targetCollection: {"users": user_role} }}
            self.authorization.add_permission( access_token, user_id, self.collection, company_id, user_role)
            self.app.logger.info("updated user permissions for the company")
        except Exception as e:
            self.app.logger.error('Error inserting a company record: %s', e)
            result = {'error': 'Failed to insert a company record.'}
            status = 400

        return jsonify(result), status


    def get_company_by_company_id(self, company_id):
        self.app.logger.info('Companies.get_company_by_company_id: '. format(company_id))
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on submitting an app request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        user = self.oauth2.get_user_from_access_token(access_token)
        user_id = ""
        if "user_id" not in user or user["user_id"] == "":
            self.app.logger.error("Invalid request; access token doesn't have an associated user_id")
            return jsonify({"error": "Invalid request; access token doesn't have an associated user_id"}), 400
        else:
            user_id = user["user_id"]
        # we don't need to check the permissions for get operation but we do need for update/delete
        fieldName           = "_id"
        fieldValue          = ObjectId(company_id)
        try:
            companies = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e: 
            self.app.logger.error("Data retrieval for company with company id {} failed with error {}".format(company_id, e))
            return jsonify({"error": format(e) }), 400
        if len(companies) < 1:   # company not found.
            #---  check that this user is an owner of this application. If not, reject the request.
            self.app.logger.error("No company found for the supplied company id {} ".format(company_id))
            return jsonify({"error":"No company found for the supplied company id {}".format(company_id)}),400
        company = companies[0]
        if "_id" in company:
            del company["_id"]
        return jsonify(company), 200
   
    def update_company(self, company_id):
        self.app.logger.info("Companies.update_company() - updating the company for company_id {}".format(company_id))
        if company_id == "":
            return jsonify({"error": "company_id is required for updating the submission status"}),400
        #--- get the access token and check that this user owns the application before returning the status ---
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('Invalid request: No access_token  provided.')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        fieldName       = "_id"
        fieldValue      = ObjectId(company_id)
        companies    = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        if len(companies) < 1 :
            return jsonify({"error": "No company found for the supplied company."}), 400
        # check that the user has update access on this company
        user        = self.oauth2.get_user_from_access_token(access_token)
        if "user_id" not in user or user["user_id"] == "":
            self.app.logger.error("Invalid request; access token doesn't have an associated user_id")
            return jsonify({"error": "Invalid request; access token doesn't have an associated user_id"}), 400
        else:
            user_id = user["user_id"]
        permissions  = self.oauth2.get_document_permissions_using_access_token(access_token, self.collection, company_id)
        print("permissions for user {}, for company_id {} is {}".format(user_id, company_id, permissions))
        if permissions is None or "success" not in permissions or permissions["success"] is not True:
            self.app.logger.error("Missing update permissions on company with id {}".format(company_id))
            return jsonify({"error":"Missing update permissions on company with id ".format(company_id)}),400
        crud_permissions = permissions["permissions"]
        if crud_permissions[2] != "1":
            self.app.logger.error("Missing update permissions on company with id {}".format(company_id))
            return jsonify({"error":"Missing update permissions on company with id ".format(company_id)}),400
        company = companies[0]
        data = self.request.get_json()
        if "company" in data and data["company"] != "" and data["company"] != company["company"]:
            company["company"]  = data["company"]
        if "company_description" in data and data["company_description"] != "" and data["company_description"] != company["company_description"]:
            company["company_description"]  = data["company_description"]
        if "company_url" in data and data["company_url"] != "" and data["company_url"] != company["company_url"]:
            company["company_url"]  = data["company_url"]
        if "company_logo" in data and data["company_logo"] != "" and data["company_logo"] != company["company_logo"]:
            company["company_logo"]  = data["company_logo"]
        if "company_location" in data and data["company_location"] != "" and data["company_location"] != company["company_location"]:
            company["company_location"]  = data["company_location"]
        if "company_industry" in data and data["company_industry"] != "" and data["company_industry"] != company["company_industry"]:
            company["company_industry"]  = data["company_industry"]
        company["last_updated_by"]      = user_id
        company["last_updated"]         = round(time())
        try:
                self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue,  company)    
        except Exception as e:
            self.app.logger.error("Company update failed with exception {}".format(e))
            return jsonify({"error": "Comapny update failed with exception {}".format(e) }), 400
        return jsonify({"status": "success", "company_id": company_id}), 200

