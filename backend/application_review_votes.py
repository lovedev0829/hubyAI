import os, sys
from flask import Flask, render_template, redirect, url_for, request, jsonify
from bson.objectid import ObjectId
from oauth2 import OAuth2
from authorization import Authorization 
from time import time # for timestamping
from users import Users 

class ApplicationReviewVotes:
    def __init__(self, app, request, dbCon):
        self.app        = app
        self.request    = request
        self.dbCon      = dbCon
        self.oauth2     = OAuth2()
        self.authorization  = Authorization(self.app, self.dbCon)
        self.collection = "user_comment_votes"

    def create_update_application_review_vote(self, review_id):
        #--- Ideally we should be checking for the ownership of the application when a user up/down votes a review; 
        # But for now we don't need to since the page itself is accessible to owners only.
        #-- Assume that validation of incoming app/prototype comments will happen in some sort of a controller.
        # check that a comments record with this appid does not already exist... If it dowesn't then simply add crud fields and write it.
        self.app.logger.info('Preparing the app review vote for adding it to user_comment_votes collection')
        #--- First authenticate the request with access token. See if this can be modularized. ---#
        access_token    = self.oauth2.get_access_token_from_request(self.request)

        if access_token is None:
            self.app.logger.error('No access_token  provided on review vote request')
            return jsonify({'error': 'No access_token provided'}), 400
        if not self.oauth2.validate_access_token(access_token):
            self.app.logger.error('Invalid or expired access_token.')
            return jsonify({'error': 'Invalid or expired access_token. Please login and resubmit your request.'}), 400
        data    = self.request.get_json()
        if "up_down_vote" not in data or data["up_down_vote"] not in [1, -1, 0]:
            self.app.logger.error('Invalid review vote request; up_down_vote can be 1 or -1, or 0 to unvote.')
            return jsonify({'error': 'Invalid review vote request; up_down_vote can be 1 or -1, or 0 to unvote.'}), 400
        up_down_vote    = data["up_down_vote"]
        if "review_id" == "" :
            self.app.logger.error('Invalid review vote request;  review_id needs to have a valid value.')
            return jsonify({'error': 'Invalid review vote request;  review_id needs to have a valid value.'}), 400
             
        user = self.oauth2.get_user_from_access_token(access_token)
        user_id = user["user_id"]
        # validate the review in application_reviews
        tmp_collection  = "application_reviews"
        fieldName       = "_id"
        fieldValue      = ObjectId(review_id)
        try:
            reviews    = self.dbCon.get_documents_by_field(tmp_collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Retrieval of app review failed on review id {} with error {}".format(review_id, e))
            return jsonify({"error": format(e) }), 400
        if len(reviews) < 1:
            self.app.logger.error("Invalid review id: No review found for the review id {}".format(review_id))
            return jsonify({"error": "Invalid review id: No review found for the review id {}".format(review_id)}), 400
        review     = reviews[0]
        #print("review in create_update_application_review_vote:", review)
        #review_id  = str(creview.get("_id"))
        # Now check if there's already a vote for this user's review in user_comment_votes collection
        filterDict = {"comment_id": review_id, "user_id": user_id}
        sortOrder   = ""  # No sorting needed here since we're looking for a specific record.
        try:
            application_review_votes       = self.dbCon.get_documents_by_fields(self.collection, filterDict, sortOrder)
        except Exception as e:
            self.app.logger.error("Retrieval of app user review(comment) vote failed on review id {} with error {}".format(review_id, e))
            return jsonify({"error": format(e) }), 400
        print("application_review_votes:", application_review_votes)
        data = {}
        data["comment_id"]      = review_id
        data["application_id"]  = review["application_id"]
        data["user_id"]         = user_id
        data["up_down_vote"]    = up_down_vote
        if len(application_review_votes) > 0:
            application_review_vote_id = application_review_votes[0]["_id"]
            # do an update
            data["updated"]         = round(time())
            data["last_updated_by"]  = user_id
            print("len > 0: data = ", data )
            try:
                fieldName   = "_id"
                fieldValue  = application_review_vote_id
                result    = self.dbCon.update_document_by_field(self.collection, fieldName, fieldValue,  data) 
                # successful update above gives a response of {"updated_record_count": <count>}
                print("updated the review vote and application_review_vote_id:", str(application_review_vote_id))
                result  = {"application_review_vote_id": str(application_review_vote_id), "application_review_id": review_id, "application_id": review["application_id"], "up_down_vote": up_down_vote }
                status = 201
                return jsonify(result), status
            except Exception as e:
                self.app.logger.error('Error updating the app review vote: %s', e)
                result = {'error': 'Failed to update the app review vote'}
                status = 400
        else:
            # do an insert
            data["created"]     = round(time())
            data["created_by"]  = user_id
            try:
                application_review_vote_id    = self.dbCon.insert_document(self.collection, data)
                print("Added the review vote and application_review_vote_id:", application_review_vote_id)
                result  = {"application_review_vote_id": application_review_vote_id, "application_review_id": review_id, "application_id": review["application_id"], "up_down_vote": up_down_vote }
                status = 201
                return jsonify(result), status
            except Exception as e:
                self.app.logger.error('Error inserting user review vote: %s', e)
                result = {'error': 'Failed to insert the app user review vote'}
                status = 400
        return jsonify(result), status
    
    def get_application_review_votes_by_review_id(self, review_id):  
        result  = self.get_application_review_votes_by_review_id_internal(review_id)
        return jsonify(result), 200
          
    def get_application_review_votes_by_review_id_internal(self, review_id):
        # No need to check token here because this is public  information available even without login.
        # This function returns total upvotes, total downvotes, array of user names for up_vote, and array of users for down_vote
        #print("review_id in application_review_votes:", review_id)
        #self.app.logger.info('UserCommentVotes.get_application_review_votes_by_review_id: get comment votes for comment id {} '.format(comment_id))
        fieldName   = "comment_id"
        fieldValue  = review_id
        try:
            review_votes    = self.dbCon.get_documents_by_field(self.collection, fieldName, fieldValue)
        except Exception as e:
            self.app.logger.error("Retrieval of app review failed on comment id {} with error {}".format(review_id, e))
            return jsonify({"error": format(e) }), 400
        result  = dict()
        #print("review_votes:", review_votes)
        result["up_votes"]          = 0
        result["down_votes"]        = 0
        result["net_votes"]         = 0
        result["up_vote_users"]     = []
        result["down_vote_users"]   = []
        if len(review_votes) > 0:
            user  = Users(self.app, self.request, self.dbCon)
            for vote in review_votes:
                voter_name  = user.get_user_name_by_id(vote["user_id"])
                if vote["up_down_vote"] == 1:
                    result["up_votes"]      += 1
                    result["net_votes"]     += 1
                    result["up_vote_users"].append({"user_id": vote["user_id"], "user_name": voter_name})
                elif vote["up_down_vote"] == -1:
                    result["down_votes"]    += 1
                    result["net_votes"]     -= 1
                    result["down_vote_users"].append({"user_id": vote["user_id"], "user_name": voter_name})
        return result

'''
if __name__ == '__main__':
    from database import Database
    dbCon = Database("test.log")
    ucv = UserCommentVotes("a", "b", dbCon)
    comment_id = "66889c62e8f7dfe02529e696"
    result = ucv.get_application_review_votes_by_review_id(comment_id)
    print("result:", result)
    import json
    print("json dumps:", json.dumps(result))
'''