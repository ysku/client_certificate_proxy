import os
import json

import boto3
from botocore.vendored import requests


CA_CERTIFICATE = os.environ['CA_CERTIFICATE'].encode('utf-8')


def lambda_handler(event, context):
    try:
        client = boto3.client('acm-pca')
        if event['RequestType'] == 'Create':
            response = client.create_certificate_authority(
                CertificateAuthorityConfiguration={
                    'KeyAlgorithm': 'RSA_2048',
                    'SigningAlgorithm': 'SHA256WITHRSA',
                    'Subject': {
                        'Country': 'JP',
                        'Organization': 'TODO',
                        'OrganizationalUnit': 'TODO',
                        'State': 'TOKYO',
                        'CommonName': '*.ysku.me',
                        'Locality': 'MINATO'
                    }
                },
                RevocationConfiguration={
                    'CrlConfiguration': {
                        'Enabled': False,
                        # TODO:
                        # 'ExpirationInDays': 60,
                        # 'CustomCname': 'string',
                        # 'S3BucketName': 'string'
                    }
                },
                CertificateAuthorityType='ROOT',
                # IdempotencyToken='string',
                Tags=[
                    {
                        'Key': 'Name',
                        'Value': 'TODO'
                    },
                ]
            )
            # TODO: private 鍵を生成して証明書を作成する、いまはマニュアルで設定
            # res = client.get_certificate_authority_csr(
            #     CertificateAuthorityArn=response['CertificateAuthorityArn']
            # )
            # client.import_certificate_authority_certificate(
            #     CertificateAuthorityArn=response['CertificateAuthorityArn'],
            #     Certificate=res['Csr'].encode('utf-8')
            # )
            client.create_permission(
                CertificateAuthorityArn=response['CertificateAuthorityArn'],
                Principal='acm.amazonaws.com',
                Actions=[
                    'IssueCertificate',
                    'GetCertificate',
                    'ListPermissions'
                ]
            )
            sendResponseCfn(event,context, "SUCCESS", response['CertificateAuthorityArn'])
        elif event['RequestType'] == 'Delete':
            client.delete_certificate_authority(
                CertificateAuthorityArn=event['PhysicalResourceId'],
                PermanentDeletionTimeInDays=7
            )
            sendResponseCfn(event,context, "SUCCESS", event['PhysicalResourceId'])
        elif event['RequestType'] == 'Update':
            print('NOT IMPLEMENTED YET')
            # client.update_certificate_authority(
            #     CertificateAuthorityArn=event['PhysicalResourceId'],
            # )
            sendResponseCfn(event,context, "SUCCESS", event['PhysicalResourceId'])
        else:
            console.log('Unknown RequestType: ' + event['RequestType'])
            sendResponseCfn(event, context, "FAILED", event['PhysicalResourceId'] if 'PhysicalResourceId' in event else 'NaN')
    except Exception as e:
        print(e)
        sendResponseCfn(event, context, "FAILED", event['PhysicalResourceId'] if 'PhysicalResourceId' in event else 'NaN')


def sendResponseCfn(event, context, responseStatus, resourceId):
    response_body = {
        'Status': responseStatus,
        'Reason': 'Log stream name: ' + context.log_stream_name,
        'PhysicalResourceId': resourceId,
        'StackId': event['StackId'],
        'RequestId': event['RequestId'],
        'LogicalResourceId': event['LogicalResourceId'],
        'Data': json.loads("{}")
    }
    requests.put(event['ResponseURL'], data=json.dumps(response_body))
