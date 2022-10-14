# aws-cdk-eksctl
## Create VPC Stack whih CDK on TS
1. ``yarn cdk deploy``

## Create EKS Cluster with eksctl
1. modify ``eksctl/cluster.yml``
1. ``eksctl create cluster -f eksctl/cluster.yml``

## References
### eksctl Command Ref
- https://eksctl.io/

### CDK API Ref
- https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html