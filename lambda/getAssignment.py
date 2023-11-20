import json
import boto3


def lambda_handler(event, context):
    dynamo = boto3.resource('dynamodb')
    table = dynamo.Table('infoexp-assign')

    assign = table.scan()['Items']

    queue = dynamo.Table('infoexp-queue-db')
    users = dynamo.Table('infoexp-users')

    result = []

    for item in assign:
        file = queue.get_item(
            Key={
                "uid": item["file"]
            }
        )["Item"]

        user = users.get_item(
            Key={
                "uid": item["user"]
            }
        )['Item']

        result.append({
            "filename": file['filename'],
            "fileId": file['uid'],
            "assignedUser": user['name'],
            "assigneduserId": user['uid'],
            "uploadUser": file['user']
        })

    print(result)

    return {
        'statusCode': 200,
        'body': json.dumps(result)
    }
