#-- This utility is to put media files in cloud storage. Currently Google Cloud storage"
#-- It uses the service account key file for access; although less safe but good for our use case.
#-- The service account key needs to be maintained outside git and needs to be setup for different envs.
#-- The bucket on Google Cloud Storage is huby_media_files with two folders images and videos.
#-- The bucket for development is huby_media_files_dev with same two folders.
#-- We will be deciding on bucket name and service account key file names based on env var HUBY_ENV being dev or prod
#-- bucket folder name cannot be in config since it changes API to API. It will be an input to save incl file being saved
from google.cloud import storage
from configparser import ConfigParser
import os, io, logging
class CloudStorage:
    def __init__(self, bucket = "", service_account_key_file = "", logger=""):
        config      = ConfigParser()
        if "WorkingDirectory" not in os.environ:
            raise EnvironmentError("Missing value for environment variable WorkingDirectory in CloudStorage().")
            return
        if "HUBY_ENV" not in os.environ:
            raise EnvironmentError("Missing value for environment variable HUBY_ENV in CloudStorage().")
            return
        huby_env = os.getenv("HUBY_ENV").strip().lower()
        configFile  = os.getenv("WorkingDirectory") + "/huby.cfg"
        config.read(configFile)
        if  huby_env == "dev":
            config_section = "CloudStorageDev"
        elif huby_env == "prod":
            config_section = "CloudStorage" 
        else:
            config_section = "CloudStorage" 
        if bucket   == "":
            self.bucket = config.get(config_section, 'bucket')
        else:
            self.bucket = bucket
        if service_account_key_file == "":
            self.service_account_key_file = config.get(config_section, 'service_account_key_file')
        else:
            self.service_account_key_file = service_account_key_file

        if os.path.exists(self.service_account_key_file):
            self.client = storage.Client.from_service_account_json(self.service_account_key_file)
        else:
            self.logger.error("Failed to find the service account key file " + self.service_account_key_file)
            print("Failed to find the service account key file " + self.service_account_key_file)
            return
        logLevel        = config.get('Default', 'log_level')
        if logger == "":
            logger = logging.getLogger()
            file_with_path = "/var/log/huby/cloud_storage_util.log"
            handler = logging.FileHandler(file_with_path)
            handler.setFormatter(logging.Formatter('%(asctime)s.%(msecs)03d  %(levelname)-s %(message)s', datefmt='%Y-%m-%d %H:%M:%S'))
            logger.addHandler(handler)
            if logLevel != "":
                logger.logLevel = logLevel
            else:
                logger.logLevel = logging.INFO
        self.logger = logger
        return
    #-- Save a file stream coming from http request as opposed to a file existing on file system
    def save_object_stream(self, source_file_stream, destination_blob_name ):
        if not source_file_stream or source_file_stream == "":
            self.logger.error("Error: Failed to save the object. source_file_stream is required for saving an object to cloud bucket.")
            return
        # Get the file data as bytes
        file_data = source_file_stream.read()
        # Create a BytesIO object
        memory_file = io.BytesIO(file_data)
        if not destination_blob_name or destination_blob_name == "":
            self.logger.error("Error: Failed to save the object. destination_blob_name (destination file including folder path in bucket) is required for saving an object to cloud bucket.")
            return
        try:
            #print("in CloudStorage.save_object() and service acc key_file is: ", self.service_account_key_file)
            bucket = self.client.bucket(self.bucket)
            blob = bucket.blob(destination_blob_name)
            blob.upload_from_file(
                memory_file,
                content_type=source_file_stream.content_type,
                rewind=True  # Ensures we're at the start of the stream
            )
            #blob.make_public() - This will fail given our configuration
            return blob.public_url
        except Exception as e:
            print("Error:", e)
            self.logger.error("Error: Failed to save the object with source_file_stream = {} and destination_blob_name = {} due to error: {}".format(source_file_stream, destination_blob_name, e))
            return

    def save_object(self, source_file_path, destination_blob_name ):
        if not source_file_path or source_file_path == "":
            self.logger.error("Error: Failed to save the object. source_file_path is required for saving an object to cloud bucket.")
            return
        if not destination_blob_name or destination_blob_name == "":
            self.logger.error("Error: Failed to save the object. destination_blob_name (destination file including folder path in bucket) is required for saving an object to cloud bucket.")
            return
        try:
            print("in CloudStorage.save_object() and service acc key_file is: ", self.service_account_key_file)
            bucket = self.client.bucket(self.bucket)
            blob = bucket.blob(destination_blob_name)
            blob.upload_from_filename(source_file_path)
            #blob.make_public() - This will fail given our configuration
            return blob.public_url
        except Exception as e:
            print("Error:", e)
            self.logger.error("Error: Failed to save the object with source_file_path = {} and destination_blob_name = {} due to error: {}".format(source_file_path, destination_blob_name, e))
            return
        
    def delete_object(self, gcs_url):
        #make sure that gcs_url starts with https
        list_gcs_url_parts = gcs_url.split('/')
        if list_gcs_url_parts[0].lower() != 'https:' :
            self.logger.error("Error: This media object can't be deleted. gcs_url must begin with https: ")
            return
        if gcs_url == "":
            self.logger.error("Error: CloudStorage.delete_object() - media file_url not supplied for file deletion")
            return
        
        _, _, _, bucket_name, object_name = gcs_url.split('/', 4) 
        try:
            bucket = self.client.bucket(bucket_name)
            print("bucket object created successfully and it is: {}".format(bucket))
        except Exception as e:
            self.logger.error("CloudStorage.delete_object(): Failed to create the bucket object from bucket name: {} with error {}".format( bucket_name, e))
            return
        try:
            blob = bucket.blob(object_name)
        except Exception as e:
            self.logger.error("CloudStorage.delete_object(): Failed to create the blob object from object name: {} with error {}".format( object_name, e))
            return
        #print("blob object created successfully and it is: {}".format(blob))
        
        try:
            # Delete the object
            blob.delete()
            #print(f"Object deleted successfully from {gcs_url}")
        except ValueError:
            raise ValueError(f"Invalid GCS URL format: {gcs_url}")
        except Exception as e:
            #print(f"Error deleting object from {gcs_url}: {e}")
            self.logger.error("CloudStorage.delete_object(): Failed to delete the object: {} with error {}".format( gcs_url, e))
            return