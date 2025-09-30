import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export interface AuthStackProps extends cdk.StackProps {
  stage: string;
}

export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly userPoolDomain: cognito.UserPoolDomain;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    // Create Cognito User Pool
    this.userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: `user-pool-${props.stage}`,
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        username: false,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
        },
        givenName: {
          required: true,
        },
        familyName: {
          required: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: props.stage === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    // Create User Pool Domain
    this.userPoolDomain = new cognito.UserPoolDomain(this, 'UserPoolDomain', {
      userPool: this.userPool,
      cognitoDomain: {
        domainPrefix: `auth-${props.stage}-${cdk.Aws.ACCOUNT_ID}`, // Make it unique
      },
    });

    // Create User Pool Client (after domain for proper dependency)
    this.userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      userPoolClientName: `web-client-${props.stage}`,
      generateSecret: false, // For web applications
      authFlows: {
        userPassword: true,
        userSrp: true,
        custom: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls: [
          'http://localhost:3000/callback', // For development
          'http://localhost:5173/callback', // For Vite dev server
          ...(props.stage === 'prod' ? ['https://your-domain.com/callback'] : []),
        ],
        logoutUrls: [
          'http://localhost:3000/logout', // For development
          'http://localhost:5173/logout', // For Vite dev server
          ...(props.stage === 'prod' ? ['https://your-domain.com/logout'] : []),
        ],
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
        // Google will be added conditionally
      ],
    });

    // Conditionally add Google Identity Provider if parameters exist
    // This allows deployment without Google OAuth initially
    const createGoogleProvider = new cdk.CfnCondition(this, 'CreateGoogleProvider', {
      expression: cdk.Fn.conditionNot(
        cdk.Fn.conditionEquals(
          cdk.Fn.ref('GoogleClientIdParam'),
          'PLACEHOLDER'
        )
      ),
    });

    const googleClientIdParam = new cdk.CfnParameter(this, 'GoogleClientIdParam', {
      type: 'String',
      description: 'Google OAuth Client ID (set to PLACEHOLDER to skip Google setup)',
      default: 'PLACEHOLDER',
      noEcho: false,
    });

    const googleClientSecretParam = new cdk.CfnParameter(this, 'GoogleClientSecretParam', {
      type: 'String',
      description: 'Google OAuth Client Secret (set to PLACEHOLDER to skip Google setup)',
      default: 'PLACEHOLDER',
      noEcho: true,
    });

    const googleProvider = new cognito.UserPoolIdentityProviderGoogle(this, 'GoogleProvider', {
      userPool: this.userPool,
      clientId: googleClientIdParam.valueAsString,
      clientSecret: googleClientSecretParam.valueAsString,
      scopes: ['email', 'profile', 'openid'],
      attributeMapping: {
        email: cognito.ProviderAttribute.GOOGLE_EMAIL,
        givenName: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
        familyName: cognito.ProviderAttribute.GOOGLE_FAMILY_NAME,
        profilePicture: cognito.ProviderAttribute.GOOGLE_PICTURE,
      },
    });

    // Apply condition to Google provider
    (googleProvider.node.defaultChild as cdk.CfnResource).cfnOptions.condition = createGoogleProvider;

    // Update client to include Google provider when it exists
    this.userPoolClient.node.addDependency(googleProvider);

    // Store important values in SSM Parameter Store for other stacks
    new ssm.StringParameter(this, 'UserPoolIdParameter', {
      parameterName: `/${props.stage}/auth/user-pool-id`,
      stringValue: this.userPool.userPoolId,
      description: 'Cognito User Pool ID',
    });

    new ssm.StringParameter(this, 'UserPoolClientIdParameter', {
      parameterName: `/${props.stage}/auth/user-pool-client-id`,
      stringValue: this.userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
    });

    new ssm.StringParameter(this, 'UserPoolDomainParameter', {
      parameterName: `/${props.stage}/auth/user-pool-domain`,
      stringValue: this.userPoolDomain.domainName,
      description: 'Cognito User Pool Domain',
    });

    // Output important values
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
      description: 'Cognito User Pool ID',
      exportName: `Auth-${props.stage}-UserPoolId`,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
      exportName: `Auth-${props.stage}-UserPoolClientId`,
    });

    new cdk.CfnOutput(this, 'UserPoolDomain', {
      value: this.userPoolDomain.domainName,
      description: 'Cognito User Pool Domain',
      exportName: `Auth-${props.stage}-UserPoolDomain`,
    });

    new cdk.CfnOutput(this, 'AuthUrl', {
      value: `https://${this.userPoolDomain.domainName}.auth.${cdk.Aws.REGION}.amazoncognito.com/login?client_id=${this.userPoolClient.userPoolClientId}&response_type=code&scope=email+openid+profile&redirect_uri=http://localhost:3000/callback`,
      description: 'Authentication URL for development',
      exportName: `Auth-${props.stage}-AuthUrl`,
    });

    new cdk.CfnOutput(this, 'Region', {
      value: cdk.Aws.REGION,
      description: 'AWS Region',
      exportName: `Auth-${props.stage}-Region`,
    });
  }
}