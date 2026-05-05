# Ruguna College Admissions and eLearning Platform

## Requirements and Operating Scope

Prepared for: Ruguna College Executive Leadership, Admissions, Academic Leadership, eLearning Operations, Finance, and Administration  
Prepared with: Ruguna Digital Platform Delivery Team  
Document date: 06 May 2026  
Version: 1.2  
Primary contact: fokorio@byupathway.edu  
Institution motto: One Who Prevails

---

## 1. Executive Summary

Ruguna College requires a clear digital platform for institutional discovery, online admissions, eLearning delivery, learner progress tracking, course administration, and operational oversight. The platform must serve learners in Uganda while remaining suitable for regional and international applicants who expect secure access, clear information, mobile usability, and credible academic pathways.

The platform is structured as a connected institutional website and eLearning environment. It covers the public website, admissions flow, authenticated learning spaces, instructor tools, admin operations, storage, email, analytics, database records, and role-based access.

The purpose is to increase applicant confidence, reduce admissions friction, support structured digital learning, improve staff visibility, and establish a scalable foundation for Ruguna College's academic operations.

## 2. Business Purpose

The platform exists to help Ruguna College:

- Present a credible institutional identity.
- Publish academic schools, programmes, short courses, fees guidance, admissions details, and verification services.
- Receive complete online applications from local and international applicants.
- Support applicants with guided document submission, country-aware phone fields, next of kin records, disability declaration, nationality, intake selection, education background, referral source tracking, reference-based status tracking, and email updates.
- Deliver online-first courses through a secure learner dashboard, with live online sessions and practical blended activities where a course requires them.
- Support instructors with course content, modules, lessons, assignments, quizzes, resources, submissions, grading, feedback, and announcements.
- Support administrators with users, roles, courses, categories, applications, announcements, audit logs, CMS content, settings, and operational visibility.
- Maintain learner records, completion status, certificate eligibility, and verification-ready credentials.

## 3. Strategic Outcomes

| Outcome | Business Value |
| --- | --- |
| Higher admissions conversion | Applicants can understand Ruguna College, choose a pathway, and apply without manual back-and-forth. |
| Stronger institutional trust | Parents, applicants, partners, and staff see a professional platform with clear information and working flows. |
| Better learner continuity | Students can access courses, lessons, grades, support, certificates, and downloads in a structured learning space. |
| Staff operational control | Admins and instructors manage live content and learner activity without requiring developer intervention. |
| Regional readiness | The admissions flow supports country codes, nationality, international applicants, and clear contact records. |
| Deployment readiness | The system can be deployed on Vercel with PostgreSQL, Clerk, Supabase Storage, Resend, and analytics. |

## 4. Stakeholders

| Stakeholder | Primary Needs |
| --- | --- |
| Executive leadership | Brand trust, growth visibility, operational governance, readiness for launch. |
| Admissions team | Complete applications, applicant contacts, programme choices, documents, intake records, follow-up notes. |
| Academic leadership | Programme structure, course delivery, learning pathways, academic quality, completion evidence. |
| Students | Simple registration, course access, learning progress, assignments, quizzes, downloads, announcements, support. |
| Instructors | Course builder, lesson publishing, grading, feedback, progress monitoring, learner announcements. |
| Registrar | Application review, admissions decisions, applicant documents, learner activation, programme records, certificate records. |
| Finance users | Invoice management, learner payment verification, payment status, account holds, and finance follow-up. |
| Super admin | User roles, course operations, CMS, eLearning settings, audit logs, integrations, and system governance. |
| Parents and guardians | Trust signals, programme legitimacy, admissions clarity, certificate verification. |
| International applicants | Clear application route, nationality support, country-aware phone contacts, online learning access. |

## 5. User Roles and Access Model

| Role | Access Expectations |
| --- | --- |
| Public visitor | Browse institutional content, programmes, short courses, admissions, fees, contact, verification, and eLearning landing pages. |
| Applicant | Submit online application, upload or defer documents, receive reference number, track status, receive admissions email updates, and request admissions guidance. |
| Student | Access learning dashboard, enrolled courses, modules, lessons, assignments, quizzes, payments, downloads, support, profile, certificates. |
| Instructor | Access assigned courses, manage modules and lessons, create assessments, grade submissions, publish announcements. |
| Registrar | Manage application decisions, supporting documents, learner programme activation, learner records, and certificate records. |
| Finance admin | Manage invoices, verify learner payment references, update payment status, and place or release learning-access holds. |
| Super admin | Manage all roles, eLearning operations, CMS, settings, integrations, security controls, and system governance. |

Access must be enforced both at route level and server action/API level. User interface hiding alone is not acceptable for protected workflows.

## 6. Product Scope

### 6.1 Included Scope

