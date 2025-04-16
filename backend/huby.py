import os, sys
from flask import Flask, render_template, redirect, url_for, request, session, json, jsonify
from flask_cors import CORS, cross_origin
from bson.json_util import dumps
from flask import send_from_directory
from datetime import datetime
import time
from pymongo import MongoClient
import urllib.parse
import logging
from database import Database
from bson.objectid import ObjectId
import bcrypt
from configparser import ConfigParser
from users import Users
from applications import Applications
from application_ownership import ApplicationOwnership
from application_runtime import ApplicationRuntime 
from application_source import ApplicationSource
from application_models import ApplicationModels
from application_marketing import ApplicationMarketing
from application_submission_reviews import ApplicationSubmissionReviews
from application_user_comments import ApplicationUserComments
from application_ratings import ApplicationRatings
from application_review_requests import ApplicationReviewRequests
from application_reviews import ApplicationReviews
from user_comment_votes import UserCommentVotes
from application_review_votes import ApplicationReviewVotes
from user_profiles import UserProfiles 
from companies import Companies
from webscrape_update import WebscrapeUpdate
from micro_updates import MicroUpdates
from cache import Cache
#------------- get the environment variables ---------------
required_envs = ["DBHOST","DBPORT", "DBNAME", "DBUSER", "DBPASS", "REDIS_HOST", "REDIS_PORT", "DOMAIN", "API_DOMAIN", "WorkingDirectory"]
for var in required_envs:
    if var not in os.environ:
        raise EnvironmentError("Missing value for environment variable {}.".format(var))
        sys.exit()
host        = os.getenv("DBHOST") 
port        = os.getenv("DBPORT")
dbname      = os.getenv("DBNAME")
dbuser      = os.getenv("DBUSER")
dbpass      = os.getenv("DBPASS")
domain      = os.getenv("DOMAIN")
api_domain  = os.getenv("API_DOMAIN")
config      = ConfigParser()
configFile  = os.getenv("WorkingDirectory") + "/huby.cfg"
print("configFile:", configFile)
config.read(configFile)
debug_mode  = config.getboolean('Default', 'debug')
from_email  = config.get('Default', 'from_email')
logFile     = config.get('Default', 'log_file')
logLevel    = config.get('Default', 'log_level')
vdb_server  = config.get('Default', 'vectordb_server')
llm_url     = config.get('LLM', 'url')
llm_key     = config.get('LLM', 'key')
llm_prompt  = config.get('LLM', 'prompt')
llm_prompt_steps  = config.get('LLM', 'prompt_steps')

if logFile      == "":
    logFile     = "/var/log/huby/huby_api.log"
if logLevel     == "":
    logLevel    = "INFO" 
if from_email   == "":
    from_email  = "support@huby.ai"
#if "LOGFILE" in os.environ:
#    logFile = os.getenv("LOGFILE")
#else:
#    logFile     = "/var/log/huby/huby_api.log"
#logLevel    = logging.INFO
#logging.basicConfig(format='%(asctime)s %(levelname)-s %(message)s', datefmt='%Y-%m-%d %H:%M:%S %Z', filename=logFile, level=logLevel, filemode='a')
# ----------- Create Flask application instance and configure it -----------
app = Flask(__name__, template_folder='templates') # Do NOT put root_path from os.getcwd() in app here o/w it gets here as "/"; template_folder is only required if you're using jinja2 templates i.e. data going from flask app into html doc in templates folder.
#------ Set centralized logging information
app.logger.setLevel(logLevel)
handler = logging.FileHandler(logFile)
handler.setFormatter(logging.Formatter('%(asctime)s.%(msecs)03d  %(levelname)-s %(message)s', datefmt='%Y-%m-%d %H:%M:%S'))
app.logger.addHandler(handler)
app.config["VECTOR_DB_SERVER"] = vdb_server
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  #For picking latest changed files, not just that got updated 12 hrs back
app.config["LLM_URL"]           = llm_url
app.config["LLM_KEY"]           = llm_key
app.config["LLM_PROMPT"]        = llm_prompt
app.config["LLM_PROMPT_STEPS"]  = llm_prompt_steps

#cors is currently broad; we need to replace origins to actual domain names that we want to enable.
CORS(app, resources={r"/api/*": {"origins": "*"}}) #CORS(app)  # Enable CORS for all routes
# Create the database connection if needed. TODO: check this after refactoring the code
dbCon   = Database(logFile)
#--- Seed the cache with the role based access on collections ------ Do we need a separate function here? Maybe later.
cache = Cache()
try:
    arr_role_perms = dbCon.get_documents_all("role_collection_permission")
    #print("role - collection - permissions received from the database are:arr_role_perms= {}".format( arr_role_perms))
    if len(arr_role_perms) > 0:
        for role_perms in arr_role_perms:
            role = role_perms["role"]
            permissions = json.dumps(role_perms["permissions"])
            cache.set_key_value(role, permissions, "NX")
            app.logger.info("Added role collection permission key values with key(role) = {} and permissions = {}".format(role, permissions))
except Exception as e:
    print("Error seeding the cache: {}".format(e))
    
 
#--------------    TEST AREA ------------------
from functools import wraps
def sanitize_input(data):
    if not "name" in data:
        return 0
    # this will use global objects e.g. request, app, dbCon; they need to be set in unit tests
    return 1

