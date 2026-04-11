# Ruguna Vocational Training Institute

This workspace now contains a production-minded Next.js App Router scaffold for the Ruguna Vocational Training Institute platform direction.

## What is included

- Brand-aligned marketing site routes for home, about, schools, programs, short courses, admissions, fees, student life, news, verification, contact, apply, and portal entry pages
- Shared content/data files for schools, programs, testimonials, admissions steps, fee highlights, and portal foundations
- Mobile-first design system using Tailwind CSS patterns and shadcn-style source components
- Searchable client-side program directory
- Dynamic detail pages for schools and programs
- SEO basics through `robots.ts` and `sitemap.ts`

## Next implementation phases

1. Install and configure Clerk for applicant, student, instructor, registrar, finance, and super admin roles.
2. Add Prisma, PostgreSQL, and the core schema for programs, applications, students, payments, certificates, and audit logs.
3. Connect verification, admissions, contact, and portal routes to live backend workflows.
4. Add CMS-managed content editing for hero content, programs, testimonials, news, events, and downloads.
5. Integrate storage, email, analytics, and deployment environment variables.

## Local development

```bash
npm install
npm run dev
```

If PowerShell wrappers around `npm` are slow on this machine, call the CLI through Node directly:

```powershell
& "C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install
& "C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
```
