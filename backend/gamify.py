import os, sys
import logging
from configparser import ConfigParser
from database import Database
from time import time
from bson.objectid import ObjectId
class Gamification:
    def __init__(self, logFile = ""):
        config      = ConfigParser()
        configFile  = os.getenv("WorkingDirectory") + "/huby.cfg"
        config.read(configFile)
        debug_mode  = config.getboolean('Default', 'debug')
        from_email  = config.get('Default', 'from_email')
        logFile     = config.get('Default', 'log_file')
        logLevel    = config.get('Default', 'log_level')

        if logFile      == "":
            logFile     = "/var/log/huby/huby_api.log"
        if logLevel     == "":
            logLevel    = "INFO" 
        if from_email   == "":
            from_email  = "support@huby.ai"
        logging.basicConfig(format='%(asctime)s %(levelname)-s %(message)s', datefmt='%Y-%m-%d %H:%M:%S %Z', filename=logFile, level=logLevel, filemode='a')
        self.logger = logging.getLogger(logFile)
        self.dbCon = Database(logFile)
        return
    
    def update_user_scores(self):
        # for each user calculate the score; For now, for each user, and start to finish as opposed to incremental;
        # Where do we start - for each user, then every user_comment, then user_comment_votes; 
        # maybe start with each user_comment_vote => comment id => user_comment (user_id). Let's start with users
        user_collection     = "users"
        try:
            users = self.dbCon.get_documents_all(user_collection)
        except Exception as e:
            self.logger.error("failed to read users from the users collection with error {}".format(e))
            return 
        #print("users:", users)
        for user in users:
            #print("user is: ", user["first_name"] + " " + user["last_name"])
            all_comment_votes = 0 # total votes across all comments
            user_id = ""
            if "_id" in user and user["_id"] != "":
                user_id = str(user["_id"])
                comments = self.get_comments_by_user_id( user_id)
                for comment in comments:
                    comment_votes       = 0 # total comment specific votes
                    comment_id          = str(comment["_id"])
                    votes  = self.get_votes_by_comment_id(comment_id) 
                    for vote in votes:                  
                        if "up_down_vote" in vote:
                            comment_votes       += int(vote["up_down_vote"]) 
                            all_comment_votes   += int(vote["up_down_vote"])
                            #print("up_down_vote true and up_down_vote = {}".format(vote["up_down_vote"]))
                        #print("user {}, comment {} comment_vote {} and user votes {}".format(user_id, comment_id, comment_votes, all_comment_votes ))
                #   update user comment votes in user_profile - if user exists update the record o/w insert one.
                reviews                         = self.get_reviews_by_user_id(user_id)
                num_of_reviews                  = len(reviews)
                number_of_prototype_reviews     = 0
                all_review_votes    = 0
                if num_of_reviews > 0:
                    #print("reviews found:", reviews)
                    #print("user is: ", user["first_name"] + " " + user["last_name"])
                for review in reviews:
                    review_votes    = 0
                    review_id       = str(review["_id"])
                    #check if it's a prototype and if it is then increment the counter for # of prototypes
                    application = self.get_application_by_application_id(review["application_id"])
                    if "type" in application and application["type"] != "P":
                        number_of_prototype_reviews += 1
                    votes = self.get_votes_by_comment_id(review_id)  # This is fine since votes are for comments, developer votes, 
                    for vote in votes:                  
                        if "up_down_vote" in vote:
                            review_votes        += int(vote["up_down_vote"]) 
                            all_review_votes    += int(vote["up_down_vote"])
                            #print("up_down_vote true and up_down_vote = {}".format(vote["up_down_vote"]))
                        #print("user {}, review {} review_vote {} and total review votes {}".format(user_id, review_id, review_votes, all_review_votes ))
                # check the number of different ratings this user has given
                number_of_app_ratings                   = 0
                number_of_proto_impact_ratings          = 0
                number_of_proto_practicality_ratings    = 0
                number_of_app_practicality_ratings      = 0
                number_of_app_performance_ratings       = 0
                number_of_app_ux_ratings                = 0
                number_of_app_ecosystem_ratings         = 0
                app_ratings = self.get_app_ratings_by_user_id(user_id)
                number_of_app_ratings                   = len(app_ratings)
                #print("number of app ratings for user {} are: {}".format(user_id, number_of_app_ratings))
                for app_rating in app_ratings:
                    if "proto_impact_rating" in app_rating and app_rating["proto_impact_rating"] != "":
                        number_of_proto_impact_ratings      += 1
                    if "proto_practicality_rating" in app_rating and app_rating["proto_practicality_rating"] != "":
                        number_of_proto_practicality_ratings      += 1 
                    if "app_practicality_rating" in app_rating and app_rating["app_practicality_rating"] != "":
                        number_of_app_practicality_ratings      += 1 
                    if "app_performance_rating" in app_rating and app_rating["app_performance_rating"] != "":
                        number_of_app_performance_ratings      += 1 
                    if "app_ux_rating" in app_rating and app_rating["app_ux_rating"] != "":
                        number_of_app_ux_ratings      += 1 
                    if "app_ecosystem_rating" in app_rating and app_rating["app_ecosystem_rating"] != "":
                        number_of_app_ecosystem_ratings      += 1  
                
                fieldName3  = "user_id"
                fieldValue3 = user_id
                profile_collection  = "user_profiles"
                try:
                    profiles   =   self.dbCon.get_documents_by_field(profile_collection, fieldName3, fieldValue3) 
                except Exception as e:
                    self.logger.error("failed to retrieve user_profile for user {} user_profiles collection with error {}".format(user_id, e))
                    return
                #print("profiles for user {} is {}".format(user_id, profiles))
                if len(profiles) > 0:
                    profile     = profiles[0]
                    profile["number_of_comments"]                   = len(comments)
                    profile["comment_votes"]                        = all_comment_votes
                    profile["number_of_reviews"]                    = num_of_reviews
                    profile["review_votes"]                         = all_review_votes
                    profile["number_of_prototype_reviews"]          = number_of_prototype_reviews
                    profile["number_of_app_ratings"]                = number_of_app_ratings
                    profile["number_of_proto_impact_ratings"]       = number_of_proto_impact_ratings
                    profile["number_of_proto_practicality_ratings"] = number_of_proto_practicality_ratings
                    profile["number_of_app_practicality_ratings"]   = number_of_app_practicality_ratings
                    profile["number_of_app_performance_ratings"]    = number_of_app_performance_ratings
                    profile["number_of_app_ux_ratings"]             = number_of_app_ux_ratings
                    profile["number_of_app_ecosystem_ratings"]      = number_of_app_ecosystem_ratings

                    profile["last_updated"]                 = round(time())
                    try:
                        profile_id = self.dbCon.update_document_by_field(profile_collection, fieldName3, fieldValue3, profile)
                    except Exception as e:
                        self.logger.error("failed to update the user_profiles for user {} with error {}".format(user_id, e))
                        return
                else:
                    #create a new record
                    profile = {}
                    profile["user_id"]                              = user_id
                    profile["number_of_comments"]                   = len(comments)
                    profile["comment_votes"]                        = all_comment_votes
                    profile["number_of_reviews"]                    = num_of_reviews
                    profile["review_votes"]                         = all_review_votes
                    profile["number_of_prototype_reviews"]          = all_review_votes
                    profile["number_of_app_ratings"]                = number_of_app_ratings
                    profile["number_of_proto_impact_ratings"]       = number_of_proto_impact_ratings
                    profile["number_of_proto_practicality_ratings"] = number_of_proto_practicality_ratings
                    profile["number_of_app_practicality_ratings"]   = number_of_app_practicality_ratings
                    profile["number_of_app_performance_ratings"]    = number_of_app_performance_ratings
                    profile["number_of_app_ux_ratings"]             = number_of_app_ux_ratings
                    profile["number_of_app_ecosystem_ratings"]      = number_of_app_ecosystem_ratings
                    profile["created"]              = round(time())
                    try:
                        profile_id      = self.dbCon.insert_document(profile_collection, profile)
                    except Exception as e:
                        self.logger.error("failed to create the user_profile record for user {} with error {}".format(user_id, e))
                        return        
        # TODO: 
        return

    def update_comment_scores(self):
        # for each user calculate the score; For now, for each user, and start to finish as opposed to incremental;
        # Where do we start - for each user, then every user_comment, then user_comment_votes; 
        # maybe start with each user_comment_vote => comment id => user_comment (user_id). Let's start with users
        user_collection     = "users"
        try:
            users = self.dbCon.get_documents_all(user_collection)
        except Exception as e:
            self.logger.error("failed to read users from the users collection with error {}".format(e))
            return 
        #print("users:", users)
        for user in users:
            #print("user is: ", user["first_name"] + " " + user["last_name"])
            all_comment_votes = 0 # total votes across all comments
            user_id = ""
            if "_id" in user and user["_id"] != "":
                user_id = str(user["_id"])
                comments = self.get_comments_by_user_id( user_id)
                for comment in comments:
                    comment_votes       = 0 # total comment specific votes
                    comment_id          = str(comment["_id"])
                    votes  = self.get_votes_by_comment_id(comment_id) 
                    for vote in votes:                  
                        if "up_down_vote" in vote:
                            comment_votes       += int(vote["up_down_vote"]) 
                            all_comment_votes   += int(vote["up_down_vote"])
                            #print("up_down_vote true and up_down_vote = {}".format(vote["up_down_vote"]))
                        #print("user {}, comment {} comment_vote {} and user votes {}".format(user_id, comment_id, comment_votes, all_comment_votes ))
                #   update user comment votes in user_profile - if user exists update the record o/w insert one.
               
                fieldName3  = "user_id"
                fieldValue3 = user_id
                profile_collection  = "user_profiles"
                try:
                    profiles   =   self.dbCon.get_documents_by_field(profile_collection, fieldName3, fieldValue3) 
                except Exception as e:
                    self.logger.error("failed to retrieve user_profile for user {} user_profiles collection with error {}".format(user_id, e))
                    return
                #print("profiles for user {} is {}".format(user_id, profiles))
                if len(profiles) > 0:
                    profile     = profiles[0]
                    profile["number_of_comments"]   = len(comments)
                    profile["comment_votes"]        = all_comment_votes
                    profile["last_updated"]         = round(time())
                    try:
                        profile_id = self.dbCon.update_document_by_field(profile_collection, fieldName3, fieldValue3, profile)
                    except Exception as e:
                        self.logger.error("failed to update the user_profiles for user {} with error {}".format(user_id, e))
                        return
                else:
                    #create a new record
                    profile = {}
                    profile["user_id"]              = user_id
                    profile["number_of_comments"]   = len(comments)
                    profile["comment_votes"]        = all_comment_votes
                    profile["created"]              = round(time())
                    try:
                        profile_id      = self.dbCon.insert_document(profile_collection, profile)
                    except Exception as e:
                        self.logger.error("failed to create the user_profile record for user {} with error {}".format(user_id, e))
                        return        
        # TODO: 
        return
 

    def update_review_scores(self):
        # for each user calculate the score; For now, for each user, and start to finish as opposed to incremental;
        # Where do we start - for each user, then every user_comment, then user_comment_votes; 
        # maybe start with each user_comment_vote => comment id => user_comment (user_id). Let's start with users
        user_collection     = "users"
        try:
            users = self.dbCon.get_documents_all(user_collection)
        except Exception as e:
            self.logger.error("failed to read users from the users collection with error {}".format(e))
            return 
        #print("users:", users)
        for user in users:
            user_id = ""
            if "_id" in user and user["_id"] != "":
                user_id = str(user["_id"])
                reviews                         = self.get_reviews_by_user_id(user_id)
                number_of_reviews               = len(reviews)
                number_of_prototype_reviews     = 0
                all_review_votes    = 0
                for review in reviews:
                    review_votes    = 0
                    review_id       = str(review["_id"])
                    #check if it's a prototype and if it is then increment the counter for # of prototypes
                    application = self.get_application_by_application_id(review["application_id"])
                    if "type" in application and application["type"] != "P":
                        print("Prototype found and the id is ", review["application_id"])
                        number_of_prototype_reviews += 1
                    votes = self.get_votes_by_comment_id(review_id)  # This is fine since votes are for comments, developer votes, 
                    for vote in votes:                  
                        if "up_down_vote" in vote:
                            review_votes        += int(vote["up_down_vote"]) 
                            all_review_votes    += int(vote["up_down_vote"])
                            print("up_down_vote true and up_down_vote = {}".format(vote["up_down_vote"]))
                        print("user {}, review {} review_vote {} and total review votes {}".format(user_id, review_id, review_votes, all_review_votes ))
                
                fieldName3  = "user_id"
                fieldValue3 = user_id
                profile_collection  = "user_profiles"
                try:
                    profiles   =   self.dbCon.get_documents_by_field(profile_collection, fieldName3, fieldValue3) 
                except Exception as e:
                    self.logger.error("failed to retrieve user_profile for user {} user_profiles collection with error {}".format(user_id, e))
                    return
                #print("profiles for user {} is {}".format(user_id, profiles))
                if len(profiles) > 0:
                    profile     = profiles[0]
                    profile["number_of_reviews"]                    = number_of_reviews
                    profile["review_votes"]                         = all_review_votes
                    profile["last_updated"]                 = round(time())
                    try:
                        profile_id = self.dbCon.update_document_by_field(profile_collection, fieldName3, fieldValue3, profile)
                    except Exception as e:
                        self.logger.error("failed to update the user_profiles for user {} with error {}".format(user_id, e))
                        return
                else:
                    #create a new record
                    profile = {}
                    profile["user_id"]                      = user_id
                    profile["number_of_reviews"]            = number_of_reviews
                    profile["review_votes"]                 = all_review_votes
                    profile["number_of_prototype_reviews"]  = all_review_votes
                    profile["created"]                      = round(time())
                    try:
                        profile_id      = self.dbCon.insert_document(profile_collection, profile)
                    except Exception as e:
                        self.logger.error("failed to create the user_profile record for user {} with error {}".format(user_id, e))
                        return        
        # TODO: 
        return
    
    def update_rating_scores(self):
        # for each user calculate the score; For now, for each user, and start to finish as opposed to incremental;
        # Where do we start - for each user, then every user_comment, then user_comment_votes; 
        # maybe start with each user_comment_vote => comment id => user_comment (user_id). Let's start with users
        user_collection     = "users"
        try:
            users = self.dbCon.get_documents_all(user_collection)
        except Exception as e:
            self.logger.error("failed to read users from the users collection with error {}".format(e))
            return 
        #print("users:", users)
        for user in users:
            user_id = ""
            if "_id" in user and user["_id"] != "":
                user_id = str(user["_id"])
                number_of_proto_impact_ratings          = 0
                number_of_proto_practicality_ratings    = 0
                number_of_app_practicality_ratings      = 0
                number_of_app_performance_ratings       = 0
                number_of_app_ux_ratings                = 0
                number_of_app_ecosystem_ratings         = 0
                number_of_app_ratings                   = 0
                app_ratings = self.get_app_ratings_by_user_id(user_id)
                number_of_app_ratings                   = len(app_ratings)
                print("app ratings for user {} are: {}".format(user_id, app_ratings))
                for app_rating in app_ratings:
                    if "proto_impact_rating" in app_rating and app_rating["proto_impact_rating"] != "":
                        number_of_proto_impact_ratings      += 1
                    if "proto_practicality_rating" in app_rating and app_rating["proto_practicality_rating"] != "":
                        number_of_proto_practicality_ratings      += 1 
                    if "app_practicality_rating" in app_rating and app_rating["app_practicality_rating"] != "":
                        number_of_app_practicality_ratings      += 1 
                    if "app_performance_rating" in app_rating and app_rating["app_performance_rating"] != "":
                        number_of_app_performance_ratings      += 1 
                    if "app_ux_rating" in app_rating and app_rating["app_ux_rating"] != "":
                        number_of_app_ux_ratings      += 1 
                    if "app_ecosystem_rating" in app_rating and app_rating["app_ecosystem_rating"] != "":
                        number_of_app_ecosystem_ratings      += 1  
                
                fieldName3  = "user_id"
                fieldValue3 = user_id
                profile_collection  = "user_profiles"
                try:
                    profiles   =   self.dbCon.get_documents_by_field(profile_collection, fieldName3, fieldValue3) 
                except Exception as e:
                    self.logger.error("failed to retrieve user_profile for user {} user_profiles collection with error {}".format(user_id, e))
                    return
                #print("profiles for user {} is {}".format(user_id, profiles))
                if len(profiles) > 0:
                    profile     = profiles[0]
                    profile["number_of_app_ratings"]                = number_of_app_ratings   
                    profile["number_of_proto_impact_ratings"]       = number_of_proto_impact_ratings
                    profile["number_of_proto_practicality_ratings"] = number_of_proto_practicality_ratings
                    profile["number_of_app_practicality_ratings"]   = number_of_app_practicality_ratings
                    profile["number_of_app_performance_ratings"]    = number_of_app_performance_ratings
                    profile["number_of_app_ux_ratings"]             = number_of_app_ux_ratings
                    profile["number_of_app_ecosystem_ratings"]      = number_of_app_ecosystem_ratings
                    profile["last_updated"]                         = round(time())
                    try:
                        profile_id = self.dbCon.update_document_by_field(profile_collection, fieldName3, fieldValue3, profile)
                    except Exception as e:
                        self.logger.error("failed to update the user_profiles for user {} with error {}".format(user_id, e))
                        return
                else:
                    #create a new record
                    profile = {}
                    profile["user_id"]                              = user_id
                    profile["number_of_app_ratings"]                = number_of_app_ratings
                    profile["number_of_proto_impact_ratings"]       = number_of_proto_impact_ratings
                    profile["number_of_proto_practicality_ratings"] = number_of_proto_practicality_ratings
                    profile["number_of_app_practicality_ratings"]   = number_of_app_practicality_ratings
                    profile["number_of_app_performance_ratings"]    = number_of_app_performance_ratings
                    profile["number_of_app_ux_ratings"]             = number_of_app_ux_ratings
                    profile["number_of_app_ecosystem_ratings"]      = number_of_app_ecosystem_ratings
                    profile["created"]              = round(time())
                    try:
                        profile_id      = self.dbCon.insert_document(profile_collection, profile)
                    except Exception as e:
                        self.logger.error("failed to create the user_profile record for user {} with error {}".format(user_id, e))
                        return        
        # TODO: 
        return

    def get_application_by_application_id(self, application_id):
        if application_id == "":
            return {}
        fieldName   = "_id"
        fildeValue  = ObjectId(application_id)
        app_collection = "applications"
        try:
            apps    = self.dbCon.get_documents_by_field(app_collection, fieldName, fildeValue)
        except Exception as e:
            self.logger.error("failed to read the application with id {} from applications collection with error {}".format(application_id,e))
            return
        if len(apps) > 0:
            return apps[0]
        else:
            return {}

    def get_comments_by_user_id(self, user_id):
        fieldName   = "created_by"
        fildeValue  = user_id
        comment_collection = "application_user_comments"
        try:
            comments    = self.dbCon.get_documents_by_field(comment_collection, fieldName, fildeValue)
        except Exception as e:
            self.logger.error("failed to read comments by the user {} from application_user_comments collection with error {}".format(user_id,e))
            return
        return comments

    def get_votes_by_comment_id(self, comment_id):
        fieldName2          = "comment_id"
        fieldValue2         = comment_id
        votes_collection    = "user_comment_votes"
        try:
            votes   =   self.dbCon.get_documents_by_field(votes_collection, fieldName2, fieldValue2) 
            #print("for comment {} votes are {}".format(comment_id, votes))
        except Exception as e:
            self.logger.error("failed to comment votes for user {} for comment_id {} from user_comment_votes collection with error {}".format(user_id, comment_id, e))
        return votes
    
    # collect the voting by app owners/developers on the review they received.
    def get_reviews_by_user_id(self, user_id):
        fieldName   = "user_id"
        fildeValue  = user_id
        reviews_collection = "application_reviews"
        try:
            comments    = self.dbCon.get_documents_by_field(reviews_collection, fieldName, fildeValue)
        except Exception as e:
            self.logger.error("failed to read application reviews by the user {} from application_reviewss collection with error {}".format(user_id,e))
            return
        return comments
    
    # Get ratings
    def get_app_ratings_by_user_id(self, user_id):
        fieldName   = "created_by"
        fildeValue  = user_id
        ratings_collection = "application_ratings"
        try:
            ratings    = self.dbCon.get_documents_by_field(ratings_collection, fieldName, fildeValue)
        except Exception as e:
            self.logger.error("failed to read application ratings by the user {} from application_ratings collection with error {}".format(user_id,e))
            return
        return ratings      

    # collect the voting on app rating comments

if __name__ == '__main__':
    voting = Gamification("gamify.log")
    print("args: ", sys.argv)
    if len(sys.argv) > 1:
        arg     = sys.argv[1].lower()
        print("arg", arg)
        if  arg  == "comments":
            print("processing comments")
            voting.update_comment_scores()
        elif arg  == "reviews":
            print("processing reviews")
            voting.update_review_scores()
        elif arg  == "ratings":
            print("processing ratings")
            voting.update_rating_scores()

    else:
        print("processing comments")
        voting.update_comment_scores()
        print("processing reviews")
        voting.update_review_scores()
        print("processing ratings")
        voting.update_rating_scores()
