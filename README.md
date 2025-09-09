## Introduction
Simple application demonstrate using Kubernetes in AWS with:
- EKS K8s Cluster
- Event Driven Architecture using NATs
- Monitoring and Login using Grafana, Loki, Prometheus through Helm charts.

## Prerequisites:

- AWS CLI configured.
- `kubectl` installed and configured.
- `eksctl` installed.
- Docker installed.
- Helm installed (for monitoring stack).
- Minikube (locally + metric server + ingress addons are enabled)

## EKS Cluster Setup:

- Create EKS cluster through AWS console. 
- Create Node Group or Fargate Profile
- Create Role for cluster, Node Group.
- Create Access entry + policy for `kubectl` to access EKS cluster.

## Container Image Management:

- Building Docker images for `backend` and `frontend`.
- Pushing images to a container registry (e.g., ECR or Docker Hub).
- Updating image names in Kubernetes manifests.

## Deploying the Application:

- Create the Kubernetes namespace (`simple-love`) `k apply -f namespace.yml`.

## Monitoring Setup (Optional):

- Monitoring stack (Grafana, Loki - log, Prometheus) using Helm

```bash
helm install argocd argo/argo-cd --namespace argocd
k apply -f argocd/simple-love-project.yml -n argocd
k apply -f argocd/application/dev/appsets.yml -n argocd
minikube service argocd-server -n argocd
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode ; echo

helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo update
helm upgrade --install nats nats/nats -n simple-love-queue
```
- Get password to access Grafana

```bash
kubectl get secret -n simple-love-monitoring monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode
```

- Access through minikube + etc with host
- https://simple-love.com (Frontend)
- https://simple-love.com/api (Backend)
- https://simple-love-monitoring.com (Grafana)
```bash
minikube tunnel
```

## Accessing the Application:

- Access Application Load Balancer URL.

## Cleanup:

- Delete the Kubernetes EKS cluster and Helm related resources (ALB...)
