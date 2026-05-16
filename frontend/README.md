# 🚨 CrashApp — Public Bug & Outage Tracker

A fullstack platform where developers can report outages and bugs they're experiencing with popular tools, upvote existing reports, and search for known problems.

## 🌐 Live URLs

- **Frontend:** https://crashapp-one.vercel.app
- **Backend API:** https://crashapp-p305.onrender.com

## 🗄️ Database Schema

### users

| Column     | Type               | Notes                         |
| ---------- | ------------------ | ----------------------------- |
| id         | SERIAL PRIMARY KEY |                               |
| name       | VARCHAR(100)       |                               |
| email      | VARCHAR(255)       | UNIQUE                        |
| password   | TEXT               | nullable (Google OAuth users) |
| google_id  | VARCHAR(255)       | nullable                      |
| avatar_url | TEXT               | nullable                      |
| created_at | TIMESTAMP          | DEFAULT NOW()                 |

### reports

| Column         | Type               | Notes                    |
| -------------- | ------------------ | ------------------------ |
| id             | SERIAL PRIMARY KEY |                          |
| user_id        | INTEGER            | FK → users               |
| tool_name      | VARCHAR(100)       |                          |
| title          | VARCHAR(255)       |                          |
| description    | TEXT               |                          |
| severity       | VARCHAR(20)        | Low/Medium/High/Critical |
| status         | VARCHAR(20)        | Ongoing/Resolved         |
| screenshot_url | TEXT               | nullable                 |
| created_at     | TIMESTAMP          | DEFAULT NOW()            |
| updated_at     | TIMESTAMP          | DEFAULT NOW()            |

### upvotes

| Column     | Type               | Notes                          |
| ---------- | ------------------ | ------------------------------ |
| id         | SERIAL PRIMARY KEY |                                |
| report_id  | INTEGER            | FK → reports ON DELETE CASCADE |
| user_id    | INTEGER            | FK → users ON DELETE CASCADE   |
| created_at | TIMESTAMP          | DEFAULT NOW()                  |
|            |                    | UNIQUE(report_id, user_id)     |

## 🔌 API Endpoints

| Method | Path                      | Auth | Description                        |
| ------ | ------------------------- | ---- | ---------------------------------- |
| POST   | /api/auth/register        | No   | Register new user                  |
| POST   | /api/auth/login           | No   | Login, returns JWT                 |
| GET    | /api/auth/google          | No   | Initiate Google OAuth              |
| GET    | /api/auth/google/callback | No   | Google OAuth callback              |
| GET    | /api/reports              | No   | Get all reports ordered by upvotes |
| GET    | /api/reports/search       | No   | Search reports by keyword          |
| GET    | /api/reports/:id          | No   | Get a single report                |
| POST   | /api/reports              | Yes  | Create a new report                |
| PUT    | /api/reports/:id          | Yes  | Edit a report (owner only)         |
| DELETE | /api/reports/:id          | Yes  | Delete a report (owner only)       |
| POST   | /api/reports/:id/upvote   | Yes  | Upvote a report                    |
| DELETE | /api/reports/:id/upvote   | Yes  | Remove upvote                      |
| GET    | /api/users/:id            | No   | Get user profile and reports       |

## ⚙️ Setup Instructions

### Prerequisites

- Node.js
- PostgreSQL (via Supabase)
- Cloudinary account
- Google OAuth credentials

### Environment Variables

Create a `.env` file in the `/backend` folder:
