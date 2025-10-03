import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as path from 'path';

export interface AppSyncStackProps extends cdk.StackProps {
  stage: string;
  userPool: cognito.UserPool;
  database: rds.DatabaseInstance;
  vpc: ec2.Vpc;
  lambdaSecurityGroup: ec2.SecurityGroup;
}

export class AppSyncStack extends cdk.Stack {
  public readonly api: appsync.GraphqlApi;

  constructor(scope: Construct, id: string, props: AppSyncStackProps) {
    super(scope, id, props);

    // Create AppSync API
    this.api = new appsync.GraphqlApi(this, 'CalendarApi', {
      name: `calendar-api-${props.stage}`,
      definition: appsync.Definition.fromFile(path.join(__dirname, '../schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: props.userPool,
          },
        },
      },
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      xrayEnabled: true,
    });

    // Allow Lambda to connect to RDS (security group rules are configured in NetworkStack)

    // Create Lambda resolver function
    const resolverFunction = new nodejs.NodejsFunction(this, 'ResolverFunction', {
      functionName: `calendar-resolver-${props.stage}`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, '../lambda/resolver.ts'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [props.lambdaSecurityGroup],
      environment: {
        DATABASE_SECRET_ARN: props.database.secret!.secretArn,
        DATABASE_ENDPOINT: props.database.instanceEndpoint.hostname,
        DATABASE_PORT: props.database.instanceEndpoint.port.toString(),
        DATABASE_NAME: 'calendardb',
        STAGE: props.stage,
      },
      bundling: {
        nodeModules: ['pg', '@types/pg'],
        externalModules: ['@aws-sdk/*'],
      },
    });

    // Grant Lambda permissions to access the database secret
    props.database.secret!.grantRead(resolverFunction);

    // Grant Lambda permissions to connect to RDS
    resolverFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'rds-data:ExecuteStatement',
        'rds-data:BatchExecuteStatement',
        'rds-data:BeginTransaction',
        'rds-data:CommitTransaction',
        'rds-data:RollbackTransaction',
      ],
      resources: [props.database.instanceArn],
    }));

    // Create Lambda data source
    const lambdaDataSource = this.api.addLambdaDataSource('LambdaDataSource', resolverFunction);

    // Create resolvers for all operations
    const resolvers = [
      // Board resolvers
      { typeName: 'Query', fieldName: 'getBoard' },
      { typeName: 'Query', fieldName: 'listBoards' },
      { typeName: 'Mutation', fieldName: 'createBoard' },
      { typeName: 'Mutation', fieldName: 'updateBoard' },
      { typeName: 'Mutation', fieldName: 'deleteBoard' },
      
      // Task resolvers
      { typeName: 'Query', fieldName: 'getTask' },
      { typeName: 'Query', fieldName: 'listTasksByBoard' },
      { typeName: 'Mutation', fieldName: 'createTask' },
      { typeName: 'Mutation', fieldName: 'updateTask' },
      { typeName: 'Mutation', fieldName: 'deleteTask' },
      
      // Subtask resolvers
      { typeName: 'Mutation', fieldName: 'createSubtask' },
      { typeName: 'Mutation', fieldName: 'updateSubtask' },
      { typeName: 'Mutation', fieldName: 'deleteSubtask' },
      
      // Group resolvers
      { typeName: 'Query', fieldName: 'getGroup' },
      { typeName: 'Query', fieldName: 'listGroups' },
      { typeName: 'Mutation', fieldName: 'createGroup' },
      { typeName: 'Mutation', fieldName: 'updateGroup' },
      { typeName: 'Mutation', fieldName: 'deleteGroup' },
    ];

    resolvers.forEach(({ typeName, fieldName }) => {
      lambdaDataSource.createResolver(`${typeName}${fieldName}Resolver`, {
        typeName,
        fieldName,
      });
    });

    // Store AppSync API info in SSM Parameter Store
    new ssm.StringParameter(this, 'ApiUrlParameter', {
      parameterName: `/${props.stage}/appsync/api-url`,
      stringValue: this.api.graphqlUrl,
      description: 'AppSync GraphQL API URL',
    });

    new ssm.StringParameter(this, 'ApiIdParameter', {
      parameterName: `/${props.stage}/appsync/api-id`,
      stringValue: this.api.apiId,
      description: 'AppSync GraphQL API ID',
    });

    // Output important values
    new cdk.CfnOutput(this, 'GraphQLApiUrlOutput', {
      value: this.api.graphqlUrl,
      description: 'GraphQL API URL',
      exportName: `AppSync-${props.stage}-ApiUrl`,
    });

    new cdk.CfnOutput(this, 'GraphQLApiIdOutput', {
      value: this.api.apiId,
      description: 'GraphQL API ID',
      exportName: `AppSync-${props.stage}-ApiId`,
    });

    new cdk.CfnOutput(this, 'GraphQLApiKeyOutput', {
      value: this.api.apiKey || 'No API Key (using Cognito)',
      description: 'GraphQL API Key',
      exportName: `AppSync-${props.stage}-ApiKey`,
    });
  }
}