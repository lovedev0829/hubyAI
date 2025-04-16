Directory of Generative AI Applications

Database Connectivity
The Flask APIs as well as the code used for the website requires the database access information for it to run. This information is stored in the systemd unit file as environment variables. This way the credentials are more secured and accessible to all the programs in this service.
The enviornment variables are:
- DBHOST for the ip address of the database server
- DBPORT for the port number where the database server listens for incoming requests
- DBNAME for the name of the database
- DBUSER for the database user id that has access to all the data that this service uses
- DBPASS for the password associated with the database user id
. DBCOLLECTION for the name of the database collection that this service needs.
