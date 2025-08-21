k apply -f namespace.yml 
k apply -f backend.yml 
k apply -f frontend.yml 
k apply -f ingress.yml 
minikube addons enable ingress


# install loki grafana
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
helm install simple-love-loki grafana/loki-stack --namespace simple-love-monitoring --create-namespace -f grafana-values.yml
kubectl get secret -n simple-love-monitoring simple-love-loki-grafana -o jsonpath="{.data.admin-password}" | base64 --decode
helm repo update

helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm upgrade --install nats nats/nats -n simple-love-queue

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install simple-love-prometheus prometheus-community/prometheus -n simple-love-monitoring

