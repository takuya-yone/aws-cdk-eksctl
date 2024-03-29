import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import * as eks from 'aws-cdk-lib/aws-eks';
import { Construct } from 'constructs';

export class EksVpcStack extends cdk.Stack {
  vpc: ec2.Vpc;
  publicSecurityGroup: ec2.SecurityGroup;
  privateSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const vpcCidr = '10.0.0.0/16';

    this.vpc = new ec2.Vpc(this, `${id}-VPC`, {
      ipAddresses: ec2.IpAddresses.cidr(vpcCidr),
      natGateways: 2,
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: `${id}-public`,
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: `${id}-with-nat`,
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    // //////////////////  Security Group //////////////////

    const proxyIP1 = '0.0.0.0/32';
    // const proxyIP2 = '0.0.0.0/32';

    //// public security group
    this.publicSecurityGroup = new ec2.SecurityGroup(this, `${id}-PublicSG`, {
      vpc: this.vpc,
      // allowAllOutbound: false,
      securityGroupName: `${id}-PublicSG`,
    });

    //// private security group
    this.privateSecurityGroup = new ec2.SecurityGroup(this, `${id}-PrivateSG`, {
      vpc: this.vpc,
      // allowAllOutbound: false,
      securityGroupName: `${id}-PrivateSG`,
    });

    //// public security group Rule
    this.publicSecurityGroup.addIngressRule(
      this.publicSecurityGroup,
      ec2.Port.allTraffic()
    );
    this.publicSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(proxyIP1),
      ec2.Port.allTraffic()
    );
    this.publicSecurityGroup.addIngressRule(
      this.privateSecurityGroup,
      ec2.Port.allTraffic()
    );
    // this.publicSecurityGroup.addIngressRule(
    //   ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
    //   ec2.Port.allTraffic()
    // );

    //// private security group Rule
    this.privateSecurityGroup.addIngressRule(
      this.privateSecurityGroup,
      ec2.Port.allTraffic()
    );
    this.privateSecurityGroup.addIngressRule(
      this.publicSecurityGroup,
      ec2.Port.allTraffic()
    );
    this.privateSecurityGroup.addIngressRule(
      ec2.Peer.prefixList('pl-0596057d86614af83'),
      ec2.Port.allTraffic()
    );

    //  this.privateSecurityGroup.addIngressRule(
    //     ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
    //     ec2.Port.allTraffic()
    //   );

    ////////////////// ////////////////// //////////////////

    // const EC2InterfaceEndpoint = this.vpc.addInterfaceEndpoint(
    //   'EC2InterfaceEndpoint',
    //   {
    //     service: ec2.InterfaceVpcEndpointAwsService.EC2,
    //     subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    //     securityGroups: [this.privateSecurityGroup],
    //   }
    // );

    // const EC2InterfaceEndpoint = this.vpc.addInterfaceEndpoint(
    //   'EC2InterfaceEndpoint',
    //   {
    //     service: ec2.InterfaceVpcEndpointAwsService.EC2,
    //     subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    //     securityGroups: [this.privateSecurityGroup],
    //   }
    // );

    // const EC2InterfaceEndpoint = this.vpc.addInterfaceEndpoint(
    //   'EC2InterfaceEndpoint',
    //   {
    //     service: ec2.InterfaceVpcEndpointAwsService.EC2,
    //     subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    //     securityGroups: [this.privateSecurityGroup],
    //   }
    // );

    // const EC2InterfaceEndpoint = this.vpc.addInterfaceEndpoint(
    //   'EC2InterfaceEndpoint',
    //   {
    //     service: ec2.InterfaceVpcEndpointAwsService.EC2,
    //     subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    //     securityGroups: [this.privateSecurityGroup],
    //   }
    // );

    // const ECRInterfaceEndpoint = this.vpc.addInterfaceEndpoint(
    //   'ECRInterfaceEndpoint',
    //   {
    //     service: ec2.InterfaceVpcEndpointAwsService.ECR,
    //     subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    //     securityGroups: [this.privateSecurityGroup],
    //   }
    // );

    // const ECRDockerInterfaceEndpoint = this.vpc.addInterfaceEndpoint(
    //   'ECRDockerInterfaceEndpoint',
    //   {
    //     service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
    //     subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    //     securityGroups: [this.privateSecurityGroup],
    //   }
    // );

    // const STSEndpoint = this.vpc.addInterfaceEndpoint('STSEndpoint', {
    //   service: ec2.InterfaceVpcEndpointAwsService.STS,
    //   subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    //   securityGroups: [this.privateSecurityGroup],
    // });

    // const ElasticLoadbalancingEndpoint = this.vpc.addInterfaceEndpoint(
    //   'ElasticLoadbalancingEndpoint',
    //   {
    //     service: ec2.InterfaceVpcEndpointAwsService.ELASTIC_LOAD_BALANCING,
    //     subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    //     securityGroups: [this.privateSecurityGroup],
    //   }
    // );

    // const CloudWatchLogsEndpoint = this.vpc.addInterfaceEndpoint(
    //   'CloudWatchLogsEndpoint',
    //   {
    //     service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
    //     subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    //     securityGroups: [this.privateSecurityGroup],
    //   }
    // );

    // const S3GatewayEndpoint = this.vpc.addGatewayEndpoint('S3GatewayEndpoint', {
    //   service: ec2.GatewayVpcEndpointAwsService.S3,
    //   subnets: [{ subnetType: ec2.SubnetType.PRIVATE_ISOLATED }],
    // });
  }
}
