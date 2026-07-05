---
title: MSIS Leave Management System
emoji: 📋
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
---

# 🤖 MSIS AI Leave Management System

<div align="center">

**Manipal School of Information Science, Manipal**

[![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-teal?logo=fastapi)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.3-orange?logo=langchain)](https://langchain-ai.github.io/langgraph/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green?logo=openai)](https://openai.com)
[![SQLite](https://img.shields.io/badge/SQLite-3-blue?logo=sqlite)](https://sqlite.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://docker.com)
[![HuggingFace](https://img.shields.io/badge/HuggingFace-Spaces-yellow?logo=huggingface)](https://huggingface.co/spaces)
[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)

**Live Demo → [VikasOtageri-leaveflow.hf.space](https://VikasOtageri-leaveflow.hf.space)**

</div>

---

## 🚀 Overview

A production-ready **Multi-Role AI-powered Leave Management System** built for MSIS, Manipal. Features **three distinct portals** (Employee, Manager, HR) with **LangGraph-driven multi-agent AI** that intelligently handles leave applications, approvals, policy enforcement, and notifications.

Unlike basic leave systems, this uses a **Supervisor + Specialist Agent architecture** powered by OpenAI GPT-4o-mini for real-time, conversational leave management.

---

## 🧠 Key Highlights

- 🤖 **Multi-Agent AI Architecture** — Supervisor Agent classifies intent → routes to 5 specialist agents
- 👥 **Three-Role Access** — Employee | Manager | HR — each with dedicated dashboard & AI assistant
- 🔐 **Secure JWT Authentication** — bcrypt hashing + python-jose tokens with 8h expiry
- 📊 **Real-time Dashboards** — Live leave balances, team overview, approval workflows
- 📩 **Email Notifications** — Auto-email credentials to new employees via Gmail SMTP
- ⚡ **Automated Leave Processing** — Policy-compliant auto-approval within limits
- 📱 **Flicker-Free UI** — Optimized auto-refresh with incremental DOM updates
- 🏷️ **Project Tag System** — Tagged employees require manager approval for ALL leaves

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Backend** | Python FastAPI (port 8000) | REST API + static file serving |
| **AI Framework** | LangGraph StateGraph | Multi-agent orchestration |
| **LLM** | OpenAI GPT-4o-mini | Intent classification + tool calling |
| **Database** | SQLAlchemy + SQLite | Relational data storage |
| **Frontend** | Vanilla JS + TailwindCSS (CDN) | No build step, instant loading |
| **Auth** | python-jose + bcrypt | JWT token authentication |
| **Email** | smtplib (Gmail SMTP) | Credential & notification emails |
| **Deployment** | Docker + Hugging Face Spaces | Free, always-on hosting |

---

## 📂 Project Structure

```
leave-management/
│
├── backend/                          # Python FastAPI backend
│   ├── main.py                       # App entry, middleware, CORS
│   ├── database.py                   # SQLAlchemy models + DB setup
│   ├── auth.py                       # JWT creation, verification, hashing
│   ├── seed.py                       # Seeds HR + Manager accounts
│   ├── email_service.py              # Gmail SMTP integration
│   │
│   ├── routers/                      # REST API endpoints
│   │   ├── auth.py                   # Login, register, forgot password
│   │   ├── employees.py              # CRUD, balance, documents, tags
│   │   ├── leaves.py                 # Apply, approve, reject, cancel
│   │   ├── notifications.py          # Read, create notifications
│   │   ├── chat.py                   # AI chat session endpoint
│   │   ├── frontend.py               # HTML template routes
│   │   └── holidays.py               # Holiday management
│   │
│   ├── agents/                       # AI Agent Layer (LangGraph)
│   │   ├── supervisor.py             # Intent classifier + 19 tool schemas
│   │   ├── tools.py                  # All DB query functions
│   │   └── graphs.py                 # StateGraph definitions (5 roles)
│   │
│   └── templates/                    # Jinja2 HTML templates
│       ├── base.html                 # Shared nav, notification bell
│       ├── employee_dashboard.html   # Employee portal
│       ├── manager_dashboard.html    # Manager portal
│       ├── hr_dashboard.html         # HR portal
│       ├── login.html                # Shared login page
│       ├── chat.html                 # AI chat component
│       └── ...
│
├── frontend/
│   └── static/js/                    # Vanilla JavaScript
│       ├── api.js                    # HTTP client + auth interceptor
│       ├── auth.js                   # Login, logout, token management
│       ├── app.js                    # Global app state + auto-refresh
│       ├── employee.js               # Employee dashboard logic
│       ├── manager.js                # Manager dashboard logic
│       ├── hr.js                     # HR dashboard logic
│       ├── notifications.js          # Bell dropdown + polling
│       ├── chat.js                   # AI chat UI component
│       └── utils.js                  # Date formatting, helpers
│
├── screenshots/                      # UI screenshots
│   ├── employee/
│   │   ├── login.png
│   │   ├── dashboard.png
│   │   ├── apply-leave.png
│   │   └── ai-chat.png
│   ├── manager/
│   │   ├── dashboard.png
│   │   ├── approvals.png
│   │   └── ai-chat.png
│   └── hr/
│       ├── dashboard.png
│       ├── employees.png
│       └── ai-chat.png
│
├── Dockerfile                        # Docker build for HF Spaces
├── docker-compose.yml                # Multi-service setup (optional)
├── requirements.txt                  # Python dependencies
├── start.sh                          # One-command launcher
├── AGENTS.md                         # AI agent documentation
└── README.md                         # This file
```

---

## 🧠 Architecture Overview

```
User → React/Static Frontend → FastAPI :8000
  │
  ├── /api/chat → LangGraph StateGraph
  │   └── Supervisor Agent (LLM intent classifier)
  │       ├── → Leave Agent (apply/cancel leaves)
  │       ├── → Approval Agent (approve/reject)
  │       ├── → Policy Agent (policy questions)
  │       ├── → Analytics Agent (stats & reports)
  │       └── → General Agent (fallback)
  │
  └── /api/* → REST endpoints (CRUD operations)
       └── SQLAlchemy → SQLite Database
```

### AI Workflow

```
1. Employee sends message in chat
2. Supervisor Agent classifies intent via GPT-4o-mini
3. Routes to appropriate Specialist Agent
4. Agent calls database tools (SQLAlchemy)
5. Returns natural language response
```

---

## ✨ Features

### 👨‍💼 Employee Portal
- Apply / Cancel leaves with policy validation
- View leave balance (Casual, Sick, Emergency, Business, Family, Unpaid)
- Leave history with status tracking
- 📅 70-day booking & cancellation window
- 🤖 AI Chat Assistant for leave queries

### 👔 Manager Portal
- Team member overview with leave balances
- Approve / Reject pending leaves
- Cancellation request management
- Real-time dashboard stats (pending, approved today, etc.)
- 📊 AI Analytics — "How many approved today?", team reports
- 🔄 Auto-refresh every 12s (pauses during AI processing)

### 🧑‍💼 HR Portal
- Create / Delete employees with auto-generated credentials
- Upload employee documents
- Project tag management (overrides auto-approval)
- View all employee records & leave history
- Resend credentials via email
- 🤖 AI Chat for HR operations

### 🤖 AI Capabilities
- **Supervisor Agent** — Routes intent to correct specialist
- **Leave Agent** — Apply, cancel, check status
- **Approval Agent** — Smart approval decisions with policy checks
- **Policy Agent** — Explains leave rules & 70-day window
- **Analytics Agent** — Reports & statistics
- **Zero regex** — All LLM-driven intent classification

### 🏷️ Leave Policy

| Leave Type | Max/Year | Carry Forward | Auto-Approval |
|------------|----------|---------------|---------------|
| 🏖️ Casual | 24 | ✅ Yes | First 2/month (≤2 days) |
| 🤒 Sick | 12 | ❌ No | First 1/month (≤1 day) |
| 🚨 Emergency | 10 | ❌ No | First 1/month (≤1 day) |
| 💼 Business | 20 | ❌ No | Always manager |
| 👨‍👩‍👧‍👦 Family | 10 | ❌ No | Always manager |
| 🕊️ Unpaid | Unlimited | ❌ No | Always manager |

> 📌 **Project Tag Rule:** Tagged employees require manager approval for ALL leaves.
> 📅 **70-Day Window:** Cannot book >70 days ahead or past. Only leaves within 70 days can be cancelled.

---

## 🚀 Deployment

### 🌐 Live on Hugging Face Spaces

The system is deployed at **https://VikasOtageri-leaveflow.hf.space** with three portals:

| Portal | URL Path | Credentials |
|--------|----------|-------------|
| **Employee** | `/employee` | Created by HR |
| **Manager** | `/manager` | manager@company.com / pass123 |
| **HR** | `/hr` | hr@company.com / pass123 |

### 🐳 Docker Deployment (HF Spaces)

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 7860
CMD cd backend && python main.py
```

Set these **HF Space Secrets**:
- `OPENAI_API_KEY` — OpenAI key for AI chat
- `SECRET_KEY` — JWT signing secret
- `SMTP_USER` — Gmail address (optional)
- `SMTP_PASS` — Gmail app password (optional)

---

## ⚙️ Local Setup

### Prerequisites
- Python 3.12+
- OpenAI API key

### Quick Start

```bash
# 1. Clone
git clone https://github.com/vikasotageri/leave-management.git
cd leave-management

# 2. Configure
cp backend/.env.example backend/.env
# Edit backend/.env with your OPENAI_API_KEY

# 3. Run
bash start.sh
```

Open `http://localhost:8001/employee` 🎉

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | ✅ | OpenAI API key |
| `SECRET_KEY` | ✅ | JWT secret (any random string) |
| `SMTP_USER` | ❌ | Gmail address |
| `SMTP_PASS` | ❌ | Gmail app password |

### Seeded Accounts

| Role | Email | Password |
|------|-------|----------|
| HR | hr@company.com | pass123 |
| Manager | manager@company.com | pass123 |

---

## 📸 Screenshots

> *Screenshots pending — will be added after UI finalization.*

| Portal | Preview |
|--------|---------|
| 👨‍💼 Employee Dashboard | *Coming soon* |
| 👔 Manager Dashboard | *Coming soon* |
| 🧑‍💼 HR Dashboard | *Coming soon* |
| 🤖 AI Chat | *Coming soon* |

---

## 🔐 Authentication Flow

1. User enters email + password → POST `/api/auth/login`
2. Server verifies bcrypt hash → returns JWT token (8h expiry)
3. Client stores token in `localStorage`
4. Subsequent requests include `Authorization: Bearer <token>`
5. `GET /api/auth/me` returns current user profile

---

## 📄 License

This project is **open-source** for learning and development purposes.

---

## 👨‍💻 Author

**Vikas Otageri** — AI & Full Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-vikasotageri-181717?logo=github)](https://github.com/vikasotageri)

---

<div align="center">
  <strong>⭐ Star this repo if you found it useful!</strong>
</div>
