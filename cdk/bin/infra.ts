#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CanaryStack } from '../lib/canary-stack';

const app = new cdk.App();

new CanaryStack(app, 'CanaryStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION
  },
});
