#Hello World using Node

## Best Thing To Change
./node-app/views/index.pug

Add/remove p,br,hr lines

## Run The Whole Setup Localy With docker-compose
Download the repo and then run the following two commands
from the same base directory next to the docker-compose.yml
Make sure you don't have anything running on port 8000 already locally

docker-compose build
docker-compose up -d --scale node-app=6

Browse to the website at "http://localhost:8000"

## Develop Locally 
If you don't have NPM install that first 
Download the repo and then cd into node_app directory
Download the packages with:

npm install

then run the app with

node server.js

Browse to the website at "http://localhost:3000"


## Running it on Kubernetes
The traefik load-balancer in the compose file is for quick seeing demo locally.  You could use it as the ingress controller or use nginx.  Really you don't need an ingress controller because you can just use the google load-balancer so i suggest ignoring this things existence for now.  

Need to build the Dockerfile under node-app and deploy it to a registery (googles register in the projct)

Need to deploy to k8s an redis server accessable to other workloads (google has a cached one at: k8s.gcr.io/redis:e2e) don't reboot this or it will lose the global count or you could attach persistent storage to it. You could make a redis cluster with master/slaves but probably not needed for the demo. Though the google guestbook example shows how to create one and use it for another service. 
Need to expose this as a service internally for other apps in the cluster to use. You'll need to set this service name and port below passed in to the node containers for redis access. 

Need to deploy to k8s XXXX number of node-app images running and make sure to pass in the following running environment variables:
- NODE_ENV=development
- REDIS_HOSTNAME=redis
- REDIS_PORT=6379
- SITE_VERSION=v1.0
- SITE_NAME=Cloud Team Example App

Create service via the gui that creates an external load-balancer pointed to the node-app running pods for users to hit. 

Here is googles example of deploying a guest-book app with redis its basically the exact same thing as this except the frontend app is the container we built before instead of gcr.io/google-samples/gb-frontend:v4
https://cloud.google.com/kubernetes-engine/docs/tutorials/guestbook