| Area | Included Capability |
| --- | --- |
| Public institutional website | Home, about, schools, programmes, short courses, admissions, fees, student life, news/events, prospectus, verification, contact. |
| Online application | Guided form, applicant identity, gender, date of birth, nationality, disability declaration, WhatsApp, alternative phone, next of kin, programme choice, intake, education background, referral source, documents, confirmation question, duplicate detection, success reference, status lookup, and confirmation email. |
| eLearning landing | Public eLearning entry page, course browsing, categories, course detail, FAQ, contact, login, registration, verification support, and live-support access. |
| Authentication | Clerk sign in, sign up, Google sign in, verification tasks, password reset, role-aware redirects, protected logout. |
| Learner dashboard | Course cards, admissions status notice, short-course catalog access, progress, calendar, assignments, quizzes, payments, certificates, downloads, profile, support, and announcement notifications. |
| Course workspace | Course home, announcements, syllabus, modules, grades, people, course materials, weekly learning structure, live session information, instructor contact details, and resources. |
| Instructor portal | Assigned courses, content builder, modules, lessons, resources, assignments, quizzes, submissions, grading, live session scheduling, instructor contact details, and announcements. |
| Registrar workspace | Applications, admissions decisions, document review, learner activation, programme records, and certificate records. |
| Finance workspace | Live invoice records, learner-submitted payment references, payment verification, payment status updates, clearance percentage, and learner access holds. |
| Super admin portal | eLearning administration, courses, users, announcements, settings, audit activity, applications, CMS. |
| Data and storage | PostgreSQL data model through Prisma, Supabase Storage for uploads, signed file access patterns. |
| Communications | Contact submissions, learner support, admissions support, Resend-backed email capability. |
| Analytics and audit | PostHog analytics, audit logs for important operational activity. |

### 6.2 Not in This Phase

The current platform is not intended to replace every institutional ERP function in its first operating phase. HR, payroll, hostel management, full bursar accounting, procurement, library circulation, and government reporting automation should be treated as later modules after admissions and eLearning operations are stable.

### 6.3 Delivery Model Clarification

The platform is online-first. A course can be delivered fully online when all lessons, resources, quizzes, assignments, support, and feedback can happen through the learning portal.

Blended delivery does not automatically mean daily physical lectures. In this document, blended delivery means one or more of the following, depending on the course:

- Scheduled live online video classes led by the instructor on a fixed day and time.
- Instructor office hours where students can ask questions by video, phone, WhatsApp, or email.
- Practical labs, workshops, demonstrations, fieldwork, or campus attendance where the subject cannot be completed online only.
- Online lessons and assessments supported by a limited number of planned physical practical sessions.

Every course must clearly state whether it is fully online, live-online supported, blended with practical sessions, or practical-heavy. Students should know attendance expectations before enrollment.

### 6.4 Registrar and Finance Scope Clarification

The first operating phase includes the registrar and finance capabilities needed to support admissions and eLearning access. It does not claim to be a full university ERP.

Registrar capabilities included now:

- Application records and statuses.
- Applicant document records.
- Admissions status decisions.
- Programme activation after admissions approval.
- First-term course enrollment records from the programme plan.
- Learner profile and academic access records.
- Certificate and verification records.

Registrar capabilities reserved for a later student information system phase:

- Full transcript production.
- Examination board processing.
- Graduation clearance workflows.
- Government statutory reporting.
- Full campus timetable management across all departments.
- Deep registry records beyond admissions, learning access, and certificates.

Finance-related capabilities included now:

- Invoice records.
- Payment references.
- Payment status visibility.
- Learner payment page for invoice balances, minimum clearance, and reference submission.
- Payment reference entry by finance staff.
- Payment verification by finance staff.
- Invoice status updates.
- Enrollment hold and release support where payment status affects access.
- Minimum-clearance policy support, starting with a 50% payment rule before unrestricted learning access.

Finance capabilities reserved for a later finance system phase:

- Full accounting ledger.
- Bank reconciliation.
- Payroll.
- Procurement.
- Tax reporting.
- Budgeting and department-level financial controls.

## 7. Business Workflows

### 7.1 Public Inquiry to Application

1. Visitor lands on the Ruguna College website.
2. Visitor reviews schools, programmes, admissions guidance, fees, and contact options.
3. Visitor selects Apply Now.
4. Applicant chooses Certificate, Diploma, Bachelor's, or Short Courses.
5. Applicant completes required personal, contact, next of kin, programme, education, referral, document, and confirmation fields.
6. System validates data before submission.
7. System checks whether the applicant already has an active application for the same programme.
8. System creates a new application only when no active duplicate exists.
9. Applicant sees a clean confirmation state with a reference number and tracking action.
10. Applicant receives a confirmation email when Resend is configured.
11. Registrar can review submitted applications in the registrar workspace.

### 7.2 Applicant Review and Enrollment

1. Admissions team reviews the submitted application and supporting documents.
2. Admissions team updates application status based on completeness and eligibility.
3. Applicant can track status using the application reference and submitted email address.
4. System sends applicant email updates when a registrar changes status.
5. Applicant may be contacted by phone, WhatsApp, or email.
6. Qualified applicants are moved toward programme or course enrollment.
7. Student account and role access are confirmed.
8. Student receives access to approved course or programme learning records.

### 7.3 Student Learning Flow

1. Student signs in through Ruguna eLearning.
2. Student lands on the learner dashboard.
3. Student sees active admissions applications linked to the same email/account.
4. Student can open a protected learner course catalog without returning to the public website shell.
5. Student can self-enroll in open short courses.
6. Student views enrolled course cards.
7. Student opens a course workspace.
8. Student navigates course home, announcements, syllabus, modules, grades, people, and materials.
9. Student views payment status where an invoice is attached to the course or programme.
10. Student studies weekly modules and lessons when learning access is clear.
11. Student joins scheduled live video sessions where the course includes them.
12. Student uses instructor contact details or office hours for academic support where configured.
13. Student completes quizzes, assignments, practical tasks, and downloads resources.
14. System records lesson progress, assessment attempts, submissions, grades, and completion status.
15. Student becomes eligible for certificate or completion record when course rules and finance clearance rules are satisfied.

### 7.3.1 Authenticated Website Navigation Flow

