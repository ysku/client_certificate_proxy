#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { EksStack } from '../lib'

const app = new cdk.App()
const props = {
  env: {
    region: 'ap-northeast-1',
  },
}
new EksStack(app, 'EksStack', props)
