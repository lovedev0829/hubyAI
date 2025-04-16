import os
from configparser import ConfigParser
from bson.objectid import ObjectId
from flask import  jsonify
from oauth2 import OAuth2
from authorization import Authorization 
from time import time # for timestamping
from utils.email_util import EmailUtil

class MicroUpdates:
    #-- This class supports visual editing by users and updates one field at a time
    def __init__(self, app, request, dbCon):
        self.app        = app
        self.request    = request
        self.dbCon      = dbCon
        self.oauth2     = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        config      = ConfigParser()
        configFile  = os.getenv("WorkingDirectory") + "/huby.cfg"
        config.read(configFile) 
        self.from_email = config.get('Default', 'from_email')
        if self.from_email   == "":
            self.from_email  = "support@huby.ai"
        self.valid_collections = config.get('Default', 'collections').split(",")
        # build a dictionary of required fields and field types by collection
        self.required_fields_types_by_collection = dict()
        l_applications_fields = [{"application": "string"}]
        self.required_fields_types_by_collection["applications"] = l_applications_fields
        l_marketing_fields = [{"industry":"list"}, {"demo":"list"}, {"tutorials":"list"}, {"communities":"dict"}, {"tags":"list"}]
        self.required_fields_types_by_collection["marketing"] = l_marketing_fields
        l_models    = [{}]
        self.required_fields_types_by_collection["models"] = l_models
        l_runtime   = [{}]
        self.required_fields_types_by_collection["runtime"] = l_runtime
        l_source    = [{}]
        self.required_fields_types_by_collection["source"] = l_source


    def create_document(self):
        self.app.logger.info('MicroUpdates.create_document(): Preparing the doc for adding it to the collection')
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token == "":
            self.app.logger.error('MicroUpdates.create_document(): No access_token  provided on submitting a create doc request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('MicroUpdates.create_document(): Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        user = self.oauth2.get_user_from_access_token(access_token)
        payload = self.request.get_json()
        # As such we can get the user_id from the access_token but we may need a company admin/support person update it too. So, keep the user_id as an arg.
        if "collection" not in payload or payload["collection"] not in self.valid_collections:  # not supplied in the endpoint (only in payload)
            self.app.logger.error('MicroUpdates.create_document(): Invalid collection in the request.')
            return jsonify({'error': 'Invalid collection name in the request'}), 400
        if "document" not in payload or not payload["document"]: # no document or empty object
            self.app.logger.error('MicroUpdates.create_document(): No or empty document in the request.')
            return jsonify({'error': 'No or empty document in the request.'}), 400
        collection  = payload["collection"]
        document    = payload["document"]
        print("collection is: ", collection, " and document is: ", document)
        if collection != "applications":
            if "application_id" not in document or document["application_id"] == "":
                self.app.logger.error('MicroUpdates.create_document(): Invalid document in the request, application_id missing.')
                return jsonify({"error": "Invalid document in the request, application_id missing."}), 400
            #TODO Validate that the application_id is valid.
            application_id  = document["application_id"]
            fieldName       = "_id"
            fieldValue      = ObjectId(application_id)
            applications    = self.dbCon.get_documents_by_field("applications", fieldName, fieldValue)
            if len(applications) < 1 :
                return jsonify({"error": f"No product found for the supplied product id {application_id}."}), 400
            # validate that the user has create or update permission on application
            perms = self.oauth2.get_document_permissions_using_access_token(access_token, "applications", application_id) 
            if perms["success"] :
                crud = perms["permissions"]
                print("crud in update is : ", crud)
                if crud[0] != "1" and crud[2] != "1":
                    return jsonify({"error": "You don't have permissions to work on this product's information"}),400
            else:
                return jsonify({"error": "You don't have required permissions to updates related to this product"}), 400
            if crud[0] != "1" and crud[2] != "1":
                return jsonify({"error": "You don't have permissions to work on this product's information"}),400
        else:
            # if the collection is applications and the field being supplied is the product name (ensure that it's not duplicate) and fire the email after saving it
            if "application" in document:
                search_text = document["application"]
                field_name  = "application"
                query       = {field_name: {"$regex": f"^{search_text}$", "$options": "i"}}
                res_fields  = ["application"]
                apps        = self.dbCon.get_collection_docs_using_logical_query(collection, query, res_fields)
                if len(apps) > 0:
                    return jsonify({"error": f"A product with name {search_text} already exists"}),400
        # Add the placeholder values for required fields by
        updated_document = self.add_required_missing_fields( collection, document)
        document["created"] = round(time())
        document["created_by"] = user["user_id"]
        document_id = self.dbCon.insert_document( collection, updated_document)
        if collection == "applications" and "application" in document:
            if not self.perform_post_product_creation_steps(access_token, user, collection, document_id, document):
                self.app.logger.error(f"MicroUpdates.perform_post_product_creation_steps(): Post product creation steps for product with id {document_id} failed due to certain technical reasons")
        
        return jsonify({"document_id": document_id, "collection": collection}), 201

    def update_document(self):
        self.app.logger.info('MicroUpdates.update_document(): Preparing the doc field for updating the doc')
        access_token    = self.oauth2.get_access_token_from_request(self.request)
        if access_token == "":
            self.app.logger.error('MicroUpdates.update_document(): No access_token  provided on submitting a create doc request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('MicroUpdates.update_document(): Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        user = self.oauth2.get_user_from_access_token(access_token)
        payload = self.request.get_json()
        # As such we can get the user_id from the access_token but we may need a company admin/support person update it too. So, keep the user_id as an arg.
        if "collection" not in payload or payload["collection"] not in self.valid_collections:  # not supplied in the endpoint (only in payload)
            self.app.logger.error('MicroUpdates.update_document(): Invalid collection in the request.')
            return jsonify({'error': 'Invalid collection name in the request'}), 400
        if "document_id" not in payload or payload["document_id"] == "": # no document_id or empty object
            self.app.logger.error('MicroUpdates.update_document(): No or empty document_id in the request.')
            return jsonify({'error': 'No or empty document_id in the request.'}), 400
        if "document" not in payload or not payload["document"]: # no document or empty object
            self.app.logger.error('MicroUpdates.update_document(): No or empty document in the request.')
            return jsonify({'error': 'No or empty document in the request.'}), 400
        
        collection  = payload["collection"]
        document    = payload["document"]
        document_id = payload["document_id"]
        if collection != "applications":
            if "application_id" not in document or document["application_id"] == "":
                self.app.logger.error('MicroUpdates.update_document(): Invalid document in the request, application_id missing.')
                return jsonify({"error": "Invalid document in the request, application_id missing."}), 400
            #TODO Validate that the application_id is valid.
            application_id  = document["application_id"]
            fieldName       = "_id"
            fieldValue      = ObjectId(application_id)
            applications    = self.dbCon.get_documents_by_field("applications", fieldName, fieldValue)
            #print("collection is {} fieldName is {} field value: {} and products ={}".format(collection, fieldName, fieldValue, applications))
            if len(applications) < 1 :
                return jsonify({"error": f"No product found for the supplied product id {application_id}."}), 400
            # validate that the user has create or update permission on application

            perms = self.oauth2.get_document_permissions_using_access_token(access_token, "applications", application_id) 
            #print("perms:", perms)
            if perms["success"] :
                crud = perms["permissions"]
                #print("crud in update is : ", crud)
                if crud[0] != "1" and crud[2] != "1":
                    return jsonify({"error": "You don't have permissions to work on this product's information"}),400
            else:
                return jsonify({"error": "You don't have required permissions to updates related to this product"}), 400
        document["last_updated"] = round(time())
        document["last_updated_by"] = user["user_id"]        
        result      = self.dbCon.update_document_fields(collection, document_id, document)
        #print("type and result of update: ", type(result), result)
        if "error" not in result:
            return jsonify(result), 200
        else:
            return jsonify(result), 400

    

    def add_required_missing_fields(self, collection, document):
        #set the default value of required fields
        if collection == "application_marketing":
            if "industry" not in document:
                document["industry"] = []
            if "demo" not in document:
                document["demo"] = []
            if "tutorials" not in document:
                document["tutorials"] = []
            if "communities" not in document:
                document["communities"] = []
            if "tags" not in document:
                document["tags"] = []
        return document

    def perform_post_product_creation_steps(self, access_token, user, collection, application_id, data):
        #create product ownership record and send email notification
        user_id = first_name = last_name = email = phone = ""
        # --- Set the user permission record in user_document_role collection
        user_role           = "owner"
        if "user_id" in user and user["user_id"] != "":
            user_id         = user["user_id"]
            #user_perms          = {"user_id": documentId, "collection_roles": {targetCollection: {"users": user_role} }}
            self.authorization.add_permission(access_token, user_id, collection, application_id, user_role)
            #self.app.logger.info("updated user permissions ")
            #--- Add the user to application_ownership collection too
            if "first_name" in user and user["first_name"] != "":
                first_name  =  user["first_name"]
            if "last_name" in user and user["last_name"] != "":
                last_name   =  user["last_name"]
            if "email" in user and user["email"] != "":
                email       =  user["email"]
            if "phone" in user and user["phone"] != "":
                phone       =  user["phone"]
            ownership_record    = {}
            ownership_record["application_id"]          = application_id 
            ownership_record["owner_company"]           = "To be provided" 
            ownership_record["company_url"]             =  "To be provided" 
            ownership_record["product_url"]             =  "To be provided"
            ownership_record["owner_id"]                =  user_id
            ownership_record["owner_name"]              =  first_name + " " + last_name  
            ownership_record["owner_email"]             =  email
            ownership_record["owner_phone"]             =  phone 
            ownership_record["secondary_owner_name"]    =  "To be provided"
            ownership_record["secondary_owner_id"]      =  "To be provided" 
            ownership_record["secondary_owner_email"]   =  "To be provided" 
            ownership_record["secondary_owner_phone"]   =  "To be provided"
            ownershipCollection                         = "application_ownership"  # ideally this should be a global var
            ownership_id    = self.dbCon.insert_document(ownershipCollection, ownership_record)
        subject = "Congratulations on submitting " + data["application"]
        body = "Dear " + first_name +  ",<br>" + " Congratulations on submitting <b>" + data["application"] + "</b>. <br>"
        body += "Your submission confirmation number is <b>" + application_id + "</b>.<br>"
        body += "A background job is already at work to gather any publicly available information on this product and update it on huby marketplace.<br>"
        body += "As a next step, we recommend you to review/update detailed information on " + data["application"] + " using huby's burger menu. "
        body += " Among other things, this includes marketing information, demo videos/how tos, system requirements, AI technology used, etc."
        body += " This information is used by our curation process as well as for the visibility of your product to your target users. <br>"
        body += "Simply click https://huby.ai/application/marketing to enter the rest of information. <br>"
        body += "You can also preview your application by simply clicking https://huby.ai/appdetails?application_id=" + application_id + "  <br>"
        body += "Thank you! <br>"
        body += "huby support team <br>"
        body += "support@huby.ai"
        try:
            email_util = EmailUtil(self.from_email)
            response  = email_util.send_email(email, subject, body)
            self.app.logger.info("successfully sent the product submission email for product %s.", application_id)
            #print("response from sending email:", response)
        except Exception as e:
            self.app.logger.error('Exception sending the product submission email: %s', e)
            #return jsonify({"error": "Exception sending  the product submission email: {}".format(e) }), 206
            return False
        #-- We should not initiate the auto population of information in this case.
        return True


