# PulseAPI

<p align="center">
  <strong>A full-stack API monitoring and uptime tracking platform</strong>
</p>

<p align="center">
  Monitor REST APIs, track response times, inspect logs, detect incidents, and publish a public status page.
</p>

<p align="center">
  <a href="https://pulse-api-six.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <a href="https://pulseapi-production-181e.up.railway.app/api/health">
    <img src="https://img.shields.io/badge/Backend-Railway-purple?style=for-the-badge&logo=railway" alt="Backend" />
  </a>
  <!-- <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
  </a> -->
</p>

---

## Live Deployment

| Service  | Platform      | URL                                                            |
| -------- | ------------- | -------------------------------------------------------------- |
| Frontend | Vercel        | [Open PulseAPI](https://pulse-api-six.vercel.app)              |
| Backend  | Railway       | [Backend API](https://pulseapi-production-181e.up.railway.app) |
| Database | Railway MySQL | Private Railway service                                        |

---

## Overview

PulseAPI is a full-stack API monitoring platform that helps developers track the availability and performance of their REST APIs.

Users can register monitored endpoints, automatically check their availability, inspect response-time history, review incidents, and manually trigger new checks from a dashboard.

The application also provides a public status page that can be shared without authentication.

---

## Features

### Authentication

* User registration and login
* Password hashing using bcrypt
* JWT-based authentication
* Protected dashboard and endpoint routes
* User-specific monitored endpoints

### Endpoint Monitoring

* Add REST API endpoints
* Delete existing endpoints
* Support for HTTP methods
* Automatic scheduled API checks
* Manual **Check Now** option
* Status-code tracking
* Response-time measurement
* Last-checked timestamp
* Uptime and downtime detection

### Dashboard

* View all monitored APIs
* Search endpoints
* Filter endpoints by status
* Sort newly created endpoints first
* View total, active, and failed endpoints
* Quickly open endpoint details
* Responsive web interface

### Endpoint Details

* Current endpoint status
* Last response status code
* Latest response time
* Historical monitoring logs
* Response-time chart
* Error messages
* Manual endpoint checks

### Bulk Import

Multiple endpoints can be added together using JSON.

Example:

```json
[
  {
    "name": "JSONPlaceholder Posts",
    "url": "https://jsonplaceholder.typicode.com/posts",
    "method": "GET",
    "category": "Testing"
  },
  {
    "name": "HTTPBin Healthy",
    "url": "https://httpbin.org/status/200",
    "method": "GET",
    "category": "Status Testing"
  },
  {
    "name": "HTTPBin Server Error",
    "url": "https://httpbin.org/status/500",
    "method": "GET",
    "category": "Failure Testing"
  }
]
```

### Incident Management

* Automatically detect endpoint failures
* Create incidents when an endpoint becomes unavailable
* Track ongoing and resolved incidents
* Store incident duration
* Display incident history
* Record associated error messages

### Public Status Page

* Publicly accessible endpoint status
* No login required
* Shareable user-specific status URL
* Displays current availability of monitored services

### Notifications

* Nodemailer email-service integration
* Can notify users when endpoint status changes
* Supports environment-based email credentials

---

## Tech Stack

### Frontend

| Technology   | Purpose                           |
| ------------ | --------------------------------- |
| React        | User interface                    |
| Vite         | Development and production builds |
| React Router | Client-side routing               |
| Axios        | API communication                 |
| Recharts     | Response-time charts              |
| CSS          | Application styling               |
| Vercel       | Frontend deployment               |

### Backend

| Technology     | Purpose                             |
| -------------- | ----------------------------------- |
| Node.js        | JavaScript runtime                  |
| Express.js     | REST API server                     |
| MySQL          | Relational database                 |
| mysql2         | MySQL driver and connection pooling |
| JSON Web Token | Authentication                      |
| bcryptjs       | Password hashing                    |
| Axios          | External API health checks          |
| node-cron      | Scheduled monitoring                |
| Nodemailer     | Email notifications                 |
| CORS           | Frontend-backend communication      |
| Railway        | Backend and database hosting        |

---

## System Architecture

```text
┌─────────────────────────┐
│      React Frontend     │
│         Vercel          │
└────────────┬────────────┘
             │ HTTPS / Axios
             ▼
┌─────────────────────────┐
│  Node.js + Express API  │
│         Railway         │
└────────────┬────────────┘
             │ Private Railway Network
             ▼
┌─────────────────────────┐
│      MySQL Database     │
│         Railway         │
└─────────────────────────┘
             ▲
             │
┌────────────┴────────────┐
│ Scheduled API Checker   │
│ Axios + Node Cron       │
└─────────────────────────┘
```

---

## Project Structure

```text
PulseAPI/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── initDb.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── endpointController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── endpointRoutes.js
│   │
│   ├── services/
│   │   ├── apiChecker.js
│   │   └── emailService.js
│   │
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── components/
│   │
│   ├── pages/
│   │   ├── AddEndpoint.jsx
│   │   ├── BulkImport.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EndpointDetails.jsx
│   │   ├── Incidents.jsx
│   │   ├── Login.jsx
│   │   ├── PublicStatus.jsx
│   │   └── Register.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── index.html
│   ├── vercel.json
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## API Routes

### Authentication

| Method | Endpoint             | Authentication | Description            |
| ------ | -------------------- | -------------: | ---------------------- |
| POST   | `/api/auth/register` |             No | Register a user        |
| POST   | `/api/auth/login`    |             No | Log in and receive JWT |

### Endpoints

| Method | Endpoint                               | Authentication | Description                        |
| ------ | -------------------------------------- | -------------: | ---------------------------------- |
| GET    | `/api/endpoints`                       |            Yes | Get the user's monitored endpoints |
| POST   | `/api/endpoints`                       |            Yes | Add a new endpoint                 |
| DELETE | `/api/endpoints/:id`                   |            Yes | Delete an endpoint                 |
| GET    | `/api/endpoints/:id`                   |            Yes | Get endpoint details               |
| POST   | `/api/endpoints/:id/check-now`         |            Yes | Manually check an endpoint         |
| GET    | `/api/endpoints/:id/logs`              |            Yes | Get monitoring logs                |
| POST   | `/api/endpoints/bulk-import`           |            Yes | Import multiple endpoints          |
| GET    | `/api/endpoints/incidents`             |            Yes | Get incident history               |
| GET    | `/api/endpoints/public-status/:userId` |             No | View public status data            |

### Health Check

| Method | Endpoint      | Description                          |
| ------ | ------------- | ------------------------------------ |
| GET    | `/api/health` | Check whether the backend is running |

Protected routes require:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Local Installation

### Prerequisites

Install the following:

* Node.js
* npm
* MySQL
* Git

### Clone the repository

```bash
git clone https://github.com/siddhantjain1077/PulseAPI.git
cd PulseAPI
```

### Backend setup

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Add:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pulseapi_db

JWT_SECRET=replace_with_a_secure_random_secret

FRONTEND_URL=http://localhost:5173

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Create the local database:

```sql
CREATE DATABASE IF NOT EXISTS pulseapi_db;
```

Start the backend:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env.local
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

## Production Build

Build the frontend:

```bash
cd frontend
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The backend does not require a compilation step. Start it using:

```bash
cd backend
npm start
```

---

## Deployment

### Frontend on Vercel

Use the following Vercel settings:

```text
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Add:

```env
VITE_API_URL=https://pulseapi-production-181e.up.railway.app/api
```

### Backend on Railway

Use:

```text
Root Directory: backend
Start Command: npm start
```

Add the backend environment variables through the Railway Variables panel.

For a backend and MySQL database inside the same Railway project:

```env
DB_HOST=mysql.railway.internal
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_railway_mysql_password
DB_NAME=railway

JWT_SECRET=replace_with_a_secure_random_secret
FRONTEND_URL=https://pulse-api-six.vercel.app
```

Never commit real production credentials to GitHub.

---

## Testing APIs

### Healthy endpoint

```text
https://jsonplaceholder.typicode.com/posts/1
```

Expected result:

```text
Status: UP
HTTP status: 200
```

### Failure endpoint

```text
https://httpbin.org/status/500
```

Expected result:

```text
Status: DOWN
HTTP status: 500
```

### Slow endpoint

```text
https://httpbin.org/delay/3
```

Use this to test response-time tracking.

### Invalid-domain test

```text
https://invalid-pulseapi-test-12345.com
```

Use this to test network-error handling.

---

## Security Practices

* Passwords are hashed before being saved.
* Protected routes require JWT authentication.
* SQL parameters should use prepared statements.
* Environment variables are used for credentials.
* CORS restricts access to configured frontend origins.
* `.env` files must never be committed.
* Database and email credentials should be rotated if exposed.
* JWT secrets should be long, random, and production-specific.

---

## Troubleshooting

### `VITE_API_URL is missing`

Create `frontend/.env.local` for local development or add `VITE_API_URL` in Vercel, then rebuild the frontend.

### CORS error

Confirm the frontend URL is present in the backend CORS allowlist or the Railway `FRONTEND_URL` variable.

### Database variables are undefined

Create `backend/.env` locally or configure the variables in Railway.

### MySQL access denied

Verify:

```text
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
```

### Railway cannot find a module

Railway runs on Linux, so filenames and imports are case-sensitive.

Example:

```text
authRoutes.js
```

must match:

```js
require("./routes/authRoutes");
```

### White screen after deployment

Open the browser Console and verify that:

```text
VITE_API_URL
```

is included during the Vercel build.

---

## Roadmap

* [ ] Custom monitoring intervals
* [ ] Slack and Discord alerts
* [ ] Webhook notifications
* [ ] API-key and custom-header support
* [ ] SSL certificate expiry monitoring
* [ ] Multi-region monitoring
* [ ] Team workspaces
* [ ] Role-based access control
* [ ] Export logs as CSV
* [ ] Advanced uptime reports
* [ ] Dark and light themes
* [ ] Docker support
* [ ] Automated backend and frontend tests
* [ ] GitHub Actions CI/CD workflow

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/feature-name
```

3. Commit the changes:

```bash
git commit -m "Add feature name"
```

4. Push the branch:

```bash
git push origin feature/feature-name
```

5. Create a pull request.

Read [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

---

## Author

**Siddhant Jain**

* GitHub: [@siddhantjain1077](https://github.com/siddhantjain1077)
* Project: [PulseAPI](https://github.com/siddhantjain1077/PulseAPI)

---

## License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with React, Node.js, Express, MySQL, Railway and Vercel.
</p>
