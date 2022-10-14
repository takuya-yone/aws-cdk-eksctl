#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { AwsCdkEksctlStack } from '../lib/aws-cdk-eksctl-stack';

const app = new cdk.App();
new AwsCdkEksctlStack(app, 'AwsCdkEksctlStack');
