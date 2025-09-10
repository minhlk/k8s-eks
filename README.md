## Introduction
Simple application demonstrate using Kubernetes in AWS with:
- EKS K8s Cluster
- Event Driven Architecture using NATs
- Monitoring and Login using Grafana, Loki, Prometheus through Helm charts.
- Gitops for K8s cluster using ArgoCD

## Prerequisites:

- AWS CLI configured.
- Docker installed.
- Helm installed.
- ArgoCD installed on the cluster.
- `kubectl` installed and configured.
- `eksctl` installed.
- Minikube (locally + metric server + ingress addons are enabled)

## Quick Start
1.  **EKS Cluster Setup**:
- Create EKS cluster through AWS console. 
- Create Node Group or Fargate Profile
- Create Role for cluster, Node Group.
- Create Access entry + policy for `kubectl` to access EKS cluster.

2. **Create the namespace**:
    ```bash
    kubectl apply -f manifests/namespace.yml
    ```

3. **Install ArgoCD**:
    ```bash
    helm install argocd argo/argo-cd --namespace argocd
    ```

4. **Create the ArgoCD Project**:
    ```bash
    kubectl apply -f argocd/simple-love-project.yml
    ```

5. **Deploy to Development**:
   ```bash
   kubectl apply -f argocd/application/dev
   ```

6. **Install NATS for event driven communication**:
   ```bash
    helm repo add nats https://nats-io.github.io/k8s/helm/charts/
    helm repo update
    helm upgrade --install nats nats/nats -n simple-love
   ```

7. **Create local DNS (minikube)**:
    ```host
    # File /etc/hosts
    127.0.0.1 simple-love.com
    127.0.0.1 simple-love-monitoring.com
    ```
    
    ```bash
    #Tunnel minikube cluster to localhost
    minikube tunnel
    ```

## Access 
1. **ArgoCD UI**
    ```bash
    minikube service argocd-server -n argocd
    # Get ArgoCD Password (User: admin)
    kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode ; echo
    ```
2. **Grafana UI**
    ```bash
    kubectl get secret -n simple-love-monitoring monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode
    https://simple-love-monitoring.com
    ```

## Cleanup:

- Delete the Kubernetes EKS cluster and Helm related resources (ALB...)
