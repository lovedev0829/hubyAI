# activate huby env
./home/dsharma/huby/hubyenv/bin/activate
cd /home/dsharma/huby/backend/vector_db_search/
python3 /home/dsharma/huby/backend/vector_db_search/prepare_apps_for_vectordb.py
# Check timestamps of files and size 
#
# FTP files to new vectordb server
sftp dsharma@128.199.15.215 <<EOF
cd huby_vectordb_apis
put apps_for_vectordb.txt
put app_ids.txt
put apps_uncurated_for_vectordb.txt
put app_uncurated_ids.txt
bye
EOF
#
# FTP files to vectordb server
sftp dsharma@164.90.152.83 <<EOF2
cd huby_vectordb_apis
put apps_for_vectordb.txt
put app_ids.txt
put apps_uncurated_for_vectordb.txt
put app_uncurated_ids.txt
bye
EOF2

