#-------- This database class is responsible for database operations - CRUD -------
import os, sys
import pymongo
from pymongo import MongoClient
from bson.json_util import dumps
import urllib.parse
import json
import logging
import traceback
from bson.objectid import ObjectId 
#--- defult log level. Set it to DEBUG, WARNING, INFO, or ERROR.
logLevel = logging.DEBUG 
class Database:
    def __init__(self, logFile):
        if not logFile:
            logFile = "database.log"
        logging.basicConfig(format='%(asctime)s %(levelname)-s %(message)s', datefmt='%Y-%m-%d %H:%M:%S %Z', filename=logFile, level=logLevel, filemode='a')
        self.logger = logging.getLogger(logFile)
        required_envs = ["DBHOST","DBPORT", "DBNAME", "DBUSER", "DBPASS"]
        for var in required_envs:
            if var not in os.environ:
                self.logger.error( "Missing value for environment variable {}. Exiting the application".format(var))
                raise EnvironmentError("Missing value for environment variable {}.".format(var))
                sys.exit()
        self.host = os.getenv("DBHOST") 
        self.port = os.getenv("DBPORT")
        self.dbname = os.getenv("DBNAME")
        self.dbuser = os.getenv("DBUSER")
        self.dbpass = os.getenv("DBPASS")
        self.MONGO_URI = f'mongodb://{self.dbuser}:{urllib.parse.quote_plus(self.dbpass)}@{self.host}:{self.port}/{self.dbname}'
        try:
            self.logger.info("Attempting to connect to the database.")
            self.client =  MongoClient(f'mongodb://{self.dbuser}:{urllib.parse.quote_plus(self.dbpass)}@{self.host}:{self.port}/{self.dbname}')
            # connecting with self-certified certs
            self.db     = self.client[self.dbname]
        except pymongo.errors.ConnectionFailure as e:
            print("Failed to connect to databasse server due to error {}. Exiting the application".format(e))
            self.logger.error("Failed to connect to databasse server due to error {}".format(e))
        return

#--------- Get all the documents for a collection - no filter ------------
    def get_documents_all(self, collectionName):
        try:
            collection  = self.db[collectionName]
            cursor      = collection.find({})
            return list(cursor) # Returns a list of dictionaries
            #Mongo returns BSON data that we need to convert first using json_util.dumps and then convert it to json using json.loads.
            #return dumps(cursor) # This dumps fro bson_json_util converts the array of dict into a json
        except (AttributeError, pymongo.errors.OperationFailure):
            print("could not get the right data in database.get_documents_all().")


#--------- Get all the documents from a collection - by a filter field ------------
    def get_documents_by_field(self, collectionName, fieldName, fieldValue):
        #print("Function: database=>get_doucments_by_field:", collectionName, fieldName, fieldValue)
        try:
            collection  = self.db[collectionName]
            cursor      = collection.find({fieldName: fieldValue})
            #Mongo returns BSON data that we need to convert first using json_util.dumps and then convert it to json using json.loads.
            #print("result straight from db:", list(cursor))
            return list(cursor) # Returns a list of dictionaries
            #return dumps(cursor) # This dumps fro bson_json_util converts the array of dict into a json
        except (AttributeError, pymongo.errors.OperationFailure):
            print("could not get the right data.")

#--------- Get documents by field for a collection - but a limited number of docs from some starting point ------------
# ---             particularly useful for infinite scroll ---------
    def get_documents_by_field_with_skip_limit(self, collectionName, fieldName, fieldValue, skip=0, limit=5):
        try:
            collection  = self.db[collectionName]
            cursor      = collection.find({fieldName: fieldValue}).skip(skip).limit(limit)
            return list(cursor) # Returns a list of dictionaries
            #Mongo returns BSON data that we need to convert first using json_util.dumps and then convert it to json using json.loads.
            #return dumps(cursor) # This dumps fro bson_json_util converts the array of dict into a json
        except (AttributeError, pymongo.errors.OperationFailure):
            print("could not get the right data in database.get_documents_by_field_with_skip_limit().")

#--------- Get all the documents from a collection - by a filter field and sorted by fields/direction list of tuples e.g. [("field1", 1), ("field2", -1)] ------------
    def get_documents_by_field_sorted(self, collectionName, fieldName, fieldValue, sortFieldValues):
        #print("Function: database=>get_doucments_by_field_sorted:", collectionName, fieldName, fieldValue, sortFieldValues)
        try:
            collection  = self.db[collectionName]
            cursor      = collection.find({fieldName: fieldValue})
            if sortFieldValues:
                cursor.sort(sortFieldValues)
            #Mongo returns BSON data that we need to convert first using json_util.dumps and then convert it to json using json.loads.
            #print("result straight from db:", list(cursor))
            return list(cursor) # Returns a list of dictionaries
            #return dumps(cursor) # This dumps fro bson_json_util converts the array of dict into a json
        except (AttributeError, pymongo.errors.OperationFailure):
            print("could not get the right data.")


