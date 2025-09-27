# Application Deployment on AWS Infrastructure

A small full-stack blog application engineered as a hands-on reference for deploying a real Node.js + React workload to AWS using managed services. The codebase is intentionally compact — the value is in **how it is wired to the cloud**, not in the feature set.

If you are learning how the pieces of a modern AWS deployment fit together — Elastic Beanstalk for compute, RDS for relational data, S3 for object storage, IAM for least-privilege access, and an Nginx reverse proxy in front — this repository walks through one clean, working configuration.

## What it does

A minimal authenticated blog:

- Register / log in (JWT-based)
- Create a post with title, body, and an optional image
- Image upload happens **directly to S3 from the browser** via a short-lived pre-signed URL issued by the backend
- List and delete the logged-in user's posts

## Architecture

```
+-------------+        HTTPS         +----------------------+
|             |  -----------------> |  Elastic Beanstalk   |
|   Browser   |                     |  (frontend, Nginx)   |
|  (React)    |  <----------------- |   serves React build |
+------+------+                     +----------+-----------+
       |                                       |
       |  pre-signed PUT to S3                 |  /api proxy
       v                                       v
+-------------+                     +----------------------+
|     S3      | <------------------ |  Elastic Beanstalk   |
|   (images)  |   AWS SDK from API  |  (backend, Express)  |
+-------------+                     +----------+-----------+
                                                |
                                                v
                                     +----------------------+
                                     |   Amazon RDS         |
                                     |   (PostgreSQL)       |
                                     +----------------------+
```

**Why this shape:**

- **Two Elastic Beanstalk environments** (frontend + backend) instead of one — keeps deploy cycles independent and lets each scale on its own metrics.
- **Direct browser → S3 uploads** — the backend never touches image bytes. Upload bandwidth and CPU stay off your application servers.
- **Nginx in front of the frontend EB env** — handles static-file serving, gzip, and headers without bloating the Node process. Configured via [.ebextensions](frontend/.ebextensions/01_nginx.config).
- **RDS, not a self-hosted DB** — automated backups, patching, and failover are AWS's problem, not yours.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, React Router, Axios, Create React App |
| Backend | Node.js, Express 5, Sequelize ORM, JWT, bcrypt |
| Database | PostgreSQL (Amazon RDS in production, local Postgres for dev) |
| Object storage | Amazon S3 (pre-signed PUT URLs) |
| Compute | AWS Elastic Beanstalk (Node.js platform) |
| Reverse proxy | Nginx (provisioned via `.ebextensions`) |

## Repository layout

```
backend/                Express API
  db.js                 Sequelize connection (uses DATABASE_URL)
  index.js              app entry, route wiring, server bootstrap
  models/               Sequelize models (User, Post)
  routes/               auth + posts routers

frontend/               React app
  src/components/       Login, Register, Posts, CreatePost
  .ebextensions/        Elastic Beanstalk config (Nginx, perms)

infra/                  Reserved for IaC (Terraform / CloudFormation) — not yet populated
```

## Local development

### Prerequisites
- Node.js 18+
- A local PostgreSQL instance (or Docker)
- An AWS account with an S3 bucket if you want image uploads to work end-to-end

### Backend

```bash
cd backend
npm install
cp .env.example .env        # then fill in real values
npm start                   # http://localhost:8080
```

Required environment variables (see [.env.example](backend/.env.example)):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string, e.g. `postgres://user:pass@localhost:5432/blogdb` |
| `JWT_SECRET` | Signing key for access tokens. Use a long random string. |
| `S3_BUCKET` | Bucket used for post images |
| `AWS_REGION` | Region of the bucket, e.g. `us-east-1` |
| `PORT` | Optional, defaults to `8080` |

> **Note on credentials:** the backend uses the standard AWS SDK credential chain. Locally that means `~/.aws/credentials` or `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`. **In production on Elastic Beanstalk, attach an IAM role to the environment** instead of baking keys into env vars.

### Frontend

```bash
cd frontend
npm install
npm start                   # http://localhost:3000
```

The frontend currently calls `http://localhost:8080` directly. For deployed environments, replace those calls with a relative path (`/api/...`, `/auth/...`) and let the proxy / load balancer route them.

## Deploying to AWS

A short outline — adapt to your account and CI:

1. **RDS** — create a PostgreSQL instance in a private subnet. Capture the connection string.
2. **S3** — create a bucket for uploads. Apply a CORS policy that allows `PUT` from your frontend origin.
3. **IAM role for the backend EB env** — grant `s3:PutObject` / `s3:GetObject` on the bucket only. No long-lived keys.
4. **Backend EB environment** — Node.js platform. Set env vars: `DATABASE_URL`, `JWT_SECRET`, `S3_BUCKET`, `AWS_REGION`. Deploy from `backend/`.
5. **Frontend EB environment** — Node.js platform. The bundled `.ebextensions` install `serve` and configure Nginx on port 8080. Build with `npm run build`, then deploy.
6. **Security groups** — RDS open only to the backend EB security group. Backend not directly reachable from the public internet (front via the load balancer only).

## API reference

| Method | Path                       | Auth | Body / Notes                                  |
|--------|----------------------------|------|-----------------------------------------------|
| POST   | `/auth/register`           | —    | `{ username, password }`                      |
| POST   | `/auth/login`              | —    | `{ username, password }` → `{ token }`        |
| GET    | `/api/posts`               | JWT  | List the caller's posts                       |
| POST   | `/api/posts`               | JWT  | `{ title, content, imageKey }`                |
| DELETE | `/api/posts/:id`           | JWT  | Delete one of the caller's posts              |
| GET    | `/api/generate-upload-url` | JWT  | Returns a pre-signed S3 `PUT` URL + image key |

## Known limitations (be honest)

- `sequelize.sync({ force: true })` is enabled in [backend/index.js](backend/index.js) for development convenience. **It drops and recreates tables on every restart.** Replace with migrations (e.g. `umzug`, `sequelize-cli`) before any environment that holds real data.
- The frontend hardcodes `http://localhost:8080` in API calls. Centralise this through an `axios` instance reading `REACT_APP_API_BASE_URL` before deploying.
- `aws-sdk` v2 is used. AWS recommends v3 for new code; this project still works on v2 but should be migrated.
- No automated tests yet beyond the CRA scaffolding.
- `infra/` is a placeholder. A real-world version of this repo would express the AWS resources as Terraform or CloudFormation so the deployment is reproducible.

## License

MIT — see source for details. Use it, fork it, learn from it.
