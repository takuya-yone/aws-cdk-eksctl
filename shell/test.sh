#!/bin/bash
for i in {0..10000}
do
    curl http://k8s-default-nginxsam-007de4e883-388582330.ap-northeast-1.elb.amazonaws.com/api/article/list
    sleep 0.5;
done