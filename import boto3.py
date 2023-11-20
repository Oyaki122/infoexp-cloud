import boto3
import json
import math
import itertools


def lambda_handler(event, context):
    s3_bucket_name = "kondoharuna-testbucket"
    users_key = "users.json"
    files_key = "files.json"

    s3 = boto3.client('s3')

    users_data = s3.get_object(Bucket=s3_bucket_name, Key=users_key)
    users = json.loads(users_data['Body'].read().decode('utf-8'))

    files_data = s3.get_object(Bucket=s3_bucket_name, Key=files_key)
    files = json.loads(files_data['Body'].read().decode('utf-8'))

    distribute_files(files, users)

    s3.put_object(Bucket=s3_bucket_name, Key=files_key, Body=json.dumps(files))

    return {
        'statusCode': 200,
        'body': json.dumps('Files distributed successfully!')
    }


def distribute_files(files, users):

    files_per_user = math.ceil(len(files["files"]) / len(users["users"]))
    user_files = {}
    for i in range(len(users["users"])):
        start_idx = i * files_per_user
        end_idx = start_idx + files_per_user
        user_files[users["users"][i]["id"]] = files["files"][start_idx:end_idx]
    return user_files
