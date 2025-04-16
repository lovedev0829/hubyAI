#-------- This class Redis is responsible for all operations on Redis cache --------
from redis import Redis, ConnectionError
import redis
import logging
import os, sys
#--- defult log level. Set it to DEBUG, WARNING, INFO, or ERROR.
log_file    = "/var/log/huby/cache.log"
log_level   = logging.DEBUG
DEFAULT_TTL = 900 #---- default time to live/expiration for a key-value 15 minutes 
class Cache:
    #----       Methods in this class --------
    # __init__(): Retrieve cache (Redis) IP/Port information; create a cache instance.
    # set_key_value(key, value, ex=900): Stores a new K-V pair (with optional expiry) in cache
    # get_key_value(key): Retrieves the value for supplied key if it's present in cache; 
    #                     and reset ttl for key to default value DEFAULT_TTL; 
    #                     Returns null if key not found. 
    # get_key_ttl(key): Retrieves the TTL value for a key in seconds; Returns -2 if key not found.
    # set_key_ttl(self, key, time_to_live ): Set the TTL value from time_to_live in seconds.
    #                                         Returns False if key not found.
    #--------        End of list of methods ------
    def __init__(self): 
        logging.basicConfig(format='%(asctime)s.%(msecs)03d  %(levelname)-s %(message)s', datefmt='%Y-%m-%d %H:%M:%S %Z', filename=log_file, level=log_level, filemode='a')
        self.logger = logging.getLogger(log_file)
        required_envs = ["REDIS_HOST","REDIS_PORT"]
        for var in required_envs:
            if var not in os.environ:
                self.logger.error( "Missing value for environment variable {}. Exiting the application".format(var))
                raise EnvironmentError("Missing value for environment variable {}.".format(var))
                sys.exit()
        self.redis_host  = os.getenv("REDIS_HOST")
        self.redis_port  = os.getenv("REDIS_PORT")
        try:
            self.logger.info("Attempting to connect to the cache database.")
            self.redis =  Redis(host=self.redis_host, port=self.redis_port, decode_responses=True )
        except (redis.ConnectionError, redis.TimeoutError) as e:
            print("Failed to connect to cache databasse server due to error {}. Exiting the application".format(e))
            self.logger.error("Failed to connect to databasse server due to error {}".format(e))
        return
    #------ Method to set a new key
    def set_key_value(self, key, value, ex=900):
        #--- default ttl is set to 15 minutes -----
        #--- If a key already exists its value will be replaced by new value and new ttl
        #print("incoming key value and ex are: ", key, value, ex)
        try:
            if ex == "NX":
                 self.redis.set(key, value)
            else:
                 self.redis.set(key, value, ex=ex)
        except redis.RedisError as e:  #
            print("Failed to set the value for a key in cache database due to error {}. Exiting the application".format(e))
            self.logger.error("Failed to set the value for a key in cache database due to error {}".format(e))
            return False
        return True


    
    #------ Method to get the value of a key
    def get_key_value(self, key):
        #--- check that key exists. If not then return error
            try:
                result = self.redis.get(key)
                #--- reset the ttl value if ttl exists on this key
                self.logger.info("ttl on the key {} is {}".format(key, self.redis.ttl(key)))
                if self.redis.ttl(key) > 0:   # if it's NX, it will give the value of -1 
                    self.logger.info("set the ttl for key {} to default value {}".format(key, DEFAULT_TTL))
                    self.redis.expire(key, DEFAULT_TTL)
                return result
            except redis.RedisError as e:
                print("Failed to get the value for a key in cache database due to error {}. Exiting the application".format(e))
                self.logger.error("Failed to get the value for a key in cache database due to error {}".format(e))
                return False

        #------ Method to get the ttl value of a key
    def get_key_ttl(self, key):
        #--- check that key doesn't already exists. If it does then return error
            try:
                return self.redis.ttl(key)
            except redis.RedisError as e:
                print("Failed to get the ttl value for a key in cache database due to error {}. Exiting the application".format(e))
                self.logger.error("Failed to get the ttl value for a key in cache database due to error {}".format(e))
                return False

        #------ Method to set the ttl value in seconds for a key
    def set_key_ttl(self, key, time_to_live ):
        #--- check that key doesn't already exists. If it does then return error
            try:
                return self.redis.expire(key, time_to_live)
            except redis.RedisError as e:
                print("Failed to set the ttl value for a key in cache database due to error {}. Exiting the application".format(e))
                self.logger.error("Failed to get the ttl value for a key in cache database due to error {}".format(e))
                return False
