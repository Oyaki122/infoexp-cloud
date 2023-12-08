import boto3
import json


def lambda_handler(event, context):
    s3 = boto3.client('s3')
    print(event)
    data = event['body-json']
    KEY = data['fileid']
    filename = data['filename']

    header_location = s3.generate_presigned_url(ClientMethod='get_object',
                                                Params={
                                                    'Bucket':
                                                    "infoexp-3dfile-bucket",
                                                    'Key': "3d/" + KEY
                                                },
                                                ExpiresIn=3600,
                                                HttpMethod='GET')
    print(header_location)

    # AWS IoTのクライアントを初期化
    iot_client = boto3.client('iot-data')

    # トピック名
    topic_name = "test/topic"

    # パブリッシュするメッセージ
    message = {"url": header_location, "filename": filename}

    # メッセージをJSON形式に変換
    payload = json.dumps(message)

    try:
        # トピックを公開
        response = iot_client.publish(topic=topic_name, payload=payload)

        print(f"Published to topic '{topic_name}' with message: {payload}")

        # 必要に応じて、成功時の処理を記述

    except Exception as e:
        print(f"Error publishing to topic '{topic_name}': {str(e)}")

    return {'statusCode': 200, 'body': json.dumps('OK.')}
    # 必要に応じて、エラー時の処理を記述