1. A signed-in user who opens public Ruguna pages shall not be shown the normal applicant-first navigation as if they were anonymous.
2. The public header shall switch to a compact Ruguna eLearning header with the Ruguna logo, dashboard return action, notification access, message/help access, and profile access.
3. The user shall be able to return to the correct dashboard through a clear back-to-dashboard action.
4. The user may still open public pages such as Apply, Courses, Fees, Admissions, and Verification without being asked to sign in again.
5. Signing out shall clear the eLearning session and return the user to the original Ruguna College public homepage.
6. Header notifications shall show current platform or course announcements where available and fall back to a clean empty state where none exist.

### 7.4 Instructor Content and Grading Flow

1. Instructor signs in with assigned role.
2. Instructor views assigned courses and learner activity.
3. Instructor creates or edits modules, lessons, course weeks, assignments, quizzes, and resources.
4. Instructor publishes approved content.
5. Instructor schedules live online sessions or office hours for courses that need direct teaching support.
6. Instructor publishes approved contact channels for academic support.
7. Students access published content.
8. Instructor reviews submissions and quiz activity.
9. Instructor grades work, records feedback, and monitors progress.
10. Instructor publishes announcements for course learners.

### 7.5 Registrar Operations Flow

1. Registrar signs in with registrar role.
2. Registrar reviews applications awaiting action.
3. Registrar opens applicant documents and checks admissions readiness.
4. Registrar updates the application status.
5. System emails the applicant when the status changes.
6. Registrar activates approved applicants into programme records.
7. System creates the learner programme record and first-term course enrollments from the programme plan.
8. Registrar can review learner records and certificate records.

### 7.6 Finance Operations Flow

1. Finance user signs in with finance role.
2. Finance user reviews issued invoices, paid balances, overdue accounts, and learner holds.
3. Student-submitted payment references appear for finance verification.
4. Finance user records or verifies payment references with amount, method, and status.
5. System recalculates invoice amount paid from received or verified payments.
6. System shows whether the learner has reached the minimum 50% clearance rule.
7. Finance user can place or release a learner access hold where payment status requires it.
8. Finance actions are written to the audit log.

### 7.7 Student Payments and Access Flow

1. Student opens Payments from the learner dashboard.
2. Student sees invoice amount, confirmed paid amount, balance, payment history, and clearance percentage.
3. Student pays through the approved Ruguna payment channel.
4. Student submits the mobile money, bank, card, or virtual-card reference against the correct invoice.
5. The payment remains pending until finance verifies it or a future payment-provider webhook confirms it.
6. Verified or received payments increase the invoice paid amount.
7. A learner should have at least 50% confirmed clearance to continue without a finance hold.
8. Full clearance can be required before certificates, final records, or graduation-related documents are released.

### 7.8 Super Admin Operations Flow

1. Super admin signs in with super admin role.
2. Super admin manages users, roles, course operations, categories, announcements, settings, CMS entries, integrations, and audit logs.
3. Super admin can access registrar and finance workspaces for oversight.
4. Super admin updates operational content and system settings without changing code.

### 7.9 Certificate Verification Flow

1. Public user enters certificate or verification code.
2. System searches the verification record.
3. System returns a valid, revoked, expired, or not found result.
4. Verification event can be logged for audit visibility.

### 7.10 Support and Help Flow

1. Public pages shall provide direct WhatsApp access for visitors.
2. Authentication and eLearning access pages shall provide a compact live-support panel with links to application, admissions, eLearning access, fees, certificate verification, and WhatsApp support.
3. The live-support panel shall stay visually light, height-limited, and usable on mobile screens.
4. Help links shall route to implemented pages rather than placeholder actions.
5. Student, instructor, registrar, finance, and admin dashboards shall keep support access inside the authenticated workspace.

## 8. Functional Requirements

### 8.1 Public Website Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-PUB-001 | The system shall present Ruguna College identity, motto, schools, programmes, admissions, fees, and contact details in a professional public website. | Must |
| BR-PUB-002 | The system shall provide a slim utility header with direct access to fees, campus news, eLearning, eLibrary, verification, student portal, and staff portal. | Must |
| BR-PUB-003 | The system shall expose programme and school detail pages with award level, mode, duration, overview, pathways, and application actions. | Must |
| BR-PUB-004 | The system shall provide prospectus and downloadable document access. | Must |
| BR-PUB-005 | The system shall include contact and WhatsApp support routes for admissions and learner help. | Must |
| BR-PUB-006 | The system shall support certificate or document verification through a public verification route. | Must |
| BR-PUB-007 | When a user is signed in and navigates public pages, the system shall replace the anonymous public navigation with a compact Ruguna eLearning header containing logo, dashboard return, notification, message/help, and profile access. | Must |
| BR-PUB-008 | Public visitor pages shall retain the WhatsApp quick action, while authentication pages shall show the live-support panel instead of a generic floating WhatsApp-only button. | Must |

### 8.2 Application Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-APP-001 | The application form shall support Certificate, Diploma, Bachelor's, and Short Course pathways. | Must |
| BR-APP-002 | The form shall capture full name, email, gender, date of birth, nationality, disability declaration, WhatsApp number, alternative phone number, next of kin, programme choices, intake, study mode, education background, referral source, documents, and confirmation answer. | Must |
| BR-APP-003 | Required fields shall be marked with clear asterisks and validated before submission. | Must |
| BR-APP-004 | Phone fields shall support international country codes with compact flag and dial code presentation. | Must |
| BR-APP-005 | The form shall preserve entered data during normal browser disruption through local draft recovery. | Must |
| BR-APP-006 | After successful submission, the form shall be replaced by a clear success state and reference number. | Must |
| BR-APP-007 | Uploaded documents shall be validated by file type and size before storage. | Must |
| BR-APP-008 | The system shall allow applicants to submit without files when documents will be provided later. | Must |
| BR-APP-009 | Registrar and super admin users shall be able to view and manage submitted applications. | Must |

