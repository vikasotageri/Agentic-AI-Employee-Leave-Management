# AI Leave Management System

Multi-role Agentic AI Leave Management System with LangGraph-powered AI assistants for Employees, Managers, and HR.

## Architecture

```
User → Browser → FastAPI (port 8001/8002/8003 per role)
  → REST API (auth, leaves, employees, notifications)
  → AI Chat: POST /api/chat → LangGraph StateGraph
    → Supervisor (classifies intent via GPT-4o-mini)
      → Specialist Agent (tools + LLM)
        → PostgreSQL / OpenAI
```

Three separate server instances (one per role), each serving static HTML/JS + API.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python FastAPI |
| AI | LangGraph + OpenAI GPT-4o-mini |
| Database | PostgreSQL (SQLAlchemy ORM) |
| Frontend | Vanilla JS + TailwindCSS (CDN) |
| Auth | JWT (python-jose + bcrypt) |

## Features

### Employee Portal (:8001)
- Apply/cancel leaves with AI chatbot
- View leave balance, history, upcoming leaves
- In-app notifications when manager approves/rejects
- Upload documents for leave requests

### Manager Portal (:8002)
- AI-powered team management chat
- Approve/reject leaves by employee ID + date
- Filter team members by project_tag, designation, gender
- View past vs upcoming pending leaves
- Auto-refresh dashboard every 6s
- In-app notifications for new leave requests

### HR Portal (:8003)
- View all employees and their records
- AI chat for org-wide queries
- Override leave statuses
- Manage company holidays

## Project Structure

```
├── ai/
│   ├── agents/
│   │   ├── graphs.py        # LangGraph StateGraphs (Employee/Manager/HR)
│   │   ├── supervisor.py    # Intent classification + tool execution
│   │   └── tools.py         # All DB functions + @tool wrappers (29 tools)
│   └── engine/
│       ├── agent_memory.py  # In-memory conversation history
│       ├── rag.py           # RAG pipeline for policy queries
│       └── vector_store.py  # ChromaDB vector store
├── backend/
│   ├── main.py              # FastAPI app entry point (3 instances)
│   ├── database.py          # SQLAlchemy models (Employee, LeaveRecord, Notification, Holiday)
│   ├── auth.py              # JWT auth (login, token verification)
│   ├── seed.py              # Seeds HR + Manager accounts
│   ├── email_service.py     # Gmail SMTP for notifications
│   ├── routers/
│   │   ├── auth.py          # Login, register, forgot-password
│   │   ├── leaves.py        # Apply, approve, reject, cancel leaves
│   │   ├── employees.py     # Employee CRUD
│   │   ├── notifications.py # In-app notification CRUD
│   │   ├── chat.py          # POST /api/chat → LangGraph
│   │   ├── holidays.py      # Holiday management
│   │   └── frontend.py      # Static file serving
│   └── templates/           # HTML templates (base, dashboards, login)
├── frontend/static/js/      # Vanilla JS modules (api, auth, chat, employee, manager, hr, notifications)
└── start.sh                 # Launches all 3 server instances
```

## Quick Start

### Prerequisites
- Python 3.11+
- PostgreSQL running on localhost:5432
- OpenAI API key

### Setup

```bash
# 1. Clone and enter
git clone <repo-url> && cd leave-management

# 2. Create database
createdb leaveflow

# 3. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env: set OPENAI_API_KEY, DATABASE_URL, SECRET_KEY

# 4. Install dependencies
pip install -r backend/requirements.txt

# 5. Run
bash start.sh
```

### Credentials (seeded)
| Role | Email | Password |
|------|-------|----------|
| HR | hr@company.com | pass123 |
| Manager | manager@company.com | pass123 |
| Employee | (self-register) | user-set |

### URLs
| Portal | URL |
|--------|-----|
| Employee | http://localhost:8001/employee |
| Manager | http://localhost:8002/manager |
| HR | http://localhost:8003/hr |

## AI Agents

### Employee Chat
- Apply/cancel leaves by date
- Check leave balance, history, profile
- Policy questions via RAG

### Manager Chat
- **Approval Agent**: Approve/reject leaves by employee+date, cancellation requests
- **Team Agent**: List/filter team members by project_tag, designation, gender
- **Analytics Agent**: Team leave stats, past vs upcoming pending leaves

### HR Chat
- Employee management (view all employees, details, leave history)
- Organization-wide leave data

## API Endpoints

### Auth
- `POST /api/auth/login` — Login
- `POST /api/auth/register` — Register employee
- `GET /api/auth/me` — Current user profile

### Leaves
- `POST /api/leaves` — Apply leave
- `POST /api/leaves/cancel` — Cancel leave
- `POST /api/leaves/approve` — Approve leave
- `POST /api/leaves/reject` — Reject leave
- `GET /api/leaves/pending/{manager_id}` — Pending requests
- `GET /api/leaves/employee/{employee_id}` — Leave history

### Notifications
- `GET /api/notifications/{user_id}` — List notifications
- `PUT /api/notifications/{id}/read` — Mark read

### Chat
- `POST /api/chat` — AI assistant message

## Leave Policy

- Casual: 24/year, 2/month. Auto-approved first 2 requests/month (max 2 days). Manager approval for 3rd+ or >2 days.
- Sick: 12/year. Auto-approved first 1/month (max 1 day). Manager for 2nd+ .
- Emergency: 10/year. Same as sick.
- Business: 20/year. Always manager approval.
- Family: 10/year. Always manager approval.
- Unpaid: Unlimited. Always manager approval.
- Tagged employees (project_tag set): all leaves require manager approval.
