#!/bin/bash

# Define the files to check
FILE1="app_ids.txt"
FILE2="apps_for_vectordb.txt"
cd /home/dsharma/huby_vectordb_apis
# Function to check if either file was updated in the last 10 hours
check_file_update() {
    local updated=false

    for file in "$FILE1" "$FILE2"; do
        if [[ -f "$file" ]]; then
            # Get the last modification time in seconds since epoch
            last_modified=$(stat -c %Y "$file")
            current_time=$(date +%s)

            # Calculate the difference in hours
            time_diff=$(( (current_time - last_modified) / 3600 ))

            # Check if the file was updated in the last 10 hours
            if [[ $time_diff -le 10 ]]; then
                updated=true
                break  # Exit the loop if at least one file is updated
            fi
        else
            echo "File $file does not exist."
        fi
    done

    if $updated; then
        return 0  # At least one file was updated within the last 10 hours
    else
        return 1  # No files were updated recently
    fi
}

# Main script logic
if [[ -n $1 ]]; then
    # If a parameter is provided, check the file modification times
    if check_file_update; then
        echo "At least one file was updated in the last 10 hours. Running the Python script..."
        python3 prepare_model_and_index_embeddings.py
    else
        echo "No files were updated in the last 10 hours. Skipping the Python script."
    fi
else
    # No parameter provided, run the Python script unconditionally
    echo "No parameter provided. Running the Python script unconditionally..."
    python3 prepare_model_and_index_embeddings.py
fi