### 8.3 Authentication and Access Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-AUTH-001 | The system shall use Clerk for secure sign in, sign up, Google authentication, email verification, password reset, and session management. | Must |
| BR-AUTH-002 | Protected routes shall redirect unauthenticated users to the eLearning login flow. | Must |
| BR-AUTH-003 | Authenticated users shall be redirected by role to the correct learner, instructor, registrar, finance, or super admin area. | Must |
| BR-AUTH-004 | Server-side authorization shall be enforced for protected APIs and server actions. | Must |
| BR-AUTH-005 | User profile records shall sync with Clerk identity and support first name, last name, avatar, contact preferences, and learning preferences. | Must |
| BR-AUTH-006 | Logout shall terminate the local platform session and Clerk session cleanly. | Must |
| BR-AUTH-007 | Logout shall return users to the original Ruguna College homepage unless an approved destination is explicitly provided. | Must |
| BR-AUTH-008 | Authenticated users shall not be sent back to sign in when opening public course, application, admissions, fees, or verification pages. | Must |

### 8.4 Student eLearning Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-STU-001 | Students shall access a learner dashboard after sign in. | Must |
| BR-STU-002 | The dashboard shall show only enrolled courses as course cards. | Must |
| BR-STU-003 | Each course card shall lead to a course workspace. | Must |
| BR-STU-004 | The course workspace shall contain course home, announcements, syllabus, modules, grades, people, and materials. | Must |
| BR-STU-005 | Modules shall support weekly learning structure, collapsed and expanded states, progress, and completion indicators. | Must |
| BR-STU-006 | Lessons shall support text, video, resource, live session, assignment, quiz, practical task, and blended guide types. | Must |
| BR-STU-007 | Students shall mark lessons complete and system shall update progress. | Must |
| BR-STU-008 | Students shall attempt quizzes and submit assignments. | Must |
| BR-STU-009 | Students shall access downloadable resources through protected resource routes where required. | Must |
| BR-STU-010 | Students shall view grades and weighted assessment categories. | Must |
| BR-STU-011 | Students shall access support and WhatsApp help from the learner area. | Must |
| BR-STU-012 | Students shall access certificates when issued and eligible. | Must |
| BR-STU-013 | Students shall view live online session schedules, joining links, and instructor office-hour details where a course includes them. | Must |
| BR-STU-014 | Students shall view invoices, balances, clearance percentage, and payment history inside the learner area. | Must |
| BR-STU-015 | Students shall submit payment references for MTN Mobile Money, Airtel Money, bank transfer, card, or virtual-card payments for finance verification. | Must |
| BR-STU-016 | Students with finance holds shall see a clear payment action instead of inaccessible course content. | Must |
| BR-STU-017 | Students with active applications shall see a clean admissions status notice that can be dismissed temporarily and reappears after the dismissal window or next relevant session. | Must |
| BR-STU-018 | Students shall receive announcement notifications from platform, school, programme, or enrolled-course notices where available. | Must |

### 8.5 Course and Academic Delivery Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-ACD-001 | The system shall distinguish programmes from courses. | Must |
| BR-ACD-002 | Courses shall be reusable across multiple programmes. | Must |
| BR-ACD-003 | Programme enrollments shall define the learner's academic pathway. | Must |
| BR-ACD-004 | Course enrollments shall define the learner's actual learning access. | Must |
| BR-ACD-005 | Courses shall support seven-week, fourteen-week, and custom pace patterns. | Must |
| BR-ACD-006 | Course weeks shall support topic, overview, preparation, group learning, paper or proof task, and live session notes. | Must |
| BR-ACD-007 | Assessment components shall support Preparation, Teach One Another, Ponder and Prove, Practical Fieldwork, and Final Capstone categories. | Must |
| BR-ACD-008 | Courses shall support published, draft, review, and archived content states. | Must |
| BR-ACD-009 | Courses shall clearly state whether delivery is fully online, live-online supported, blended with practical sessions, or practical-heavy. | Must |
| BR-ACD-010 | Courses shall support scheduled live online video sessions with day, time, meeting link, topic, and instructor notes. | Must |
| BR-ACD-011 | Courses shall support instructor contact and office-hour information visible to enrolled learners. | Must |

### 8.6 Instructor Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-INS-001 | Instructors shall access a role-protected instructor dashboard. | Must |
| BR-INS-002 | Instructors shall view assigned courses and learner progress summaries. | Must |
| BR-INS-003 | Instructors shall create and edit modules. | Must |
| BR-INS-004 | Instructors shall create and edit lessons. | Must |
| BR-INS-005 | Instructors shall attach resources and course materials. | Must |
| BR-INS-006 | Instructors shall create assignments and quizzes. | Must |
| BR-INS-007 | Instructors shall review submissions, assign grades, and leave feedback. | Must |
| BR-INS-008 | Instructors shall publish course announcements. | Must |
| BR-INS-009 | Instructors shall schedule live online teaching sessions for heavy or support-intensive courses. | Must |
| BR-INS-010 | Instructors shall publish approved contact channels and office hours for enrolled learners. | Must |

