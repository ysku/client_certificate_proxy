#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { ACMPCAStack, EksStack, Route53Stack, VPCStack } from '../lib'

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

const vpc = new VPCStack(app, 'VPCStack', props)
// new ACMPCAStack(app, 'ACMPCAStack', props)
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
