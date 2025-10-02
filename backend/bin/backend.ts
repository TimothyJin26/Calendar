#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from '../lib/backend-stack';
import { AuthStack } from '../lib/auth-stack';

const app = new cdk.App();

// Get stage from context or default to 'dev'
const stage = app.node.tryGetContext('stage') || 'dev';

const env = { 
  account: process.env.CDK_DEFAULT_ACCOUNT, 
  region: process.env.CDK_DEFAULT_REGION 
};

// Deploy AuthStack first
const authStack = new AuthStack(app, `AuthStack-${stage}`, {
  stage,
  env,
});

// Deploy BackendStack (includes Database and AppSync)
const backendStack = new BackendStack(app, `BackendStack-${stage}`, {
  stage,
  authStack,
  env,
});

// Add dependency
backendStack.addDependency(authStack);