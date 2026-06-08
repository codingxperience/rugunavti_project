# Ruguna Security And Operations Notes

## Dashboard Session Security

Ruguna dashboards use a separate workspace session in addition to Clerk or local dev auth. This prevents an old browser-history link from reopening protected dashboards after the Ruguna workspace has gone idle.

- `ruguna-workspace-session` is an HTTP-only cookie.
- The default idle limit is 3 minutes.
- Set both `RUGUNA_WORKSPACE_IDLE_MINUTES` and `NEXT_PUBLIC_RUGUNA_WORKSPACE_IDLE_MINUTES` to the same value.
- Protected dashboards require both valid authentication and an active workspace session.
- Expired sessions redirect to `/elearning/session-expired`, which clears Ruguna cookies and signs out of Clerk when configured.
- After expiry, `/elearning/login` refuses to silently reopen a Clerk/Gmail session without first passing through the expired-session cleanup flow.
- Protected dashboard responses send `Cache-Control: no-store` headers to reduce sensitive browser-history caching.

Important limitation: if a learner or staff member uses Google OAuth, Ruguna can close the Ruguna/Clerk session and require a new sign-in action, but the browser may still have an active Google account session. If the institution requires a password or MFA challenge every time, enforce that in Clerk/identity-provider policy, or require password/MFA for staff roles.

## Supabase / Postgres Keepalive

The production deployment includes a Vercel Cron job:

- Path: `/api/cron/supabase-keepalive`
- Schedule: every Monday at 05:00 UTC
- Protection: `Authorization: Bearer $CRON_SECRET`
- Action: runs `SELECT 1` through Prisma against the configured Supabase/Postgres database

Required production environment:

- `CRON_SECRET`
- `RUGUNA_USE_DATABASE=true`
- `DATABASE_URL`

This is both a small health check and a database activity signal. Do not expose Supabase service-role keys in browser code or unprotected scripts.

## Production Monitoring Direction

For a serious academic platform, monitor at three levels:

- Infrastructure: deployment status, database availability, function duration, and storage.
- Application: authentication failures, API errors, payment webhook failures, upload failures, and database latency.
- Business flow: applications submitted, enrollments created, payments completed, lessons completed, submissions graded, and certificates issued.

The cron endpoint gives a basic database signal. Production should still review Vercel logs and add alerting before high-traffic launch.
