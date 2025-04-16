import multiprocessing as mp
import requests, json, os
prompt_file = "test_prompts.txt"
from random import randint
fh = open(prompt_file, 'r')
prompt_list = []
with open(prompt_file, 'r') as fh:
    for line in fh:
        prompt_list.append(line)
#print("prompts", prompt_list, len(prompt_list))
def get_curated_results(prompts_list,result_count, num_tests):
    fc = open("curated_results.txt", "a")
    pid = os.getpid()
    max = len(prompts_list) - 1
    for i in range(num_tests):
        search_text = prompt_list[randint(0, max)]
        search_text = search_text.replace('\n', '')
        url = "http://128.199.15.215:5000/api/search"
        headers = {"Content-Type": "Application/Json"}
        params = {"search_text": search_text, "result_count": result_count}
        #print("params:", params)
        res = requests.get(url, params=params, headers=headers)
        #print('i, res.text:',i,  res.text)
        if res.status_code == 200:
            j_result     = json.loads(res.text)
            #print("j_result:", j_result)
            list_app_ids = json.loads(j_result['result'])
            apps = []
            for app in list_app_ids:
                apps.append(app["application_id"])
            #print("test num, search_text, list_app_ids: ", i, search_text,  list_app_ids)
            fc.write(str(pid) + ":" + str(i) + "- prompt = " + search_text + "\n" + " APPS = {}".format(apps))
    fc.close()
    return

def get_uncurated_results(prompts_list, result_count, num_tests):
    fc = open("uncurated_results.txt", "a")
    pid = os.getpid()
    max = len(prompts_list) - 1
    for i in range(num_tests):
        search_text = prompt_list[randint(0, max)]
        search_text = search_text.replace('\n', '')
        url = "http://128.199.15.215:5000/api/search/uncurated"
        headers = {"Content-Type": "Application/Json"}
        params = {"search_text": search_text, "result_count": result_count}
        #print("params:", params)
        res = requests.get(url, params=params, headers=headers)
        #print('i, res.text:',i,  res.text)
        if res.status_code == 200:
            j_result     = json.loads(res.text)
            #print("j_result:", j_result)
            list_app_ids = json.loads(j_result['result'])
            apps = []
            for app in list_app_ids:
                apps.append(app["application_id"])
            #print("test num, search_text, list_app_ids: ", i, search_text,  list_app_ids)
            fc.write(str(pid) + ":" + str(i) + "- prompt = " + search_text + "\n" + " APPS = {}".format(apps))
    fc.close()
    return

def main():
    try:
        num_cpus = os.cpu_count()
        if num_cpus is None:
            print("Could not determine the number of CPUs. Using a default of 1.")
            num_cpus = 1
        else:
            print(f"Number of CPUs available: {num_cpus}")
    except NotImplementedError:
        print("os.cpu_count() is not implemented on this system. Using a default of 1.")
        num_cpus = 1
    processes = []
    results = []
    result_count = 4
    num_tests   = 1000 # gradually increase it.
    for i in range(num_cpus):
        process = mp.Process(target=get_uncurated_results, args=(prompt_list, result_count, num_tests))
        processes.append(process)
        process.start()

    # Wait for all processes to finish
    for process in processes:
        process.join()

    for i in range(num_cpus):
        process = mp.Process(target=get_curated_results, args=(prompt_list, result_count, num_tests))
        processes.append(process)
        process.start()

    # Wait for all processes to finish
    for process in processes:
        process.join()    
    #with mp.Pool(processes=num_cpus) as pool:
    #    results = pool.map(get_uncurated_results, range(num_cpus))
if __name__ == '__main__':
    main()
