import io
import cgi
import json
import boto3
import base64
import uuid

BUCKET_NAME = 'infoexp-3dfile-bucket'
DIRECTORY = '3d/'

dynamo = boto3.resource('dynamodb')
s3 = boto3.resource('s3')


def lambda_handler(event, context):

    body = base64.b64decode(event['body-json'])
    fp = io.BytesIO(body)

    environ = {'REQUEST_METHOD': 'POST'}
    headers = {
        'content-type': event['params']['header']['content-type'],
        # 'content-type': 'multipart/form-data',
        'content-length': len(body)
    }

    bucket = s3.Bucket(BUCKET_NAME)
    fs = cgi.FieldStorage(fp=fp, environ=environ, headers=headers)
    user = fs.getvalue('user')

    uid = uuid.uuid4()
    f = fs['file']
    filename = f.filename
    bucket.put_object(Body=f.value, Key=DIRECTORY+str(uid))

    table = dynamo.Table('infoexp-queue-db')
    table.put_item(
        Item={
            "uid": str(uid),
            "filename": filename,
            "user": user
        }
    )

    return {
        'statusCode': 200,
        'body': json.dumps('success')
    }
