import * as cdk from '@aws-cdk/core'
import * as fs from 'fs'

export class ACMPCAStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new cdk.CfnInclude(this, "ACMPCA", {
      template: JSON.parse(fs.readFileSync("resources/acmpca.json").toString())
    })
  }
}