#--------- Get all the documents from a collection - by a set of filter fields and sorting fields as key/vals ------------
    def get_documents_by_fields(self, collectionName, fieldNameValuePairs, sortFieldValues):
        #-- ex of fieldNameValuePairs: {"comment_id": review_id, "user_id": user_id}
        #-- ex of sortFieldValues = array of tuples with 1 for asc e.g.  [("path", 1), ("some_field2", -1)]; "" => no sort
        #print("Function: database=>get_doucments_by_field:", collectionName, fieldNameValuePairs, sortFieldValues)
        try:
            collection  = self.db[collectionName]
            cursor      = collection.find(fieldNameValuePairs)
            if sortFieldValues:
                cursor.sort(sortFieldValues)
            #Mongo returns BSON data that we need to convert first using json_util.dumps and then convert it to json using json.loads.
            #print("result straight from db:", list(cursor))
            return list(cursor) # Returns a list of dictionaries
            #return dumps(cursor) # This dumps fro bson_json_util converts the array of dict into a json
        except (AttributeError, pymongo.errors.OperationFailure):
            print("could not get the right data.")

#-------- Get documents from a collection using a logical query involving $and, $or, $not, $nor etc
        #-- example of a query: query  = { "$or": [{"owner_id": user_id }, {"secondary_owner_id": user_id }] }
    def get_collection_docs_using_logical_query(self, collectionName, query, list_result_fields=[]):
        try:
            collection          = self.db[collectionName]
            dict_result_fields  = {}
            dict_result_fields["_id"]  = 0     # by default suppress the _id unless specifically requested
            if len(list_result_fields) > 0:
                for result_field in list_result_fields:
                    if result_field == "_id":
                        dict_result_fields["_id"] = { "$toString": "$_id" } 
                    else:
                        dict_result_fields[result_field] = 1

            cursor      = collection.find(query, dict_result_fields)
            return list(cursor) # Returns a list of dictionaries
            #return dumps(cursor) # This dumps fro bson_json_util converts the array of dict into a json
        except (AttributeError, pymongo.errors.OperationFailure):
            print("could not get the right data.")
            return {"error": "Error trying to fetch data using_logical_query"}



#------- Search a collection for  search term across all its documents ------
#------- It returns a list/array of dictionaries (KV pairs of fields that are supplied as an arr - arr_result fields)
    def search_collection_get_fields(self, collectionName, search_terms_str, arr_result_fields):
        try:
            collection      = self.db[collectionName]
            dResultFields   = dict()
            for result_field in arr_result_fields:
                if result_field == "_id":
                    dResultFields["_id"] = { "$toString": "$_id" } 
                else:
                    dResultFields[result_field] = 1
            cursor      = collection.find({"$text":{"$search" : search_terms_str}}, dResultFields)
            return list(cursor) # Returns a list of dictionaries
            #return dumps(cursor) # This dumps fro bson_json_util converts the array of dict into a json
        except Exception as e:
            print("Could not get the right data. Unexplained error in Database.search_collection_get_fields() with error: {}".format(e))
            self.logger.error("Could not get the right data. Unexplained error in Database.search_collection_get_fields() with error: {}".format(e))