### 8.7 Registrar Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-REG-001 | Registrar users shall access a role-protected registrar workspace. | Must |
| BR-REG-002 | Registrar users shall view submitted applications, applicant contacts, next of kin, education background, referral source, intake, and supporting documents. | Must |
| BR-REG-003 | Registrar users shall update application statuses including submitted, in review, documents required, offered, waitlisted, rejected, and withdrawn. | Must |
| BR-REG-004 | Registrar users shall activate approved applicants into programme enrollment records. | Must |
| BR-REG-005 | Programme activation shall create the learner programme record and first-term course enrollments from the programme course plan. | Must |
| BR-REG-006 | Registrar users shall review active learner programme records. | Must |
| BR-REG-007 | Registrar users shall review certificate and verification records. | Must |
| BR-REG-008 | Registrar actions shall be audit logged. | Must |

### 8.8 Super Admin Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-ADM-001 | Super admin users shall access a role-protected eLearning administration area. | Must |
| BR-ADM-002 | Super admin users shall manage users and role assignments. | Must |
| BR-ADM-003 | Super admin users shall manage courses, categories, modules, lessons, weeks, assignments, quizzes, and resources. | Must |
| BR-ADM-004 | Super admin users shall manage platform and course announcements. | Must |
| BR-ADM-005 | Super admin users shall manage CMS content and eLearning settings. | Must |
| BR-ADM-006 | Super admin users shall review audit logs for important actions. | Must |
| BR-ADM-007 | Super admin users shall have oversight access to registrar and finance workspaces. | Must |

### 8.9 Finance Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-FIN-001 | Finance users shall access a role-protected finance workspace. | Must |
| BR-FIN-002 | The system shall model invoices, payments, payment references, and payment statuses. | Must |
| BR-FIN-003 | Finance users shall record payment references with amount, method, and status. | Must |
| BR-FIN-004 | Finance records shall remain linked to users and learner records. | Must |
| BR-FIN-005 | Finance users shall update invoice status. | Must |
| BR-FIN-006 | Finance users shall place and release learner access holds where payment status requires restrictions. | Must |
| BR-FIN-007 | Finance actions shall be audit logged. | Must |
| BR-FIN-008 | The first phase shall provide finance operations for admissions and learning access, not full accounting replacement. | Must |
| BR-FIN-009 | Finance users shall verify or reject learner-submitted payment references. | Must |
| BR-FIN-010 | The system shall calculate learner clearance percentage against invoice amount due. | Must |
| BR-FIN-011 | The default access rule shall require at least 50% confirmed clearance before unrestricted learning access, unless leadership configures a different policy. | Must |
| BR-FIN-012 | The system shall support Uganda payment operations through mobile money and bank/card references, with provider checkout integration available after Ruguna selects and activates a payment provider. | Must |

### 8.10 CMS and Content Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-CMS-001 | Admin users shall manage CMS pages, FAQs, testimonials, events, settings, and downloadable documents. | Must |
| BR-CMS-002 | Public-facing content that changes operationally shall be manageable without code changes. | Must |
| BR-CMS-003 | CMS content shall support publish states and creator/updater audit references. | Must |

### 8.11 Communication Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-COM-001 | The system shall send transactional emails through Resend where configured. | Must |
| BR-COM-002 | The system shall capture contact form submissions. | Must |
| BR-COM-003 | The system shall support learner support tickets. | Must |
| BR-COM-004 | The system shall provide visible WhatsApp support actions for admissions and learning support. | Must |

## 9. Data Requirements

The platform uses PostgreSQL through Prisma ORM. The relational model shall support normalized ownership, indexes, statuses, timestamps, and relationships across academic, admissions, learner, instructor, admin, content, finance, and verification workflows.

### 9.1 Core Data Domains

| Domain | Data Entities |
| --- | --- |
| Identity and access | User, Profile, Role, UserRole |
| Academic structure | School, Program, ProgramEnrollment, ProgramCourse, Course, CourseOffering, Intake |
| Course delivery | Module, Lesson, LessonResource, CourseWeek, CourseAssessmentComponent, LessonProgress |
| Admissions | Application |
| Assessment | Assignment, Submission, Quiz, QuizQuestion, QuizAttempt, QuizAttemptAnswer |
| Communication | Announcement, SupportTicket, DiscussionThread, DiscussionReply |
| Credentials | Certificate, CertificateVerification |
| Finance | Invoice, Payment |
| CMS and public content | CMSPage, SiteSetting, Testimonial, FAQ, Event, DownloadableDocument |
| Governance | AuditLog |

### 9.2 Lifecycle Statuses

The platform shall use explicit statuses for:

- Applications: Draft, Submitted, In Review, Documents Required, Offered, Waitlisted, Rejected, Withdrawn.
- Enrollments: Pending, Active, On Hold, Completed, Cancelled, Expired.
- Content: Draft, Review, Published, Archived.
- Assignments: Draft, Published, Closed, Archived.
- Submissions: Draft, Submitted, Late, Graded, Returned.
- Invoices: Draft, Issued, Partially Paid, Paid, Overdue, Void.
- Payments: Pending, Received, Verified, Failed, Refunded.
- Certificates: Pending, Issued, Revoked, Expired.
- Support tickets: Open, In Progress, Resolved, Closed.
- Lesson progress: Not Started, In Progress, Completed.

