import multiprocessing as mp
import subprocess
import os
import psutil
import time

def scrape_media_urls_update_marketing_collection(product_id, product_url, json_file, max_pages):
    print(f"Worker Process ID: {os.getpid()}")
    print(f"Calling scrape_urls.py with Product ID: {product_id}, URL: {product_url}, File: {json_file} and max pages to scrape: {max_pages}")

    args = product_id, product_url, json_file, max_pages
    print("args: ", type(args), len(args), args)
    proc = mp.Process(target=call_python_program,args=(args,))
    proc.start() 
    set_low_priority(proc.pid)
    proc.join()
    return

def set_low_priority(pid):
    """Set process priority to low."""
    try:
        p = psutil.Process(pid)
        p.nice(psutil.IDLE_PRIORITY_CLASS if os.name == 'nt' else 10)
        print(f"Set low priority for process {pid}")
    except Exception as e:
        print(f"Failed to set priority: {e}")

def call_python_program(args):
    print(f"received input type in call_python_pgm {type(args)} and value = {args}")
    try:
        subprocess.run(["python", "../website_crawler_media_files.py"] + list(args) )
    except subprocess.CalledProcessError as e:
        print(f"Error in calling website_crawler_media_files.py: {e}")
    print(f"Worker process finished for Product ID: {args}")    

if __name__ == '__main__':
    application = input("Enter the application name or application id: ")
    url = input("Enter the starting URL of a website to scrape (press Enter to stop): ")
    file_json = input("Enter the file name where media urls in json format will be saved: ")
    max_pages = input("Enter the max number of pages to be scrapped (in case of too many pages): ")
    scrape_media_urls_update_marketing_collection(application, url, file_json, max_pages)
