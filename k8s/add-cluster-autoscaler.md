https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/autoscaling.html


```
eksctl create iamserviceaccount \
  --cluster=Sandbox-EKS \
  --namespace=kube-system \
  --name=cluster-autoscaler \
  --attach-policy-arn=arn:aws:iam::{$AccountID}:policy/AmazonEKSClusterAutoscalerPolicy \
  --override-existing-serviceaccounts \
  --approve
```

```
kubectl apply -f cluster-autoscaler-autodiscover.yaml

```

```
kubectl annotate serviceaccount cluster-autoscaler \
  -n kube-system \
  eks.amazonaws.com/role-arn=arn:aws:iam::{$AccountID}:role/
  eksctl-Sandbox-EKS-addon-iamserviceaccount-k-Role1-H9QDKWT5JKM2
```

```
kubectl patch deployment cluster-autoscaler \
  -n kube-system \
  -p '{"spec":{"template":{"metadata":{"annotations":{"cluster-autoscaler.kubernetes.io/safe-to-evict": "false"}}}}}'
```

```
kubectl -n kube-system edit deployment.apps/cluster-autoscaler
```

```
kubectl set image deployment cluster-autoscaler \
  -n kube-system \
  cluster-autoscaler=k8s.gcr.io/autoscaling/cluster-autoscaler:v1.25.0
```