## 10. Security Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-SEC-001 | All protected routes shall require authenticated sessions. | Must |
| BR-SEC-002 | Registrar, instructor, finance, and super admin areas shall require matching roles. | Must |
| BR-SEC-003 | Protected API routes shall validate both authentication and authorization server-side. | Must |
| BR-SEC-004 | All form submissions shall be validated with Zod schemas. | Must |
| BR-SEC-005 | File uploads shall enforce MIME type, file size, and storage restrictions. | Must |
| BR-SEC-006 | Private files shall use signed or protected access routes where appropriate. | Must |
| BR-SEC-007 | Sensitive production secrets shall be stored in environment variables only. | Must |
| BR-SEC-008 | Audit logs shall record major admin, instructor, application, enrollment, certificate, and user actions. | Must |
| BR-SEC-009 | Rate limiting shall protect sensitive routes such as applications, support, uploads, and verification where applicable. | Must |
| BR-SEC-010 | The system shall avoid insecure direct object access by checking ownership or role authority before returning private records. | Must |
| BR-SEC-011 | Database connection failures shall not expose stack traces to users and shall show concise recovery states while server logs remain controlled and non-repetitive. | Must |

## 11. Non-Functional Requirements

| Category | Requirement |
| --- | --- |
| Performance | Public pages and dashboards shall load efficiently on Vercel with server rendering and optimized assets. |
| Mobile usability | Public pages, application form, eLearning, and dashboards shall work on small, medium, and large screens. |
| Low-bandwidth support | Interfaces shall favor readable content, clean cards, minimal unnecessary motion, and optimized media. |
| Accessibility | Forms shall use labels, clear errors, keyboard-friendly controls, and readable contrast. |
| Reliability | Production deployments shall use environment checks, Prisma validation, typecheck, and build verification. |
| Maintainability | Code shall be modular, typed, validated, and organized by public site, platform, eLearning, data, and API concerns. |
| Observability | Analytics and audit logs shall support visibility into user activity and operational actions. |
| Scalability | Data model shall support additional schools, programmes, courses, instructors, students, and intakes. |
| Failure handling | Database or integration interruptions shall degrade into clear unavailable states instead of crashing finance, learner, or catalog pages. |

## 12. Integrations

| Integration | Purpose | Business Requirement |
| --- | --- | --- |
| Clerk | Authentication and identity management | Secure sign in, sign up, Google auth, verification, password reset, session management, role-aware access. |
| PostgreSQL | Primary relational database | Store users, applications, courses, enrollments, assessments, progress, finance, CMS, certificates, and audit logs. |
| Prisma ORM | Data access and schema management | Provide typed database access, migrations, seed strategy, and relational integrity. |
| Supabase Storage | Uploaded documents and course files | Store applicant documents, profile photos, course resources, and learner submissions. |
| Resend | Transactional email | Send application, support, learner, and operational emails where configured. |
| PostHog | Product analytics | Track usage patterns, learner engagement, and conversion behavior. |
| Uganda payment provider | Mobile money, card, and international payment collection | Recommended production options are Pesapal or Flutterwave for Uganda-local mobile money and cards, with direct MTN MoMo or Airtel Money integration if Ruguna wants operator-specific control. |
| Stripe | International card checkout where Ruguna has a supported merchant entity | Stripe should be used only if Ruguna can legally operate a Stripe account in a supported country; otherwise it should not be the primary Uganda merchant account. |
| Vercel | Hosting and deployment | Deploy the Next.js application with environment-managed production configuration. |

### 12.1 Payment Provider Decision

Ruguna College should not depend on Stripe alone for Uganda-local tuition collection unless the institution has a supported Stripe merchant setup. For local operations, the practical route is:

- Primary local provider: Pesapal or Flutterwave for cards plus mobile money support, subject to account approval and transaction fees.
- Direct mobile money option: MTN MoMo and Airtel Money APIs for higher-control local collections after merchant onboarding.
- International card option: Stripe only where Ruguna has a supported merchant entity, or the selected local provider supports international cards.
- Current platform workflow: students can view invoices, submit payment references, and finance can verify them. Provider checkout can be connected without changing the learner-finance operating model.

## 13. Environment Requirements

Production deployment shall include:

- DATABASE_URL
- DIRECT_URL
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- CLERK_WEBHOOK_SECRET
- NEXT_PUBLIC_SITE_URL
- RESEND_API_KEY
- RESEND_FROM_EMAIL
- SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- POSTHOG_KEY where analytics is enabled
- RUGUNA_MTN_MOMO_NUMBER when MTN Mobile Money instructions are approved
- RUGUNA_AIRTEL_MONEY_NUMBER when Airtel Money instructions are approved
- RUGUNA_BANK_NAME, RUGUNA_BANK_ACCOUNT_NAME, RUGUNA_BANK_ACCOUNT_NUMBER, and RUGUNA_BANK_BRANCH when bank transfer instructions are approved
- RUGUNA_PAYMENT_PROVIDER when online checkout is activated
- PAYMENT_WEBHOOK_SECRET for the selected payment provider
- PAYMENT_PUBLIC_KEY and PAYMENT_SECRET_KEY where required by the selected provider
- RUGUNA_USE_DATABASE set according to production mode
- RUGUNA_ALLOW_DEV_AUTH disabled in production

The production check script shall fail deployment readiness when required keys are missing or unsafe development toggles are active.

## 14. Reporting and KPIs

| KPI | Measurement |
| --- | --- |
| Application conversion | Visitors to submitted applications. |
| Application quality | Percentage of submitted applications with complete required records. |
| Admissions response time | Time from application submission to first admissions action. |
| Course enrollment count | Active course enrollments by intake, programme, and course. |
| Learner engagement | Lessons completed, quizzes attempted, assignments submitted. |
| Completion rate | Course completion percentage by course and intake. |
| Certificate eligibility | Learners eligible for certificates versus issued certificates. |
| Support responsiveness | Open tickets, resolved tickets, average resolution time. |
| Staff activity | Course updates, announcements, grading actions, audit log activity. |

