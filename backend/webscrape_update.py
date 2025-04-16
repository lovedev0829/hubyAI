#--- This is an API endpoint to update Application info from other more relevant models.
#--- This is different from webscrape_adhoc.py which runs the current AI pipeline (implemented in applications.py) automatically.
#--- The idea is that we could try running the prompt for a product manually but get the output in standard json format.
#--- That output will be the input for a method here as post.
import os, sys
from flask import request, json, jsonify
from flask_cors import CORS, cross_origin
from bson.objectid import ObjectId
from bson.errors import InvalidId
#from database import Database
from oauth2 import OAuth2
from authorization import Authorization 
from time import time, strftime, localtime # for timestamping
class WebscrapeUpdate():
    def __init__(self, app, request, dbCon):
        self.app            = app
        self.request        = request
        self.dbCon          = dbCon
        self.oauth2         = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        return
    
    def update_product_info(self, application ):
        #--- note that here application arg can either be the application_id or just the exact name of the product
        self.app.logger.info(f"processing Webscrape update in WebScrapeUpdate.update_product_info() for application: {application}")
        #------ validate the token first
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token is None:
            self.app.logger.error('No access_token  provided on updating the product request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        user_id = self.oauth2.get_user_id_from_access_token(access_token)
        #--- get the data from request
        d_prod_data = self.request.get_json()
        collection = "applications"
        fieldName  = "application"
        fieldValue = application
        try:
            apps = self.dbCon.get_documents_by_field(collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Error in WebScrapeUpdate.update_product_info() while trying to retrieve the application {} with error {}".format(application, e))
            return jsonify({"error": "Error in WebScrapeUpdate.update_product_info() while trying to retrieve the application {} with error {}".format(application, e)}), 400
        if len(apps) < 1:
            print("Couldn't find a product with name {}. Trying to find a product with this input as an id".format(application))
            self.app.logger.info("Error in WebScrapeUpdate.update_product_info() no application forund for the application id {}".format(application))
            self.app.logger.info("Now trying with application_id")
            collection = "applications"
            fieldName  = "_id"
            try:
                fieldValue = ObjectId(application)
            except InvalidId:
                self.app.logger.error(f"Invalid input, can\'t convert the product {application} to an ObjectId")
            except Exception as e:
                self.app.logger.error(f"Invalid input, can\'t convert it to an Object id. Error: {e}")
                print("Invalid input, can\'t convert it to an Object id. Error: ", e)
                return jsonify({"error": "Invalid input, can\'t convert it to an Object id." }),400
            try:
                apps = self.dbCon.get_documents_by_field(collection, fieldName, fieldValue)
            except Exception as e:
                self.app.logger.error("Error in WebScrapeUpdate.update_product_info() while trying to retrieve the application for id {} with error {}".format(application, e))
                return jsonify({"erorr": "while trying to retrieve the application"}), 400
            if len(apps) < 1:
                self.app.logger.error("Error in WebScrapeUpdate.update_product_info() no application forund for the application id {}".format(application))
                return jsonify({"erorr": "while trying to retrieve the application"}), 400
        app = apps[0]
        application_id = str(app["_id"])
        self.app.logger.info(f"WebScrapeUpdate.update_product_info() for the application information for application id:  {application_id}")

        if "owner" in d_prod_data:
            d_owner = d_prod_data["owner"]
            self.app.logger.info("Now processing the owner information {}".format(d_owner))
            # Ownership record is auto generated at product creation time; so this needs to be an update
            if "owner_company" in d_owner and "owner_name" in d_owner and "owner_email" in d_owner:
                # There should be a better way to validate the schema
                d_owner["application_id"] = application_id
                try:
                    #  check  first if there's a record for this app
                    owners = self.dbCon.get_documents_by_field("application_ownership", "application_id", application_id)
                    if len(owners) < 1:
                        owner_id = self.dbCon.insert_document("application_ownership", d_owner)
                    else:
                        owner = owners[0]
                        if d_owner["owner_company"]:
                            owner["owner_company"] = d_owner["owner_company"]
                        if d_owner["owner_name"]:
                            owner["owner_name"] = d_owner["owner_name"]
                        if d_owner["owner_email"]:
                            owner["owner_email"] = d_owner["owner_email"]
                        if d_owner["owner_phone"]:
                            owner["owner_phone"] = d_owner["owner_phone"]
                        owner["last_updated"] = round(time())
                        self.app.logger.info("Updating the owner information")
                        owner_id = self.dbCon.update_document_by_field("application_ownership", "application_id", application_id, owner)
                except Exception as e:
                    self.app.logger.error("Error in WebScrapeUpdate.update_product_info() while trying to insert owner info for  application with id {} and with owner info as {} with error {}".format(application_id, d_prod_data["owner"], e))
                    # no need to return, try capturing the rest
        #logger.info("Starting processing runtime info")
        if "runtime" in d_prod_data:
            # check for required runtime fields
            d_runtime = d_prod_data["runtime"]
            self.app.logger.info("Now processing the runtime information: {}".format(d_runtime))
            if "hardware" in d_runtime and "operating_system" in d_runtime and "memory" in d_runtime:
                #logger.info("runtime condition met")
                # There should be a better way to validate the schema
                d_runtime["application_id"]     = application_id
                d_runtime["created"]            = round(time())
                try:
                    #logger.info("Now retrieving the runtime information")
                    runtimes = self.dbCon.get_documents_by_field("application_runtime", "application_id", application_id)
                    if len(runtimes) < 1:
                        self.app.logger.info("Now inserting the runtime information")
                        runtime_id = self.dbCon.insert_document("application_runtime", d_runtime)
                except Exception as e:
                    self.app.logger.error("Error in WebScrapeUpdate.update_product_info() while trying to insert runtime info for  application with id {} and with runtime info as {} with error {}".format(application_id, d_prod_data["runtime"], e))
                    # no need to return, try capturing the rest
        #logger.info("Starting processing source info")
        if "source" in d_prod_data:
        # check for required source fields
            d_source = d_prod_data["source"]
            self.app.logger.info("Now processing the source information: {}".format(d_source))
            if "source_type" in d_prod_data["source"] :
                # There should be a better way to validate the schema
                d_source["application_id"]  = application_id
                d_source["created"]         = round(time())

                try:
                    sources = self.dbCon.get_documents_by_field("application_source", "application_id", application_id)
                    if len(sources) < 1:
                        self.app.logger.info("Now inserting the source information")
                        source_id = self.dbCon.insert_document("application_source", d_source)
                except Exception as e:
                    self.app.logger.error("Error in WebScrapeUpdate.update_product_info() while trying to insert source info for application with id {} and with source info as {} with error {}".format(application_id, d_prod_data["source"], e))
                    # no need to return, try capturing the rest
        #logger.info("Starting processing models info")
        if "models" in d_prod_data:
            # check for required owner fields
            #logger.info("Now processing the models information")
            d_models    = d_prod_data["models"]
            self.app.logger.info("Now processing the models information: {}".format(d_models))
            if len(d_prod_data["models"]) > 0: 
                #perhaps there is a better way to validate this
                try:
                    models = self.dbCon.get_documents_by_field("application_models", "application_id", application_id)
                    if len(models) < 1:
                        self.app.logger.info("Now inserting the models information")
                        d_doc_models = {}
                        d_doc_models["application_id"] = application_id
                        d_doc_models["created"]        = round(time())
                        d_doc_models["models"]         = d_models
                        model_id = self.dbCon.insert_document("application_models", d_doc_models)
                except Exception as e:
                    self.app.logger.error("Error in WebScrapeUpdate.update_product_info() while trying to insert models info for application with id {} and with models info as {} with error {}".format(application_id, d_doc_models, e))
                    # no need to return, try capturing the rest
        #logger.info("Starting processing marketing info")
        if "marketing" in d_prod_data:
            d_marketing = d_prod_data["marketing"]
            self.app.logger.info("Now processing the marketing information: {}".format(d_marketing))
            # check for required owner fields
            if "industry" in d_marketing and "pricing_type" in d_marketing and "privacy" in d_marketing:
                d_marketing["application_id"]   = application_id
                d_marketing["created"]          = round(time())
                try:
                    marketings = self.dbCon.get_documents_by_field("application_marketing", "application_id", application_id)
                    if len(marketings) < 1:
                        self.app.logger.info("Now inserting the marketing information")
                        marketing_id = self.dbCon.insert_document("application_marketing", d_marketing)
                except Exception as e:
                    self.app.logger.error("Error in WebScrapeUpdate.update_product_info() while trying to insert marketing info for  application with id {} and with marketing info as {} with error {}".format(application_id, d_prod_data["marketing"], e))
        return jsonify({"status": "success"}),201
        