#------- Get records from a collection where a field has one of the values from a supplied list 
    def get_documents_for_field_in_list_ordered(self, collectionName, fieldName, arr_field_values, arr_result_fields=[]):
        #print("Database.get_documents_for_field_in_list(): field name is {} and array field values are: {}".format(fieldName, arr_field_values))
        try:
            collection      = self.db[collectionName]
            dResultFields   = dict()
            for result_field in arr_result_fields:
                if result_field == "_id":
                    dResultFields["_id"] = { "$toString": "$_id" } 
                else:
                    dResultFields[result_field] = 1
            
            pipeline = [
                    {
                        "$match": {
                            fieldName: {"$in": arr_field_values}  # Match the documents with the field value in the provided list
                        }
                    },
                    {
                        "$addFields": {
                            "order": {
                                "$indexOfArray": [arr_field_values, f"${fieldName}"]  # Add the order based on values_order list
                            }
                        }
                    },
                    {
                        "$sort": {"order": 1}  # Sort the documents based on the 'order' field
                    },
                    {
                        "$project": {"order": 0}  # Optionally remove the 'order' field from the result
                    }
                ]
            result = list(collection.aggregate(pipeline))
            #print("ordered result:", result)
            return result
            #cursor      = collection.find({ fieldName : {"$in" : arr_field_values}}, dResultFields)
            #documents   = list(cursor)
            #print("documents before sort: ", documents)
            #ordered_documents = sorted(documents, key=lambda doc: arr_field_values.index(doc[fieldName]))
            #print("documents after sort: ", documents)
            #return ordered_documents
            #return list(cursor) # Returns a list of dictionaries
            #return dumps(cursor) # This dumps fro bson_json_util converts the array of dict into a json
        except Exception as e:
            print("Could not get the right data. Unexplained error in Database.get_documents_for_field_in_list_ordered() with error: {}".format(e))

#------- Get records from a collection where a field has one of the values from a supplied list in the order of the list
    def get_documents_for_field_in_list(self, collectionName, fieldName, arr_field_values, arr_result_fields=[]):
        #print("Database.get_documents_for_field_in_list(): field name is {} and array field values are: {}".format(fieldName, arr_field_values))
        try:
            collection      = self.db[collectionName]
            dResultFields   = dict()
            for result_field in arr_result_fields:
                if result_field == "_id":
                    dResultFields["_id"] = { "$toString": "$_id" } 
                else:
                    dResultFields[result_field] = 1
            cursor      = collection.find({ fieldName : {"$in" : arr_field_values}}, dResultFields)
            return list(cursor) # Returns a list of dictionaries
            #return dumps(cursor) # This dumps fro bson_json_util converts the array of dict into a json
        except Exception as e:
            print("Could not get the right data. Unexplained error in Database.get_documents_for_field_in_list() with error: {}".format(e))
    

#------------------------- Insert a Document in a Cluster and return document id as a string -----------------------

    def insert_document(self, collection_name, document):
        self.logger.info("Attempting to insert a document {} in collection {} of the database.".format(document, collection_name))
        if collection_name is None:
            self.logger.error('Collection name argument missing')
            return json.dumps({'error': 'Collection name not provided'}), 400
        if document is None:
            self.logger.error('No data (json) provided in request')
            return json.dumps({'error': 'No data provided'}), 400
        try:
            collections = self.db.list_collection_names()
            if collection_name not in collections:  
                # Try to validate a collection
                self.logger.error("Database.insert_document() - Invalid collection. Collection {} doesn't exist".format(collection_name))
                return {"error": "Invalid collection. Collection {} doesn't exist".format(collection_name)}
        except pymongo.errors.OperationFailure:  # If the collection doesn't exist
            self.logger.error("Database.insert_document() - Exception on fetching collections")
            return {"error": "Invalid collection. Exception on fetching collections"}

        try:
            collection  = self.db[collection_name]
            result      = collection.insert_one(document, bypass_document_validation=False, session=None, comment=None)
            return str(result.inserted_id) 
        except Exception as e:
            print("An exception occurred ::", e)  
            return False

#------------------------- Insert multiple Documents in one go  -----------------------
    def insert_documents(self, collectionName, documents):
        self.logger.info("Attempting to insert multiple documents {} in collection {} of the database.".format(documents, collectionName))
        if collectionName is None:
            self.logger.error('Collection name argument missing')
            return json.dumps({'error': 'Collection name not provided'}), 400
        if documents is None:
            self.logger.error('No data (json) provided in request. An array of documents expected.')
            return json.dumps({'error': 'No data provided'}), 400
        if not isinstance(documents, list):
            self.logger.error('Invalid data format: Expected a list of documents')
            return {'error': 'Invalid data format'}
        try:
            collection  = self.db[collectionName]
            result  = collection.insert_many(documents, bypass_document_validation=False, session=None, comment=None)
            return {'ids': [str(doc_id) for doc_id in result.inserted_ids]}
        except Exception as e:
            print("An exception occurred ::", e)  
            self.logger.error('Error inserting documents: %s', e)
            return {'error': 'Failed to insert documents'}
        
