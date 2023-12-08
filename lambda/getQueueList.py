import json
import boto3

# バケット名,オブジェクト名
BUCKET_NAME = 'infoexp-3dfile-bucket'
DIR_NAME = '3d/'


def lambda_handler(event, context):
    client = boto3.client('s3')
    obj = client.list_objects(Bucket=BUCKET_NAME,
                              Prefix=DIR_NAME,
                              Delimiter='/')

    files = [
        content['Key'].removeprefix(DIR_NAME) for content in obj['Contents']
    ][1:]

    dynamo = boto3.resource('dynamodb')
    table = dynamo.Table('infoexp-queue-db')

    result = []
    for item in files:
        query_data = table.get_item(Key={'uid': item})
        if 'Item' in query_data:
            query_data['Item']['filesize'] = int(
                query_data['Item']['filesize'])
            result.append(query_data['Item'])

    # print(result)
    return {'statusCode': 200, 'body': json.dumps(result)}
