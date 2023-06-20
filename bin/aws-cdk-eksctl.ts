#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EksVpcStack } from '../lib/eks-vpc-stack';
import { EksClusterStack } from '../lib/eks-cluster-stack';
import { Aspects } from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag'


const app = new cdk.App();

const envTokyo = { region: 'ap-northeast-1' };
// const envOsaka = { region: 'ap-northeast-3' };

const VpcStack = new EksVpcStack(app, 'Sandbox-EKS-VPC-Stack', {
  env: envTokyo,
});

Aspects.of(app).add(new AwsSolutionsChecks());
cdk.Tags.of(app).add("Project", "CDKEksCtl");

// const ClusterStack = new EksClusterStack(
//   app,
//   'EKS-Sandbox-Cluster-Stack',
//   VpcStack.vpc,
//   VpcStack.publicSecurityGroup,
//   VpcStack.privateSecurityGroup,
//   { env: envTokyo }
// );
