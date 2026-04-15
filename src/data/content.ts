export type Testimonial = {
  name: string;
  quote: string;
  program: string;
  graduationYear: string;
};

export type NewsItem = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
};

export type EventItem = {
  title: string;
  date: string;
  type: string;
  summary: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Amina N.",
    quote:
      "Ruguna made the learning practical from the first term. I graduated with confidence, a portfolio, and a clear path into work.",
    program: "Diploma in Software Engineering",
    graduationYear: "2025",
  },
  {
    name: "Brian T.",
    quote:
      "The workshop sessions felt connected to the real world. I did not just learn theory, I learned how to solve problems.",
    program: "Certificate in Solar PV Installation",
    graduationYear: "2024",
  },
  {
    name: "Catherine M.",
    quote:
      "Admissions was simple, mobile-friendly, and supportive. The institute helped me move from interest to enrollment quickly.",
    program: "Diploma in Public Health Practice",
    graduationYear: "2025",
  },
];

export const admissionsSteps = [
  "Create account",
  "Choose program",
  "Fill application form",
  "Upload documents",
  "Pay application fee if applicable",
  "Track review status",
  "Receive decision",
  "Confirm admission",
];

export const admissionRequirements = [
  "Academic transcripts or result slips",
  "National ID, passport, or school ID copy",
  "Passport photo",
  "Any required certificates for prior study or work experience",
];

export const feeHighlights = [
  {
    level: "Short Courses",
    range: "UGX 250,000 to UGX 850,000",
    note: "Best for fast upskilling and weekend or online access.",
  },
  {
    level: "Certificate",
    range: "UGX 1,250,000 to UGX 1,650,000",
    note: "Strong entry-level vocational pathways with practical labs and attachments.",
  },
  {
    level: "Diploma",
    range: "UGX 2,000,000 to UGX 2,500,000 per year",
    note: "Deeper professional training for technical and supervisory growth.",
  },
  {
    level: "Bachelor's",
    range: "UGX 2,700,000 to UGX 3,100,000 per year",
    note: "Leadership-focused pathways for advanced academic and career progression.",
  },
];

export const studentLifeHighlights = [
  "Career talks and employability clinics",
  "Attachment and internship support",
  "Student support desk and help tickets",
  "Digital portal for timetables and documents",
  "Faithful mobile-first communication for busy learners",
  "Clubs, creative showcases, and entrepreneurship activities",
];

export const faqs = [
  {
    question: "Do you support weekend and evening study?",
    answer:
      "Yes. Several certificate, diploma, and short-course pathways are available in evening, weekend, or blended modes.",
  },
  {
    question: "Can I apply using my phone?",
    answer:
      "Yes. The admissions flow is designed to work well on mobile, including document uploads from photos or scans.",
  },
  {
    question: "How do I verify a certificate or admission letter?",
    answer:
      "Use the verification page and enter the document code, certificate number, or student identifier supplied on the official document.",
  },
  {
    question: "Do you offer installment payment options?",
    answer:
      "Yes. Eligible learners can receive installment guidance, invoice references, and payment follow-up through the finance workflow.",
  },
];

export const newsItems: NewsItem[] = [
  {
    slug: "digital-skills-intake-open",
    title: "Next intake opens for digital, health, and technical programs",
    category: "Admissions",
    date: "12 May 2026",
    excerpt:
      "Applications are open for learners seeking practical pathways into work-ready certificate, diploma, and short-course study.",
  },
  {
    slug: "career-readiness-week",
    title: "Career readiness week to connect students with employers and mentors",
    category: "Student Life",
    date: "20 June 2026",
    excerpt:
      "A practical week of employer sessions, portfolio support, interview coaching, and internship preparation.",
  },
  {
    slug: "solar-lab-upgrade",
    title: "Renewable energy lab upgrade expands hands-on solar training capacity",
    category: "Campus",
    date: "05 July 2026",
    excerpt:
      "New equipment will support stronger lab-based learning for installation, maintenance, and systems practice.",
  },
];

export const eventItems: EventItem[] = [
  {
    title: "Open Campus & Program Discovery Day",
    date: "24 July 2026",
    type: "Open Day",
    summary:
      "Meet admissions, explore workshops, and discover which certificate or diploma path fits your goals.",
  },
  {
    title: "Admissions Helpdesk Webinar",
    date: "06 August 2026",
    type: "Online Session",
    summary:
      "A guided session covering entry requirements, document uploads, fees, and how to apply using your phone.",
  },
  {
    title: "Industry Skills Showcase",
    date: "19 September 2026",
    type: "Exhibition",
    summary:
      "Students present practical projects to guests from industry, schools, and partner organizations.",
  },
];

