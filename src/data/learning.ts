export type DemoResource = {
  label: string;
  type: string;
  size: string;
};

export type DemoDiscussionPost = {
  author: string;
  role: "Instructor" | "Student";
  postedAt: string;
  message: string;
};

export type DemoAssessment = {
  title: string;
  type: "Assignment" | "Quiz";
  status: string;
  due: string;
  detail: string;
};

export type DemoLessonStatus = "complete" | "current" | "upcoming";

export type DemoLesson = {
  id: string;
  title: string;
  type: string;
  duration: string;
  status: DemoLessonStatus;
  summary: string;
  objective: string;
  keyPoints: string[];
  instructorNote: string;
  resources: DemoResource[];
  assignment?: DemoAssessment;
  quiz?: DemoAssessment;
  practicalTask?: string;
  discussion: DemoDiscussionPost[];
};

export type DemoModule = {
  id: string;
  title: string;
  progress: number;
  lessons: DemoLesson[];
};

export type DemoCourse = {
  slug: string;
  title: string;
  school: string;
  award: string;
  instructor: string;
  delivery: string;
  progress: number;
  nextDeadline: string;
  schedule: string[];
  certificateCode?: string;
  modules: DemoModule[];
};

export const demoStudentCourses: DemoCourse[] = [
  {
    slug: "diploma-software-engineering",
    title: "Diploma in Software Engineering",
    school: "School of Digital Technology, AI & Cyber Systems",
    award: "Diploma",
    instructor: "Grace Namara",
    delivery: "Blended",
    progress: 68,
    nextDeadline: "14 April 2026",
    schedule: [
      "Mon 7:00 PM: Live theory session",
      "Thu 6:30 PM: Mentor code review",
      "Sat 10:00 AM: Practical lab attendance",
    ],
    modules: [
      {
        id: "product-foundations",
        title: "Module 1: Product Foundations",
        progress: 100,
        lessons: [
          {
            id: "problem-discovery",
            title: "Problem Discovery and User Context",
            type: "Text lesson",
            duration: "28 min",
            status: "complete",
            summary: "How to define the real business or community problem before writing software.",
            objective: "Frame software work around real user pain points and operational needs.",
            keyPoints: [
              "Map the user problem before solution design",
              "Separate assumptions from verified learner or client needs",
              "Capture workflows that the final system must support",
            ],
            instructorNote: "Strong submissions usually describe the workflow problem before listing features.",
            resources: [
              { label: "Discovery worksheet", type: "DOCX", size: "142 KB" },
              { label: "Interview template", type: "PDF", size: "318 KB" },
            ],
            discussion: [
              {
                author: "Grace Namara",
                role: "Instructor",
                postedAt: "08 Apr, 09:10",
                message: "Good discovery work usually starts with people, not screens.",
              },
            ],
          },
          {
            id: "user-stories",
            title: "Writing User Stories and Acceptance Notes",
            type: "Text lesson",
            duration: "24 min",
            status: "complete",
            summary: "Translate the discovered problem into clear user stories and acceptance conditions.",
            objective: "Write lean stories that connect to business and learner outcomes.",
            keyPoints: [
              "Avoid vague stories without measurable outcomes",
              "Link every story to a real user role",
              "Write acceptance notes before implementation starts",
            ],
            instructorNote: "Your acceptance notes should be testable by another student or team member.",
            resources: [
              { label: "Story examples", type: "PDF", size: "210 KB" },
            ],
            discussion: [],
          },
          {
            id: "project-setup",
            title: "Project Setup and Delivery Rhythm",
            type: "Blended instruction",
            duration: "32 min",
            status: "complete",
            summary: "Set up your project tools, folder structure, and weekly execution rhythm.",
            objective: "Prepare a stable workspace for team delivery and assessment submissions.",
            keyPoints: [
              "Agree file structure and naming early",
              "Keep delivery milestones visible each week",
              "Track handoffs between design, code, and testing",
            ],
            instructorNote: "Keep your repository disciplined from the start; disorder gets expensive later.",
            resources: [
              { label: "Project setup checklist", type: "PDF", size: "188 KB" },
            ],
            discussion: [],
          },
        ],
      },
      {
        id: "frontend-and-data-flows",
        title: "Module 2: Frontend and Data Flows",
        progress: 100,
        lessons: [
          {
            id: "state-management",
            title: "State Management for Student-Facing Interfaces",
            type: "Video lesson",
            duration: "36 min",
            status: "complete",
            summary: "Handle local and remote state predictably inside modern learning and business interfaces.",
            objective: "Choose the right state boundary for forms, lists, and learning progress views.",
            keyPoints: [
              "Prefer explicit state transitions in multi-step forms",
              "Keep remote data loading states visible",
              "Avoid coupling form state to display state unnecessarily",
            ],
            instructorNote: "If state is confusing in code, it will be confusing in the UI.",
            resources: [
              { label: "State flow slides", type: "PDF", size: "522 KB" },
            ],
            discussion: [],
          },
          {
            id: "form-validation",
            title: "Validation and Error Handling",
            type: "Text lesson",
            duration: "29 min",
            status: "complete",
            summary: "Design forms that are safe, clear, and tolerant of mobile and low-bandwidth input.",
            objective: "Present validation clearly without blocking legitimate student progress.",
            keyPoints: [
              "Validate on the server for protected actions",
              "Keep messages short and corrective",
              "Design around document uploads and limited connectivity",
            ],
            instructorNote: "Validation is part of trust, not just part of coding.",
            resources: [
              { label: "Validation examples", type: "PDF", size: "266 KB" },
            ],
            discussion: [],
          },
          {
            id: "fetching-data",
            title: "Fetching Data and Loading States",
            type: "Video lesson",
            duration: "31 min",
            status: "complete",
            summary: "Load data predictably and communicate progress, empty states, and errors cleanly.",
            objective: "Build interfaces that remain usable while waiting for network or server responses.",
            keyPoints: [
              "Loading states should preserve layout stability",
              "Empty states need a next action",
              "Error states should explain the recovery path",
            ],
            instructorNote: "Students lose trust quickly when loading and error states feel unfinished.",
            resources: [
              { label: "Loading-state examples", type: "PDF", size: "314 KB" },
            ],
            discussion: [],
          },
        ],
      },
      {
        id: "backend-services",
        title: "Module 3: Backend Services",
        progress: 35,
        lessons: [
          {
            id: "api-design-for-small-business-systems",
            title: "API Design for Small Business Systems",
            type: "Blended lesson",
            duration: "42 min",
            status: "current",
            summary: "Design endpoints for student, customer, and operational workflows that stay readable as the system grows.",
            objective: "Define resource structure, validation rules, and response contracts for a small institutional platform.",
            keyPoints: [
              "Name endpoints around resources and actions consistently",
              "Document request validation before implementation",
              "Keep response shapes stable for the frontend and support staff",
            ],
            instructorNote: "A good API feels predictable to both the developer and the person grading the work.",
            resources: [
              { label: "API brief", type: "PDF", size: "486 KB" },
              { label: "Response contract examples", type: "PDF", size: "274 KB" },
              { label: "Practice dataset", type: "CSV", size: "112 KB" },
            ],
            assignment: {
              title: "REST API brief",
              type: "Assignment",
              status: "Open for submission",
              due: "14 April 2026, 11:59 PM",
              detail: "Submit your endpoint plan, validation notes, and sample request and response structure.",
            },
            quiz: {
              title: "Data flows and endpoints",
              type: "Quiz",
              status: "Available now",
              due: "16 April 2026, 9:00 PM",
              detail: "Timed quiz with a 20-minute limit and one retry.",
            },
            practicalTask:
              "Map one small-business service workflow and explain how your API supports staff, student, and finance records without duplication.",
            discussion: [
              {
                author: "Grace Namara",
                role: "Instructor",
                postedAt: "11 Apr, 18:20",
                message:
                  "Focus on consistent endpoint naming and show exactly where validation happens for each request.",
              },
              {
                author: "Amina N.",
                role: "Student",
                postedAt: "11 Apr, 20:02",
                message:
                  "I am using Supabase tables for the prototype. Is that acceptable if the schema and validation assumptions are documented clearly?",
              },
            ],
          },
          {
            id: "database-modeling-for-service-platforms",
            title: "Database Modeling for Service Platforms",
            type: "Text lesson",
            duration: "34 min",
            status: "upcoming",
            summary: "Translate service workflows into durable relational models and practical indexing decisions.",
            objective: "Model relationships for users, records, progress, payments, and institutional reporting.",
            keyPoints: [
              "Model status transitions explicitly",
              "Use indexes around reporting and operational access paths",
              "Keep audit-friendly creator and updater references",
            ],
            instructorNote: "Model the institution, not just the form on the screen.",
            resources: [
              { label: "Schema worksheet", type: "PDF", size: "296 KB" },
            ],
            discussion: [],
          },
          {
            id: "deployment-and-release-workflow",
            title: "Deployment and Release Workflow",
            type: "Text lesson",
            duration: "22 min",
            status: "upcoming",
            summary: "Prepare a software handoff that is safe enough for staging and production-ready review.",
            objective: "Package code, environment assumptions, and rollout steps into a credible delivery workflow.",
            keyPoints: [
              "Separate environment configuration from code",
              "Verify build and database readiness before release",
              "Track what changes in a release note",
            ],
            instructorNote: "A finished feature without release discipline is not finished.",
            resources: [
              { label: "Release checklist", type: "PDF", size: "172 KB" },
            ],
            discussion: [],
          },
        ],
      },
    ],
  },
  {
    slug: "short-course-ai-digital-work",
    title: "Short Course in AI for Digital Work",
    school: "School of Business, Entrepreneurship & Digital Economy",
    award: "Short Course",
    instructor: "Michael Tendo",
    delivery: "Online",
    progress: 100,
    nextDeadline: "Completed",
    schedule: ["Self-paced review materials available", "Certificate issued and ready for download"],
    certificateCode: "RUG-CERT-2025-1142",
    modules: [
      {
        id: "responsible-ai-use",
        title: "Module 1: Responsible AI Use",
        progress: 100,
        lessons: [
          {
            id: "prompt-foundations",
            title: "Prompt Foundations for Work Tasks",
            type: "Video lesson",
            duration: "18 min",
            status: "complete",
            summary: "Use prompts to guide drafting, planning, and quality checking responsibly.",
            objective: "Apply AI support to real office and business tasks without over-trusting outputs.",
            keyPoints: [
              "Define the task and quality bar clearly",
              "Iterate prompts instead of accepting the first output",
              "Always verify before sending or publishing",
            ],
            instructorNote: "Quality checking is the real professional skill here.",
            resources: [{ label: "Prompt worksheet", type: "PDF", size: "120 KB" }],
            discussion: [],
          },
          {
            id: "quality-checking",
            title: "Checking AI Output for Accuracy",
            type: "Text lesson",
            duration: "16 min",
            status: "complete",
            summary: "Review generated work for missing context, errors, and unsafe assumptions.",
            objective: "Build a repeatable checking process before sharing AI-assisted output.",
            keyPoints: [
              "Check facts, dates, and institutional details",
              "Look for missing local context",
              "Rewrite unclear or inflated claims",
            ],
            instructorNote: "The safest learner is the one who checks confidently.",
            resources: [{ label: "Quality checklist", type: "PDF", size: "104 KB" }],
            discussion: [],
          },
          {
            id: "workflow-automation",
            title: "Workflow Automation for Digital Work",
            type: "Practical task",
            duration: "23 min",
            status: "complete",
            summary: "Package prompts, templates, and review steps into reusable work routines.",
            objective: "Move from isolated prompts to a repeatable digital workflow.",
            keyPoints: [
              "Standardize your repeated tasks",
              "Separate drafting from final approval",
              "Document where AI is useful and where it is not",
            ],
            instructorNote: "Repeatability matters more than novelty in workplace use.",
            resources: [{ label: "Workflow template", type: "DOCX", size: "88 KB" }],
            discussion: [],
          },
        ],
      },
    ],
  },
];

