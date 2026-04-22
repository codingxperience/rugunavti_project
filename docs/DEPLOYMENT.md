# Ruguna eLearning Deployment Runbook

This runbook prepares the Ruguna eLearning platform for a real Vercel deployment with Supabase Postgres, Supabase Storage, Clerk, and Resend.

## 1. Rotate Exposed Secrets

The Supabase database password and service key have been shared in chat. Treat them as exposed.

Before production:

- Rotate the Supabase database password.
- Rotate the Supabase secret/service role key.
- Update local `.env.local`, Vercel environment variables, and any deployment secrets after rotation.
- Never commit `.env`, `.env.local`, database passwords, Clerk secrets, Supabase service keys, or Resend keys.

## 2. Required Environment Variables

Set these in Vercel for Production and Preview, and keep local values in `.env.local`.

```env
NEXT_PUBLIC_SITE_URL=
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/elearning/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/elearning/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/learn/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/learn/dashboard
CLERK_SIGN_IN_URL=/elearning/login
CLERK_SIGN_UP_URL=/elearning/register
CLERK_AFTER_SIGN_IN_URL=/learn/dashboard
CLERK_AFTER_SIGN_UP_URL=/learn/dashboard
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET_PUBLIC=ruguna-public
SUPABASE_BUCKET_PRIVATE=ruguna-private
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
RUGUNA_USE_DATABASE=true
RUGUNA_ALLOW_DEV_AUTH=false
RUGUNA_ENABLE_ANALYTICS=false
```

Production requirements:

- `RUGUNA_ALLOW_DEV_AUTH=false`
- `RUGUNA_USE_DATABASE=true`
- `NEXT_PUBLIC_SITE_URL` must be the deployed domain, not localhost.
- Supabase Postgres URLs should include `sslmode=require`.
- `DATABASE_URL` should use the pooled Supabase connection for the app.
- `DIRECT_URL` should use the direct/session connection for Prisma migrations.

Run:

```powershell
npm.cmd run prod:check
```

The command must pass before production deployment.

## 3. Clerk Setup

Configure Clerk with email/password and Google sign-in.

Required Clerk URLs:

- Sign in URL: `/elearning/login`
- Sign up URL: `/elearning/register`
- After sign in URL: `/learn/dashboard`
- After sign up URL: `/learn/dashboard`

Create a Clerk webhook endpoint:

- Endpoint URL: `https://YOUR_DOMAIN/api/webhooks/clerk`
- Events: `user.created`, `user.updated`, `user.deleted`
- Secret: store as `CLERK_WEBHOOK_SECRET`

The webhook syncs Clerk users into the platform database so role checks, learner records, instructor workflows, and audit logs use real local records.

## 4. Supabase Database

After env variables are configured:

```powershell
npm.cmd run db:generate
npm.cmd run db:deploy
npm.cmd run db:seed
```

The seed creates Ruguna roles, online-first schools/categories, course structure, modules, lessons, resources, quiz/assignment records, FAQs, testimonials, and site settings.

## 5. Supabase Storage

Create or update Ruguna Storage buckets:

```powershell
npm.cmd run storage:setup
```

The script configures:

- Public bucket: `SUPABASE_BUCKET_PUBLIC`
- Private bucket: `SUPABASE_BUCKET_PRIVATE`
- Max upload size: 20 MB
- Allowed MIME types: PDF, JPEG, PNG, WebP, CSV, DOCX, XLSX

The application only creates signed upload/download URLs for configured Ruguna buckets and validates bucket names, paths, MIME types, and file size server-side.

## 6. Resend Email

Configure:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

Recommended production email events:

- Application received
- Learner enrollment confirmation
- Support ticket received
- Certificate issued
- Instructor/admin notifications for submissions and grading queues

## 7. Vercel Deployment

Local preflight:

```powershell
npm.cmd run deploy:check
```

Production deployment sequence:

```powershell
npm.cmd run db:deploy
npm.cmd run db:seed
npm.cmd run storage:setup
npm.cmd run build
```

For Vercel, set the build command to:

```powershell
npm.cmd run build
```

## 8. Post-Deploy Smoke Test

Verify these routes after deployment:

- `/elearning`
- `/elearning/login`
- `/elearning/register`
- `/elearning/courses`
- `/learn/dashboard`
- `/learn/my-courses`
- `/instructor/dashboard`
- `/admin/elearning`
- `/api/elearning/certificates/verify?code=INVALID-CODE`

Expected behavior:

- Public eLearning routes load without auth.
- Protected learner, instructor, and admin routes redirect to Clerk when signed out.
- Clerk sign-in creates/syncs a local user through the webhook.
- Student users can enroll, open courses, complete lessons, submit assignments, attempt quizzes, open support tickets, and view certificates.
- Instructor/admin users can manage courses, modules, lessons, resources, assignments, quizzes, announcements, grading, and certificates.
