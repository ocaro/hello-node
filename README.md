# Hello World using Node

## Build the container image

`docker build --tag hello-node:latest .`

## Run the app in GCP

Deploy the image.
`docker tag hello-node:latest gcr.io/project/hello-node:latest`
`docker push gcr.io/project/hello-node:latest`

## Run the app

Deploy the app using a one pod replica.
`kubectl create deployment hello-node --image=gcr.io/project/hello-node`

Undeploy the app.
`kubectl delete deployment/hello-node`

Allow accessing the web app via a HTTP load balancer.
`kubectl expose deployment hello-node --type=LoadBalancer --port=8080`

Scale the app if CPU usage hits 5%
`kubectl autoscale -f hello-node-deployment.yaml --min=1 --max=3 --cpu-percent=05`

Read the horizontal pod scaling policy
`kubectl get hpa`

Watch pods activity.
`kubectl get pods --watch`

Cause scaling from k8s.
`kubectl run -i --tty service-test --image=busybox /bin/sh`
`while true; do wget -q -O- http://host_ip_not_localhost:8080; done`

Cause autoscaling from your computer.
`while true; do curl http://localhost:8080; done > /dev/null 2>&1`

## Using the k8s Dashboard in Docker Desktop

Use your local k8s cluster.
`kubectl config get-contexts`
`kubectl config use-context docker-for-desktop`

Run the dashboard.
`kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/aio/deploy/recommended/kubernetes-dashboard.yaml`

Create an administrator user.
`kubectl apply -f dashboard-adminuser.yaml`

Get an authorization token to logon as the administrator user.
`kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')`

Run a local web proxy.
`kubectl proxy`

Open the dashboard and logon.
`http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/`

## Using a local private registry in k8s Docker Desktop

Create a registry login user for k8s
`mkdir auth`
`docker run --entrypoint htpasswd registry:2 -Bbn k8s-user k8s-password > auth/htpasswd`

Run the local private registry using the user
`docker run --detach --publish 5000:5000 --restart=always -v "$(pwd)"/auth:/auth --name registry registry:2`

Configure k8s to use the local registry

`kubectl create secret docker-registry regcred --docker-server=localhost:5000 --docker-username=k8s-user --docker-password=k8s-password --docker-email=noreply@localhost`

## Run the app in k8s Docker Desktop

Deploy the image.
`docker tag hello-node:latest localhost:5000/k8s-user/hello-node:latest`
`docker push localhost:5000/k8s-user/hello-node:latest`

Deploy the app.
`kubectl apply -f hello-node-deployment.yaml`

Undeploy the app.
`kubectl delete -f hello-node-deployment.yaml`
