#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { ACMPCAStack, ECRStack, EksStack, Route53Stack, VPCStack, WAFStack } from '../lib'

const app = new cdk.App()
const props = {
  env: {
    region: 'ap-northeast-1',
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
}

if (!process.env.DOMAIN_NAME) {
  throw new Error('DOMAIN_NAME is required')
}
const domainName = process.env.DOMAIN_NAME

if (!process.env.ZONE_NAME) {
  throw new Error('ZONE_NAME is required')
}
const zoneName = process.env.ZONE_NAME

if (!process.env.LOCAL_ZONE_NAME) {
  throw new Error('LOCAL_ZONE_NAME is required')
}
const localZoneName = process.env.LOCAL_ZONE_NAME

if (!process.env.BACKEND_LB_ARN) {
  throw new Error('BACKEND_LB_ARN is required')
}
const loadBalancerArn = process.env.BACKEND_LB_ARN

if (!process.env.BACKEND_LB_SECURITY_GROUP_ID) {
  throw new Error('BACKEND_LB_SECURITY_GROUP_ID is required')
}
const securityGroupId = process.env.BACKEND_LB_SECURITY_GROUP_ID

const vpc = new VPCStack(app, 'VPCStack', props)
new ACMPCAStack(app, 'ACMPCAStack', props)
new ECRStack(app, 'ECRStack', {
  ...props,
  // FIXME:
  repositoryName: 'client_certificate_proxy'
})
new EksStack(app, 'EksStack', {
  ...props,
  vpc: vpc.vpc,
})
new Route53Stack(app, 'Route53Stack', {
  ...props,
  vpc: vpc.vpc,
  domainName,
  zoneName,
  localZoneName,
})
new WAFStack(app, 'WAFStack', {
  ...props,
  loadBalancerArn,
  securityGroupId
})
