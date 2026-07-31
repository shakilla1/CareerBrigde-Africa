# CareerBridge Africa

CareerBridge Africa is a web-based platform designed to help reduce youth unemployment among young Africans, especially students and graduates in Rwanda. The main purpose of this system is to create a connection between young people looking for career opportunities and organizations that provide employment and internship opportunities.

The idea behind this project comes from the challenge that many young Africans face after completing their studies. Every year, many students graduate with knowledge and skills, but they struggle to access suitable internships, jobs, mentorship, or career guidance. This happens because opportunities are sometimes difficult to find, information is scattered across different platforms, and many young people often lack professional connections.


This is a project built with a RESTful API.

---

## What it does

**Students and graduates** register, complete a profile with skills, career interests
and education history, and upload a CV. They can search and filter opportunities by
keyword and location, save the interesting ones for later, apply with a short cover
letter, and follow each application as its status moves from submitted through to a
decision. They can also withdraw an application. A mentorship section holds career
guidance videos and articles published by the administrator.

**Employers** register with a company name, then wait for an administrator to verify
the company. Once approved they can publish opportunities, edit or close them, and
see everyone who has applied to each posting along with their skills and CV. They
move candidates through the hiring stages, and each change writes a notification for
the applicant.

**Administrators** see platform statistics, approve or reject employer verification
requests, suspend and reactivate user accounts, publish and remove mentorship
resources, and act on content that users have reported.

Administrators cannot sign themselves up. The registration endpoint only accepts
`student` or `employer`, and it rejects anything else even when the request is sent
directly to the API rather than through the form. Admin accounts are created from
the command line by whoever runs the server.

---

## Built with

**Backend** — Python, Flask, SQLAlchemy, Flask-Migrate, Flask-JWT-Extended,
Flask-CORS, MySQL (PyMySQL). Passwords are hashed with Werkzeug. Authentication uses
JWT access and refresh tokens, with the user's role carried as a claim.

**Frontend** — React 19 with Vite, React Router 7, axios, react-icons. Styling is
plain CSS with custom properties, organised per component. No UI framework.

---

## Running it locally

You will need Python 3.10 or newer, Node.js 18 or newer, and a MySQL server.

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
source .venv/bin/activate       # macOS or Linux
pip install -r requirements.txt
```

Create the database:

```sql
CREATE DATABASE careerbridge_africa;
```

Copy `backend/.env.example` to `backend/.env` and fill it in:

```
FLASK_ENV=development
SECRET_KEY=<a long random string>
JWT_SECRET_KEY=<a different long random string>
DATABASE_URL=mysql+pymysql://root:yourpassword@localhost/careerbridge_africa
```

Load some data to work with, then start the server:

```bash
flask --app run.py seed-data
python run.py
```

The API runs on `http://localhost:5000`. Open `http://localhost:5000/api/health`
to confirm the database connection is working before going any further. If it
reports `unreachable`, the response includes the underlying error.

### Frontend

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env`:

```
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

The site runs on `http://localhost:5173`, which is already in the backend's list of
allowed origins.

Note that Vite reads environment variables at build time. If you change `.env`,
restart the dev server, and if you change the variable on a hosting platform you
have to redeploy for it to take effect.

---


| Role | Email |
|---|---|
| Administrator | admin@careerbridge.africa |
| Employer | hr@rwandawomenintech.org |
| Employer | careers@ictyouthhub.rw |
| Employer | recruitment@kigaliagritech.rw |
| Student | jean.niyonzima@student.alu.edu |
| Student | divine.ingabire@student.alu.edu |

---

## Command line tools

```bash
flask --app run.py create-admin        # create an administrator account
flask --app run.py list-users          # list every account, with role and status
flask --app run.py reset-password      # set a new password for any account
flask --app run.py promote-to-admin    # give an existing account admin rights
flask --app run.py seed-data           # load demo data
```

`list-users` cannot display passwords. They are stored as one way hashes, so a
forgotten password is reset rather than recovered.

---

## API

Everything lives under `/api`. Endpoints marked with a role require a bearer token
belonging to that role.

