def update_app_webscrape_async(application):
    import os
    from bson.objectid import ObjectId
    from configparser import ConfigParser
    import requests
    import json
    import time
    import logging
    from database import Database
    config      = ConfigParser()
    configFile  = os.getenv("WorkingDirectory") + "/huby.cfg"
    #print("configFile:", configFile)
    config.read(configFile)
    webscrape_prompt = config.get('LLM', 'prompt_webscrape')
    logFile     = config.get('Default', 'log_file')
    logLevel    = config.get('Default', 'log_level')
    if logFile      == "":
        logFile     = "/var/log/huby/huby_api.log"
    if logLevel     == "":
        logLevel    = "INFO" 
    logging.basicConfig(format='%(asctime)s.%(msecs)03d  %(levelname)-s %(message)s', datefmt='%Y-%m-%d %H:%M:%S %Z', filename=logFile, level=logLevel, filemode='a')
    logger = logging.getLogger(logFile)
    dbCon   = Database(logFile)
    if application == "":
        logger.error("Error in applications.update_app_webscrape_async(), no application passed")
        return
    #get the application name and product URL using the application name first

   
    
    collection = "applications"
    fieldName  = "application"
    fieldValue = application
    try:
        apps = dbCon.get_documents_by_field(collection, fieldName, fieldValue)
    except Exception as e:
        logger.error("Error in applications.update_app_webscrape_async() while trying to retrieve the application {} with error {}".format(application, e))
        return
    if len(apps) < 1:
        print("Couldn't find a product with name {}. Trying to find a product with this input as an id".format(application))
        logger.info("Error in applications.update_app_webscrape_async() no application forund for the application id {}".format(application))
        logger.info("Now trying with application_id")
        collection = "applications"
        fieldName  = "_id"
        try:
            fieldValue = ObjectId(application)
        except Exception as e:
            logger.error("Invalid input, can\'t convert it to an Object id. Error: ", e)
            print("Invalid input, can\'t convert it to an Object id. Error: ", e)
            return
        try:
            apps = dbCon.get_documents_by_field(collection, fieldName, fieldValue)
        except Exception as e:
            logger.error("Error in applications.update_app_webscrape_async() while trying to retrieve the application for id {} with error {}".format(application, e))
            return
        if len(apps) < 1:
            logger.error("Error in applications.update_app_webscrape_async() no application forund for the application id {}".format(application))
            return
    app = apps[0]
    application_id = str(app["_id"])
    logger.info("Web scraping the application information for " + application_id)
    if "application" not in app or app["application"] == "":
        logger.error("Error in applications.update_app_webscrape_async(); stopped webscraping as no application name forund for the application id {}".format(application_id))
        return
    if "product_url" not in app or app["product_url"] == "":
        logger.error("Error in applications.update_app_webscrape_async(); stopped webscraping as no product_url found for the application id {}".format(application_id))
        return
    webscrape_prompt = webscrape_prompt.replace('{1}', app["application"])
    webscrape_prompt = webscrape_prompt.replace('{2}', app["product_url"])
    #print("The final webscraping prompt is : ", webscrape_prompt)
    llm_url     = config.get("LLM", "URL").strip() +  config.get("LLM", "KEY").strip()
    llm_prompt  = webscrape_prompt
    headers     = {"Content-Type": "Application/json"}
    data        = {"contents":[{"parts":[{"text": llm_prompt}]}]} 
    #print("llm_url", llm_url)
    #print("llm_prompt", llm_prompt)
    #print("payload:", data)
    try:
        results  = requests.post(url=llm_url, json=data, headers=headers)
        #print("returned status code from LLM:", results.status_code)
        #print("results from LLM: {}".format(results))
        resp    = json.loads(results.text)
        #json_str = resp['candidates'][0]['content']['parts'][0]['text']
        #json_str = json_str.replace('```json\n', '').replace('```', '')
        #json_str = json_str.replace('\n', '')
        json_str = resp['candidates'][0]['content']['parts'][0]['text']
        print("resp:", resp)
        print("json_str:", json_str)
    except requests.exceptions.ConnectionError as e:
        print(e)
        logger.error("Applications.update_app_webscrape_async() error in performing semantic search: %s", e)
        return
    except requests.exceptions.HTTPError as e:
        print(e)
        logger.error("Applications.update_app_webscrape_async() error in performing semantic search: %s", e)
        return
    except Exception as e:
        print(e)
        logger.error("Applications.update_app_webscrape_async() error in performing semantic search: %s", e)
        return
    
    #return json_str
    #logger.info("obtained the json string")
    json_str = json_str.replace('json', '')
    json_str = json_str.replace('```', '')
    logger.info("json string after replace is: {}".format(json_str))
    try:
        d_prod_data = json.loads(json_str)
    except Exception as e:
        print(e)
        logger.error("Applications.update_app_webscrape_async() error in performing semantic search: %s", e)
        logger.error("json.loads() failed while trying to convert the string %s to Json.", json_str)
        return
    # TODO:  Add time stamps too
    #print("the final response dictionary is: ", d_prod_data)
    #logger.info("Starting processing the owner info")
    if "owner" in d_prod_data:
        d_owner = d_prod_data["owner"]
        logger.info("Now processing the owner information {}".format(d_owner))
        # Ownership record is auto generated at product creation time; so this needs to be an update
        if "owner_company" in d_owner and "owner_name" in d_owner and "owner_email" in d_owner:
            # There should be a better way to validate the schema
            d_owner["application_id"] = application_id
            try:
                #  check  first if there's a record for this app
                owners = dbCon.get_documents_by_field("application_ownership", "application_id", application_id)
                if len(owners) < 1:
                    owner_id = dbCon.insert_document("application_ownership", d_owner)
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
                    owner["last_updated"] = round(time.time())
                    logger.info("Updating the owner information")
                    owner_id = dbCon.update_document_by_field("application_ownership", "application_id", application_id, owner)
            except Exception as e:
                logger.error("Error in applications.update_app_webscrape_async() while trying to insert owner info for  application with id {} and with owner info as {} with error {}".format(application_id, d_prod_data["owner"], e))
                # no need to return, try capturing the rest
    #logger.info("Starting processing runtime info")
    if "runtime" in d_prod_data:
        # check for required runtime fields
        d_runtime = d_prod_data["runtime"]
        logger.info("Now processing the runtime information: {}".format(d_runtime))
        if "hardware" in d_runtime and "operating_system" in d_runtime and "memory" in d_runtime:
            #logger.info("runtime condition met")
            # There should be a better way to validate the schema
            d_runtime["application_id"]     = application_id
            d_runtime["created"]            = round(time.time())
            try:
                #logger.info("Now retrieving the runtime information")
                runtimes = dbCon.get_documents_by_field("application_runtime", "application_id", application_id)
                if len(runtimes) < 1:
                    logger.info("Now inserting the runtime information")
                    runtime_id = dbCon.insert_document("application_runtime", d_runtime)
            except Exception as e:
                logger.error("Error in applications.update_app_webscrape_async() while trying to insert runtime info for  application with id {} and with runtime info as {} with error {}".format(application_id, d_prod_data["runtime"], e))
                # no need to return, try capturing the rest
    #logger.info("Starting processing source info")
    if "source" in d_prod_data:
    # check for required source fields
        d_source = d_prod_data["source"]
        logger.info("Now processing the source information: {}".format(d_source))
        if "source_type" in d_prod_data["source"] :
            # There should be a better way to validate the schema
            d_source["application_id"]  = application_id
            d_source["created"]         = round(time.time())

            try:
                sources = dbCon.get_documents_by_field("application_source", "application_id", application_id)
                if len(sources) < 1:
                    logger.info("Now inserting the source information")
                    source_id = dbCon.insert_document("application_source", d_source)
            except Exception as e:
                logger.error("Error in applications.update_app_webscrape_async() while trying to insert source info for application with id {} and with source info as {} with error {}".format(application_id, d_prod_data["source"], e))
                # no need to return, try capturing the rest
    #logger.info("Starting processing models info")
    if "models" in d_prod_data:
        # check for required owner fields
        #logger.info("Now processing the models information")
        d_models    = d_prod_data["models"]
        logger.info("Now processing the models information: {}".format(d_models))
        if len(d_prod_data["models"]) > 0: 
            #perhaps there is a better way to validate this
            try:
                models = dbCon.get_documents_by_field("application_models", "application_id", application_id)
                if len(models) < 1:
                    logger.info("Now inserting the models information")
                    d_doc_models = {}
                    d_doc_models["application_id"] = application_id
                    d_doc_models["created"]        = round(time.time())
                    d_doc_models["models"]         = d_models
                    model_id = dbCon.insert_document("application_models", d_doc_models)
            except Exception as e:
                logger.error("Error in applications.update_app_webscrape_async() while trying to insert models info for application with id {} and with models info as {} with error {}".format(application_id, d_doc_models, e))
                # no need to return, try capturing the rest
    #logger.info("Starting processing marketing info")
    if "marketing" in d_prod_data:
        d_marketing = d_prod_data["marketing"]
        logger.info("Now processing the marketing information: {}".format(d_marketing))
        # check for required owner fields
        if "industry" in d_marketing and "pricing_type" in d_marketing and "privacy" in d_marketing:
            d_marketing["application_id"]   = application_id
            d_marketing["created"]          = round(time.time())
            try:
                marketings = dbCon.get_documents_by_field("application_marketing", "application_id", application_id)
                if len(marketings) < 1:
                    logger.info("Now inserting the marketing information")
                    marketing_id = dbCon.insert_document("application_marketing", d_marketing)
            except Exception as e:
                logger.error("Error in applications.update_app_webscrape_async() while trying to insert marketing info for  application with id {} and with marketing info as {} with error {}".format(application_id, d_prod_data["marketing"], e))
                # no need to return, try capturing the rest
    # Call different functions to add 
    #print("arr_results:", arr_results)       
    return json_str

# add functions to add different sections
if __name__ == '__main__':
    get_application = True
    while get_application:
        application = input("Enter the application name or application id for adhoc webscraping (press just the enter key to stop): ")
        if not application or application == "" or application.lower() == "stop":
            exit()
        else:
            res = update_app_webscrape_async(application)
    
