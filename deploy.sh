#!/bin/sh

Starting Cluster
echo Starting Cluster
echo Checking if minikube is installed...
if ! [ -x "$(command -v minikube)" ]; then
  # Install Minikube
  echo Installing Minikube
  curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube
  sudo install minikube /usr/local/bin
fi

# Start Minikube
minikube start 


#Building Docker Images
echo Building Docker Images
docker-compose up
# kubectl build -t simonazilb/create-user:latest -f create-user/Dockerfile


#Create Pod/Deploy
echo Deploying Kubernetes
kubectl apply -f ./infra/k8s/

#Waiting for Deployment
echo waiting...
sleep 5

#show Pods
kubectl get pods