### Authentication

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/api/auth/register` | Accepts `student` or `employer` only |
| POST | `/api/auth/login` | Returns access token, refresh token and user |
| POST | `/api/auth/refresh` | Requires the refresh token |
| GET | `/api/auth/me` | Current user |
| PUT | `/api/auth/change-password` | |
| POST | `/api/auth/logout` | |

### Opportunities

| Method | Endpoint | Role |
|---|---|---|
| GET | `/api/opportunities` | Public. Supports `query`, `location`, `type`, `page`, `per_page` |
| GET | `/api/opportunities/<id>` | Public |
| POST | `/api/opportunities` | Employer, verified only |
| PUT | `/api/opportunities/<id>` | Owning employer |
| DELETE | `/api/opportunities/<id>` | Owning employer |
| GET | `/api/opportunities/mine` | Employer |
| GET | `/api/opportunities/<id>/applicants` | Owning employer |
| POST | `/api/opportunities/<id>/apply` | Student |
| POST, DELETE | `/api/opportunities/<id>/save` | Student |
| GET | `/api/opportunities/saved` | Student |

### Applications

| Method | Endpoint | Role |
|---|---|---|
| GET | `/api/applications` | Student, their own |
| GET | `/api/applications/<id>` | Student or the employer who posted it |
| PUT | `/api/applications/<id>/withdraw` | Student |
| PUT | `/api/applications/<id>/status` | Owning employer |

### Profile

| Method | Endpoint | Notes |
|---|---|---|
| GET, PUT | `/api/profile` | Shape depends on role |
| GET | `/api/profile/dashboard` | Counters for the dashboard cards |
| POST, PUT, DELETE | `/api/profile/education` | Student education history |
| GET, POST, DELETE | `/api/profile/resume` | PDF, DOC or DOCX, 5MB limit |

### Mentorship

| Method | Endpoint | Role |
|---|---|---|
| GET | `/api/mentorship` | Public |
| POST, PUT, DELETE | `/api/mentorship`, `/api/mentorship/<id>` | Admin |

### Administration

| Method | Endpoint |
|---|---|
| GET | `/api/admin/stats` |
| GET | `/api/admin/users` |
| PUT | `/api/admin/users/<id>/status` |
| GET | `/api/admin/employer-verifications` |
| PUT | `/api/admin/employer-verifications/<id>/approve` |
| PUT | `/api/admin/employer-verifications/<id>/reject` |
| GET | `/api/admin/reports` |
| PUT | `/api/admin/reports/<id>/resolve`, `/dismiss` |

`GET /api/health` reports whether the API is up and whether the database is
reachable. It is unauthenticated so it can be used as a deployment check.

---

## Project structure

```
backend/
  app/
    models/          User, StudentProfile, EmployerProfile, Opportunity,
                     Application, SavedOpportunity, MentorshipResource,
                     Notification, Report
    routes/          auth, profile, opportunities, applications,
                     mentorship, admin
    utils/           validators, current_user
    cli.py           administrator and account management commands
    seed.py          demo data
  migrations/        Alembic
  config.py
  run.py

frontend/
  src/
    components/      shared UI, grouped by area
    layouts/         one shell per role
    pages/           Public, StudentGraduate, Employer, Admin
    routes/          route table and role guards
    services/        every API call lives here, nothing calls axios directly
    styles/          global styles and CSS variables
    utils/           token storage
```

Two conventions worth knowing if you are reading the code. All network calls go
through `src/services`, so components never talk to axios themselves and the base
URL is configured in exactly one place. On the backend, the token identity is stored
as a string and converted back to an integer in `app/utils/current_user.py` rather
than in each route.

---

## Database

Nine tables. A user has one profile, either student or employer, depending on their
role. An employer profile owns many opportunities. A student profile owns many
applications and many saved opportunities. An application joins a student profile to
an opportunity, with a unique constraint so nobody can apply to the same posting
twice. Notifications and reports both reference a user.

Migrations are managed with Flask-Migrate:

```bash
flask --app run.py db migrate -m "description"
flask --app run.py db upgrade
```

---

## Deployment

The backend is deployed on Render with `gunicorn run:app`, and the frontend on
Vercel as a static Vite build.

Two things cause almost every deployment problem with this stack. The first is
`VITE_API_URL` not being set on the hosting platform, because `.env` is git-ignored
and never reaches the build. The second is `DATABASE_URL` not being set on the
server, which leaves the app trying to reach a MySQL instance on localhost that does
not exist. Check `/api/health` first whenever something is wrong, since it
distinguishes between the two immediately.

On free hosting tiers the service sleeps after a period of inactivity and the first
request afterwards takes close to a minute while it wakes up.

---

## Not implemented yet

Being straightforward about the edges of the project:

- Password reset by email. The endpoints exist but return "not implemented", so
  passwords are reset from the command line.
- Notification delivery. Notification rows are written when an application is
  submitted or its status changes, but there is no endpoint to read them, so the
  bell icon in the top bar is not yet connected.
- Users cannot submit reports from the interface. Administrators can only act on
  reports that already exist in the database.
- The CV upload API works, but there is no upload control on the profile page.
- Employer logo upload.
- Notification preferences and account deletion in the settings pages.

---

## Author

Shakilla Uwamahoro
