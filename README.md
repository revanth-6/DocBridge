# DocBridge

> **"Because understanding your health shouldn't require a medical degree."**

DocBridge is an AI-powered post-consultation health companion that helps patients understand their medicines, track prescriptions, interpret lab reports, monitor symptoms, and get plain-language explanations of complex medical information.

---

## Features

- **Medicine Explainer** — Plain-language explanations for every medication
- **Prescription Tracker** — Dosage schedules, refill reminders, side-effect logging
- **Lab Report Interpreter** — Simple explanations for blood work, scans, and tests
- **Symptom Diary** — Track symptoms over time with AI pattern detection
- **AI Health Companion** — GPT-4 powered chat for medical questions (with disclaimers)
- **Smart Questions** — AI-generated questions to ask your doctor at the next visit
- **Family Profiles** — Manage health data for your entire family under one account
- **Health Timeline** — Longitudinal view of your complete health journey

---

## Architecture

```
VM1 (App Server)                          VM2 (Database)
┌────────────────────────────────┐       ┌──────────────────┐
│  Nginx :80                     │       │  PostgreSQL :5432 │
│    ├── /* → React SPA          │       │  docbridge_db    │
│    └── /api/* → Gateway :3000  │       └──────────────────┘
│                                │                ▲
│  API Gateway :3000             │                │
│    ├── /auth     → :3001       │                │
│    ├── /consult  → :3002       │───── TCP ──────┘
│    ├── /prescr   → :3003       │
│    ├── /remind   → :3004       │
│    ├── /lab      → :3005       │
│    ├── /symptom  → :3006       │
│    ├── /ai       → :3007       │
│    ├── /health   → :3008       │
│    └── /family   → :3009       │
└────────────────────────────────┘
```

---

## Quick Start (Docker — Local Development)

### Prerequisites

- Docker & Docker Compose v2+
- Node.js 20+ (for running migrations/seeders outside Docker)

### 1. Clone and configure

```bash
git clone https://github.com/your-org/docbridge.git
cd docbridge
cp .env.example .env
```

### 2. Create service .env files

Each service in `services/` and `gateway/` has a `.env.example`. Copy each to `.env`:

```bash
for dir in gateway services/*/; do
  cp "$dir/.env.example" "$dir/.env"
done
```

### 3. Start everything

```bash
docker-compose up --build -d
```

### 4. Run migrations and seeders

```bash
cd services/auth-service
npx sequelize db:migrate --config ../../database/config/config.js --migrations-path ../../database/migrations
npx sequelize db:seed:all --config ../../database/config/config.js --seeders-path ../../database/seeders
```

### 5. Open the app

- **Frontend**: http://localhost
- **API Gateway**: http://localhost:3000
- **Demo Login**: `demo@docbridge.health` / `Demo@123456`

---

## Production Deployment (Azure VMs)

See [docs/vm-deployment-guide.md](docs/vm-deployment-guide.md) for full instructions.

### Quick steps:

1. **VM2** — Run `scripts/vm2-setup.sh` to install PostgreSQL
2. **VM1** — Edit `scripts/vm1-setup.sh` with VM2 private IP, then run it
3. All services start via PM2 automatically

---

## Project Structure

```
docbridge/
├── frontend/          # React + Vite + TailwindCSS
├── gateway/           # API Gateway (Express + http-proxy-middleware)
├── services/
│   ├── auth-service/          # JWT auth, registration, profile
│   ├── consultation-service/  # Doctor visit records
│   ├── prescription-service/  # Medicine tracking & side effects
│   ├── reminder-service/      # Medicine & follow-up reminders
│   ├── labreport-service/     # Lab results & interpretation
│   ├── symptom-service/       # Symptom diary & trends
│   ├── ai-companion-service/  # Azure OpenAI GPT-4 integration
│   ├── health-summary-service/# Dashboard aggregation
│   └── family-service/        # Family member management
├── database/          # Migrations, seeders, schema
├── scripts/           # VM setup & health check scripts
├── docs/              # Deployment guide, API reference, Postman
├── docker-compose.yml # Local development
└── ecosystem.config.js# PM2 production config
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS 3, Redux Toolkit, Recharts |
| API Gateway | Express, http-proxy-middleware |
| Backend | Express, Sequelize ORM, Zod validation |
| Database | PostgreSQL 15 |
| AI | Azure OpenAI GPT-4 |
| Process Manager | PM2 |
| Web Server | Nginx |
| Auth | JWT (access + refresh tokens), bcryptjs |

---

## API Documentation

See [docs/api-reference.md](docs/api-reference.md) for the complete API specification.

Import [docs/postman/DocBridge.postman_collection.json](docs/postman/DocBridge.postman_collection.json) into Postman for interactive testing.

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `docbridge_db` |
| `DB_USER` | Database user | `docbridge_user` |
| `DB_PASSWORD` | Database password | — |
| `JWT_ACCESS_SECRET` | Access token secret (32+ chars) | — |
| `JWT_REFRESH_SECRET` | Refresh token secret (32+ chars) | — |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint URL | — |
| `AZURE_OPENAI_KEY` | Azure OpenAI API key | — |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | GPT-4 deployment name | `gpt-4` |

---

## Security & Production Hardening

DocBridge has undergone a comprehensive production readiness assault and security hardening phase. Key security implementations include:
- **XSS Protection**: Strict input sanitization across all endpoints to prevent Stored XSS.
- **Payload Limits**: Gateway-level 100kb payload limits to mitigate memory exhaustion DoS attacks.
- **Service Mesh Hardening**: All internal microservices are bound to `127.0.0.1`, ensuring they are strictly accessible only via the API Gateway.
- **Idempotency & Race Conditions**: Enforced idempotency keys on sensitive operations and strict database-level referential integrity to prevent duplicate entries and orphaned records.
- **Resilience**: The global dashboard (Health Summary Service) degrades gracefully, providing partial data even if individual microservices experience outages.

---

## Testing (Regression Suite)

A robust regression test suite is built into the project to guarantee security, stability, integrity, and standard CRUD behaviors.

To execute the regression test suite against a running local environment:
```bash
# Ensure PM2 cluster and Postgres are running
npm run test:regression
```
The suite will test payload limits, missing/tampered JWTs, double deletions, rate-limiting isolation, and endpoint latencies.

---

## Azure Deployment

The platform is designed to be deployed on Azure Kubernetes Service (AKS) with Managed PostgreSQL and Azure Cache for Redis.

All deployment manifests and migration runbooks are located in the [`azure/`](./azure) folder:
- **`docbridge-deployment.yml`**: Full Kubernetes manifest (Deployments, Services, Ingress, HorizontalPodAutoscalers).
- **`redis-migration.md`**: Guide for migrating the in-memory API Gateway rate limiter to Azure Cache for Redis.
- **`postgres-migration.md`**: Runbook for transitioning from local Docker PostgreSQL to Azure Database for PostgreSQL Flexible Server.
- **`key-vault-setup.md`**: Guide for injecting secrets securely via Azure Key Vault CSI provider.

---

## CI/CD Pipeline

The project utilizes GitHub Actions for Continuous Integration and Continuous Deployment.
The workflow is defined in [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

The pipeline automatically triggers on pushes to the `main` branch and pull requests. It performs:
1. **Linting & Unit Testing**: Verifies code health and runs the regression suite in a headless environment.
2. **Container Build & Push**: Builds Docker images for all 8 microservices and pushes them to Azure Container Registry (ACR).
3. **Deployment**: Deploys the updated images to the Azure Kubernetes Service (AKS) cluster using rolling updates to ensure zero downtime.

---

## License

MIT
