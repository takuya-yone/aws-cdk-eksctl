import * as cdk from 'aws-cdk-lib';

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import {
  Role,
  ServicePrincipal,
  ManagedPolicy,
  User,
} from 'aws-cdk-lib/aws-iam';
import * as eks from 'aws-cdk-lib/aws-eks';
import { Tags } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';

export class EksClusterStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    vpc: ec2.Vpc,
    publicSecurityGroup: ec2.SecurityGroup,
    privateSecurityGroup: ec2.SecurityGroup,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const EksMasterRole = new Role(this, 'EksMasterRole', {
      assumedBy: new ServicePrincipal('eks.amazonaws.com'),
    });
    EksMasterRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy')
    );
    EksMasterRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSServicePolicy')
    );

    const cluster = new eks.Cluster(this, 'EKS-Sandbox-Cluster', {
      vpc: vpc,
      mastersRole: EksMasterRole,
      outputMastersRoleArn: true,
      clusterName: 'EKS-Sandbox-Cluster',
      endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,

      vpcSubnets: [
        vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_ISOLATED }),
      ],
      securityGroup: publicSecurityGroup,

      version: eks.KubernetesVersion.V1_21,

      defaultCapacity: 0,
    });

    const autoScalingGroup = cluster.addAutoScalingGroupCapacity(
      'BottlerocketNodes',
      {
        instanceType: new ec2.InstanceType('t3.small'),
        minCapacity: 2,
        maxCapacity: 2,
        machineImageType: eks.MachineImageType.BOTTLEROCKET,
        associatePublicIpAddress: false,
        mapRole: true,
        vpcSubnets: vpc.selectSubnets({
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        }),
      }
    );
    Tags.of(autoScalingGroup).add('Name', 'EKS-Sandbox-Node');

    autoScalingGroup.addSecurityGroup(privateSecurityGroup);
  }
}
