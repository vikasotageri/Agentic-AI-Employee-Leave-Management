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

## 👋 For Visitors — How to Use This Project

**Jump to:**
- [🌐 Visit Live Demo (no install)](#-option-1-visit-the-live-demo-no-installation)
- [💻 Run Locally on Your Computer](#-option-2-run-locally-on-your-computer)
  - [Step 1: Install required software](#step-1-install-the-required-software)
  - [Step 2: Download the code](#step-2-download-the-code-clone-the-repository)
  - [Step 3: Set up environment variables](#step-3-set-up-environment-variables)
  - [Step 4: Start the system](#step-4-start-the-system)
  - [Step 5: Open in browser](#step-5-open-in-your-browser)
  - [Troubleshooting](#%EF%B8%8F-troubleshooting)
- [🔧 Integrate into your own project](#-option-3-integrate-into-your-own-project)

---

### 🌐 Option 1: Visit the Live Demo (No Installation)

Choose a portal below, open the URL in your browser, and follow the steps:

---

#### 🧑‍💼 1. HR Portal
**URL:** [VikasOtageri-leaveflow.hf.space/hr](https://VikasOtageri-leaveflow.hf.space/hr)

**Step-by-step:**
1. Open the URL above
2. Login with: **Email:** `hr@company.com` | **Password:** `pass123`
3. You'll see the **HR Dashboard** with all employees listed
4. **To create an employee:** Click the "➕ Add" button → Fill in the form (name, email, phone, DOJ, etc.) → Submit
5. The system will generate an **Employee ID** (e.g. `EMP001`) and a random password — **copy them immediately** (see note below)
6. You can also **project-tag** employees (tagged employees need manager approval for ALL leaves)
7. Click on any employee to **view/edit documents, resend credentials, or delete**
8. Click the 🔔 bell icon for notifications

> **⚠️ Email Note:** The live demo on Hugging Face Spaces **cannot send emails** (free tier blocks SMTP ports). So the welcome email with credentials will NOT arrive. You must **copy the Employee ID and password** from the popup after creating an employee. If you miss it, click "Resend Credentials" and check the 🔔 notification bell — the password is shown there too.
>
> ✅ When you run the system **locally** on your computer, emails will work if you set up your Gmail credentials in `.env`.

---

#### 👔 2. Manager Portal
**URL:** [VikasOtageri-leaveflow.hf.space/manager](https://VikasOtageri-leaveflow.hf.space/manager)

**Step-by-step:**
1. Open the URL above
2. Login with: **Email:** `manager@company.com` | **Password:** `pass123`
3. You'll see the **Manager Dashboard** with team stats (pending leaves, approved today, team size)
4. **Approve/reject leaves:** Go to the "Approvals" tab → See all pending requests → Click ✅ Approve or ❌ Reject
5. **View team members:** Scroll down to see all employees under you with their leave balances
6. Click any employee card to see their **detailed leave history**
7. Use the **AI Chat** to ask things like *"How many leaves did I approve today?"* or *"Show team leave summary"*
8. The dashboard **auto-refreshes every 12 seconds**

---

#### 👨‍💼 3. Employee Portal
**URL:** [VikasOtageri-leaveflow.hf.space/employee](https://VikasOtageri-leaveflow.hf.space/employee)

**Step-by-step:**
1. Open the URL above
2. Login with credentials given by HR (e.g. `EMP001` / password from HR)
3. You'll see your **leave balance** (Casual, Sick, Emergency, Business, Family, Unpaid)
4. **To apply leave:** Click "Apply Leave" → Select leave type, dates, reason → Submit
5. Leaves within policy limits get **auto-approved** immediately
6. Leaves requiring manager approval will show as **pending**
7. **To cancel:** Find the leave in your history → Click "Cancel" (only within 70-day window)
8. Use the **AI Chat** to ask: *"What is my leave balance?"* or *"Apply for casual leave tomorrow"*

---

### 💻 Option 2: Run Locally on Your Computer [↑](#readme)

Follow these steps even if you've never used a terminal before. Each step tells you **exactly** what to type and why.

---

#### Step 1: Install the Required Software [↑](#step-1-install-the-required-software)

Before you can run this project, your computer needs 3 things:

| Software | What it is | Where to get it | How to check if you already have it |
|----------|-----------|-----------------|--------------------------------------|
| **Python** | The programming language this project runs on | [Download Python 3.12+](https://www.python.org/downloads/) | Open Terminal/Command Prompt → type `python --version` |
| **Git** | Downloads code from GitHub | [Download Git](https://git-scm.com/downloads) | Open Terminal → type `git --version` |
| **OpenAI API Key** | A secret key to use the AI chat feature | [Get your key here](https://platform.openai.com/api-keys) → Click "Create new secret key" | You'll copy this key into a file later |

> **📌 Don't have Python?** [Watch this 2-min video](https://www.youtube.com/watch?v=uDbDIwRpNdo) on installing Python.
>
> **📌 No OpenAI key?** No problem! The system still works — you can apply leaves, approve requests, manage employees. Only the AI Chat feature won't work.

---

#### Step 2: Download the Code (Clone the Repository) [↑](#step-2-download-the-code-clone-the-repository)

1. Open **Terminal** (Mac/Linux) or **Command Prompt** (Windows)
2. Type these commands one by one, pressing **Enter** after each:

```bash
# This downloads the entire project to your computer
git clone https://github.com/vikasotageri/leave-management.git

# This moves you into the project folder
cd leave-management
```

**What just happened?** You now have a folder called `leave-management` on your computer with all the code inside.

> **📌 Stuck?** If `git` is not found, [install Git](https://git-scm.com/downloads) and restart Terminal.

---

#### Step 3: Set Up Environment Variables [↑](#step-3-set-up-environment-variables)

This is where you add your secret keys so the project can run.

##### 3a. Create the `.env` file

```bash
cp backend/.env.example backend/.env
```

This copies the example file into a real `.env` file.

##### 3b. Open the file in a text editor

Choose one of these methods:

| Your Skill Level | Do This |
|----------------|---------|
| **Beginner** | Open the `leave-management` folder → open `backend` folder → double-click `.env` file (it will open in Notepad/TextEdit) |
| **Terminal user** | Run: `nano backend/.env` or `code backend/.env` |

##### 3c. Edit the file — replace the placeholder text

Find these lines in the file and change them:

```
OPENAI_API_KEY=sk-your-openai-api-key-here
SECRET_KEY=any-random-string-for-jwt
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

**What to put where:**

| Variable | What to type | Example | Required? |
|----------|-------------|---------|-----------|
| `OPENAI_API_KEY` | Your OpenAI key (starts with `sk-...`) | `sk-proj-AbCdEfGhIjKlMnOpQrStUvWxYz123456` | ✅ Yes for AI chat |
| `SECRET_KEY` | **Any random text you make up** | `mySuperSecretKey123!@#` | ✅ Yes |
| `SMTP_USER` | Your Gmail address | `you@gmail.com` | ❌ Skip unless you need emails |
| `SMTP_PASS` | Your Gmail app password | `abcd efgh ijkl mnop` | ❌ Skip unless you need emails |

> **❓ What is SECRET_KEY?** It's like a password that your computer uses to create login tokens. Make up anything — `abc123`, `mysecret`, `hjsdhfjshdf` — it doesn't matter as long as it's not empty.
>
> **❓ What about SMTP?** These are for sending emails (e.g. welcome emails to new employees). You only need them if you want email features. [How to get Gmail app password](https://support.google.com/accounts/answer/185833).

**Save the file** (Ctrl+S in most editors) and close it.

---

#### Step 4: Start the System [↑](#step-4-start-the-system)

Now run this single command:

```bash
bash start.sh
```

Then **wait**. The first time takes 1-2 minutes because it downloads all dependencies.

**What this command does (in simple words):**
1. 📥 Downloads all required Python packages (like downloading apps from an app store)
2. 🗄️ Creates a small database file on your computer
3. 👤 Creates demo accounts (HR and Manager) so you can log in
4. 🚀 Starts 3 mini-servers on your computer — one for each portal

**You'll know it's done when you see:**

```
✅ All servers started!

  Role       | Dashboard                           | Port
  -----------|-------------------------------------|------
  Employee   | http://localhost:8001/employee      | 8001
  Manager    | http://localhost:8002/manager        | 8002
  HR         | http://localhost:8003/hr             | 8003
```

> **❓ Something went wrong?** See the Troubleshooting table below.

---

#### Step 5: Open in Your Browser [↑](#step-5-open-in-your-browser)

1. Open **Chrome, Firefox, or Edge**
2. Click one of these links:

| Portal | URL | What to do there |
|--------|-----|-----------------|
| 👨‍💼 **Employee** | [http://localhost:8001/employee](http://localhost:8001/employee) | Apply for leaves, check balance, chat with AI |
| 👔 **Manager** | [http://localhost:8002/manager](http://localhost:8002/manager) | Approve/reject leaves, manage team |
| 🧑‍💼 **HR** | [http://localhost:8003/hr](http://localhost:8003/hr) | Create/manage employees |

Login with these demo accounts:

| Portal | Email | Password |
|--------|-------|----------|
| HR | `hr@company.com` | `pass123` |
| Manager | `manager@company.com` | `pass123` |

> **📌 Can't click the links?** Type `http://localhost:8001/employee` directly into your browser's address bar.

---

#### 🛠️ Troubleshooting [↑](#%EF%B8%8F-troubleshooting)

| Problem | What it means | How to fix |
|---------|--------------|------------|
| `'python' is not recognized` | Python is not installed | [Download Python](https://www.python.org/downloads/) — during install, CHECK the box "Add Python to PATH" |
| `pip: command not found` | Python's package installer is missing | Reinstall Python with "Add to PATH" checked |
| `Port 8001 already in use` | Another program is using port 8001 | Run: `kill $(lsof -ti:8001)` (Mac/Linux) or restart your computer (Windows) |
| AI Chat says "Error" | OpenAI key is missing or wrong | Double-check `OPENAI_API_KEY` in `backend/.env` file |
| `ModuleNotFoundError` | A package didn't install | Run: `pip install -r requirements.txt` manually |
| Database errors | Database file is corrupted | Delete `backend/leave_management.db` and run `bash start.sh` again |
| Can't open the links | Server hasn't started yet | Wait for the "✅ All servers started!" message |
| Forgot where `.env` is | Navigate to `leave-management/backend/.env` | Open the `leave-management` folder → `backend` folder → `.env` file |

---

### 🔧 Option 3: Integrate Into Your Own Project

This project is modular. You can pick and choose what you need:

1. **Just the AI Agents?** → Copy `backend/agents/` folder. It's a standalone LangGraph multi-agent system. Import `graphs.py` and call `graph.invoke()` with a user message and employee data.

2. **Just the Leave Management API?** → Copy `backend/routers/` + `backend/database.py`. The FastAPI endpoints are fully self-contained REST APIs for leave CRUD.

3. **Full System on Your Own Domain?** → Fork the repo, change the branding in `backend/templates/base.html` (edit the "MSIS" logo), set your own `SECRET_KEY`, deploy on any cloud (Render, Railway, Fly.io).

4. **Add a New Feature / Agent?** → Add a new tool function in `backend/agents/tools.py`, create its prompt in `backend/agents/graphs.py`, and add it to the supervisor's allowed tools in `backend/agents/supervisor.py`.

---

## 🔗 Live Portals (Quick Access)

| Portal | URL | Who Uses It | What You Can Do |
|--------|-----|-------------|-----------------|
| 👨‍💼 **Employee** | [leaveflow.hf.space/employee](https://VikasOtageri-leaveflow.hf.space/employee) | All employees | Apply/cancel leaves, check balance, view history, chat with AI assistant |
| 👔 **Manager** | [leaveflow.hf.space/manager](https://VikasOtageri-leaveflow.hf.space/manager) | Team managers | Approve/reject leaves, manage team, view analytics, AI-powered reports |
| 🧑‍💼 **HR** | [leaveflow.hf.space/hr](https://VikasOtageri-leaveflow.hf.space/hr) | HR admins | Create/manage employees, view all records, project tags, notifications |

---

## 🚀 Overview

A production-ready **Multi-Role AI-powered Leave Management System** built for MSIS, Manipal. Features **three distinct portals** (Employee, Manager, HR) with **LangGraph-driven multi-agent AI** that intelligently handles leave applications, approvals, policy enforcement, and notifications.

Unlike basic leave systems, this uses a **Supervisor + Specialist Agent architecture** powered by OpenAI GPT-4o-mini for real-time, conversational leave management.

---

## 🧠 Key Highlights

- 🤖 **Multi-Agent AI Architecture** — Supervisor Agent classifies intent → routes to 5 specialist agents
- 👥 **Three-Role Access** — Employee, Manager, and HR — each with dedicated dashboard
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

## 🧠 Architecture Overview — Explained Simply

Think of this system like a **smart restaurant**:

| Real-world | In this system |
|------------|----------------|
| 🍽️ Customer | **Employee** (wants leave) |
| 📋 Waiter | **Manager** (approves/rejects) |
| 🏪 Restaurant Manager | **HR** (manages everything) |
| 🤖 Smart Assistant Bot | **AI Agents** (chat helpers) |
| 📁 Order Notebook | **Database** (stores all data) |
| 🔑 Door Lock | **JWT Auth** (keeps data secure) |

### 📐 System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        YOUR WEB BROWSER                            │
│                                                                     │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│   │  👨‍💼 Employee  │  │  👔 Manager   │  │  🧑‍💼 HR Admin  │            │
│   │   Dashboard   │  │   Dashboard   │  │   Dashboard   │            │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘            │
│          │                 │                 │                      │
│          └─────────────────┴─────────────────┘                      │
│                              │                                      │
│                     ┌────────┴────────┐                            │
│                     │  Chat Window 🤖  │  ← AI chat in every portal│
│                     └────────┬────────┘                            │
└────────────────────────────────┼────────────────────────────────────┘
                                 │ (Internet)
┌────────────────────────────────┼────────────────────────────────────┐
│                    FASTAPI SERVER (Python)                          │
│                                 │                                   │
│          ┌──────────────────────┼──────────────────────┐           │
│          │                      │                      │           │
│          ▼                      ▼                      ▼           │
│  ┌──────────────┐     ┌──────────────────┐     ┌──────────────┐   │
│  │  REST APIs   │     │  AI AGENT SYSTEM │     │   STATIC      │   │
│  │  (Endpoints) │     │   (LangGraph)    │     │   FILES      │   │
│  │              │     │                  │     │   (HTML/JS)  │   │
│  │  • Apply     │     │  ┌────────────┐  │     └──────────────┘   │
│  │    leave     │     │  │ SUPERVISOR │  │                         │
│  │  • Approve   │     │  │   AGENT    │  │                         │
│  │  • Cancel    │     │  │  (Decides  │  │                         │
│  │  • View      │     │  │   who to   │  │                         │
│  │    balance   │     │  │   handle)  │  │                         │
│  │  • Create    │     │  └─────┬──────┘  │                         │
│  │    employee  │     │        │         │                         │
│  │  • Notify    │     │        ▼         │                         │
│  │              │     │  ┌────────────┐  │                         │
│  │              │     │  │  SPECIALIST│  │                         │
│  │              │     │  │   AGENTS   │  │                         │
│  │              │     │  │            │  │                         │
│  │              │     │  │ • Leave 📝 │  │                         │
│  │              │     │  │ • Approve ✅│  │                         │
│  │              │     │  │ • Policy 📋 │  │                         │
│  │              │     │  │ • Analytics│  │                         │
│  │              │     │  │ • General 💬│  │                         │
│  │              │     │  └────────────┘  │                         │
│  └──────┬───────┘     └──────────────────┘                         │
│         │                                                           │
│         ▼                                                           │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    DATABASE (SQLite)                       │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │    │
│  │  │Employees │ │  Leaves  │ │ Notifica-│ │   Holidays   │  │    │
│  │  │ (Users)  │ │ (Records)│ │  tions   │ │   (Off days) │  │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │    │
│  └────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────┘
```

### 🔄 How Data Flows (Step by Step)

**Example: An employee applies for leave**

```
Step 1: Employee opens browser → goes to Employee Portal
Step 2: Logs in with email + password → Server gives a "token" (like a wristband)
Step 3: Clicks "Apply Leave" → fills form (type, dates, reason) → clicks Submit
Step 4: FastAPI receives the request at /api/leaves/apply
Step 5: System checks:
        ├── Is the employee logged in? (checks the token)
        ├── Is the date valid? (not >70 days in future/past)
        ├── Is the leave type within limits? (e.g., casual ≤2/month)
        └── Does it need manager approval? (project tag? 3rd request?)
Step 6: If auto-approved → leave is saved in database → "Approved!" shown
Step 7: If needs manager → leave is saved as "Pending" → Manager sees it
Step 8: Notification created → 🔔 bell icon lights up for manager
```

**Example: Employee asks AI Chat "What is my leave balance?"**

```
Step 1: Employee types question in chat box
Step 2: Chat sends message to /api/chat endpoint
Step 3: SUPERVISOR AGENT reads the question
Step 4: Supervisor decides: "This is a balance question → send to Leave Agent"
Step 5: LEAVE AGENT calls a database tool → fetches leave balance
Step 6: Agent formats the answer in plain English
Step 7: Response sent back to chat → "You have 12 casual leaves remaining..."
```

### 🤖 How the AI Works (For Non-Technical Readers)

**What is an "AI Agent"?** — Think of it as a very smart assistant that has:
1. **A Brain** — OpenAI GPT-4o-mini (a large language model that understands text)
2. **Hands** — Tools/functions it can use (like `get_leave_balance`, `apply_leave`)
3. **Rules** — A prompt that tells it what to do and what NOT to do

**The Supervisor Agent** is like a **receptionist**:
- Listens to your question
- Decides which department (specialist agent) should handle it
- Passes the message along

**The Specialist Agents** are like **department heads**:

| Agent | Job | Example Question |
|-------|-----|-----------------|
| 📝 **Leave Agent** | Handle leave applications & cancellations | "Apply for casual leave tomorrow" |
| ✅ **Approval Agent** | Approve or reject pending leaves | "Approve John's sick leave" |
| 📋 **Policy Agent** | Explain company leave rules | "What is the leave policy?" |
| 📊 **Analytics Agent** | Answer questions about data | "How many leaves approved today?" |
| 💬 **General Agent** | Chat about anything else | "Hello, what can you do?" |

**What is LangGraph?** — It's a framework that lets us connect these agents together in a workflow, like connecting pipes. The Supervisor feeds into specialists, specialists can call tools, and results flow back.

**What is GPT-4o-mini?** — It's OpenAI's small, fast, cheap AI model. It reads text and decides what to do. It doesn't store your data — each question is processed independently.

**Does it learn from my data?** — No. OpenAI does NOT train on API calls. Your data stays private.

### 🗄️ How the Database Works

We use **SQLite** — a simple database saved as a single file (`leave_management.db`):

| Table | Stores | Example Row |
|-------|--------|-------------|
| `employees` | User accounts | EMP001, John Doe, john@email.com |
| `leave_records` | Leave applications | EMP001, Casual, 2026-07-10, Approved |
| `notifications` | Alerts & messages | "Your leave was approved!" |
| `holidays` | Company holidays | 2026-01-26, Republic Day |

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

## 💻 Environment Variables

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
🎓 Currently Student at **Manipal School of Information Science, Manipal**

[![GitHub](https://img.shields.io/badge/GitHub-vikasotageri-181717?logo=github)](https://github.com/vikasotageri)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-vikasotageri-0A66C2?logo=linkedin)](https://www.linkedin.com/in/vikasotageri/)

---

<div align="center">
  <strong>⭐ Star this repo if you found it useful!</strong>
</div>
