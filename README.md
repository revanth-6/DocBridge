# DocBridge

> **"Because understanding your health shouldn't require a medical degree."**

DocBridge is a production-grade, AI-powered post-consultation health companion. Built on a resilient microservices architecture, it bridges the gap between complex clinical data and patient understanding by translating prescriptions, doctor logs, and lab results into clear, actionable, plain-language insights.

The platform provides patients with medication scheduling, smart reminders, family profile management, and a unified health timeline—all while maintaining high security, strict validation, and database integrity.

---

## 📖 Table of Contents

1. [Features](#-features)
2. [Architecture](#-architecture)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Environment Variables](#-environment-variables)
6. [Security & Production Hardening](#-security--production-hardening)
7. [Getting Started (Local Development)](#-getting-started-local-development)
    - [Prerequisites](#prerequisites)
    - [First-Time Setup](#first-time-setup-run-once)
    - [Starting the App](#starting-the-app)
    - [Stopping the App](#stopping-the-app)
8. [Important Notes for Windows Users](#-important-notes-for-windows-users)
9. [Troubleshooting](#-troubleshooting)
10. [Testing (Regression Suite)](#-testing-regression-suite)
11. [Azure Deployment](#-azure-deployment)
12. [Future Roadmap](#-future-roadmap)
13. [License](#-license)

---

## 🌟 Features

*   **Consultation Logger** — Record every doctor visit with diagnoses, dynamic clinical notes, and physician information.
*   **Prescription Tracker** — Manage active medications, track dosage instructions, and log potential side effects.
*   **Medicine Reminders** — Configure scheduled medicine timers with specific before/after food rules.
*   **Follow-up Reminders** — Schedule medical checkups, subsequent doctor appointments, or testing slots.
*   **Lab Report Interpreter** — Log and review comprehensive blood work values with automatic normal range visual indicators.
*   **Symptom Diary** — Maintain a daily timeline of symptoms with severity scoring and description logs.
*   **Family Profiles** — Seamlessly manage and toggle medical records for multiple family members under a single unified account.
*   **Health Dashboard** — View a aggregated health status summary showing active medications, upcoming follow-ups, and recent symptoms.
*   **AI Health Companion** — Chat in real-time with a GPT-4 powered virtual health companion (requires Azure OpenAI credentials; degrades gracefully with a fallback if unconfigured).

---

## 🏗️ Architecture

DocBridge is engineered as a distributed microservice network, fronted by an API Gateway. The entire ecosystem is deployed across two dedicated virtual servers in production:

*   **VM1 (Application Server)**: Runs Nginx as a reverse proxy, the React Single Page Application (SPA), the Express-based API Gateway, and all 9 standalone Express microservices managed continuously by PM2.
*   **VM2 (Database Server)**: Houses a dedicated PostgreSQL 15 server, isolating data storage and enforcing security barriers.
*   **External Service**: Integrates with Azure OpenAI services for advanced clinical text summarization and conversation features.

```
VM1 (Application Server)                              VM2 (Database Server)
┌───────────────────────────────────────────────┐     ┌─────────────────────┐
│  Nginx (Port 80/443)                          │     │  PostgreSQL :5432   │
│    ├── /* → React SPA (:5173 / static)        │     │  (docbridge_db)     │
│    └── /api/* → API Gateway (:3000)           │     └─────────────────────┘
│                                               │                ▲
│  API Gateway (Port 3000)                      │                │
│    ├── /api/v1/auth         → Port 3001       │                │
│    ├── /api/v1/consultations→ Port 3002       │                │
│    ├── /api/v1/prescriptions→ Port 3003       │───── TCP ──────┘
│    ├── /api/v1/reminders    → Port 3004       │
│    ├── /api/v1/lab-reports  → Port 3005       │
│    ├── /api/v1/symptoms     → Port 3006       │
│    ├── /api/v1/ai           → Port 3007       │───── HTTPS ────┐
│    ├── /api/v1/health-summary→Port 3008       │                ▼
│    └── /api/v1/family       → Port 3009       │        [ Azure OpenAI ]
└───────────────────────────────────────────────┘        [    (GPT-4)   ]
```

### Port Mapping Summary

| Service Name | Port | Description |
| :--- | :--- | :--- |
| **API Gateway** | `3000` | Single entry point; handles rate limiting, authentication headers, and path routing |
| **Auth Service** | `3001` | Manages user registration, secure login sessions, JWT tokens, and user profiles |
| **Consultation Service** | `3002` | Manages patient physician visit logs and medical diagnoses |
| **Prescription Service** | `3003` | Tracks active medications, dosages, and drug side-effect records |
| **Reminder Service** | `3004` | Handles dosage reminders and checkup follow-up alerts |
| **Lab Report Service** | `3005` | Logs and monitors clinical blood panel variables |
| **Symptom Service** | `3006` | Manages severity logging and descriptions of physical symptoms |
| **AI Companion Service** | `3007` | Connects securely to Azure OpenAI endpoints for clinical companion chats |
| **Health Summary Service** | `3008` | Generates aggregated dashboard snapshots and unified timelines |
| **Family Service** | `3009` | Manages sub-profiles for family members linked to an account |

---

## 💻 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, TailwindCSS 3, Redux Toolkit, Axios, Recharts | Premium glassmorphic UI, centralized global state, and fluid data charts |
| **API Gateway** | Express, http-proxy-middleware, express-rate-limit, node-cache | Handles incoming reverse proxying, CORS policy preflights, and request limits |
| **Backend Services** | Express, Sequelize ORM, Zod, bcryptjs | Standalone Node.js services utilizing relational database query interfaces |
| **Database** | PostgreSQL 15 | Strict referential integrity, foreign constraints, and relation mapping |
| **Process Manager**| PM2 | Multi-process daemon management, clustering, and log rotation |
| **Web Server** | Nginx | Enforces production-grade static asset serving and SSL termination |
| **Authentication** | JWT (Dual Access + Refresh Tokens) | Statless microservice authorization; 15-minute access, 7-day refresh lifecycle |
| **Containerization**| Docker & Docker Compose | Used to orchestrate isolated PostgreSQL services in local development |

---

## 📂 Project Structure

```text
docbridge/
├── .env                  # Root environment variables
├── docker-compose.yml    # Development PostgreSQL database container
├── ecosystem.config.js   # PM2 process configuration for clustering
├── package.json          # Root dependencies (cross-env, axios for test running)
├── database/             # Shared database structure
│   ├── config/           # Sequelize database credentials config
│   ├── migrations/       # SQL Schema definition scripts (11 files)
│   └── seeders/          # Initial sandbox dataset seeding scripts (6 files)
├── gateway/              # API Gateway Service (Port 3000)
│   ├── src/
│   │   ├── app.js        # Express middleware and rate limit loading
│   │   ├── proxy/        # http-proxy-middleware path configuration
│   │   └── middleware/   # JWT verification, CORS mapping, rate limit rules
│   └── .env              # Gateway config parameters
├── frontend/             # Single Page Application
│   ├── src/
│   │   ├── api/          # Interceptors, authorization headers, and API methods
│   │   ├── context/      # React Auth Context state hooks
│   │   ├── components/   # Modular dashboard UI containers
│   │   └── pages/        # Fully functional microservice views (Dashboard, Logs, etc.)
│   └── .env              # Frontend client config
├── services/             # Autonomous microservices
│   ├── auth-service/     # Handles registrations, login flows, profiles (Port 3001)
│   ├── consultation-service/ # Logs consultations and visits (Port 3002)
│   ├── prescription-service/ # Tracks medication dosages and schedules (Port 3003)
│   ├── reminder-service/ # Schedules dosage alerts and appointments (Port 3004)
│   ├── labreport-service/# Logs blood panels and indicators (Port 3005)
│   ├── symptom-service/  # Stores symptom diaries and descriptions (Port 3006)
│   ├── ai-companion-service/ # Interfaces with Azure OpenAI GPT-4 (Port 3007)
│   ├── health-summary-service/ # Aggregates dashboard summaries (Port 3008)
│   └── family-service/   # Manages patient family links (Port 3009)
├── azure/                # Enterprise Deployment Assets
│   ├── aks-deployment.yml# Kubernetes cluster configuration yml
│   ├── key-vault-setup.md# Azure Key Vault CSI provider integration guide
│   ├── postgres-migration.md # Flexible Server PostgreSQL migration guide
│   └── redis-migration.md    # Gateway Rate Limiter to Azure Redis guide
├── deploy/               # Production VM setup (vm1-setup.sh, vm2-setup.sh) & deploy scripts
├── scripts/              # Scaffolding and codebase generator scripts
└── tests/                # Verification Suite
    ├── health-check.js   # Automated API Gateway check script
    └── regression/       # End-to-end security, stability, integrity tests
```

---

## 🔑 Environment Variables

To run the application, configure the environment variables across all services. They are grouped into two primary classes:

### 1. General & Database Variables (Required)

| Variable | Description | Recommended/Default Value |
| :--- | :--- | :--- |
| `NODE_ENV` | Mode of the application runtime | `development` (local) or `production` |
| `PORT` | Listening port for the specific service | Automatically loaded based on the service mapping |
| `CORS_ORIGIN` | Allowed domains for web requests | `http://localhost:5173,http://localhost:5174` |
| `DB_HOST` | Database server address | `localhost` (local dev) or VM2 Private IP |
| `DB_PORT` | Database server port | `5432` |
| `DB_NAME` | Database catalog name | `docbridge_db` |
| `DB_USER` | DB administrative user | `docbridge_user` |
| `DB_PASSWORD` | DB secure access password | `DocBridge@2024Secure` |
| `JWT_ACCESS_SECRET` | Secret key used to sign Access JWTs | *Generate a strong 32+ character key* |
| `JWT_REFRESH_SECRET`| Secret key used to sign Refresh JWTs | *Generate a strong 32+ character key* |
| `JWT_ACCESS_EXPIRY` | Access JWT expiration lifecycle | `15m` |
| `JWT_REFRESH_EXPIRY`| Refresh JWT expiration lifecycle | `7d` |

### 2. Azure OpenAI Variables (Required only for AI Companion)

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `AZURE_OPENAI_ENDPOINT` | Azure Cognitive Services URL endpoint | `https://your-resource.openai.azure.com/` |
| `AZURE_OPENAI_KEY` | Secret access key for Azure API | *Your key value* |
| `AZURE_OPENAI_DEPLOYMENT_NAME`| Azure GPT-4 model deployment mapping | `gpt-4` |
| `AZURE_OPENAI_API_VERSION` | API schema version for Azure Cognitive Services | `2024-02-15-preview` |

> [!NOTE]
> The AI Health Companion degrades gracefully with a fallback message if Azure credentials are not set. All other features (Prescriptions, Reminders, Lab Reports, Symptoms, etc.) operate 100% locally without Azure keys.

---

## 🛡️ Security & Production Hardening

DocBridge has been hardened against security threats, system instability, and load fatigue:

*   **Stateless Token Auth Lifecycle**: Enforces secure dual JWT validation. Access tokens expire in 15 minutes, while refresh tokens reside securely in localStorage to request seamless credentials replacement.
*   **Password Hashing**: Passwords are securely hashed before database entry inside the Sequelize hooks using `bcryptjs` with salt round `12`.
*   **API Gateway Rate Limiting**: Mitigates brute-force attacks. Limits:
    *   Auth endpoints (`/login`, `/register`): **10 requests per 15 minutes** per IP.
    *   AI Companion endpoint (`/ai`): **20 requests per 15 minutes** per User.
    *   All other routes: **100 requests per 15 minutes** per IP.
*   **Payload Size Restrictions**: Enforces an Express body parser payload ceiling of **`100KB`** across the gateway and services, preventing heap allocation memory exhaustion attacks.
*   **XSS Input Sanitization**: All inbound parameters are parsed to strip out malicious `<script>` or other elements, preventing stored Cross-Site Scripting (XSS).
*   **Service Isolation**: Backend microservices bind strictly to `127.0.0.1`. They are completely inaccessible directly from the public internet and accept connections exclusively via Gateway routing.
*   **CORS Domain Verification**: Enforces rigorous CORS mapping, validating against a comma-separated whitelist and dynamically permitting any local development origins (such as `http://localhost:*` or `http://127.0.0.1:*`) for developer efficiency.
*   **Graceful Microservice Degradation**: The central health dashboard loads gracefully. If a microservice is down, it displays elegant "Offline" place-markers rather than crashing the interface.

---

## 🚀 Getting Started (Local Development)

This guide walks you through setting up a complete local development environment from scratch.

### Prerequisites

*   **Node.js**: Version `v20` or higher installed
*   **Docker Desktop**: Running locally
*   **Git**: Version command-line tool
*   **Shell/Terminal**: PowerShell on Windows, or standard Terminal on macOS and Linux

---

### First-Time Setup (Run Once)

#### 1. Clone the Repository
```bash
git clone https://github.com/your-org/docbridge.git
cd docbridge
```

#### 2. Copy the Environment Configuration Files
You must copy the environment template files (`.env.example`) to their active `.env` counterparts.

*   **On Windows (PowerShell)**:
    ```powershell
    Copy-Item .env.example .env
    Copy-Item gateway/.env.example gateway/.env
    Copy-Item services/auth-service/.env.example services/auth-service/.env
    Copy-Item services/consultation-service/.env.example services/consultation-service/.env
    Copy-Item services/prescription-service/.env.example services/prescription-service/.env
    Copy-Item services/reminder-service/.env.example services/reminder-service/.env
    Copy-Item services/labreport-service/.env.example services/labreport-service/.env
    Copy-Item services/symptom-service/.env.example services/symptom-service/.env
    Copy-Item services/ai-companion-service/.env.example services/ai-companion-service/.env
    Copy-Item services/health-summary-service/.env.example services/health-summary-service/.env
    Copy-Item services/family-service/.env.example services/family-service/.env
    ```

*   **On macOS / Linux (Terminal)**:
    ```bash
    cp .env.example .env
    cp gateway/.env.example gateway/.env
    for dir in services/*/; do
      cp "$dir.env.example" "$dir.env"
    done
    ```

#### 3. Install Microservice Dependencies
Install all package dependencies across the entire workspace in one command.

*   **On Windows (PowerShell)**:
    ```powershell
    npm install
    cd gateway; npm install; cd ..
    Get-ChildItem services/ -Directory | ForEach-Object { cd $_.FullName; npm install; cd ../.. }
    ```

*   **On macOS / Linux (Terminal)**:
    ```bash
    npm install
    for dir in gateway services/*/; do
      (cd "$dir" && npm install)
    done
    ```

#### 4. Spin Up the Database Container
Launch the isolated PostgreSQL instance:
```bash
docker-compose up -d postgres
```

#### 5. Execute Database Migrations and Seeders
Run the relational migrations and pre-populate the development environment with clean sandbox data.
```bash
# Enter the database folder
cd database

# Run all schema migrations
npm run migrate

# Populate database with initial mock users and medical data
npm run seed

# Return to root directory
cd ..
```

#### 6. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

#### 7. Verify Microservice Network Connectivity
Ensure the services can connect to the database and start up cleanly by running the diagnostic tool:
```bash
# Spin up backend processes via PM2
npx pm2 start ecosystem.config.js

# Wait 5 seconds for PostgreSQL handshakes
# Then execute the health checker
node tests/health-check.js
```
All services should return `✅ 200 OK`.

---

### Starting the App

Follow these three simple steps to start the application once the first-time setup is complete:

1.  **Terminal 1 — Database & Backend Services** (Run from the project root):
    ```bash
    docker-compose up -d postgres
    npx pm2 start ecosystem.config.js
    ```
2.  **Terminal 2 — Frontend client** (Run from the `frontend` directory):
    ```bash
    cd frontend
    npm run dev
    ```
3.  **Terminal 3 — Verify Network Status** (*Optional but highly recommended*):
    ```bash
    node tests/health-check.js
    ```

Once running, open your web browser and navigate to **`http://localhost:5173`**.

> [!IMPORTANT]
> **Demo Sandbox Credentials**
> *   **Email**: `demo@docbridge.health`
> *   **Password**: `Demo@123456`

---

### Stopping the App

To shut down the stack, execute the following commands in order:

1.  **Stop Frontend Client**: Press `Ctrl + C` inside Terminal 2.
2.  **Stop Backend Services**:
    ```bash
    npx pm2 stop all
    ```
3.  **Shut Down Database Container**:
    ```bash
    docker-compose down
    ```

> [!CAUTION]
> Always execute `docker-compose down` **last** (after stopping PM2 services). Never shut down the database while backend nodes are active to avoid connection errors on your next start.

---

## 🪟 Important Notes for Windows Users

*   **Powershell execution of `curl`**: By default, Windows PowerShell aliases `curl` to `Invoke-WebRequest` (which parses headers differently and will fail). Always call **`curl.exe`** directly or use the built-in health-check script:
    ```bash
    node tests/health-check.js
    ```
*   **Port 5173 Conflicts**: If Vite starts the application on port `5174` (or another port), it means an orphan process is occupying `5173`. Find the offending PID and kill it using:
    ```powershell
    # Search for port 5173 PID
    netstat -ano | findstr :5173
    
    # Force close the PID found
    taskkill /PID <PID-Number> /F
    ```
*   **Command Directory Execution**: Always execute `docker-compose` commands directly from the project root directory. Do not trigger them from inside directories like `frontend/` or `services/`.

---

## 🔍 Troubleshooting

| Issue | Root Cause | Resolution |
| :--- | :--- | :--- |
| **Registration fails with "Registration failed" / CORS error** | Port conflict. Vite started on port `5174` while `.env` is configured for `5173`. | Free port `5173` (see Windows steps above) or update `CORS_ORIGIN` in `.env` to include your exact Vite port. |
| **Microservices crash on startup** | PostgreSQL container wasn't ready to receive handshakes when services booted. | Wait 5 seconds after starting Docker before launching PM2. |
| **Dashboard summary returns a 5MB response** | Database was populated with too much raw logging/stats data from older runs. | Reset PM2 service workers to clear memory and connections: `npx pm2 restart docbridge-consultation docbridge-health-summary`. |
| **Port 5173 is already in use** | An orphan node worker is listening on port `5173`. | Find the PID using `netstat -ano \| findstr :5173` and terminate it using `taskkill /PID <PID> /F`. |
| **curl fails inside Windows terminals** | Windows environment alias issue. | Run `curl.exe` explicitly, or run the native Node tool: `node tests/health-check.js`. |
| **PM2 nodes show Red "error" status** | Connection to PostgreSQL was lost or dropped. | Bring up Postgres, then restart PM2: `docker-compose up -d postgres && npx pm2 restart all`. |
| **Initial Login takes over 2 seconds** | Sequelize is initiating database connection pooling. | Expected behavior. Subsequent logins will execute in milliseconds. |

---

## 🧪 Testing (Regression Suite)

DocBridge has a robust test suite designed to verify security policies, database stability, microservice boundaries, and CRUD workflows.

Ensure all services are running (`npx pm2 status`), then execute:

```bash
# Runs the full regression test suite
npm run test:regression
```

### Individual Test Runs

*   **Security Policies** (Payload limits, XSS parsing, missing headers):
    ```bash
    npm run test:security
    ```
*   **Stability Metrics** (Outage resilience, graceful fallbacks):
    ```bash
    npm run test:stability
    ```
*   **Data Integrity** (Constraints, double-deletions):
    ```bash
    npm run test:integrity
    ```
*   **CRUD Workflows** (Creation, editing, fetching data):
    ```bash
    npm run test:crud
    ```

*Expected output: All 17/17 regression tests passing.*

---

## ☁️ Azure Deployment

All Kubernetes infrastructure resources, Ingress controllers, and data store migration guides are located under [**`azure/`**](./azure):

*   [**`aks-deployment.yml`**](./azure/aks-deployment.yml) — Production Kubernetes deployment manifest featuring Autoscalers (HPA), LoadBalancers, and Ingress routing rules.
*   [**`key-vault-setup.md`**](./azure/key-vault-setup.md) — Guide for secure database credentials injection using Azure Key Vault CSI Providers.
*   [**`postgres-migration.md`**](./azure/postgres-migration.md) — Steps for migrating data to Azure Database for PostgreSQL Flexible Server.
*   [**`redis-migration.md`**](./azure/redis-migration.md) — Instructions for migrating the API Gateway rate limiter to Azure Cache for Redis.

---

## 🗺️ Future Roadmap

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 1** | Consultation logs, prescriptions, medicine reminders, family member lists, health dashboard | ✅ **Complete** |
| **Phase 2** | Lab reports interpreter, symptom diary logging, dashboard aggregation | ✅ **Complete** |
| **Phase 3** | AI Companion chat with Azure OpenAI integration | 🔧 **Ready** (requires Azure OpenAI keys) |
| **Phase 4** | Multilingual localization (Hindi, Tamil, Telugu, Bengali) | 📋 Planned |
| **Phase 5** | Physician clinical interface dashboard | 📋 Planned |
| **Phase 6** | EMR/EHR Hospital integration | 📋 Planned |
| **Phase 7** | Wearable IoT device telemetry syncing | 📋 Planned |

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
