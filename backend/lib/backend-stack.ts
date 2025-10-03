import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NetworkStack } from './network-stack';
import { DatabaseStack } from './database-stack';
import { AppSyncStack } from './appsync-stack';
import { AuthStack } from './auth-stack';

export interface BackendStackProps extends cdk.StackProps {
  stage: string;
  authStack: AuthStack;
}

export class BackendStack extends cdk.Stack {
  public readonly networkStack: NetworkStack;
  public readonly databaseStack: DatabaseStack;
  public readonly appSyncStack: AppSyncStack;

  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    // Create Network Stack (VPC, Security Groups)
    this.networkStack = new NetworkStack(this, 'NetworkStack', {
      stage: props.stage,
      env: props.env,
    });

    // Create Database Stack
    this.databaseStack = new DatabaseStack(this, 'DatabaseStack', {
      stage: props.stage,
      vpc: this.networkStack.vpc,
      securityGroup: this.networkStack.databaseSecurityGroup,
      env: props.env,
    });

    // Create AppSync Stack
    this.appSyncStack = new AppSyncStack(this, 'AppSyncStack', {
      stage: props.stage,
      userPool: props.authStack.userPool,
      database: this.databaseStack.database,
      vpc: this.networkStack.vpc,
      lambdaSecurityGroup: this.networkStack.lambdaSecurityGroup,
      env: props.env,
    });

    // Add dependencies
    this.databaseStack.addDependency(this.networkStack);
    this.appSyncStack.addDependency(this.databaseStack);
    this.appSyncStack.addDependency(this.networkStack);
  }
}
