#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EksVpcStack } from '../lib/eks-vpc-stack';
import { EksClusterStack } from '../lib/eks-cluster-stack';
import { Aspects } from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';

const prjName1: string = 'LatticeStack1';
const prjName2: string = 'LatticeStack2';

const app = new cdk.App();

const envTokyo = { region: 'ap-northeast-1' };
// const envOsaka = { region: 'ap-northeast-3' };

const VpcStack1 = new EksVpcStack(app, prjName1, {
  env: envTokyo,
});

const VpcStack2 = new EksVpcStack(app, prjName2, {
  env: envTokyo,
});

// Aspects.of(app).add(new AwsSolutionsChecks());
cdk.Tags.of(app).add('Project', 'LatticeTest');

// const ClusterStack = new EksClusterStack(
//   app,
//   'EKS-Sandbox-Cluster-Stack',
//   VpcStack.vpc,
//   VpcStack.publicSecurityGroup,
//   VpcStack.privateSecurityGroup,
//   { env: envTokyo }
// );