#--------- Update/replace a document (aside from _id) in a collection using a document field value     ------------
    def update_document_by_field(self, collectionName, fieldName, fieldValue,  newDocument):
        self.logger.info("Attempting to update a document with search filed {} in collection {} of the database.".format(fieldName, collectionName))
        if collectionName is None:
            self.logger.error('Collection name argument missing')
            return json.dumps({'error': 'Collection name not provided'}), 400
        if fieldName is None:
            self.logger.error('No query fieldName  provided in the update request.')
            return json.dumps({'error': 'No query fieldName provided in the update request'}), 400
        if fieldValue is None:
            self.logger.error('No query fieldValue  provided in the update request.')
            return json.dumps({'error': 'No query fieldvalue provided in the update request'}), 400
        if newDocument is None:
            self.logger.error('No document data (json) provided in the update request.')
            return json.dumps({'error': 'No updated document data provided'}), 400
        query       = {fieldName: fieldValue}
        collection  = self.db[collectionName]
        result      = self.get_documents_by_field(collectionName, fieldName, fieldValue)
        if result is None:
            self.logger.error("Update operation failed as no document found for field {} with value {}.".format(fieldName, fieldValue))
            return json.dumps({'error': 'No document found for the search criteria'}), 400
        docsCount = len(result)
        if docsCount > 1:
            #print("result:", result)
            #print("result list is:", list(result))
            self.logger.error("Update operation failed as {} documents were found for field {} with value {}.".format(docsCount, fieldName, fieldValue))
            errMsg = 'Update failed as more than one document({}) found for the search criteria'.format(docsCount)
            #return json.dumps({'error': 'Update failed as more than one document({}) found for the search criteria'.format(len(result)}), 400
            return json.dumps({'error': errMsg}), 400

        # Reject the request if there's no document for this query or if document count is > 1
        # get rid of the doc id from the document in case it came in accidentally o/w error
        if "_id" in newDocument:
            del newDocument["_id"]
        update      = {"$set": newDocument}
        self.logger.info("query is {} and update part is {}".format(query,update))
        try:
            result      = collection.update_one(query, update)
            # Check the result of the update
            #Mongo returns BSON data that we need to convert first using json_util.dumps and then convert it to json using json.loads.
            return {"updated_record_count": result.modified_count }
        except (AttributeError, pymongo.errors.OperationFailure):
            print("could not update the document.")
            return {'error': 'Failed to update the document'}

    #---- update a set of field values in a document (dict_updates) using query fields (dict_query)
    def update_document_fields_by_query(self, collectionName, dict_query,  dict_updates):
        self.logger.info("Attempting to update a subset of fields in a document with search criteria {} in collection {} of the database.".format(dict_query, collectionName))
        if collectionName is None:
            self.logger.error('Collection name argument missing')
            return json.dumps({'error': 'Collection name not provided'}), 400
        if dict_query is None:
            self.logger.error('No query fields/values  provided in the update request.')
            return json.dumps({'error': 'No query fields/values provided in the update request'}), 400
        if dict_updates is None:
            self.logger.error('No updated fields/values  provided in the partial update of doc request.')
            return json.dumps({'error': 'No updated fields/values  provided in the partial update of doc request.f'}), 400
        collection  = self.db[collectionName]
        
        # Reject the request if there's no document for this query or if document count is > 1
        update      = {"$set": dict_updates}
        self.logger.info("query is {} and update part is {}".format(dict_query,dict_updates))
        try:
            result      = collection.update_one(dict_query, update)
            # Check the result of the update
            #Mongo returns BSON data that we need to convert first using json_util.dumps and then convert it to json using json.loads.
            return {"updated_record_count": result.modified_count }
        except (AttributeError, pymongo.errors.OperationFailure):
            self.logger.error("could not update the document.")
            return {'error': 'Failed to update the document'}
        

    def update_document_fields(self, collection_name, document_id, update_fields):
        # update one or more fields in a document using collection and document_id to support micro edits
        # validate the collection_name
        try:
            collections = self.db.list_collection_names()
            if collection_name not in collections:  
                # Try to validate a collection
                self.logger.error("Database.insert_document() - Invalid collection. Collection {} doesn't exist".format(collection_name))
                return {"error": "Invalid collection. Collection {} doesn't exist".format(collection_name)}
        except pymongo.errors.OperationFailure:  # If the collection doesn't exist
            self.logger.error("Invalid collection. Exception on listing collections")
            return {"error": "Invalid collection. Exception on listing collections"}
        try:
            collection = self.db[collection_name]
            result = collection.update_one({"_id": ObjectId(document_id)}, {"$set": update_fields})
            return {"document_id": document_id, "collection": collection_name, "affected_records": result.matched_count}
        except (AttributeError, pymongo.errors.OperationFailure):
            self.logger.error("Database.update_document_fields() - could not update the document.")
            return {'error': 'Failed to update the document'}
        except Exception as e:
            self.logger.error("Database.update_document_fields() - could not update the document. Error: {}".format(e))
            return {"error": "Invalid document ID format."}
        
    def delete_document_by_id(self, collection_name = "", document_id = ""):
        try:
            collections = self.db.list_collection_names()
            if collection_name not in collections:
                # Try to validate a collection
                self.logger.error("Database.delete_document_by_id() - Invalid collection. Collection {} doesn't exist".format(collection_name))
                return {"error": "Database.delete_document_by_id(): Invalid collection. Collection {} doesn't exist".format(collection_name)}
        except pymongo.errors.OperationFailure:  # If the collection doesn't exist
            self.logger.error("Invalid collection. Exception on listing collections")
            return {"error": "Invalid collection. Exception on listing collections"}

        try:
            collection = self.db[collection_name]
            result = collection.delete_one({"_id": ObjectId(document_id)})
            return {"document_id": document_id, "collection": collection_name, "affected_records": result.matched_count}
        except (AttributeError, pymongo.errors.OperationFailure):
            self.logger.error("Database.delete_document_by_id() - could not update the document.")
            return {'error': 'Failed to delete the document'}
        except Exception as e:
            self.logger.error("Database.delete_document_by_id() - could not update the document. Error: {}".format(e))
            return {"error": "Invalid document ID format."}
        
    def delete_document_by_field(self, collection_name, fieldName, fieldValue):

        try:
            collections = self.db.list_collection_names()
            if collection_name not in collections:
                # Try to validate a collection
                self.logger.error("Database.delete_document_by_field() - Invalid collection. Collection {} doesn't exist".format(collection_name))
                return {"error": "Database.delete_document_by_field(): Invalid collection. Collection {} doesn't exist".format(collection_name)}
        except pymongo.errors.OperationFailure:  # If the collection doesn't exist
            self.logger.error("Invalid collection. Exception on listing collections")
            return {"error": "Invalid collection. Exception on listing collections"}

        try:
            collection = self.db[collection_name]
            result = collection.delete_one({fieldName: fieldValue})
            return {fieldName: fieldValue, "collection": collection_name, "affected_records": result.matched_count}
        except (AttributeError, pymongo.errors.OperationFailure):
            self.logger.error("Database.delete_document_by_field() - could not update the document.")
            return {'error': 'Failed to delete the document'}
        except Exception as e:
            self.logger.error("Database.delete_document_by_field() - could not update the document. Error: {}".format(e))
            return {"error": "Invalid document ID format."}

