# Deployment Anleitung für Variante C

Diese Anleitung beschreibt, wie die Anwendung auf der Google Kubernetes Engine (GKE) deployed wird.

## Voraussetzungen

- Zugriff auf das Google Cloud Projekt `waldher-zahnarzt`.
- `gcloud` CLI installiert und konfiguriert.
- `kubectl` installiert.

## Schritte

### 1. Docker Images bauen

**Backend:**
```bash
cd backend
# Stellen Sie sicher, dass Java 21 verwendet wird (oder Docker Build übernimmt es)
mvn clean package -DskipTests
docker build -t gcr.io/waldher-zahnarzt/variantec-backend:latest .
docker push gcr.io/waldher-zahnarzt/variantec-backend:latest
```

**Frontend:**
```bash
cd frontend
docker build -t gcr.io/waldher-zahnarzt/variantec-frontend:latest .
docker push gcr.io/waldher-zahnarzt/variantec-frontend:latest
```

### 2. Kubernetes Deployment

Die Manifeste befinden sich im Ordner `k8s`. Wir verwenden Kustomize.

```bash
cd k8s
kubectl apply -k .
```

### 3. Überprüfung

Prüfen Sie, ob die Pods laufen:
```bash
kubectl get pods
```

Prüfen Sie den Ingress (für die öffentliche IP):
```bash
kubectl get ingress
```
Die Anwendung sollte unter `http://variantec.zahnarzt.waldher.com` (sofern DNS konfiguriert ist) erreichbar sein.

## Vertex AI Konfiguration
Der Backend-Service erwartet, dass der ServiceAccount (default) Workload Identity Zugriff auf Vertex AI hat.
Stellen Sie sicher, dass das Binding existiert:

```bash
gcloud iam service-accounts add-iam-policy-binding \
  <YOUR-GSA-EMAIL> \
  --role roles/aiplatform.user \
  --member "serviceAccount:waldher-zahnarzt.svc.id.goog[default/default]"
```
