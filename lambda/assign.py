import boto3
import json
import math
import itertools


def lambda_handler(event, context):
    dynamo = boto3.resource('dynamodb')
    queue = dynamo.Table('infoexp-queue-db')
    queue = list(map(lambda x: x["uid"], queue.scan()['Items']))

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

    return {
        'statusCode': 200,
        'body': json.dumps('Files distributed successfully!')
    }


def distribute_files(files, users):

    files_per_user = math.ceil(len(files) / len(users))
    user_files = {}
    for i in range(len(users)):
        start_idx = i * files_per_user
        end_idx = start_idx + files_per_user
        user_files[users[i]] = files[start_idx:end_idx]

    result = []
    for i in user_files:
        for j in user_files[i]:
            result.append({
                "user": i,
                "file": j
            })
    return result
