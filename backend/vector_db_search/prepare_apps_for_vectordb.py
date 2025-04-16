import sys
sys.path.insert(0, '../')
from database import Database

def serialize(strings):
    return ''.join(f"{len(s)}~{s}" for s in strings)

def deserialize(serialized_str):
    result = []
    pos = 0

    while pos < len(serialized_str):
        len_pos = serialized_str.find('~', pos)
        if len_pos == -1:
            break

        length = int(serialized_str[pos:len_pos])
        pos = len_pos + 1

        word = serialized_str[pos:pos + length]
        result.append(word)

        pos += length

    return result


con  = Database("apps_data.log")
#fieldName   = "status"
#fieldValue  = "approved"
#apps = con.get_documents_by_field("applications", fieldName, fieldValue)
apps    = con.get_documents_all("applications")
output_file     = "apps_for_vectordb.txt"  # This file contains one sentence per all aspects of an app that will be vectorized.
app_ids_file    = "app_ids.txt"            # This file contains only app ids in the same sequence, needed for vector search.
output_file2    = "apps_uncurated_for_vectordb.txt"  # This file contains one sentence per all aspects of an uncurated app that will be vectorized.
app_ids_file2   = "app_uncurated_ids.txt"            # This file contains only app ids of uncurated apps in the same sequence, needed for vector search.

fh  = open(output_file, 'w')
fh2 = open(output_file2, 'w')
# we need to go through each application and get all the fields from all collections for a particular application
# and turn them into a string literal. This we can write to a file as one record at a time for populating the vector database.
# At the same time we should create an array of apps in the order we read different apps from applications collection.
# This will help us identify the record number from fastSearch and that will give us the application id.
# We need to serialize and deserialize this array too - just to make sure the integrity 
# (need to do this even if we use order by clause on applications collection, in case an app gets delated later.)
arr_apps            = []
arr_uncurated_apps  = []
for doc in apps:
    #if "status" in doc and "type" in doc and doc["status"].lower() == "approved" and doc["type"].upper() =="P": #-- take only approved apps that (P), not prototypes (H for hacks)
    application_id  = str(doc["_id"])
    doc["_id"]      = application_id
    # use formatted string (f") to combine multiple items into a string literal.
    text_mkt    = f"{doc['application']} {doc['description']} {con.get_documents_by_field('application_marketing', 'application_id', application_id)}"
    text_mdl    = f"{con.get_documents_by_field('application_models', 'application_id', application_id)}"
    text_rtg    = f"{con.get_documents_by_field('application_ratings', 'application_id', application_id)}"
    text_rvw    = f"{con.get_documents_by_field('application_reviews', 'application_id', application_id)}"
    text_rtm    = f"{con.get_documents_by_field('application_runtime', 'application_id', application_id)}"
    text_src    = f"{con.get_documents_by_field('application_source', 'application_id', application_id)}"
    text_cmt    = f"{con.get_documents_by_field('application_user_comments', 'application_id', application_id)}"
    record = text_mkt + " " + text_mdl + " " + text_rtg + " " + text_rvw + " " + text_rtm + " " + text_src + " " + text_cmt + "\n"
    if "status" in doc and doc["status"].lower() == "approved":
        arr_apps.append(application_id)
        fh.write(record)
    else:
        arr_uncurated_apps.append(application_id)
        fh2.write(record)
# serialize arrays too
fh_app_ids      = open(app_ids_file, 'w')
fh_app_ids.write(serialize(arr_apps))
fh_uncurated_app_ids      = open(app_ids_file2, 'w')
fh_uncurated_app_ids.write(serialize(arr_uncurated_apps))

