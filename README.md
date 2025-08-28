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
- Apply the `secret.yml` for database credentials.
- Apply `db.yml`, `backend.yml`, `frontend.yml`, and `worker.yml`.
- Apply `ingress.yml` and how to configure the host for the ALB.
- Mention `hpa.yml` for horizontal pod autoscaling.
- Discuss `pvc.yml` if persistent storage is needed for the database (currently commented out since aws won't support Fargate type for it).

## Monitoring Setup (Optional):

- Monitoring stack (Grafana, Loki - log, Prometheus) using Helm and the provided manifests (`manifests/monitoring/`).

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo update
helm install simple-love-loki grafana/loki-stack --namespace simple-love-monitoring --create-namespace -f grafana-values.yml
helm install simple-love-prometheus prometheus-community/prometheus -n simple-love-monitoring
helm upgrade --install nats nats/nats -n simple-love-queue
```
- Get password to access Grafana

```bash
kubectl get secret -n simple-love-monitoring simple-love-loki-grafana -o jsonpath="{.data.admin-password}" | base64 --decode
```

## Accessing the Application:

- Access Application Load Balancer URL.

## Cleanup:

- Delete the Kubernetes EKS cluster and Helm related resources (ALB...)