export const portalHighlights = {
  applicant: [
    "Saved application progress and intake selection",
    "Document upload checklist with validation rules",
    "Admission decision letters and acceptance confirmation",
    "Payment guidance, finance notes, and messaging history",
  ],
  student: [
    "Enrolled courses, next lessons, and progress tracking",
    "Announcements, grades, certificates, and support tickets",
    "Timetable summaries and practical session reminders",
    "Finance holds, invoices, and payment references",
  ],
  staff: [
    "Admissions review and record workflows",
    "Program, content, and announcement management",
    "Finance tracking, documents, and reports",
    "Audit logs and role-based permissions",
  ],
};

export const verificationSamples = [
  {
    code: "RUG-CERT-2025-1142",
    studentName: "Amina N.",
    program: "Diploma in Software Engineering",
    award: "Diploma",
    completionDate: "15 November 2025",
    status: "Verified",
  },
  {
    code: "RUG-ADM-2026-0831",
    studentName: "Brian T.",
    program: "Certificate in Solar PV Installation",
    award: "Admission Offer",
    completionDate: "03 January 2026",
    status: "Verified",
  },
];

export const learningModes = [
  {
    title: "Online",
    detail:
      "Structured lessons, downloadable resources, guided quizzes, and support designed for learners who study remotely.",
  },
  {
    title: "Blended",
    detail:
      "Digital theory delivery combined with practical workshops, labs, attachment preparation, and live check-ins.",
  },
  {
    title: "Practical",
    detail:
      "Hands-on workshop and fieldwork experiences supported by digital instructions, attendance, submissions, and assessment records.",
  },
];

export const howElearningWorks = [
  "Apply or enroll into a Ruguna programme or short course.",
  "Receive access to the student workspace and course classroom.",
  "Study lesson-by-lesson with notes, video, files, and practical instructions.",
  "Submit assignments, take quizzes, and follow instructor feedback.",
  "Track progress, receive announcements, and unlock certificates when eligible.",
];

export const supportCategories = [
  "Admissions guidance",
  "Programme selection",
  "Technical login support",
  "Document upload help",
  "Payment and invoice clarification",
  "Assessment and certification support",
];

export const downloadableDocuments = [
  {
    slug: "institutional-prospectus-2026",
    title: "Institutional Prospectus 2026",
    category: "Prospectus",
    summary: "Overview of schools, levels, intakes, fees guidance, and admissions policy.",
    href: "/downloads/institutional-prospectus-2026",
  },
  {
    slug: "short-course-guide-2026",
    title: "Short Course Guide 2026",
    category: "Programme Guide",
    summary: "Flexible short-course options for digital, enterprise, and technical upskilling.",
    href: "/downloads/short-course-guide-2026",
  },
  {
    slug: "fees-and-payment-guide",
    title: "Fees and Payment Guide",
    category: "Finance",
    summary: "Payment references, invoice process, installment guidance, and finance support contacts.",
    href: "/downloads/fees-and-payment-guide",
  },
];

export const studentDashboardSummary = {
  greeting: "Welcome back, Amina",
  nextLesson: "API Design for Small Business Systems",
  upcomingDeadlines: [
    "Submission: Community Health Reflection - 14 April",
    "Quiz: Frontend State Management - 16 April",
  ],
  recentGrades: [
    { title: "UX Prototype Review", score: "82%", status: "Graded" },
    { title: "Data Modelling Quiz", score: "74%", status: "Passed" },
  ],
  certificates: [
    { title: "Short Course in AI for Digital Work", code: "RUG-CERT-2025-1142" },
  ],
};

export const instructorWorkspace = {
  assignedCourses: ["Diploma in Software Engineering", "Short Course in AI for Digital Work"],
  gradingQueue: [
    "8 submissions awaiting feedback",
    "2 quizzes need review",
    "1 announcement drafted for publication",
  ],
};

export const adminWorkspace = {
  applications: 148,
  enrollments: 482,
  certificatesIssued: 93,
  openTickets: 17,
};

export const financeWorkspace = {
  invoicesIssued: "UGX 84.5M",
  paymentsVerified: "UGX 71.1M",
  overdueAccounts: 23,
  holdsApplied: 9,
};