export const studentAnnouncements = [
  "New blended lab schedule published for Saturday practical sessions.",
  "Reminder: upload your attachment logbook before the end of this week.",
  "Certificate eligibility checks have been completed for recent short-course graduates.",
];

export const studentSupportTickets = [
  {
    title: "Document upload support",
    status: "Resolved",
    detail: "Passport photo size issue corrected on 10 April.",
  },
  {
    title: "Practical timetable clarification",
    status: "Waiting for learner response",
    detail: "Registry shared the updated engineering lab slot.",
  },
];

export const studentTimetable = [
  "Monday: Live software engineering theory session at 7:00 PM",
  "Thursday: Instructor code review clinic at 6:30 PM",
  "Saturday: On-campus practical lab at 10:00 AM",
];

export const studentDeadlines = [
  "REST API brief submission due 14 April 2026",
  "Data flows and endpoints quiz closes 16 April 2026",
  "Attachment logbook upload closes 18 April 2026",
];

export const studentRecentGrades = [
  { title: "UX Prototype Review", score: "82%", status: "Graded" },
  { title: "Data Modelling Quiz", score: "74%", status: "Passed" },
  { title: "Prompt Quality Exercise", score: "91%", status: "Passed" },
];

export function getDemoCourseBySlug(slug: string) {
  return demoStudentCourses.find((course) => course.slug === slug);
}

export function getCourseLessons(course: DemoCourse) {
  return course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title,
    }))
  );
}

export function getRecommendedLesson(course: DemoCourse) {
  return (
    getCourseLessons(course).find((lesson) => lesson.status === "current") ??
    getCourseLessons(course).find((lesson) => lesson.status === "upcoming") ??
    getCourseLessons(course)[0]
  );
}
