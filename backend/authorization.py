import json
from cache import Cache
from oauth2 import OAuth2

#--- This class is responsible for all user Authorization functions on collection user_document_role. ---#
class Authorization:
    def __init__(self, app, dbCon) -> None:
        self.collectionName = "user_document_role"
        self.dbCon          = dbCon
        self.app            = app
        self.oauth2         = OAuth2()   
        return
    def add_permission(self, access_token, user_id, targetCollection, documentId, role):
        #--- Get any permissions document associated with this user_id first.                     
        #--- If a record exists, check if the targetCollection also exists on this document. 
        #--- If targetCollection exists then simply add/update the key for this document with the value of the role.
        #--- The program which is calling this method will have to first check if the user associated with the access_token can do this.
        #--- TODO we need to maintain some audit trail of these changes. 
        self.app.logger.info("Adding permissions using Authorization.add_permission for user_id {}".format(user_id))
        fieldName   = "user_id"
        fieldValue  = user_id
        try:
            user_perms = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Error accessing user_document_role info for user {} with error {}".format(user_id, e))
            return {"error": format(e) }
        self.app.logger.info("perms found for user {} are {}".format(user_id, user_perms))
        if len(user_perms) == 0:
            #-- build a permission record json for this user and add it to the collection.
            #print("attempting to insert into user_document_role")
            perms_dict = dict()
            perms_dict["user_id"]               = user_id
            perms_dict["collection_roles"]      = {targetCollection:{documentId: role}}
            try:
                self.dbCon.insert_document(self.collectionName, perms_dict)
                #print("authorization.add_permission(): inserted permission {} in collection {}".format(perms_dict, self.collectionName))
            except Exception as e:
                self.app.logger.error("Error inserting perms into user_document_role for user {} with error {}".format(user_id, e))
                return {"error": format(e) }    
            self.app.logger.info("added user perms {} to collection {} for user {}".format(perms_dict, self.collectionName, user_id))
            return True
        else:
            #-- update the perms record
            #print("attempting to update user_document_role")
            dPerms      = user_perms[0]  # result from the database is an array of dictionary
            #dPerms      = json.loads(user_perms)
            # There may already be an entry for the target collection for a different documentId, we need to append it as opposed to replace it.
            if targetCollection in  dPerms["collection_roles"]:
                dPerms["collection_roles"][targetCollection][documentId] = role
            else:
                dPerms["collection_roles"][targetCollection] = {documentId: role}
            # We need to drop the document_id from dPerms otherwise update will give an error
            if "_id" in dPerms:
                del dPerms["_id"]
            fieldName   = "user_id"
            fieldValue  = user_id
            try:
                self.dbCon.update_document_by_field(self.collectionName, fieldName, fieldValue, dPerms)
            except Exception as e:
                self.app.logger.error("Error updating perms into user_document_role for user {} with error {}".format(user_id, e))
                return {"error": format(e) } 
            #------ we also need to update the access_token for the updated perms for this user on this particular app.
            self.oauth2.update_access_token_permissions( access_token, targetCollection, documentId, role)
            return True

    def get_permissions(self, user_id):
    #--- return the user permisssion record from the collection user_document_role; It is not coming from access_token.
    #--- i.e "collection_roles" value which is like {"<collection1>": {<doc_id1}:<role1>, <doc_id2>: <role_2>}, "<collection2>": {<doc_id21}:<role21>, <doc_id22>: <role_22>}}
        self.app.logger.info("Adding permissions using Authorization.add_permission for user_id {}".format(user_id))
        fieldName   = "user_id"
        fieldValue  = user_id 

        try:
            arr_user_perms = self.dbCon.get_documents_by_field(self.collectionName, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Error accessing user_document_role info for user {} with error {}".format(user_id, e))
            return {"error": format(e) }
        
        self.app.logger.info("Retrieved perms for fieldName {} with fieldValue {} are {}".format(fieldName, fieldValue, arr_user_perms))
        # Note that the results from Database class comes in the form of an array (array of 1 if just one record)
        user_perms = dict()
        if len(arr_user_perms) > 0:
            perms = arr_user_perms[0]
            del perms["_id"]   # drop it because it's of type ObjectId and not needed.
            #print("perms sent by Authorization.get_permissions are: ", perms)
            return perms
        # get rid of the following lines
            if "collection_roles" in perms:
                #print("perms sent by Authorization.get_permissions are: ", perms["collection_roles"])
                return perms["collection_roles"]

    def get_collection_role_permissions(self, collectionName, role):
        #--- Get this from cache
        cache = Cache()
        perms_by_collection = cache.get_key_value(role)
        #print("authorization.get_collection_role_permissions: role is: {}, collectionName is: {} and perms_by_collection: {}".format(role, collectionName, perms_by_collection))
        if perms_by_collection:
            dict_perms_by_collection = json.loads(perms_by_collection)
            if collectionName in dict_perms_by_collection:
                return dict_perms_by_collection[collectionName]
            
        return False
    
