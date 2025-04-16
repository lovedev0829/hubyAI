import os, sys
import json
from cache import Cache  # to manage tokens etc
import logging
from configparser import ConfigParser
log_file    = "/var/log/huby/oauth2.log"
log_level   = logging.INFO
# TODO: Change this program to read the access token ttl/ lease extension, log level etc to read from the config file
class OAuth2:
    #---- Methods in this class ---------
    # __init__(): retrieve client id and secret from env; instantiate Cache class(Redis)
    # validate_client_id_secret(): compare the incoming id/secret on API call against env vars.
    # generate_authorization_code(): If the login is successful, we need to generated auth code
    #                               associate it with the user_id and store it in cache.
    # create_access_token(): If the auth code receive on API call matches the one in cache,
    #                        generate the access token
    #------- end of the list of methods ----------

    def __init__(self):
        self.cache = Cache()
        logging.basicConfig(format='%(asctime)s.%(msecs)03d  %(levelname)-s %(message)s', datefmt='%Y-%m-%d %H:%M:%S %Z', filename=log_file, level=log_level, filemode='a')
        self.logger = logging.getLogger(log_file)
        #---- If cache doesn't already have client_id and client_secret set it up. Seed it now.
        if not (self.cache.get_key_value('oauth2_client_id') and self.cache.get_key_value('outh2_client_secret')):
            # retrieve them from env vars and set them in cache
            required_envs = ["OAUTH2_CLIENT_ID","OAUTH2_CLIENT_SECRET"]
            for var in required_envs:
                if var not in os.environ:
                    self.logger.error( "Missing value for environment variable {}. Exiting the application".format(var))
                    raise EnvironmentError("Missing value for environment variable {}.".format(var))
                    sys.exit()
            self.logger.info("setting the client_id and client_secret in application cache")
            self.cache.set_key_value('oauth2_client_id', os.getenv('OAUTH2_CLIENT_ID'))
            self.cache.set_key_value('oauth2_client_secret', os.getenv('OAUTH2_CLIENT_SECRET'))
        config      = ConfigParser()
        configFile  = os.getenv("WorkingDirectory") + "/huby.cfg"
        config.read(configFile) 
        self.access_token_ttl_seconds = config.get('OAuth', 'access_token_ttl_seconds')
        if self.access_token_ttl_seconds is None or self.access_token_ttl_seconds == "":
            self.access_token_ttl_seconds = 1800 #-- default to 30 min
        
        return

    # Validate the client_id and client secret supplied by the client on login request header
    def validate_client_id_secret(self, client_id, client_secret):
        #
        if client_id != self.cache.get_key_value('oauth2_client_id') or client_secret != self.cache.get_key_value('oauth2_client_secret'):
            return 1
        else:
            return 0
    
    #----- Generate the authorization_code for the logged in user and put it in cache.
    def generate_authorization_code(self, user_id): 
        authorization_code  = os.urandom(12).hex()
        #------ store both the key as well as value as json strings so they can easily be converted to dictionary later using json.loads
        key      = json.dumps({"user_id": user_id}) 
        value   = json.dumps({"authorization_code": authorization_code })
        self.cache.set_key_value(key,value)
        return authorization_code
    
    #-------- get the access token using the authorization token
    def create_access_token(self, user_id, authorization_code, dict_permissions):
        #-- Validate the authorization code; build the key like a json string
        key             = {"user_id": user_id}
        auth_code_kv    = self.cache.get_key_value(json.dumps(key))
        #print("for key {} the auth_code_kv is: {}".format(key, auth_code_kv))
        #print("type of auth_code_kv is: ", type(auth_code_kv))
        #-- if there is no record for this user_id in cache return error ---------#
        if auth_code_kv is None:
            return {"error": "No authorization_code found. Login required."}
        
        dict_auth_code  = json.loads(auth_code_kv) # need to do it to convert the string to a dict
        #print("type of dict_auth_code is: ", type(dict_auth_code))
        #print("dict_auth_code is:", dict_auth_code)
        #print("authorization code from cache: {} and authorization code supplied: {}.".format(dict_auth_code["authorization_code"], authorization_code))
        if dict_auth_code["authorization_code"] == authorization_code:
            # generate the access token, update cache, and return the token
            access_token    = os.urandom(16).hex()
            refresh_token   = os.urandom(12).hex()
            #print("codes matched and access token is: {} and refresh token: {}".format(access_token, refresh_token))
            # store access and refresh tokens separately 
            new_key1        = access_token
            new_value1      = json.dumps({"permissions": dict_permissions}) # TODO: we need to build the access control list in user class
            new_key2        = refresh_token
            new_value2      = json.dumps({"value_type": "refresh_token", "user_id": user_id})
            #self.cache.set_key_value(json.dumps({"abc": "def"}), json.dumps({"val": "value"}))
            if self.cache.set_key_value(new_key1, new_value1, 1800) > 0  and  self.cache.set_key_value(new_key2, new_value2, 6000) > 0 :
                return {"access_token": access_token, "refresh_token": refresh_token}     
            else:
                self.logger.error("Error storing the access_token.")
                return {"error": "Error storing the access_token."}
            
        else:
            return {"error": "Invalid authorization code. Login required."}

    #--- update permissions in the access token: if perms updated in the database (e.g. app submission), we need to update the cache too
    def update_access_token_permissions(self, access_token, collectionName, docId, role):
        #access_token    = self.get_access_token_from_request()
        # if an access_token exists, it will always have a user_id associated with it.
        access_token_value = self.validate_access_token(access_token)
        #print("oauth2.update_access_token_permissions: access_token_value: ", access_token_value)
        if not access_token_value:
            return json.loads('{"error": "Invalid or expired access_token."}')
        dict_access_token_value = json.loads(access_token_value)
        #print("oauth2: dict_access_token_value: ", dict_access_token_value)
        if "collection_roles" in dict_access_token_value["permissions"]:
            if collectionName in dict_access_token_value["permissions"]["collection_roles"]:
                dict_access_token_value["permissions"]["collection_roles"][collectionName][docId] = role
            else:
                dict_access_token_value["permissions"]["collection_roles"][collectionName] = {docId: role}
        else:
            dict_access_token_value["permissions"]["collection_roles"] = {collectionName: {docId: role}}
        new_token_value = json.dumps(dict_access_token_value)
        if not self.cache.set_key_value(access_token, new_token_value, 1800)   > 0 :
                self.logger.error("Error updating the access_token value.")
                return {"error": "Error updating the access_token."}
        else:
            return {"access_token": access_token, "access_token_value": access_token_value}



    def get_permissions_from_access_token(self, access_token):
    #--- Validate an access_token
        access_token_value = self.validate_access_token(access_token)
        #print("oauth2: access_token_value: ", access_token_value)
        if not access_token_value:
            return json.loads('{"error": "Invalid or expired access_token."}')
        dict_access_token_value = json.loads(access_token_value)
        #print("oauth2: dict_access_token_value: ", dict_access_token_value)
        if "permissions" in dict_access_token_value:
            return dict_access_token_value["permissions"]
            # get rid of the next 2 statements
            if "collection_roles" in dict_access_token_value["permissions"]:
                return dict_access_token_value["permissions"]["collection_roles"]
        return False  

    def get_access_token_from_request(self, request):
        headers         = request.headers
        bearer          = headers.get("Authorization")  # Bearer TokenHere
        if not bearer:
            return False
        list_bearer_access_token    = bearer.split()
        if len(list_bearer_access_token) < 2: # i.e. bearer keyword was not followed by a token
            return False
        return list_bearer_access_token[1]
    
    def validate_access_token(self, access_token):
        token_value = self.cache.get_key_value(access_token)
        #print("validate_access_token: {} ; returned value is: {}".format(access_token, token_value))
        # if token exists renew the token lease to initial default of 30 min.
        if token_value != "":
            self.cache.set_key_ttl(access_token, self.access_token_ttl_seconds)
        return token_value
        

    #--- Get the value of user_id from the refresh_token
    def get_user_id_from_refresh_token(self, refresh_token):
        #-- We cannot generate the access_token from the refresh_token here because we need user permissions which will be in user objec
        refresh_token_value  = self.cache.get_key_value(refresh_token)
        #print("refresh_token_value for refresh token {} is {}".format(refresh_token, refresh_token_value))
        if not refresh_token_value:
            #print("refresh_token_value is None")
            self.logger.error("refresh_token {} does not exist or has expired.".format(refresh_token))
            return False
        dict_refresh_token_value    = json.loads(refresh_token_value)
        #print("value of dict_refresh_token_value is {} and type is {}".format(dict_refresh_token_value, type(dict_refresh_token_value)))
        if "user_id" in dict_refresh_token_value:
            #print("user_id sent from oauth2 is : {}".format(dict_refresh_token_value["user_id"]))
            self.logger.info("user_id sent from oauth2 is : {}".format(dict_refresh_token_value["user_id"]))
            return dict_refresh_token_value["user_id"]
        #print("oauth2 about to send false")
        return False    
    
    #--- Get the value of user_id from the access_token
    def get_user_id_from_access_token(self, access_token):
        access_token_value  = self.cache.get_key_value(access_token)
        #print("access_token_value for access_token {} is {}".format(access_token, access_token_value))
        if not access_token_value:
            print("access_token_value is None")
            self.logger.error("access_token {} does not exist or has expired.".format(access_token))
            return False
        dict_access_token_value    = json.loads(access_token_value)
        #print("value of dict_access_token_value is {} and type is {}".format(dict_access_token_value, type(dict_access_token_value)))
        #print("permissions in access_token:", dict_access_token_value["permissions"])
        #print("user_id in permissions in access_token:", dict_access_token_value["permissions"]["user_id"])
        if "user_id" in dict_access_token_value["permissions"]:
            #print("user_id sent from oauth2 is : {}".format(dict_access_token_value["permissions"]["user_id"]))
            self.logger.info("user_id sent from oauth2 is : {}".format(dict_access_token_value["permissions"]["user_id"]))
            return dict_access_token_value["permissions"]["user_id"]
        #print("oauth2 about to send false")
        return False 

    #--- Get the value of user_id, user_name etc from the access_token. It returns a dictionary user with user_ie, email, first_name, and last_name 
    #--- This is more useful than getting just user_id. Above function can potentially be deprecated.
    def get_user_from_access_token(self, access_token):
        access_token_value  = self.cache.get_key_value(access_token)
        if not access_token_value:
            #print("access_token_value is None")
            self.logger.error("access_token {} does not exist or has expired.".format(access_token))
            return False
        dict_access_token_value    = json.loads(access_token_value)
        #print("value of dict_access_token_value is {} and type is {}".format(dict_access_token_value, type(dict_access_token_value)))
        #print("permissions in access_token:", dict_access_token_value["permissions"])
        #print("user_id in permissions in access_token:", dict_access_token_value["permissions"]["user_id"])
        user = {}
        if "user" in dict_access_token_value["permissions"]:
            self.logger.info("user sent from oauth2 token is : {}".format(dict_access_token_value["permissions"]["user"]))
            return dict_access_token_value["permissions"]["user"]
        #print("oauth2 about to send false user")
        return False 
    
    #--- Generate the access_token from refresh_token and user_id on the refresh_token;  
    def generate_access_token_from_refresh_token(self, user_id, refresh_token, dict_permissions):
        access_token    = os.urandom(16).hex()
        value           = json.dumps({"permissions": dict_permissions}) 
        #print("In oauth2.generate_access_token_from_refresh_token: access token is {}, perms are {} and token value is {}".format(access_token, dict_permissions, value))
        if (self.cache.set_key_value(access_token, value, 1800) > 0 ) :      
            # return the tokens and renew the lease of refresh token.
            self.cache.set_key_ttl(refresh_token, self.access_token_ttl_seconds)
            return {"access_token": access_token, "refresh_token": refresh_token}            
        else:
            self.logger.error("Error storing the access_token.")
            return {"error": "Error storing the access_token."}


    
    def get_document_permissions_using_access_token(self, access_token, collectionName, document_id):
        #--- First get the user record from the token and check for privilege
        user    = self.get_user_from_access_token(access_token )
        if "privilege" in user and user["privilege"] in ("support", "admin", "sysadmin"):
            return {"success": True, "permissions": "1111", "msg": "Huby support/admin/sysadmin user"}
        #--- Get this from cache using access_token for the given collection and document id in that collection
        self.logger.info("Oauth2.get_document_permissions_using_access_token()")
        dict_collection_doc_role = self.get_permissions_from_access_token(access_token)
        #print("Oauth2.get_document_permissions_using_access_token():  dict_collection_doc_role = {}".format(dict_collection_doc_role))
        if "error" in dict_collection_doc_role:
            return {"success": False, "permissions": "", "msg": dict_collection_doc_role["error"]}
        if collectionName in dict_collection_doc_role["collection_roles"]:
            #print("dict_collection_doc_role is: \n ", dict_collection_doc_role["collection_roles"][collectionName])
            if document_id in dict_collection_doc_role["collection_roles"][collectionName]:
                #print("\n\collection perms found\n", dict_collection_doc_role["collection_roles"])
                role = dict_collection_doc_role["collection_roles"][collectionName][document_id] # role will have values like 'owner', 'user', etc 
                #--- now let's get the crud perms for this role on this specific document (document_id).
                perms_by_collection = self.cache.get_key_value(role) # this gives permsission for this role on different collections (applications, users, etc)
                #print("Oauth2.get_document_permissions_using_access_token: role is: {}, collectionName is: {} and perms_by_collection: {}".format(role, collectionName, perms_by_collection))
                if perms_by_collection:
                    dict_perms_by_collection = json.loads(perms_by_collection)
                    if collectionName in dict_perms_by_collection:
                        # below will essentially return crud string e.g. '0100' for read in the field permissions
                        return {"success": True, "permissions": dict_perms_by_collection[collectionName], "msg": "role found"}
        return {"success": False, "permissions": "", "msg": "No access found."}
