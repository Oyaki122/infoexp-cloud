import boto3
import json
import math
import itertools


def lambda_handler(event, context):
    dynamo = boto3.resource('dynamodb')
    queue = dynamo.Table('infoexp-queue-db')
    queue = list(map(lambda x: {'uid': x["uid"], 'size': x['filesize']}, queue.scan()['Items']))
    
    users = dynamo.Table('infoexp-users')
    users = list(map(lambda x: x['uid'], users.scan()['Items']))
    
    
    assign = dynamo.Table('infoexp-assign')
    scan = assign.scan()
    with assign.batch_writer() as batch:
        for each in scan['Items']:
            batch.delete_item(
                Key={
                    'user': each['user'],
                    'file': each['file']
                }
            )

    dist = distribute_files(queue, users)
    
    for i in dist:
        assign.put_item(Item=i)
    

    # s3.put_object(Bucket=s3_bucket_name, Key=files_key, Body=json.dumps(files))

    return {
        'statusCode': 200,
        'body': json.dumps('Files distributed successfully!')
    }


def distribute_files(files, users):

            
    users = [{"uid": i, "size_sum": 0} for i in users]
    result = []
    for i in files:
        users.sort(key=lambda x: x["size_sum"])
        users[0]["size_sum"] += i["size"]
        result.append({"file": i["uid"], "user": users[0]["uid"]})

    return result