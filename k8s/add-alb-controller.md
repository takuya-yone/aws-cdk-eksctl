https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/aws-load-balancer-controller.html

```Bash


curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.4.4/docs/install/iam_policy.json

aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://iam_policy.json

eksctl utils associate-iam-oidc-provider --cluster Sandbox-EKS --approve


eksctl create iamserviceaccount \
  --cluster=Sandbox-EKS \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name "AmazonEKSLoadBalancerControllerRole" \
  --attach-policy-arn=arn:aws:iam::{$AccountID}:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve



helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=Sandbox-EKS \
  --set serviceAccount.create=false \
  --set image.repository=602401143452.dkr.ecr.ap-northeast-1.amazonaws.com/amazon/aws-load-balancer-controller \
  --set serviceAccount.name=aws-load-balancer-controller
  
```