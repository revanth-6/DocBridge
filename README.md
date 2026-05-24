# DocBridge 🏥
### Your Post-Consultation Health Companion

> *"Because understanding your health shouldn't require a medical degree."*

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Architecture](#architecture)
- [Microservices](#microservices)
- [Tech Stack](#tech-stack)
- [AI Integration](#ai-integration)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Azure Services](#azure-services)
- [Future Roadmap](#future-roadmap)

---

## Overview

DocBridge is a microservices-based post-consultation 
health companion application that bridges the gap between 
what doctors say and what patients actually understand.

Every day, millions of patients leave doctor consultations 
confused, holding a prescription they don't understand, 
with lab reports full of numbers that mean nothing to them. 
DocBridge solves this by providing an intelligent, 
personalized health companion that explains medicines, 
tracks symptoms, interprets lab reports, and answers 
every health question — all in plain, simple language.

---

## Problem Statement

Healthcare communication in India and across the world 
is fundamentally broken from the patient's perspective:

- **80% of patients** leave doctor consultations without 
  fully understanding what was said
- Prescriptions contain **multiple medicines with zero 
  explanation** of purpose, side effects, or interactions
- **Medical jargon** — inflammation, benign, differential 
  diagnosis — is incomprehensible to most patients
- Lab reports return with numbers that patients 
  **cannot interpret** without medical knowledge
- Patients are **too intimidated** to ask questions 
  during the 5-minute consultation window
- **Medication non-compliance** due to confusion causes 
  thousands of preventable health deteriorations annually
- People turn to **Google** and get terrified by 
  worst-case medical scenarios
- There is **no persistent, personalized** health 
  companion that knows YOUR medicines, YOUR conditions, 
  and YOUR history

---

## Solution

DocBridge provides patients with a comprehensive 
post-consultation companion that:

1. **Logs** every doctor consultation with diagnosis 
   and notes
2. **Explains** every prescribed medicine in plain 
   simple language
3. **Reminds** patients to take medicines at the 
   right time with the right instructions
4. **Interprets** lab report values against normal 
   ranges with simple explanations
5. **Tracks** symptoms and checks if they are related 
   to medicines or need doctor attention
6. **Generates** smart questions for the next 
   doctor visit
7. **Answers** any health question through an AI 
   companion that knows the patient's complete 
   health context
8. **Summarizes** the patient's current health 
   status in one unified dashboard

---

## Architecture

DocBridge follows a **3-Tier Microservices Architecture**:

```text
┌─────────────────────────────────────────────┐
│ TIER 1 — PRESENTATION                       │
│ React.js Frontend                           │
└─────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────┐
│ TIER 2 — LOGIC                              │
│                                             │
│ ┌──────────────┐ ┌───────────────────────┐ │
│ │ Auth Service │ │ Consultation Service  │ │
│ └──────────────┘ └───────────────────────┘ │
│                                             │
│ ┌──────────────┐ ┌───────────────────────┐ │
│ │ Prescription │ │ Reminder Service      │ │
│ │ Service      │ └───────────────────────┘ │
│ └──────────────┘                           │
│                                             │
│ ┌──────────────┐ ┌───────────────────────┐ │
│ │ Symptom      │ │ Lab Report Service    │ │
│ │ Tracker      │ └───────────────────────┘ │
│ └──────────────┘                           │
│                                             │
│ ┌──────────────┐ ┌───────────────────────┐ │
│ │ AI Companion │ │ Health Summary        │ │
│ └──────────────┘ │ Service               │ │
│                  └───────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────┐
│ TIER 3 — DATA                               │
│ PostgreSQL Database per Microservice        │
└─────────────────────────────────────────────┘
```


### Architecture Principles

- **Separation of Concerns** — Each microservice 
  handles one specific domain
- **Database per Service** — Each microservice owns 
  its data, no shared databases
- **API Gateway Pattern** — Single entry point for 
  all client requests
- **Independent Deployability** — Each service can 
  be deployed, scaled, and updated independently
- **3-Tier Compliance** — Presentation, Logic, and 
  Data layers are clearly separated

---

## Microservices

DocBridge is composed of 8 microservices:

### 1. Auth/User Service
**Port: 3001**

Handles all authentication and user management 
including registration, login, profile management, 
and family member profiles.

**Responsibilities:**
- User registration and login with JWT authentication
- Personal health profile management — age, blood group, 
  known conditions, allergies
- Family profile management — manage health profiles 
  for spouse, parents, and children
- Token validation for all other services

---

### 2. Consultation Service
**Port: 3002**

Manages the logging and retrieval of all doctor 
consultation records.

**Responsibilities:**
- Log doctor visits with diagnosis, notes, 
  doctor name, specialty, hospital, and date
- Maintain a chronological consultation timeline
- Link consultations to their corresponding prescriptions
- Support for multiple family member consultations

---

### 3. Prescription Service
**Port: 3003**

Manages all medicine prescriptions linked to 
consultations.

**Responsibilities:**
- Add medicines with name, dosage, frequency, 
  duration, and special instructions
- Track active vs completed medicine courses
- Record side effects experienced against 
  specific medicines
- Link prescriptions to consultations

---

### 4. Reminder Service
**Port: 3004**

Handles two types of reminders — medicine reminders 
and follow-up reminders.

**Responsibilities:**
- Create recurring medicine reminders based on 
  prescription schedule
- Handle before-food and after-food timing context
- Allow users to mark medicines as taken or skipped
- Track medication compliance over time
- Create one-time follow-up reminders for 
  appointments and tests
- Send push notifications via Azure Notification Hubs

---

### 5. Lab Report Service
**Port: 3005**

Manages manual entry and AI-powered interpretation 
of lab test results.

**Responsibilities:**
- Accept manual entry of lab test values with 
  test name, value, unit, and date
- Store normal range data for common tests
- Provide AI-powered explanations comparing 
  patient values against normal ranges
- Track trends of the same test over multiple dates
- Flag values significantly outside normal range

---

### 6. Symptom Tracker Service
**Port: 3006**

Allows patients to log symptoms they experience 
after diagnosis or starting medicines.

**Responsibilities:**
- Log daily symptoms with severity level and description
- Cross-reference symptoms with current medicines 
  to check if it is a known side effect
- AI assessment of whether a symptom warrants 
  immediate doctor attention
- Symptom history and pattern tracking
- Generate symptom summary for doctor visits

---

### 7. AI Companion Service
**Port: 3007**

The conversational intelligence layer of DocBridge — 
the heart of the application.

**Responsibilities:**
- Maintain persistent chat history per user
- Load complete user health context before 
  every response — conditions, medicines, 
  allergies, recent labs, recent symptoms
- Explain any medicine in plain language 
  personalized to the user's context
- Interpret lab report values conversationally
- Assess symptom severity and possible causes
- Generate smart questions for upcoming 
  doctor consultations
- Answer any general health query with 
  appropriate medical disclaimers
- Always recommend professional consultation 
  for serious concerns

---

### 8. Health Summary Service
**Port: 3008**

Aggregates data from all services into a single 
unified health dashboard view.

**Responsibilities:**
- Compile current active conditions from 
  consultation history
- List all currently active medicines
- Show today's pending medicine reminders
- Display upcoming follow-up appointments and tests
- Highlight recent lab values that are outside 
  normal range
- Show recently logged symptoms
- Provide a complete at-a-glance health snapshot

---

## Tech Stack

### Frontend
- **React.js** — Component-based UI framework
- **Axios** — HTTP client for API calls
- **React Router** — Client-side navigation
- **CSS / Tailwind CSS** — Styling

### Backend
- **Node.js** — Runtime environment
- **Express.js** — Web framework for each microservice
- **JWT** — Authentication tokens
- **bcrypt** — Password hashing

### Database
- **PostgreSQL** — Relational database
- One independent PostgreSQL instance per microservice

### AI
- **Azure OpenAI Service (GPT-4)** — Powers the 
  AI Companion and all intelligent features

### DevOps
- **Docker** — Containerization of each microservice
- **Azure Kubernetes Service (AKS)** — Container 
  orchestration and deployment
- **Azure Container Registry (ACR)** — 
  Container image storage
- **GitHub Actions** — CI/CD pipeline

### Azure Services
- **Azure OpenAI** — AI and NLP capabilities
- **Azure Kubernetes Service** — Deployment 
  and orchestration
- **Azure Container Registry** — Docker image registry
- **Azure Database for PostgreSQL** — 
  Managed database service
- **Azure Notification Hubs** — Push notifications
- **Azure Blob Storage** — File and document storage
- **Azure Key Vault** — Secrets and credentials management
- **Azure API Management** — API Gateway

---

## AI Integration

### Overview

The AI Companion Service is powered by 
**Azure OpenAI (GPT-4)**. What makes DocBridge's 
AI different from simply asking ChatGPT a health 
question is **context persistence and personalization.**

Every time a user interacts with the AI, the system:

1. Fetches the user's complete health profile 
   — conditions, allergies, age
2. Fetches all currently active medicines
3. Fetches recent consultation diagnosis
4. Fetches recent lab report values
5. Fetches recently logged symptoms
6. Builds a personalized system prompt with 
   all this context
7. Sends the user's question along with this 
   context to Azure OpenAI
8. Returns a response that is specific to 
   THIS patient — not a generic answer

### System Prompt Structure

```md
You are DocBridge, a friendly, empathetic, and knowledgeable health companion.
Your role is to help patients understand their health in simple, clear, non-technical language.

---

## Current Patient Context

- Name: {name}
- Age: {age}
- Known Medical Conditions: {conditions}
- Known Allergies: {allergies}
- Currently Active Medicines: {medicines}
- Recent Diagnosis: {diagnosis}
- Recent Lab Values: {lab_values}
- Recently Logged Symptoms: {symptoms}

---

## Rules You Must Always Follow

1. Explain everything in simple language — no medical jargon
2. Always be empathetic, calm, and reassuring
3. Personalize every response to this patient's specific context
4. Never diagnose a condition
5. Always recommend consulting a doctor for serious concerns
6. When explaining medicines, always consider the patient's allergies and other medicines
7. When a symptom could indicate something serious, clearly and calmly say so and recommend immediate medical attention
```
