# Ruguna Vocational Training Institute Platform

Production-minded Next.js App Router platform for Ruguna Vocational Training Institute, built for Uganda-first vocational and professional learning delivery.

## Stack

- Next.js 16 + TypeScript + App Router
- Tailwind CSS + shadcn-style source components
- PostgreSQL + Prisma ORM
- Clerk authentication hooks and auth-ready route structure
- Supabase Storage integration points
- Resend integration points
- React Hook Form + Zod validated public workflows
- TanStack Table for admin and finance data tables
- PostHog analytics provider hook

## What is implemented

- Premium public site shell with utility header, admissions journeys, programme discovery, prospectus downloads, contact/help, and certificate verification
- Protected route structure for student, instructor, admin, and finance workspaces
- Student dashboard, course player, certificates, and support desk
- Instructor dashboard, course builder overview, and grading queue
- Admin dashboard, admissions queue, and CMS/SEO control surface
- Finance dashboard with invoice and payment-status table
- Prisma schema covering users, roles, schools, programmes, courses, learning delivery, applications, certificates, finance, support, CMS, and audit entities
- Seed strategy for roles, schools, programmes, and utility-header settings
- Route protection via `proxy.ts` plus server-side role checks

## Environment setup

1. Copy `.env.example` to `.env.local`.
2. Configure PostgreSQL, Clerk, Supabase, Resend, and PostHog values.
3. For local-only role access without Clerk, keep `RUGUNA_ALLOW_DEV_AUTH=true`.

## Development

```powershell
npm.cmd install
npm.cmd run db:generate
npm.cmd run typecheck
npm.cmd run build
npm.cmd run dev
```

## Database

```powershell
npm.cmd run db:migrate
npm.cmd run db:seed
```

## Notes

- Downloadable prospectus and guide routes are implemented at `/downloads/[slug]`.
- If Clerk is configured, `/sign-in` and `/sign-up` use Clerk components.
- If Clerk is not configured, `/e-learning-login` supports protected local role sessions for workflow testing.