def test():
    dbConn = Database("test.log")
    collectionName  = "users"
    fieldName       = "email"
    fieldValue      = 'dbeatson@huby.ai'
    uDocs  = [{'first_name': 'George', 'last_name': 'Hawley', 'email': 'ghawley@gmail.com', 'phone': '781.801.7369', 'user_icon_url': '/static/images/users/hawley.png', 'password': 'd048f43164d59296a5d0b7076d1136ba', 'created': '', 'created_by': '', 'updated': '', 'updated_by': '', 'sso_source': '', 'sso_user_id': ''}, { 'first_name': 'Lulu', 'last_name': 'Lemon', 'email': 'llemon@test.ai', 'phone': 'N/A', 'user_icon_url': '/static/images/users/lulu.png', 'password': 'd048f43164d59296a5d0b7076d1136ba', 'sso_source': '', 'sso_user_id': '', 'created': '', 'created_by': '', 'updated': '', 'updated_by': ''}]
    newDoc = {"first_name": "Joe", "last_name": "Schmoe", "email": "jschmoe.com", "phone": "N/A", "user_icon_url": "/static/images/users/average.joe.png", "password": "d048f43164d59296a5d0b7076d1136ba", "sso_source": "", "sso_user_id": "", "created": "", "created_by": "", "updated": "", "updated_by": ""}
    #userIds = dbConn.insert_documents("users",uDocs)
    #print("bulk add; userIds: ", userIds)
    ##users = dbConn.get_documents_all("users")
    fieldName   = "_id"
    fieldValue  = ObjectId("6597a9a06d82b81421fa6af1")
    print("fieldValue=", fieldValue)
    #users = dbConn.get_documents_by_field(collectionName, fieldName, fieldValue)
    #print(dumps(users))
    result = dbConn.update_document_by_field(collectionName, fieldName, fieldValue,  newDoc)
    print("result is: ", result)


if __name__ == "__main__":
    test()
