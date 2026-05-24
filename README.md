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

┌─────────────────────────────────────────────┐
│ TIER 1 — PRESENTATION │
│ React.js Frontend │
└─────────────────────────────────────────────┘
↕
┌─────────────────────────────────────────────┐
│ TIER 2 — LOGIC │
│ │
│ ┌──────────────┐ ┌───────────────────┐ │
│ │ Auth Service │ │Consultation Service│ │
│ └──────────────┘ └───────────────────┘ │
│ ┌──────────────┐ ┌───────────────────┐ │
│ │ Prescription │ │ Reminder Service │ │
│ │ Service │ └───────────────────┘ │
│ └──────────────┘ ┌───────────────────┐ │
│ ┌──────────────┐ │ Lab Report │ │
│ │ Symptom │ │ Service │ │
│ │ Tracker │ └───────────────────┘ │
│ └──────────────┘ ┌───────────────────┐ │
│ ┌──────────────┐ │ Health Summary │ │
│ │ AI Companion │ │ Service │ │
│ └──────────────┘ └───────────────────┘ │
│ │
└─────────────────────────────────────────────┘
↕
┌─────────────────────────────────────────────┐
│ TIER 3 — DATA │
│ PostgreSQL Database per Microservice │
└─────────────────────────────────────────────┘
