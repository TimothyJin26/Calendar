import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export interface DatabaseStackProps extends cdk.StackProps {
  stage: string;
  vpc: ec2.Vpc;
  securityGroup: ec2.SecurityGroup;
}

export class DatabaseStack extends cdk.Stack {
  public readonly database: rds.DatabaseInstance;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    // Create a custom parameter group to configure PostgreSQL settings
    const parameterGroup = new rds.ParameterGroup(this, 'PostgresParameterGroup', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_17_6,
      }),
      description: `PostgreSQL parameter group for ${props.stage}`,
      parameters: {
        // Enable logging for debugging
        'log_statement': 'all',
        'log_min_duration_statement': '0',
        // Configure authentication - allow MD5 and SCRAM authentication
        'password_encryption': 'scram-sha-256',
        // Enable SSL but don't require it (for easier local development)
        'ssl': '1',
        'shared_preload_libraries': 'pg_stat_statements',
      },
    });

    // Create regular RDS PostgreSQL instance (smallest possible for testing)
    this.database = new rds.DatabaseInstance(this, 'PostgresInstance', {
      instanceIdentifier: `calendar-db-${props.stage}`,
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_17_6,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO), // Smallest instance
      credentials: rds.Credentials.fromGeneratedSecret('postgres', {
        secretName: `calendar-db-credentials-${props.stage}`,
      }),
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [props.securityGroup],
      databaseName: 'calendardb',
      parameterGroup: parameterGroup,
      deletionProtection: props.stage === 'prod', // Only protect prod
      removalPolicy: props.stage === 'prod' ? cdk.RemovalPolicy.SNAPSHOT : cdk.RemovalPolicy.DESTROY,
      backupRetention: props.stage === 'prod' ? cdk.Duration.days(7) : cdk.Duration.days(1),
      preferredBackupWindow: '03:00-04:00',
      allocatedStorage: 20, // Minimum storage (20 GB)
      storageType: rds.StorageType.GP2, // General Purpose SSD
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: true,
      multiAz: false, // Single AZ for cost savings
      // Enable CA certificate for SSL connections
      caCertificate: rds.CaCertificate.RDS_CA_RSA2048_G1,
    });

    // Store database connection info in SSM Parameter Store
    new ssm.StringParameter(this, 'DatabaseEndpointParameter', {
      parameterName: `/${props.stage}/database/endpoint`,
      stringValue: this.database.instanceEndpoint.hostname,
      description: 'PostgreSQL database endpoint',
    });

    new ssm.StringParameter(this, 'DatabasePortParameter', {
      parameterName: `/${props.stage}/database/port`,
      stringValue: this.database.instanceEndpoint.port.toString(),
      description: 'PostgreSQL database port',
    });

    new ssm.StringParameter(this, 'DatabaseNameParameter', {
      parameterName: `/${props.stage}/database/name`,
      stringValue: 'calendardb',
      description: 'PostgreSQL database name',
    });

    new ssm.StringParameter(this, 'DatabaseSecretArnParameter', {
      parameterName: `/${props.stage}/database/secret-arn`,
      stringValue: this.database.secret!.secretArn,
      description: 'PostgreSQL database secret ARN',
    });

    // Output important values
    new cdk.CfnOutput(this, 'DatabaseEndpointOutput', {
      value: this.database.instanceEndpoint.hostname,
      description: 'PostgreSQL database endpoint',
      exportName: `Database-${props.stage}-Endpoint`,
    });

    new cdk.CfnOutput(this, 'DatabaseSecretArnOutput', {
      value: this.database.secret!.secretArn,
      description: 'Database credentials secret ARN',
      exportName: `Database-${props.stage}-SecretArn`,
    });
  }
}