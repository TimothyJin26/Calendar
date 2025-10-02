import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export interface NetworkStackProps extends cdk.StackProps {
  stage: string;
}

export class NetworkStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly databaseSecurityGroup: ec2.SecurityGroup;
  public readonly lambdaSecurityGroup: ec2.SecurityGroup;
  public readonly bastionHost: ec2.BastionHostLinux;

  constructor(scope: Construct, id: string, props: NetworkStackProps) {
    super(scope, id, props);

        // Create VPC for the application
    this.vpc = new ec2.Vpc(this, 'ApplicationVpc', {
      vpcName: `calendar-vpc-${props.stage}`,
      maxAzs: 2, // Use 2 AZs for availability
      natGateways: 1, // Minimal cost - use 1 NAT gateway
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: 'isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Create security group for RDS
    this.databaseSecurityGroup = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for PostgreSQL database',
      allowAllOutbound: false,
    });

    // Create security group for Lambda functions
    this.lambdaSecurityGroup = new ec2.SecurityGroup(this, 'LambdaSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for Lambda functions',
      allowAllOutbound: true,
    });

    // Allow Lambda to connect to RDS
    this.databaseSecurityGroup.addIngressRule(
      this.lambdaSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow Lambda access to PostgreSQL'
    );

    // Create Bastion Host for database access (Session Manager - No SSH key needed)
    this.bastionHost = new ec2.BastionHostLinux(this, 'BastionHost', {
      vpc: this.vpc,
      subnetSelection: { subnetType: ec2.SubnetType.PUBLIC },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
    });

    // Add additional IAM permissions for port forwarding
    this.bastionHost.role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
    );

    // Add VPC endpoints for SSM (needed for Session Manager to work properly)
    new ec2.InterfaceVpcEndpoint(this, 'SSMVpcEndpoint', {
      vpc: this.vpc,
      service: ec2.InterfaceVpcEndpointAwsService.SSM,
      subnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    new ec2.InterfaceVpcEndpoint(this, 'SSMMessagesVpcEndpoint', {
      vpc: this.vpc,
      service: ec2.InterfaceVpcEndpointAwsService.SSM_MESSAGES,
      subnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    new ec2.InterfaceVpcEndpoint(this, 'EC2MessagesVpcEndpoint', {
      vpc: this.vpc,
      service: ec2.InterfaceVpcEndpointAwsService.EC2_MESSAGES,
      subnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    // Allow bastion host to connect to database
    this.bastionHost.allowSshAccessFrom(ec2.Peer.anyIpv4());
    
    // Allow bastion host to connect to database
    this.bastionHost.connections.allowTo(
      this.databaseSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow bastion host access to PostgreSQL'
    );

    // Allow inbound connections on PostgreSQL port from within VPC (for debugging)
    this.databaseSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
      ec2.Port.tcp(5432),
      'Allow PostgreSQL access from within VPC'
    );

    // Store important values in SSM Parameter Store for other stacks
    new ssm.StringParameter(this, 'VpcIdParameter', {
      parameterName: `/${props.stage}/network/vpc-id`,
      stringValue: this.vpc.vpcId,
      description: 'VPC ID for the application',
    });

    new ssm.StringParameter(this, 'DatabaseSecurityGroupParameter', {
      parameterName: `/${props.stage}/network/database-security-group-id`,
      stringValue: this.databaseSecurityGroup.securityGroupId,
      description: 'Database security group ID',
    });

    new ssm.StringParameter(this, 'LambdaSecurityGroupParameter', {
      parameterName: `/${props.stage}/network/lambda-security-group-id`,
      stringValue: this.lambdaSecurityGroup.securityGroupId,
      description: 'Lambda security group ID',
    });

    new ssm.StringParameter(this, 'BastionHostIdParameter', {
      parameterName: `/${props.stage}/network/bastion-host-id`,
      stringValue: this.bastionHost.instanceId,
      description: 'Bastion host instance ID',
    });

    // Output important values
    new cdk.CfnOutput(this, 'VpcIdOutput', {
      value: this.vpc.vpcId,
      description: 'VPC ID',
      exportName: `Network-${props.stage}-VpcId`,
    });

    new cdk.CfnOutput(this, 'DatabaseSecurityGroupOutput', {
      value: this.databaseSecurityGroup.securityGroupId,
      description: 'Database Security Group ID',
      exportName: `Network-${props.stage}-DatabaseSG`,
    });

    new cdk.CfnOutput(this, 'LambdaSecurityGroupOutput', {
      value: this.lambdaSecurityGroup.securityGroupId,
      description: 'Lambda Security Group ID',
      exportName: `Network-${props.stage}-LambdaSG`,
    });

    new cdk.CfnOutput(this, 'BastionHostIdOutput', {
      value: this.bastionHost.instanceId,
      description: 'Bastion Host Instance ID',
      exportName: `Network-${props.stage}-BastionHostId`,
    });

    new cdk.CfnOutput(this, 'BastionHostPublicIpOutput', {
      value: this.bastionHost.instancePublicIp,
      description: 'Bastion Host Public IP',
      exportName: `Network-${props.stage}-BastionHostPublicIp`,
    });
  }
}