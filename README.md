# Ruguna Vocational Training Institute Platform

Production-minded Next.js App Router platform for Ruguna Vocational Training Institute, built for Uganda-first vocational and professional learning delivery.

## Stack

- Next.js 16 + TypeScript + App Router
- Tailwind CSS + shadcn-style source components
- PostgreSQL + Prisma ORM
- Clerk authentication hooks and auth-ready route structure
- Supabase Storage server helpers with signed/private download support
- Resend transactional email helper for admissions/application events
- React Hook Form + Zod validated public workflows
- TanStack Table for admin and finance data tables
- PostHog analytics provider hook

## What is implemented

- Premium public site shell with utility header, admissions journeys, programme discovery, prospectus downloads, contact/help, and certificate verification
- Protected route structure for student, instructor, admin, and finance workspaces
- Database-backed student dashboard, enrolled course records, course player entry points, certificates, and support desk
- Instructor dashboard, secured content-management endpoints, and grading queue
- Database-backed admin eLearning dashboard, admissions queue, and CMS/SEO control surface
- Finance dashboard with invoice and payment-status table
- Prisma schema covering users, roles, schools, programmes, courses, learning delivery, applications, certificates, finance, support, CMS, and audit entities
- Seed strategy for roles, all schools, programme catalog, intakes, eLearning courses, modules, lessons, and settings
- Database-backed contact inquiries, application interest submissions, learner enrollments, progress tracking, submissions, quiz attempts, certificate issuance, support tickets, and audit logs
- Route protection via `proxy.ts` plus server-side role checks

## Environment setup

1. Copy `.env.example` to `.env.local`.
2. Copy `.env.example` to `.env` for Prisma CLI commands.
3. Configure PostgreSQL/Supabase Postgres, Clerk, Supabase Storage, Resend, and PostHog values.
4. For local-only role access without Clerk, keep `RUGUNA_ALLOW_DEV_AUTH=true`.
5. For production, set `RUGUNA_USE_DATABASE=true` and `RUGUNA_ALLOW_DEV_AUTH=false`.
6. Add initial staff access with `RUGUNA_SUPER_ADMIN_EMAILS` and `RUGUNA_INSTRUCTOR_EMAILS`, then manage ongoing roles from `/admin/elearning/users`.

## Development

```powershell
npm.cmd install
npm.cmd run db:generate
npm.cmd run db:validate
npm.cmd run storage:setup
npm.cmd run typecheck
npm.cmd run build
npm.cmd run dev
```

## Database

```powershell
npm.cmd run db:migrate
npm.cmd run db:seed
```

For Supabase/Vercel production:

```powershell
npm.cmd run prod:check
npm.cmd run db:deploy
npm.cmd run db:seed
npm.cmd run storage:setup
npm.cmd run deploy:check
```

Use the Supabase pooled connection for `DATABASE_URL` and the session/direct connection for `DIRECT_URL`. Prisma CLI reads `.env`; Next.js reads `.env.local`.

Full deployment steps are documented in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Backend Workflows

- `POST /api/applications` validates the application form, creates or updates the applicant profile, assigns the applicant role, persists an `Application`, writes an audit log, and sends a Resend confirmation when configured.
- `POST /api/contact` validates the contact form, persists a public `SupportTicket`, and writes an audit log.
- `POST /api/elearning/enrollments` enrolls authenticated learners into published courses.
- `POST /api/elearning/progress` tracks lesson completion and updates course completion/certificate eligibility.
- `POST /api/elearning/submissions` saves assignment submissions for enrolled learners.
- `POST /api/elearning/quizzes/attempts` scores quiz attempts and enforces attempt limits.
- `POST /api/elearning/discussions` and `/api/elearning/discussions/replies` persist course and lesson discussions.
- `POST /api/elearning/support` opens authenticated learner or staff support tickets.
- `POST /api/elearning/certificates/issue` issues certificates from admin roles; `GET /api/elearning/certificates/verify?code=...` verifies issued certificates publicly.
- `POST /api/admin/elearning/courses`, `/modules`, `/lessons`, `/resources`, `/assignments`, `/quizzes`, and `/announcements` provide secured instructor/admin content operations.
- `POST /api/instructor/submissions/grade` grades learner submissions and updates assessment averages.
- `POST /api/webhooks/clerk` syncs Clerk user lifecycle events into local `User`, `Profile`, and `UserRole` records when `CLERK_WEBHOOK_SECRET` is configured.
- `/admin/elearning/users` lets super admins assign student, instructor, finance, registrar/admin, and super admin roles, with Clerk public metadata sync and audit logging.
- Supabase Storage helpers live in `src/lib/platform/storage.ts` and enforce file size and MIME restrictions before signed uploads or private signed downloads are created.
- Audit logging lives in `src/lib/platform/audit.ts` and is used by backend workflows when database mode is enabled.

## Notes

- Downloadable prospectus and guide routes are implemented at `/downloads/[slug]`.
- If Clerk is configured, `/elearning/login` and `/elearning/register` use Clerk components.
- If Clerk is not configured, `/elearning/login` supports protected local role sessions for workflow testing only.
