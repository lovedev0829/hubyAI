from database import Database
from bson.objectid import ObjectId
from bson.errors import InvalidId
from configparser import ConfigParser
import logging
import os

config      = ConfigParser()
configFile  = os.getenv("WorkingDirectory") + "/huby.cfg"
#print("configFile:", configFile)
config.read(configFile)
webscrape_prompt = config.get('LLM', 'prompt_webscrape')
logFile     = config.get('Default', 'log_file')
logLevel    = config.get('Default', 'log_level')
if logFile      == "":
    logFile = "adhoc_delete_application.log"
if logLevel     == "":
    logLevel    = "INFO" 
logging.basicConfig(format='%(asctime)s.%(msecs)03d  %(levelname)-s %(message)s', datefmt='%Y-%m-%d %H:%M:%S %Z', filename=logFile, level=logLevel, filemode='a')
logger = logging.getLogger(logFile)
logger.info("Initiating post webcrawled media URLs step of updating the product images/videos using update_marketing_collection()")

dbCon   = Database(logFile)

def main(application):
    if application == "":
        return "Error: application cannot be blank"
    
    collection = "applications"
    fieldName  = "application"
    fieldValue = application
    try:
        apps = dbCon.get_documents_by_field(collection, fieldName, fieldValue)
    except Exception as e:
        logger.error("Error in adhoc_delete_application.main() while trying to retrieve the application {} with error {}".format(application, e))
        return
    if len(apps) < 1:
        print("Couldn't find a product with name {}. Trying to find a product with this input as an id".format(application))
        logger.info("In adhoc_delete_application.main()  - Couldn't find a product with name {}. Now trying to find a product with this input as an id.".format(application))
        logger.info("Now trying with application_id")
        collection = "applications"
        fieldName  = "_id"
        try:
            fieldValue = ObjectId(application)
        except InvalidId:
            logger.error("Invalid input, can\'t convert it to an Object id. ")
            print("Invalid input, can\'t convert it to an Object id. Error: ")
            return
        try:
            apps = dbCon.get_documents_by_field(collection, fieldName, fieldValue)
        except Exception as e:
            logger.error("Error in adhoc_delete_application.main() while trying to retrieve the application for id {} with error {}".format(application, e))
            return
        if len(apps) < 1:
            logger.error("Error in adhoc_delete_application.main() no application forund for the application id {}".format(application))
            return
        logger.info("application found for deletion using id")        
    else:
        logger.info("application found for deletion using the application name")
    app = apps[0]

    #delete the application using id
    application_id = str(app["_id"])
    dbCon.delete_document_by_id("applications", application_id)
    # now delete this product from rest of collections
    dbCon.delete_document_by_field("application_marketing", "application_id", application_id)
    # Get the user id from ownership (to be used in deleting user_document_role)
    collection = "application_ownership"
    fieldName  = "application_id"
    fieldValue = application_id
    try:
        owners = dbCon.get_documents_by_field(collection, fieldName, fieldValue)
    except Exception as e:
        logger.error("Error in adhoc_delete_application.main() while trying to retrieve the application {} with error {}".format(application, e))
    if len(owners) > 0:
        owner = owners[0]
        user_id = owner["owner_id"]
        collection  = "user_document_role"
        fieldName   = "user_id"
        fieldValue  = user_id
        user_document_roles = dbCon.get_documents_by_field(collection, fieldName, fieldValue)
        if len(user_document_roles) > 0:
            udr = user_document_roles[0]
            l_apps_role = udr["collection_roles"]["applications"] # [{<app_id1>: <role1>}, {<app_id2>: <role2> }]
            l_apps_role = [ {k:v for k,v in d.items()  if k != application_id } for d in l_apps_role]
            udr["collection_roles"]["applications"] = l_apps_role
            dbCon.update_document_by_field(collection, fieldName, fieldValue, udr)

    dbCon.delete_document_by_field("application_ownership", "application_id", application_id)

    dbCon.delete_document_by_field("application_marketing", "application_id", application_id)
    dbCon.delete_document_by_field("application_models", "application_id", application_id)
    dbCon.delete_document_by_field("application_ratings", "application_id", application_id)
    dbCon.delete_document_by_field("application_runtime", "application_id", application_id)
    dbCon.delete_document_by_field("application_reviews", "application_id", application_id)
    dbCon.delete_document_by_field("application_source", "application_id", application_id)


def delete_collection_item(collection, fieldName, fieldValue):
    resp = dbCon.delete_document(collection, fieldName, fieldValue)
    

if __name__ == '__main__' :
    #get the product name or id as input
    application = input("Enter the application name or application id: ")
    main(application)