def huby_init(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        print("Came  inside custom dedcorator")
         
        users = Users(app, request, dbCon)
        kwargs = {"a": "b", "c": "d"}
        #--------- Sanitize the request object here.
        data = request.get_json()
        if not sanitize_input(data):
            return jsonify({"error": "sanitization failed <put the result from sanitization here>"}), 400
        print("api data:", data)
        #if request.method == 'GET':
            #if sanitize_input("users", data):
         #   return users.get_user(data)
        print("request args:", request.args.to_dict())
        user_id = request.args.to_dict()["id"]
        print("user id is:", user_id)
        return func(user_id, dbCon, users)

    return decorated_function
@app.route("/test/user", methods=["GET", "POST", "PUT", "DELETE"])
@huby_init
def get_user_test( user_id, dbCon, users):
    
    return users.get_user_by_id(user_id)


#------------- END of TEST AREA
#-------- Users related routes ---------------
#-------- Retrieve user records using partial/wild card values one or more user fields
'''
@app.route("/api/users", methods = ["GET"])
def get_users():
    # Don't think this function will have a lot of usage initially. 
    return dbCon.get_documents_all("users")
    return jsonify(users), 200
    return jsonify({"msg": "This method is yet to be implemented"}), 200
'''
#-------- Retrieve a user using user_id (document id) ---------------
@app.route("/api/users/<user_id>", methods=["GET"])
def get_user_by_id(user_id):
    app.logger.info("started processing of retrieving a user via user_id")
    access_token    = get_access_token_from_request(request)

    if not access_token:
        return jsonify({"error": "Invalid or no access_token on the request"}), 400
    # Permission check for operations on User object as well as user record retrieval happens in users class.
    users = Users(app, request, dbCon)
    
    return users.get_user_by_id(user_id, access_token)
#----- Validate a user provided email before password reset
@app.route("/api/users/validate_email", methods=["GET"])
def validate_user_email():
    #here we don't have access token yet.
    app.logger.info("Started validating the provided email.")
    if len(request.args.to_dict()) > 0 :
        dParsVals = request.args.to_dict()
        fieldName = list(dParsVals.keys())[0]
        fieldValue = list(dParsVals.values())[0]
        users = Users(app, request, dbCon)
        return users.validate_user_email(fieldName, fieldValue)
    else:
        return jsonify({"error": "A user field is required as a query param for this endpoint."})

#-------- Retrieve a user record using one of the user fields
@app.route("/api/users/user", methods = ["GET"])
def get_user_by_field():
    app.logger.info("started processing of retrieving a user via a query param")
    access_token    = get_access_token_from_request(request)
    if not access_token:
        return jsonify({"error": "Invalid or no access_token on the request"}), 400
    users = Users(app, request, dbCon)
    #---- get the query params and their values from request into a dictionary ---------
    #---- retrieve the first key value pair and get the results from database  ---------
    #print("request args: ", request.args.to_dict())
    if len(request.args.to_dict()) > 0 :
        dParsVals = request.args.to_dict()
        fieldName = list(dParsVals.keys())[0]
        fieldValue = list(dParsVals.values())[0]
    else:
        input   = request.get_json()
        if len(input) > 0:
            fieldName   = list(input.keys())[0]
            fieldValue  = list(input.values())[0]
        else:
            app.logger.error("No query parameter or json payload supplied on any user fields to retrieve a user record")
            return jsonify({"error": "No query parameter json payload supplied on any user fields to retrieve a user record"}), 400
    return users.get_user_by_field(fieldName, fieldValue, access_token)
 

#-------- Retrieve user records using one of the user fields
@app.route("/api/users", methods = ["GET"])
def get_users_by_field():
    app.logger.info("started processing of retrieving users via a query param")
    access_token    = get_access_token_from_request(request)
    if not access_token:
        return jsonify({"error": "Invalid or no access_token on the request"}), 400
    users = Users(app, request, dbCon)
    #---- get the query params and their values from request into a dictionary ---------
    #---- retrieve the first key value pair and get the results from database  ---------
    #print("request args: ", request.args.to_dict())
    if len(request.args.to_dict()) > 0 :
        dParsVals = request.args.to_dict()
        fieldName = list(dParsVals.keys())[0]
        fieldValue = list(dParsVals.values())[0]
    else:
        input   = request.get_json()
        if len(input) > 0:
            fieldName   = list(input.keys())[0]
            fieldValue  = list(input.values())[0]
        else:
            app.logger.error("No query parameter or json payload supplied on any user fields to retrieve a user record")
            return jsonify({"error": "No query parameter json payload supplied on any user fields to retrieve a user record"}), 400
    return users.get_users_by_field(fieldName, fieldValue, access_token)
    
#--- API to update a user's information ----------#
#--- First check that there's a valid access_token on the request header.
#--- If token not found on cache, error token expired or invalid token. Client can send refresh_token to get acccess_token.
#--- 
@app.route("/api/users/<user_id>", methods=["PUT"]) 
def update_user(user_id):
    app.logger.info("in update_user function of huby")
    access_token    = get_access_token_from_request(request)
    if not access_token:
        return jsonify({"error": "Invalid or no access_token on the request"}), 400
    
    users = Users(app, request, dbCon)
    return users.update_user(user_id, access_token)

#-------- Create a user record / signup
@app.route("/api/users/signup", methods = ["POST"])
def create_user():
    app.logger.info("started processing of creating a user via json payload")
    users = Users(app, request, dbCon)
    return users.create_user()



#--- Verify user authenticity using email verification ----#
@app.route("/api/users/verify", methods = ["GET"])
def user_verify():
    # get the query params user_id and verification
    user_id         = request.args.get("user_id")
    verification    = request.args.get("verification")
    if user_id is None or verification is None:
        app.logger.error("user verification failed")
        return jsonify({"Error": "Uer Email could not be verified due to missing user id or verification hash"}), 400
    users           = Users(app, request, dbCon)
    result          = users.verify_email(user_id, verification)
    if result[1] == 200:
        redirect_uri = domain + "/login"
        app.logger.info("email verification succeeded for user with id {}. Routed the user to url: {}".format(user_id, redirect_uri))
        return redirect(redirect_uri, code=302)
    return  result  # result json includes the redirect_uri (currently home page url that client needs to handle)

#--- Login using email and password and get the user_id, authorization_code, and status back ----#
@app.route("/api/users/login", methods = ["POST"])
def user_login():
    app.logger.info("Processing login request")
    users = Users(app, request, dbCon)
    return users.login()
#--- Change password
@app.route("/api/users/forgot_password/<email>", methods=["GET"])
def forgot_password(email):
    app.logger.info("Processing password forgot request")
    users = Users(app, request, dbCon)
    return users.forgot_password(email)

@app.route("/api/users/<user_id>/change_password", methods=["PUT"])
def change_password(user_id):
    app.logger.info("Processing password change request")
    users = Users(app, request, dbCon)
    return users.change_password(user_id)
    #----------- Save user profile picture uploaded by the user ------
@app.route("/api/users/<user_id>/savepicture", methods=['POST'])
def save_profile_picture(user_id):
    print("saving picture for user_id ", user_id)
    if user_id is None:
        app.logger.error("user_id value not sent on savepicture endpoint for saving user profile picture.")
        return jsonify({"Error": "Save user profile picture failed. user_id value not sent on savepicture endpoint for saving user profile picture."}), 400
    users  = Users(app, request, dbCon)
    return users.save_profile_picture(user_id)


#--- Endpoints/routes for user_profiles. This has detailed user info and user stats -----------$
#--- Create user_profile for a user
@app.route("/api/users/<user_id>/user_profiles", methods=["POST"])
def create_user_profile(user_id):
    if user_id is None:
        app.logger.error("user_id value not sent on savepicture endpoint for saving user profile picture.")
        return jsonify({"Error": "Save user profile picture failed. user_id value not sent on savepicture endpoint for saving user profile picture."}), 400
    user_profile  = UserProfiles(app, request, dbCon)
    return user_profile.create_user_profile(user_id)

#--- Get user_profile for a user. This route will also be called when a user hits the URL huby.ai/user_profiles/<user_profile_id>
# For now this will be a public URL and will not require access_token
@app.route("/api/users/<user_id>/user_profiles", methods=["GET"])
def get_user_profile_by_user_id(user_id):
    if user_id is None:
        app.logger.error("user_id value not sent on savepicture endpoint for saving user profile picture.")
        return jsonify({"Error": "Save user profile picture failed. user_id value not sent on savepicture endpoint for saving user profile picture."}), 400
    user_profile  = UserProfiles(app, request, dbCon)
    return user_profile.get_user_profile_by_user_id(user_id)
#--- Update user_profile for a user
@app.route("/api/users/<user_id>/user_profiles", methods=["PUT"])
def update_user_profile(user_id):
    if user_id is None:
        app.logger.error("user_id value not sent on savepicture endpoint for saving user profile picture.")
        return jsonify({"Error": "Save user profile picture failed. user_id value not sent on savepicture endpoint for saving user profile picture."}), 400
    user_profile  = UserProfiles(app, request, dbCon)
    return user_profile.update_user_profile(user_id)

#--- Following are the routes for companies ---
@app.route('/api/companies', methods=["POST"])
def create_company():
    companies  = Companies(app, request, dbCon)
    return companies.create_company()

@app.route('/api/companies/<company_id>', methods=["GET"])
def get_company_by_company_id(company_id):
    companies  = Companies(app, request, dbCon)
    return companies.get_company_by_company_id(company_id)

@app.route("/api/companies/<company_id>", methods=["PUT"])
def update_company(company_id):
    companies  = Companies(app, request, dbCon)
    return companies.update_company(company_id)

#--- Following are the routes for Applications
@app.route("/api/applications", methods=["POST"])
def create_application():
    application = Applications(app, request, dbCon)
    return application.create_application(type="H") # type P for production app, H for prototype; initially H until approved.

@app.route("/api/applications/<application_id>", methods=["GET"])
def get_application_by_id(application_id):
    application = Applications(app, request, dbCon)
    return application.get_application_by_id(application_id)

@app.route("/api/applications/user_owned", methods=["GET"]) # get applications owned by the current user
@app.route("/api/prototypes/user_owned", methods=["GET"]) # get prototypes owned by the current user
def get_applications_user_owned():
    application = Applications(app, request, dbCon)
    return application.get_applications_user_owned()

@app.route("/api/applications/<application_id>", methods=["PUT"])
@app.route("/api/prototypes/<application_id>", methods=["PUT"])
def update_application(application_id):
    application = Applications(app, request, dbCon)
    return application.update_application(application_id)

@app.route("/api/applications/<application_id>/logo", methods=["POST"])
@app.route("/api/prototypes/<application_id>/logo", methods=["POST"])
def save_application_logo(application_id):
    application = Applications(app, request, dbCon)
    return application.save_application_logo(application_id)

# Get usage instructions for an app that was retrieved from external sources/LLM
#/api/application/external?name=<name of the app that was displayed on dashboard additional search results>&search_text=<search_text entered in the search box>
@app.route("/api/application/external", methods=["GET"])
def get_llm_usage_instructions_by_app_name():
    application = Applications(app, request, dbCon)
    detailed_steps = ""
    data = request.args
    if "name" in data and data["name"] != "" and "search_text" in data and data["search_text"] != "":
        detailed_steps = application.get_llm_usage_instructions_by_app_name(data["name"], data["search_text"])
    return jsonify({"detailed_steps": detailed_steps}), 200
#----- Below are the routes for Other operations related to Applications ---------#
#---  Update Application submission status to draft/review/published ----------
@app.route("/api/applications/<application_id>/submission-status", methods=["PUT"])
@app.route("/api/prototypes/<application_id>/submission-status", methods=["PUT"])
def update_application_submission_status(application_id):
    application = Applications(app, request, dbCon)
    return application.update_application_submission_status(application_id)
#---- Following endpoints for submission status may not be needed
''' 
@app.route("/api/applications/<application_id>/submission-status/reviewed", methods=["PUT"])
@app.route("/api/prototypes/<application_id>/submission-status/reviewed", methods=["PUT"])
def update_application_submission_status_reviewed(application_id):
    application = Applications(app, request, dbCon)
    return application.update_application_submission_status(application_id, "R")

@app.route("/api/applications/<application_id>/submission-status/approved", methods=["PUT"])
@app.route("/api/prototypes/<application_id>/submission-status/approved", methods=["PUT"])
def update_application_submission_status_approved(application_id):
    application = Applications(app, request, dbCon)
    return application.update_application_submission_status(application_id, "A")
'''                                                                                                                                
#--- Application submission status ----------
@app.route("/api/applications/<application_id>/submission-status", methods=["GET"])
@app.route("/api/prototypes/<application_id>/submission-status", methods=["GET"])
def get_application_submission_status(application_id):
    application = Applications(app, request, dbCon)
    return application.get_application_submission_status(application_id)


#--- Following route expects a request like /api/search/applications?search_terms="fitness+tracking"+"fair+and+lovely"
@app.route("/api/search/applications", methods=["GET"])
def search_applications():
    application     = Applications(app, request, dbCon)

    return application.search_applications()
#--- Following route expects a request like /api/search/applications?search_terms="fitness+tracking"+"fair+and+lovely"
@app.route("/api/search/applications/uncurated", methods=["GET"])
def search_applications_uncurated():
    application     = Applications(app, request, dbCon)

    return application.search_applications_uncurated()


# Get other applications related to this search from LLM
@app.route("/api/search/llm/applications", methods=["POST"])
def search_llm_applications():
    data                    = request.get_json()
    search_text             = data["search_text"]
    exclude_applications    = data["exclude_applications"]
    result_count            = data["result_count"]
    application     = Applications(app, request, dbCon)
    return application.search_llm_applications(search_text, exclude_applications, result_count)

#-- following route is an adhoc update route to populate detailed app info using json payload
@app.route("/api/applications/<application>/webscrape", methods=["POST"])
def update_product_info(application):
    ws = WebscrapeUpdate(app, request, dbCon)
    return ws.update_product_info(application)
    

#--- Following are the routes for Prototypes/Hacks ---------#
@app.route("/api/prototypes", methods=["POST"])
def create_prototype():
    prototype = Applications(app, request, dbCon)
    return prototype.create_application(type="H")

@app.route("/api/prototypes/ownership", methods=["POST"])
@app.route("/api/applications/ownership", methods=["POST"])
def create_application_ownership():
    # TODO: Logic for validating incoming data
    application_ownership = ApplicationOwnership(app, request, dbCon)
    return application_ownership.create_application_ownership()

#--- Get prototype ownership information using application_id
@app.route("/api/applications/ownership/<application_id>", methods=["GET"])
@app.route("/api/prototypes/ownership/<application_id>", methods=["GET"])
def get_prototype_ownership_by_prototype_id(application_id):
    prototype = Applications(app, request, dbCon)
    return prototype.get_prototype_ownership_by_prototype_id(application_id)

#--- Get  ownership information using ownership_id
@app.route("/api/ownerships/<ownership_id>", methods=["GET"])
def get_ownership_by_ownership_id(ownership_id):
    #TODO change the following code to instantiate Ownership class
    ownership = ApplicationOwnership(app, request, dbCon)
    return ownership.get_ownership_by_ownership_id(ownership_id)
#--- Update application/prototype ownership 
@app.route("/api/applications/ownership/<application_id>", methods=["PUT"])
@app.route("/api/prototypes/ownership/<application_id>", methods=["PUT"])
def update_prototype_ownership(application_id):
    application_ownership = ApplicationOwnership(app, request, dbCon)
    return application_ownership.update_application_ownership(application_id)

#-------- Application/Prototype Runtime Endpoints ------------------- #
@app.route("/api/applications/runtime", methods=["POST"])
@app.route("/api/prototypes/runtime", methods=["POST"])
def create_application_runtime():
    application_runtime     = ApplicationRuntime(app, request, dbCon)
    return application_runtime.create_application_runtime()


@app.route("/api/applications/<application_id>/runtime", methods=["GET"])
@app.route("/api/prototypes/runtime/<application_id>", methods=["GET"])
def get_runtime_by_application_id(application_id):
    application_runtime     = ApplicationRuntime(app, request, dbCon)
    return application_runtime.get_runtime_by_application_id(application_id)

@app.route("/api/runtimes/<runtime_id>", methods=["GET"])
def get_runtime_by_runtime_id(runtime_id):
    #TODO change the following code to instantiate Ownership class
    application_runtime     = ApplicationRuntime(app, request, dbCon)
    return application_runtime.get_runtime_by_runtime_id(runtime_id)

@app.route("/api/applications/<application_id>/runtime", methods=["PUT"])
@app.route("/api/prototypes/<application_id>/runtime", methods=["PUT"])
def update_application_runtime(application_id):
    application_runtime     = ApplicationRuntime(app, request, dbCon)
    return application_runtime.update_application_runtime(application_id)

@app.route("/api/runtimes/<runtime_id>", methods=["PUT"])
def update_runtime_by_runtime_id(runtime_id):
    application_runtime     = ApplicationRuntime(app, request, dbCon)
    return application_runtime.update_application_runtime_by_runtime_id(runtime_id)

#-------- Application/Prototype Source Endpoints ------------------- #
@app.route("/api/applications/source", methods=["POST"])
@app.route("/api/prototypes/source", methods=["POST"])
def create_application_source():
    application_source     = ApplicationSource(app, request, dbCon)
    return application_source.create_application_source()
@app.route("/api/applications/<application_id>/source", methods=["GET"])
@app.route("/api/applications/source/<application_id>", methods=["GET"])
@app.route("/api/prototypes/source/<application_id>", methods=["GET"])
def get_source_by_application_id(application_id):
    application_source     = ApplicationSource(app, request, dbCon)
    return application_source.get_source_by_application_id(application_id)

@app.route("/api/sources/<source_id>", methods=["GET"])
def get_source_by_source_id(source_id):
    #TODO change the following code to instantiate Ownership class
    application_source     = ApplicationSource(app, request, dbCon)
    return application_source.get_source_by_source_id(source_id)

@app.route("/api/applications/source/<application_id>", methods=["PUT"])
@app.route("/api/prototypes/source/<application_id>", methods=["PUT"])
def update_application_source(application_id):
    application_source     = ApplicationSource(app, request, dbCon)
    return application_source.update_application_source(application_id)

@app.route("/api/sources/<source_id>", methods=["PUT"])
def update_source_by_source_id(source_id):
    application_source     = ApplicationSource(app, request, dbCon)
    return application_source.update_application_source_by_source_id(source_id)

#-------- Application/Prototype Models Endpoints ------------------- #
@app.route("/api/applications/models", methods=["POST"])
@app.route("/api/prototypes/models", methods=["POST"])
def create_application_models():
    application_models     = ApplicationModels(app, request, dbCon)
    return application_models.create_application_models()

@app.route("/api/applications/<application_id>/models", methods=["GET"])
@app.route("/api/applications/models/<application_id>", methods=["GET"])
@app.route("/api/prototypes/models/<application_id>", methods=["GET"])
def get_models_by_application_id(application_id):
    application_models     = ApplicationModels(app, request, dbCon)
    return application_models.get_models_by_application_id(application_id)

@app.route("/api/models/<models_id>", methods=["GET"])
def get_models_by_models_id(models_id):
    #TODO change the following code to instantiate Ownership class
    application_models     = ApplicationModels(app, request, dbCon)
    return application_models.get_models_by_models_id(models_id)

@app.route("/api/applications/models/<application_id>", methods=["PUT"])
@app.route("/api/prototypes/models/<application_id>", methods=["PUT"])
def update_application_models(application_id):
    application_models     = ApplicationModels(app, request, dbCon)
    return application_models.update_application_models(application_id)

@app.route("/api/models/<models_id>", methods=["PUT"])
def update_models_by_models_id(models_id):
    application_models     = ApplicationModels(app, request, dbCon)
    return application_models.update_application_models_by_models_id(models_id)


#-------- Application/Prototype Marketing Endpoints ------------------- #
@app.route("/api/applications/marketing", methods=["POST"])
@app.route("/api/prototypes/marketing", methods=["POST"])
def create_application_marketing():
    application_marketing     = ApplicationMarketing(app, request, dbCon)
    return application_marketing.create_application_marketing()

@app.route("/api/applications/<application_id>/marketing", methods=["GET"])
@app.route("/api/applications/marketing/<application_id>", methods=["GET"])
@app.route("/api/prototypes/marketing/<application_id>", methods=["GET"])
def get_marketing_by_application_id(application_id):
    application_marketing     = ApplicationMarketing(app, request, dbCon)
    return application_marketing.get_marketing_by_application_id(application_id)

@app.route("/api/marketing/<marketing_id>", methods=["GET"])
def get_marketing_by_marketing_id(marketing_id):
    #TODO change the following code to instantiate Ownership class
    application_marketing     = ApplicationMarketing(app, request, dbCon)
    return application_marketing.get_marketing_by_marketing_id(marketing_id)

@app.route("/api/applications/marketing/<application_id>", methods=["PUT"])
@app.route("/api/prototypes/marketing/<application_id>", methods=["PUT"])
def update_application_marketing(application_id):
    application_marketing     = ApplicationMarketing(app, request, dbCon)
    return application_marketing.update_application_marketing(application_id)

@app.route("/api/marketing/<marketing_id>", methods=["PUT"])
def update_marketing_by_marketing_id(marketing_id):
    application_marketing     = ApplicationMarketing(app, request, dbCon)
    return application_marketing.update_application_marketing_by_marketing_id(marketing_id)

# Save marketing media files - demos, primers, brochures (videos and images)
@app.route("/api/applications/<application_id>/marketing/<marketing_id>/<asset_type>/<asset_prefix>", methods=["POST"])
def save_application_marketing_asset(application_id, marketing_id, asset_type, asset_prefix ):
    application_marketing     = ApplicationMarketing(app, request, dbCon)
    return application_marketing.save_application_marketing_asset(application_id, marketing_id, asset_type, asset_prefix)
# Delete marketing media files - demos, primers, brochures (videos and images)
@app.route("/api/applications/<application_id>/marketing/<marketing_id>", methods=["DELETE"])
def delete_application_marketing_asset(application_id, marketing_id ):
    file_path     = request.args.get("file_path")
    application_marketing     = ApplicationMarketing(app, request, dbCon)
    if file_path.startswith('https://storage'):
        return application_marketing.delete_application_marketing_asset(application_id, marketing_id, file_path)
    else:
        return application_marketing.delete_application_marketing_asset_old(application_id, marketing_id, file_path)

#-------- Application Submission Reviews Endpoints ------------------- #
@app.route("/api/applications/submission_reviews", methods=["POST"])
@app.route("/api/prototypes/submission_reviews", methods=["POST"])
def create_application_submission_reviews():
    application_submission_reviews     = ApplicationSubmissionReviews(app, request, dbCon)
    return application_submission_reviews.create_application_submission_reviews()

@app.route("/api/applications/submission_reviews/<application_id>", methods=["GET"])
@app.route("/api/prototypes/submission_reviews/<application_id>", methods=["GET"])
def get_submission_reviews_by_application_id(application_id):
    application_submission_reviews     = ApplicationSubmissionReviews(app, request, dbCon)
    return application_submission_reviews.get_submission_reviews_by_application_id(application_id)

@app.route("/api/submission_reviews/<submission_review_id>", methods=["GET"])
def get_submission_reviews_by_submission_review_id(submission_review_id):
    #TODO change the following code to instantiate Ownership class
    application_submission_reviews     = ApplicationSubmissionReviews(app, request, dbCon)
    return application_submission_reviews.get_submission_reviews_by_submission_review_id(submission_review_id)

@app.route("/api/applications/submission_reviews/<application_id>", methods=["PUT"])
@app.route("/api/prototypes/submission_reviews/<application_id>", methods=["PUT"])
def update_application_submission_reviews(application_id):
    application_submission_reviews     = ApplicationSubmissionReviews(app, request, dbCon)
    return application_submission_reviews.update_application_submission_reviews(application_id)

@app.route("/api/submission_reviews/<submission_review_id>", methods=["PUT"])
def update_submission_reviews_by_submission_review_id(submission_review_id):
    application_submission_reviews     = ApplicationSubmissionReviews(app, request, dbCon)
    return application_submission_reviews.update_application_submission_reviews_by_submission_review_id(submission_review_id)


#-------- Application User Comments Endpoints ------------------- #
@app.route("/api/applications/user_comments", methods=["POST"])
@app.route("/api/prototypes/user_comments", methods=["POST"])
def create_application_user_comments():
    application_user_comments     = ApplicationUserComments(app, request, dbCon)
    return application_user_comments.create_application_user_comments()

@app.route("/api/applications/user_comments/<application_id>", methods=["GET"])
@app.route("/api/prototypes/user_comments/<application_id>", methods=["GET"])
def get_user_comments_by_application_id(application_id):
    application_user_comments     = ApplicationUserComments(app, request, dbCon)
    return application_user_comments.get_user_comments_by_application_id(application_id)

@app.route("/api/user_comments/<user_comment_id>", methods=["GET"])
def get_user_comments_by_user_comment_id(user_comment_id):
    #TODO change the following code to instantiate Ownership class
    application_user_comments     = ApplicationUserComments(app, request, dbCon)
    return application_user_comments.get_user_comments_by_user_comment_id(user_comment_id)

@app.route("/api/applications/user_comments/<application_id>", methods=["PUT"])
@app.route("/api/prototypes/user_comments/<application_id>", methods=["PUT"])
def update_application_user_comments(application_id):
    application_user_comments     = ApplicationUserComments(app, request, dbCon)
    return application_user_comments.update_application_user_comments(application_id)

@app.route("/api/user_comments/<user_comment_id>", methods=["PUT"])
def update_user_comments_by_user_comment_id(user_comment_id):
    application_user_comments     = ApplicationUserComments(app, request, dbCon)
    return application_user_comments.update_application_user_comments_by_user_comment_id(user_comment_id)
# add/update or get votes by a comment
@app.route("/api/applications/<application_id>/comments/<comment_id>/vote", methods=["POST", "PUT"])
def create_update_user_comment_vote(application_id, comment_id):
    user_comment_votes = UserCommentVotes(app, request, dbCon)
    return user_comment_votes.create_update_user_comment_vote(comment_id)

# get user votes for a user comment
@app.route("/api/applications/<application_id>/comments/<comment_id>/votes", methods=["GET"])
def get_user_comment_votes_by_comment_id(application_id, comment_id):
    user_comment_votes = UserCommentVotes(app, request, dbCon)
    return user_comment_votes.get_user_comment_votes_by_comment_id(comment_id)

#-------- Application User Ratings  Endpoints ------------------- #
@app.route("/api/applications/ratings", methods=["POST"])
@app.route("/api/prototypes/ratings", methods=["POST"])
def create_application_ratings():
    application_ratings     = ApplicationRatings(app, request, dbCon)
    return application_ratings.create_application_ratings()

@app.route("/api/applications/ratings/<application_id>", methods=["GET"])
@app.route("/api/prototypes/ratings/<application_id>", methods=["GET"])
def get_ratings_by_application_id(application_id):
    application_ratings     = ApplicationRatings(app, request, dbCon)
    return application_ratings.get_ratings_by_application_id(application_id)

@app.route("/api/ratings/<rating_id>", methods=["GET"])
def get_ratings_by_rating_id(rating_id):
    application_ratings     = ApplicationRatings(app, request, dbCon)
    resp = application_ratings.get_ratings_by_rating_id(rating_id)
    print("resp in huby:", resp)
    return resp
@app.route("/api/applications/ratings/<application_id>", methods=["PUT"])
@app.route("/api/prototypes/ratings/<application_id>", methods=["PUT"])
def update_application_ratings(application_id):
    application_ratings     = ApplicationRatings(app, request, dbCon)
    return application_ratings.update_application_ratings(application_id)

@app.route("/api/ratings/<rating_id>", methods=["PUT"])
def update_ratings_by_rating_id(rating_id):
    application_ratings     = ApplicationRatings(app, request, dbCon)
    return application_ratings.update_application_ratings_by_rating_id(rating_id)

@app.route("/api/ratings/<rating_id>/reply", methods=["PUT"])
def update_application_rating_reply(rating_id):
    application_ratings     = ApplicationRatings(app, request, dbCon)
    return application_ratings.update_application_rating_reply(rating_id)

#-------- Application Review Requests Endpoints ------------------- #
@app.route("/api/applications/review_requests", methods=["POST"])
@app.route("/api/prototypes/review_requests", methods=["POST"])
def create_application_review_request():
    application_review_request     = ApplicationReviewRequests(app, request, dbCon)
    return application_review_request.create_application_review_request()

#--- Get a list of review topics by application for promotion to users to provide reviews and ratings
@app.route("/api/applications/<application_id>/review_topics", methods=["GET"])
@app.route("/api/prototypes/<application_id>/review_topics", methods=["GET"])
def get_review_topics_by_application(application_id):
    application_review_request     = ApplicationReviewRequests(app, request, dbCon)
    return application_review_request.get_review_topics_by_application(application_id)

@app.route("/api/applications/<application_id>/review_requests", methods=["GET"])
@app.route("/api/prototypes/<application_id>/review_requests", methods=["GET"])
def get_review_requests_by_application_id(application_id):
    # This endpoint has reviewer_email as a query parameter.
    application_review_request     = ApplicationReviewRequests(app, request, dbCon)
    # get the reviewer_email from the query parameter on the endpoint and validate it before returning results.
    # if reviewer_email is not provided then return all review_requests only to the app owner and on validating the access_token
    # It's possible that an app owner may have requested feedback on different topics from different reviewers.
    dKVPairs    = request.args.to_dict()
    reviewer_email      = ""
    if "reviewer_email" in dKVPairs:
        reviewer_email  = dKVPairs["reviewer_email"]
    if reviewer_email != "":
        return application_review_request.get_review_requests_by_application_id_and_email(application_id, reviewer_email)
    else:
        return application_review_request.get_review_requests_by_application_id(application_id)

@app.route("/api/review_requests/<review_request_id>", methods=["GET"])
def get_review_request_by_review_request_id(review_request_id):
    # This endpoint has reviewer_email as a query parameter.
    application_review_request     = ApplicationReviewRequests(app, request, dbCon)
    # get the reviewer_email from the query parameter on the endpoint and validate it before returning results.
    # if reviewer_email is not provided then return all review_requests only to the app owner and on validating the access_token
    # It's possible that an app owner may have requested feedback on different topics from different reviewers.

    return application_review_request.get_review_request_by_review_request_id(review_request_id)

@app.route("/api/review_requests/<review_request_id>", methods=["PUT"])
def update_review_request_by_review_request_id(review_request_id):
    application_review_request     = ApplicationReviewRequests(app, request, dbCon)
    return application_review_request.update_review_request_by_review_request_id(review_request_id)

#--- Reviewer clicks this link in the email 
@app.route("/api/applications/<application_id>/review_request_click", methods = ["GET"])
def application_review_request_clicked(application_id):
    # This URL is clicked from an email. Upon click, get the query params and route the user to a front end page /review_response 
    dKVPairs    = request.args.to_dict()
    reviewer_email      = ""
    if "reviewer_email" in dKVPairs:
        reviewer_email  = dKVPairs["reviewer_email"]
    redirect_uri        = domain + "/review_response?application_id=" + application_id + "&reviewer_email="+ reviewer_email
    return redirect(redirect_uri, code=302)



#-------- Application Reviews Responses Endpoints (Review Requests aobve) ------------------- #
@app.route("/api/applications/<application_id>/reviews", methods=["POST"])
@app.route("/api/prototypes/<application_id>/reviews", methods=["POST"])
def create_application_reviews(application_id):
    # here reviewer_email will be part of the payload; nothing on the endpoint
    application_review     = ApplicationReviews(app, request, dbCon)
    return application_review.create_application_reviews(application_id)

@app.route("/api/applications/<application_id>/reviews/promoted", methods=["POST"])   #-- promoted review 
@app.route("/api/prototypes/<application_id>/reviews/promoted", methods=["POST"]) 
def create_application_review_promoted(application_id):
    application_review     = ApplicationReviews(app, request, dbCon)
    return application_review.create_application_review_promoted(application_id)


@app.route("/api/applications/<application_id>/reviews/<review_id>", methods=["GET"])
@app.route("/api/prototypes/<application_id>/reviews/<review_id>", methods=["GET"])
def get_application_review_by_review_id(application_id, review_id):
    # here reviewer_email will be part of the payload; nothing on the endpoint
    application_review     = ApplicationReviews(app, request, dbCon)
    return application_review.get_review_by_reveiew_id(application_id, review_id)

@app.route("/api/applications/<application_id>/reviews", methods=["GET"])
@app.route("/api/prototypes/<application_id>/reviews", methods=["GET"])
def get_reviews_by_application_id(application_id):
    application_reviews     = ApplicationReviews(app, request, dbCon)
    return application_reviews.get_reviews_by_application_id(application_id)

       #-- votes of reviews by app owners/developers
@app.route("/api/applications/<application_id>/reviews/<review_id>/vote", methods=["POST", "PUT"])
def create_update_application_review_vote(application_id, review_id):
    application_review_votes = ApplicationReviewVotes(app, request, dbCon)
    return application_review_votes.create_update_application_review_vote(review_id)

@app.route("/api/applications/<application_id>/reviews/<review_id>/vote", methods=["GET"])
def get_user_application_votes_by_review_id(application_id, review_id):
    application_review_votes = ApplicationReviewVotes(app, request, dbCon)
    return application_review_votes.get_application_review_votes_by_review_id(review_id)

# Following routes are to support micro updates
@app.route("/api/create_document", methods=["POST"])
def create_document():
    micro_upd   = MicroUpdates(app, request, dbCon)
    return micro_upd.create_document()

@app.route("/api/update_document", methods=["PUT"])
def update_document():
    micro_upd   = MicroUpdates(app, request, dbCon)
    return micro_upd.update_document()    

#--- API to send the user_id, authorization_code, and get the access token back ----#
@app.route("/api/auth/token", methods = ["POST"])
def get_user_access_token():
    app.logger.info("Processing user access token request")
    users = Users(app, request, dbCon)
    return users.create_access_token()


#--- API to get a new access_token using the refresh_token
@app.route("/api/auth/renew_token", methods = ["POST"])
def gen_access_token_from_refresh_token():
    app.logger.info("generating a new access_token from a refresh_token")
    #print("request:". format(request))
    data   = request.get_json()
    #print("data is: ", data)
    if "refresh_token" not in data:
        app.logger.error("refresh_token not found. It's required to generate a new access_token.")
        return jsonify({"error": "refresh_token not found. It's required to generate a new access_token."}), 400
    refresh_token = data["refresh_token"]
    users = Users(app, request, dbCon)
    return users.generate_access_token_from_refresh_token(refresh_token)  



# following code doesn't seem to be working
from werkzeug.exceptions import BadRequest, NotFound #-- TODO check why this is error handling is not working.
@app.errorhandler(BadRequest)
def handle_bad_request(e):
    #print("came in handle bad request")
    return 'bad request!', 400

@app.errorhandler(NotFound)
def handle_notfound_request(e):
    #print("came in handle not found")
    return 'Invalid URL!', 404

@app.errorhandler(404)
def server_error(error):
    app.logger.exception('Invalid URL. {}'.format(request))
    return 'Invalid URL.', 404

@app.errorhandler(500)
def server_error(error):
    app.logger.exception('An exception occurred during a request.')
    return 'Internal Server Error', 500
#----------- Below are General Purpose Functions ------------#
#---------- Retrieve access token from the header ----
def get_access_token_from_request(request):
    headers         = request.headers
    bearer          = headers.get("Authorization")  # Bearer TokenHere
    if not bearer:
        return False
    list_bearer_access_token    = bearer.split()
    if len(list_bearer_access_token) < 2: # i.e. bearer keyword was not followed by a token
        return False
    return list_bearer_access_token[1]
#------- Below are temporary endpoints -----------
@app.route("/api/oauth/token_ttl", methods=["GET"])
def get_access_token_ttl():
    print("request came in")
    data = request.args
    print("data:", data)
    if "access_token" in data and data["access_token"] != "":
        cache = Cache()
        ttl = cache.get_key_ttl(data["access_token"])
        return jsonify({"access_token_ttl": ttl}),200
    else:
        return jsonify({"error": "Request either had the query parameter access_token missing or its value was not set."}),400
#------ Below are old/test methods and must be dropped once refactoring of the code is complete.
@app.route("/api/log", methods = ["GET"])
def logTest():
    app.logger.info('This is an INFO message')
    app.logger.debug('This is a DEBUG message')
    app.logger.warning('This is a WARNING message')
    app.logger.error('This is an ERROR message')
    app.logger.critical('This is a CRITICAL message')
    return jsonify({"msg": "Log writing completed successfully"}), 201


def getApplications():
    client = MongoClient(f'mongodb://{dbuser}:{urllib.parse.quote_plus(dbpass)}@{host}:{port}/{dbname}')
    db =client[dbname]
    collectionName = "applications"
    collection = db[collectionName]
    cursor     = collection.find({})
    #Mongo returns BSON data that we need to convert first using json_util.dumps and then convert it to json using json.loads.
    return list(cursor) # returns a list of dictionaries
    #return json.loads(dumps(cursor)) # This dumps fro bson_json_util converts the array of dict into a json
    #return list(cursor) # use the list conversion for jinja template but dumps (for json) if returning API response 
#------ Following root / route will never be executed given that nginx file /etc/nginx/sites-available/default has root going to dist
@app.route("/")
def index():
    data = dumps(getApplications())
    #send data to javascript via jinja templates with json serialization
    #put the javascript code: appsData =  {{data|tojson}}; in a script tag in html so javascript can use this data set on the backend. 
    return render_template("index.html", data=dumps(data))


@app.route("/api/localtime")
def localtime():
    result = {"date": datetime.now().strftime("%d/%m/%y"), "time": datetime.now().strftime("%H:%M:%S")}
    response = app.response_class(
        response = json.dumps(result),
        status=200,
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
    #return jsonify(date=datetime.now().strftime("%d/%m/%y"), time=datetime.now().strftime("%H:%M:%S"))

@app.route("/api/applications", methods=['GET'])
def get_curated_applications_with_skip_limit():
    '''
    print("In get_curated_apps_with_skip_limit()")
    print("skip:", request.args.get("skip"))
    print("limit:", request.args.get("limit"))
    applications  = Applications(app, request, dbCon)
    apps =[]
    apps.append({"application_id": "123", "application": "App 123"})
    apps.append({"application_id": "234", "application": "App 234"})
    apps.append({"application_id": "367", "application": "App 367"})
    apps.append({"application_id": "477", "application": "App 467"})
    apps.append({"application_id": "577", "application": "App 567"})
    apps.append({"application_id": "677", "application": "App 667"})
    return jsonify(apps),200
    '''
    applications = Applications(app, request, dbCon)
    return applications.get_curated_applications_with_skip_limit()
    response = app.response_class(
        dumps(applications),
        status=200,
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/api/users", methods=['GET'])
def usersAPIGet():
    # we do not want to allow any open ended query
    return jsonify({"error": "Operation not allowed"}), 400
    collectionName = "users"
    users = dbCon.get_documents_all(collectionName)
    response = app.response_class(
        dumps(users),
        status=200,
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/api/old/users", methods=['POST', 'OPTIONS'])
def createUser():
    # we do not want to allow any open insert
    return jsonify({"error": "Operation not allowed"}), 400
    #print("request received in /api/user - revised: ", request)
    if request.method == 'OPTIONS':
        # Handle preflight request
        result = {'message': 'Preflight request successful'}
        response = jsonify(result)
        return response
    document = request.get_json()
    app.logger.info("request received in /api/user")
    collectionName = "users"
    UPLOAD_FOLDER = "static/images/users"
    ALLOWED_EXTENSIONS = set([ 'png', 'jpg', 'jpeg', 'gif'])
    data = request.json
    password = document["password"]
    # Adding the salt to password
    salt = bcrypt.gensalt()
    document["password"] = bcrypt.hashpw(password.encode('utf-8'), salt)
    try:
        documentId = dbCon.insert_document(collectionName, document)
        if documentId is None:
            result = {"Error": "User creation failed. Check for the input."}
            status = 400
        else: 
            result = {"document_id": documentId}
            status = 201
    except Exception as e:
        app.logger.error('Error inserting users: %s', e)
        response = {'error': 'Failed to insert the user'}
        status = 400
                
    response = jsonify(result)
    return response, status


@app.route("/api/old/users", methods=['POST'])
def usersAPIPost():
     # we do not want to allow any open insert
    return jsonify({"error": "Operation not allowed"}), 400
    collectionName = "users"
    UPLOAD_FOLDER = "static/images/users"
    ALLOWED_EXTENSIONS = set([ 'png', 'jpg', 'jpeg', 'gif'])
    data = request.json
    if isinstance(data, list):
        app.logger.debug('Received POST request to insert many records: {}'.format(data))
        try:
            response = dbCon.insert_documents(collectionName, data)
            status = 201
        except Exception as e:
            app.logger.error('Error inserting users: %s', e)
            response = {'error': 'Failed to insert users'} 
            status = 500
    else:
        document = request.json
        if document is None:
            response = {'error': 'No data provided'}
            status = 400
        else:
            #--- TODO below logic for optional display picture needs to be improved - move to a function
            # --- Additionally the URL for display image in the user document needs to be updated only after successful save
            if 'file' in request.files:
                file = request.files['file']
                extension = file.filename.rsplit('.', 1)[1].lower()
                filename    = document["email"] + '.' + extension
                if file and extension in ALLOWED_EXTENSIONS:
                    try:
                        file.save(os.path.join(UPLOAD_FOLDER, filename))
                        response["filesaved"] = "success"
                        document["user_icon_url"] = UPLOAD_FOLDER + "/" + filename
                    except Exception as e:
                        response["filesaved"] = "failed"
            #--------- hash the password after validating it for length and regex for spl chars in password
            password = document["password"]
            # Adding the salt to password
            salt = bcrypt.gensalt()
            document["password"] = bcrypt.hashpw(password.encode('utf-8'), salt)
            try:
                documentId = dbCon.insert_document(collectionName, document)
                if documentId is None:
                    response = {"Error": "User creation failed. Check for the input."}
                    status = 400
                else: 
                    response = {"document_id": documentId}
                    status = 201
            except Exception as e:
                app.logger.error('Error inserting users: %s', e)
                response = {'error': 'Failed to insert the user'}
                status = 400
                
        response = app.response_class(
                response = json.dumps(response),
                status = status,
                mimetype = 'application/json'
            )
        response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/api/old/users", methods=['PUT'])
def usersAPIPut():
    #------ process update request considering that the user id (documentId) is in the json payload itself (no query param)
    collectionName = "users"
    data = request.get_json()
    try:
        # Extract and convert objectid from the request data
        user_id_str = data.get("_id", {}).get("$oid")  # Access the embedded objectid
        if not user_id_str:
            return jsonify({"error": "Missing _id in request data"}), 400
        user_id = ObjectId(user_id_str)

        data["updated"] = datetime.utcnow()
        # remove _id key from data in case it's there
        if data["_id"]:
            del data["_id"]
        app.logger.info('user_id_str is: %s', user_id_str)
        app.logger.info('user_id is: %s', user_id)
        update = {"$set": data}  # Update all fields with provided data
        result = dbCon.update_document_by_field(collectionName, "_id", user_id, data)
        #return jsonify(result), 200
        response = app.response_class(
                response = json.dumps(result),
                status = 200,
                mimetype = 'application/json'
            )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        response = {"error": str(e)}
        return jsonify(response), 400

#--------- Login no longer used -------------------
@app.route("/api/old/user/login", methods=['POST'])
def userLogin():
    #------ process update request considering that the user id (documentId) is in the json payload itself (no query param)
    collectionName = "users"
    data = request.get_json()
    if not data["email"]:
        response = {"error": "Email address is required for login"}
        return jsonify(response), 400
    elif not data["password"]:
        response = {"error": "Password is required for login"}
        return jsonify(response), 400
    try:
        result = dbCon.get_documents_by_field(collectionName, "email", data["email"])
        #print("now print length")
        #print("length of result =", len(result))

        if len(result) < 1:
            response = {"error": "No user for this email address"}
            return jsonify(response), 400
        #print("result:", result[0])
        # in case there are more than one user records for this email, we will consider the first.
        if bcrypt.checkpw(data["password"].encode("utf-8"), result[0]["password"]):

            #------ TODO --------generate an access token 
            fResult = {"status": "success", "user_id": str(result[0]["_id"]), "access_token": "0abex5675d97xly", "token_ttl": 900, "refresh_token": "dcadtfkcmn123"}
            response = app.response_class(
                response = json.dumps(fResult),
                status = 200,
                mimetype = 'application/json'
            )
            return response

            #--- TODO: Write this token to cache for validating each request.
        else:
            response = {"error": "Invalid password. Login failed!"}
            return jsonify(response), 400
    except Exception as e:
        response = {"error": str(e)}
        return jsonify(response), 400


@app.route("/applications", methods=['GET'])
def applications():
    collectionName = "applications"
    client = MongoClient(f'mongodb://{dbuser}:{urllib.parse.quote_plus(dbpass)}@{host}:{port}/{dbname}')
    db =client[dbname]
    collection = db[collectionName]
    cursor     = collection.find({})
    # convert the cursor to list of dictionaries

    response = app.response_class(
        response = dumps(cursor),
        status=200,
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/images/<filename>")
def send_image(filename):
  return send_from_directory("images", filename)

@app.route("/css/<filename>")
def send_css(filename):
  return send_from_directory("css", filename)

@app.route("/js/<filename>")
def send_js(filename):
  return send_from_directory("js", filename)

#----------- Supporting functions --------------




if __name__ == "__main__":
    app.run(host='0.0.0.0')
   # app.run(debug=True)
