import * as cdk from '@aws-cdk/core'
import * as fs from 'fs'
import { CfnCustomResource } from '@aws-cdk/aws-cloudformation'
import { PolicyStatement } from '@aws-cdk/aws-iam'
import { Function, InlineCode, Runtime } from '@aws-cdk/aws-lambda'

export class ACMPCAStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const CA_CERTIFICATE = process.env.CA_CERTIFICATE

    if (!CA_CERTIFICATE) {
      throw new Error('need to set CA_CERTIFICATE in environment variable')
    }

    const handler = new Function(this, 'CertificateAuthorityHandler', {
      handler: 'index.lambda_handler',
      runtime: Runtime.PYTHON_3_7,
      code: new InlineCode(fs.readFileSync('script/acmpca.py', 'utf-8')),
      environment: {
        CA_CERTIFICATE
      }
    })

    handler.role!.addToPolicy(
      new PolicyStatement({
        actions: ['acm-pca:*'],
        resources: ['*'],
      })
    )

    new CfnCustomResource(this, 'CertificateAuthority', {
      serviceToken: handler.functionArn,
    })
  }
}