## 15. Acceptance Criteria

The platform shall be considered business-ready when:

- Public website pages load correctly on desktop, tablet, and mobile.
- Apply Now submits valid applications and shows a success confirmation with reference number.
- Application drafts survive normal browser interruption.
- Registrar users can review submitted applications, update decisions, and activate learner records.
- Clerk authentication works in production with live keys.
- Role-based access correctly separates student, instructor, registrar, finance, and super admin dashboards.
- Students can access enrolled courses and course workspace navigation.
- Signed-in users browsing public pages see the compact Ruguna eLearning header, profile access, notifications, message/help access, and dashboard return.
- Signing out returns the user to the original Ruguna College homepage.
- Authentication pages show live support with real route links and do not show the generic homepage WhatsApp-only behavior.
- Admission status notices are readable, dismissible, time-limited, and include a visible status tracking action.
- Students can see whether each course is fully online, live-online supported, blended with practical sessions, or practical-heavy.
- Students can view live session schedules, meeting links, instructor contacts, and office hours where configured.
- Students can complete lesson progress, assignments, quizzes, downloads, support, and profile workflows.
- Students can view payment status, submit payment references, and see finance holds clearly.
- Instructors can create content, publish lessons, create assessments, schedule live sessions, publish contact details, grade submissions, and send announcements.
- Super admin users can manage users, courses, announcements, settings, CMS content, integrations, and audit logs.
- Registrar users can manage application records, admissions decisions, learner activation, learner records, and certificate records for this phase.
- Finance users can manage invoice status, verify payment references, update payment status, calculate clearance, and control access holds for this phase.
- File uploads work through Supabase Storage with validation.
- Resend is configured for transactional emails.
- Certificate verification route returns accurate results.
- Production environment check passes.
- Prisma schema validates and migrations deploy successfully.
- TypeScript check and production build pass before deployment.
- Database connection failures show controlled recovery states and do not expose raw Prisma errors to users.

## 16. Governance and Operating Model

### 16.1 Ownership

| Area | Business Owner | Technical Owner |
| --- | --- | --- |
| Public website content | Admissions and Communications | Platform administrator |
| Admissions form and applications | Admissions office | Platform administrator |
| Course content | Academic leadership and instructors | eLearning administrator |
| User roles | Super admin | Platform administrator |
| Registrar records | Registrar office | Registrar |
| Finance records | Finance office | Finance admin |
| Certificates | Academic registry | Registrar and super admin |
| Security and production configuration | Executive-approved technical owner | Platform administrator |

### 16.2 Change Control

All major changes to admissions data, course structure, certificate rules, finance status behavior, security, or role permissions shall be reviewed before release. Content-only changes may be handled through admin CMS workflows where role permissions allow.

### 16.3 Staff Training

Before launch, Ruguna College shall complete staff orientation for:

- Admissions application review.
- Admin user and role management.
- Instructor course builder and grading workflows.
- Instructor live session and office-hour management.
- Learner support and ticket handling.
- Finance record visibility.
- Registrar application, enrollment, and certificate record handling.
- Certificate issuance and verification.
- Production support escalation.

## 17. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Production auth keys not configured | Users cannot sign in reliably. | Use live Clerk keys, set webhook route, run production check, verify sign in before launch. |
| Storage not configured | Profile photos, application files, and course resources cannot upload. | Configure Supabase buckets, service role key, MIME rules, and signed upload routes. |
| Incomplete course content | Learners see thin courses after enrollment. | Academic teams must load approved modules, lessons, resources, assessments, and announcements before opening enrollment. |
| Unclear delivery mode | Students may expect physical classes where the course is online-first, or expect fully online study where practical sessions are required. | Each course must display delivery mode, live session schedule, physical attendance expectations, and instructor contact details before enrollment. |
| Weak role governance | Staff may see or change data outside authority. | Assign roles deliberately, audit role changes, restrict super admin access. |
| Slow login perception | Learner confidence may drop. | Use production Clerk keys, avoid development auth, monitor session bridge, reduce unnecessary redirects. |
| Payment provider mismatch | Learners may not be able to pay using their preferred local or international method. | Select a Uganda-ready provider before enabling checkout, keep finance-verified references active as a safe fallback, and test MTN, Airtel, card, and international-card scenarios. |
| Finance hold confusion | Students may not understand why a course is paused. | Show invoice balance, clearance percentage, 50% minimum rule, and payment action inside the learner area. |
| Low mobile usability | Applicants and learners on phones may abandon tasks. | Continue mobile testing on apply, course, dashboard, profile, and upload flows. |
| Operational data quality gaps | Admissions follow-up becomes difficult. | Keep required fields enforced and use admin review process. |

## 18. Launch Readiness Checklist

