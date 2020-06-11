import * as cdk from '@aws-cdk/core'
import { DefaultInstanceTenancy, SubnetType, Vpc } from '@aws-cdk/aws-ec2'

export class VPCStack extends cdk.Stack {
  vpc: Vpc

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.vpc = new Vpc(this, 'VPC', {
      cidr: '10.0.0.0/16',
      defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT,
      enableDnsSupport: true,
      enableDnsHostnames: true,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public1',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Public2',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private1',
          subnetType: SubnetType.PRIVATE,
        },
        {
          cidrMask: 24,
          name: 'Private2',
          subnetType: SubnetType.PRIVATE,
        },
      ],
    })
  }
}
