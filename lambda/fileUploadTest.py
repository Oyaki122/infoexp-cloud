import os
import sys
import json
import requests
from glob import glob
from pathlib import Path

def main():
    csv_dir = "./"
    csvs = glob(csv_dir + "*.csv")
    a_csv_path = csvs[0]

    url = "https://qg6wdvbjvh.execute-api.us-east-1.amazonaws.com/1?user=1"
    file_name = os.path.basename(a_csv_path)

    file = {'file': (file_name, open(a_csv_path, 'rb'), 'text/csv')}

    res = requests.post(url, files=file)
    print(res)
    print(res.text)

if __name__ == "__main__":
    main()