| Area | Requirement |
| --- | --- |
| Environment | All production variables configured in Vercel. |
| Database | Prisma migrations deployed and seed data reviewed. |
| Authentication | Clerk live keys configured, webhook subscribed, Google provider verified. |
| Storage | Supabase Storage buckets and policies configured. |
| Email | Resend API key and sender configured. |
| Content | Schools, programmes, course catalog, admissions, fees, contact, FAQs, and downloads reviewed. |
| Courses | Launch courses include modules, lessons, resources, assignments, quizzes, announcements, and grading rules. |
| Delivery mode | Each launch course identifies whether it is fully online, live-online supported, blended with practical sessions, or practical-heavy. |
| Live teaching | Heavy or support-intensive courses include instructor live session times, joining links, office hours, and approved contact channels. |
| Roles | Super admin, registrar, instructor, finance, and student test accounts verified. |
| Registrar scope | Application decisions, learner activation, learner records, and certificate workflows are tested; full registrar ERP functions are listed as later scope. |
| Finance scope | Invoice status, learner payment references, payment verification, 50% clearance rule, and access-hold workflows are tested; full accounting ERP functions are listed as later scope. |
| Applications | Application submission, draft recovery, document upload, and admin review verified. |
| eLearning | Student dashboard, course workspace, progress, quizzes, assignments, downloads, and certificates verified. |
| Authenticated navigation | Signed-in public browsing, dashboard return, notification dropdown, message/help link, and logout-to-home verified. |
| Support widget | Public WhatsApp action and authentication live-support panel verified on desktop and mobile. |
| Monitoring | PostHog and audit log review enabled. |
| Backup | Database backup and recovery plan confirmed with hosting provider. |

## 19. Implementation Architecture Summary

| Layer | Technology |
| --- | --- |
| Frontend | Next.js App Router, React, TypeScript, Tailwind CSS, shadcn-style components. |
| Backend | Next.js route handlers, server actions, server-side authorization. |
| Database | PostgreSQL with Prisma ORM. |
| Authentication | Clerk. |
| Storage | Supabase Storage. |
| Email | Resend. |
| Analytics | PostHog. |
| Hosting | Vercel. |
| Validation | Zod and React Hook Form. |
| Admin tables | TanStack Table. |

## 20. Route Inventory

### 20.1 Public and Institutional Routes

- /
- /about
- /schools
- /schools/[slug]
- /programs
- /programs/[slug]
- /short-courses
- /admissions
- /apply
- /fees-funding
- /student-life
- /news-events
- /prospectus
- /verification
- /contact
- /e-library
- /downloads/[slug]

### 20.2 eLearning Public Routes

- /elearning
- /elearning/about
- /elearning/categories
- /elearning/courses
- /elearning/courses/[slug]
- /elearning/faq
- /elearning/contact
- /elearning/login
- /elearning/register
- /elearning/verify-email
- /elearning/forgot-password
- /elearning/auth-complete
- /elearning/logout
- /elearning/access-denied
- /elearning/tasks/[task]

### 20.3 Learner Routes

- /learn
- /learn/dashboard
- /learn/my-courses
- /learn/course/[slug]
- /learn/program
- /learn/continue
- /learn/calendar
- /learn/assignments
- /learn/quizzes
- /learn/payments
- /learn/certificates
- /learn/downloads
- /learn/help
- /learn/profile
- /learn/announcements

### 20.4 Instructor Routes

- /instructor
- /instructor/dashboard
- /instructor/courses
- /instructor/course/[id]/builder
- /instructor/submissions

### 20.5 Registrar Routes

- /registrar
- /registrar/applications
- /registrar/learners
- /registrar/records

### 20.6 Admin and Finance Routes

- /admin
- /admin/applications
- /admin/cms
- /admin/elearning
- /admin/elearning/courses
- /admin/elearning/courses/[id]/builder
- /admin/elearning/categories
- /admin/elearning/users
- /admin/elearning/announcements
- /admin/elearning/settings
- /admin/elearning/audit
- /finance
- /finance/invoices
- /finance/payments
- /finance/holds
- /account/settings

## 21. API Inventory

### 21.1 Admissions and Contact APIs

- /api/applications
- /api/applications/uploads
- /api/contact
- /api/admin/applications/documents

### 21.2 eLearning APIs

- /api/elearning/enrollments
- /api/elearning/progress
- /api/elearning/submissions
- /api/elearning/quizzes/attempts
- /api/elearning/resources/[id]
- /api/elearning/uploads/signed-url
- /api/elearning/support
- /api/elearning/discussions
- /api/elearning/discussions/replies
- /api/elearning/certificates/issue
- /api/elearning/certificates/verify
- /api/elearning/session-status
- /api/elearning/session-bridge
- /api/elearning/notifications
- /api/elearning/logout

### 21.3 Staff APIs

- /api/admin/elearning/courses
- /api/admin/elearning/modules
- /api/admin/elearning/lessons
- /api/admin/elearning/weeks
- /api/admin/elearning/resources
- /api/admin/elearning/assignments
- /api/admin/elearning/quizzes
- /api/admin/elearning/announcements
- /api/instructor/submissions/grade
- /api/webhooks/clerk

## 22. Leadership Decisions Before Launch

Ruguna College leadership should confirm:

- Final institution naming and visual identity.
- Production domain and email sender identity.
- Launch intake priorities.
- Initial schools and programmes to publish.
- Initial fully online, live-online supported, and blended courses to open for enrollment.
- Role owners for super admin, admin, instructor, finance, admissions, and support.
- Final payment provider for mobile money, card, virtual-card, and international payments.
- Finance clearance policy, including whether 50% is the default continuing-access threshold and whether 100% is required before certificates or records release.
- Data privacy and records handling expectations.
- Go-live date after production environment verification.

## 23. Conclusion

The Ruguna College Admissions and eLearning Platform establishes a practical digital foundation for admissions, online learning, staff operations, learner records, support, and verification. It is structured for operational use after production configuration, content review, staff onboarding, and final leadership confirmation.

It gives Ruguna College one connected place to receive applicants, guide learners, support instructors, and manage the first phase of digital academic delivery.
