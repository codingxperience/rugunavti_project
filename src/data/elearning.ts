import {
  faqs as institutionalFaqs,
  supportCategories,
  testimonials,
} from "./content";
import {
  demoStudentCourses,
  getCourseLessons,
  getRecommendedLesson,
  studentAnnouncements,
  studentDeadlines,
  studentRecentGrades,
  studentSupportTickets,
  studentTimetable,
} from "./learning";

export type ElearningCategory = {
  slug: string;
  title: string;
  school: string;
  description: string;
  onlineFocus: string;
};

export type ElearningCourse = {
  slug: string;
  title: string;
  categorySlug: string;
  category: string;
  school: string;
  level: "Short Course" | "Certificate" | "Diploma";
  duration: string;
  durationBucket: "Short" | "Medium" | "Extended";
  mode: "Online" | "Blended";
  skillArea: string;
  summary: string;
  overview: string;
  audience: string;
  prerequisites: string[];
  whatYouWillLearn: string[];
  assessmentMethod: string;
  certificate: string;
  tools: string[];
  instructor: string;
  startWindow: string;
  enrollmentStatus: "Open enrollment" | "Application review" | "Assigned by admissions";
  featured: boolean;
  popular: boolean;
  coverLabel: string;
  coverTone: string;
  modules: {
    title: string;
    lessonCount: number;
    focus: string;
  }[];
};

export const elearningCategories: ElearningCategory[] = [
  {
    slug: "digital-technology",
    title: "Digital Technology, AI & Cyber Systems",
    school: "School of Digital Technology, AI & Cyber Systems",
    description:
      "Digital-first pathways that translate directly into software, product, cybersecurity, and AI-enabled work.",
    onlineFocus: "Project-led theory, coding workflow, and portfolio-oriented digital delivery.",
  },
  {
    slug: "business-digital-economy",
    title: "Business, Entrepreneurship & Digital Economy",
    school: "School of Business, Entrepreneurship & Digital Economy",
    description:
      "Practical online business learning for founders, side hustlers, office teams, and career switchers.",
    onlineFocus: "Flexible short-course learning with applied assignments and market-ready outputs.",
  },
  {
    slug: "creative-media",
    title: "Creative Arts, Media & Digital Production",
    school: "School of Creative Arts, Media & Digital Production",
    description:
      "Creative production courses that combine guided lessons, project critique, and tool-based practice.",
    onlineFocus: "Recorded demos, critique sessions, and downloadable project briefs.",
  },
  {
    slug: "ict-support",
    title: "ICT Support & Digital Operations",
    school: "School of ICT Support & Digital Operations",
    description:
      "Operational digital skills for support teams, technicians, front-office staff, and service environments.",
    onlineFocus: "Phone-friendly support workflows, service desk simulation, and digital operations practice.",
  },
  {
    slug: "education-tvet",
    title: "Education, Training & TVET Instruction",
    school: "School of Education, Training & TVET Instruction",
    description:
      "Online and blended delivery for trainers, instructors, and TVET facilitators building better learning practice.",
    onlineFocus: "Facilitation, digital delivery planning, and assessment design for adult learners.",
  },
  {
    slug: "renewable-energy",
    title: "Renewable Energy Foundations",
    school: "School of Renewable Energy & Climate Technology",
    description:
      "Foundational online theory modules that support practical solar and clean-energy training pathways.",
    onlineFocus: "Theory support before workshop attendance and field practice.",
  },
];

const softwareEngineeringModules = demoStudentCourses[0].modules.map((module) => ({
  title: module.title,
  lessonCount: module.lessons.length,
  focus:
    module.lessons[0]?.summary ??
    "Structured lesson delivery, practical tasks, and guided digital assessment.",
}));

const aiForWorkModules = demoStudentCourses[1].modules.map((module) => ({
  title: module.title,
  lessonCount: module.lessons.length,
  focus:
    module.lessons[0]?.summary ??
    "Applied short-course learning with guided prompts, critique, and workplace practice.",
}));

export const elearningCourses: ElearningCourse[] = [
  {
    slug: "diploma-software-engineering",
    title: "Diploma in Software Engineering",
    categorySlug: "digital-technology",
    category: "Digital Technology",
    school: "School of Digital Technology, AI & Cyber Systems",
    level: "Diploma",
    duration: "2 academic years with blended labs",
    durationBucket: "Extended",
    mode: "Blended",
    skillArea: "Software development",
    summary:
      "A serious software pathway for learners building web applications, backend services, and delivery discipline.",
    overview:
      "This diploma blends structured online lessons with scheduled practical labs, mentor check-ins, and portfolio-focused assessments. It is suited to learners preparing for junior development, technical support, or product delivery roles.",
    audience:
      "School leavers, self-taught coders seeking structure, and working learners building a stronger technical foundation.",
    prerequisites: [
      "Basic digital literacy and comfort using a browser and email",
      "Access to a laptop for practical coding tasks",
      "Strong interest in problem solving and structured technical work",
    ],
    whatYouWillLearn: [
      "Frontend and backend application delivery",
      "Validation, data design, and secure workflow patterns",
      "Project execution habits used in real software teams",
      "Communication of technical work to clients and supervisors",
    ],
    assessmentMethod:
      "Module assignments, practical code reviews, guided quizzes, and capstone delivery.",
    certificate:
      "Eligible learners receive a Ruguna completion record and can progress toward verified diploma outcomes.",
    tools: ["VS Code", "GitHub", "PostgreSQL", "Figma for planning", "Modern browser"],
    instructor: "Grace Namara",
    startWindow: "May and September intakes",
    enrollmentStatus: "Application review",
    featured: true,
    popular: true,
    coverLabel: "Code and systems",
    coverTone:
      "from-zinc-950 via-zinc-900 to-zinc-700 text-white",
    modules: softwareEngineeringModules,
  },
  {
    slug: "short-course-ai-digital-work",
    title: "Short Course in AI for Digital Work",
    categorySlug: "business-digital-economy",
    category: "Business & Digital Economy",
    school: "School of Business, Entrepreneurship & Digital Economy",
    level: "Short Course",
    duration: "6 weeks self-paced with live review sessions",
    durationBucket: "Short",
    mode: "Online",
    skillArea: "AI productivity",
    summary:
      "A practical short course for responsible AI use in administration, communication, research, and digital work.",
    overview:
      "Learners move from basic prompt design into applied workplace use, responsible AI practice, review loops, and task automation thinking. The course is ideal for professionals who need immediate digital productivity gains.",
    audience:
      "Working adults, office teams, entrepreneurs, and career switchers improving digital efficiency.",
    prerequisites: [
      "Comfort using email, documents, and web tools",
      "Reliable smartphone or laptop access",
    ],
    whatYouWillLearn: [
      "Prompting for clearer digital outputs",
      "Responsible and ethical AI use in Ugandan work contexts",
      "Workflow design for repetitive digital tasks",
      "Quality review of AI-assisted outputs before use",
    ],
    assessmentMethod:
      "Short quizzes, guided exercises, and a practical productivity task.",
    certificate:
      "A verified short-course completion certificate is issued when all lessons and assessments are completed.",
    tools: ["Google Workspace or Microsoft Office", "Browser-based AI tools", "WhatsApp for updates"],
    instructor: "Michael Tendo",
    startWindow: "Monthly rolling intake",
    enrollmentStatus: "Open enrollment",
    featured: true,
    popular: true,
    coverLabel: "AI and productivity",
    coverTone: "from-[#fde047] via-[#f6e88d] to-white text-[#111111]",
    modules: aiForWorkModules,
  },
  {
    slug: "certificate-cybersecurity-operations",
    title: "Certificate in Cybersecurity Operations",
    categorySlug: "digital-technology",
    category: "Digital Technology",
    school: "School of Digital Technology, AI & Cyber Systems",
    level: "Certificate",
    duration: "9 months with scheduled labs",
    durationBucket: "Medium",
    mode: "Blended",
    skillArea: "Cybersecurity",
    summary:
      "Foundational cybersecurity operations for monitoring, user safety, reporting, and basic incident response.",
    overview:
      "This certificate introduces operational security thinking for helpdesk, junior SOC, and IT support environments. Learners study online and attend selected practical sessions for hands-on reinforcement.",
    audience:
      "ICT learners, service desk staff, and beginners moving into security-focused support roles.",
    prerequisites: [
      "Basic networking and computer use",
      "Consistent attendance for practical review sessions",
    ],
    whatYouWillLearn: [
      "Threat awareness and user protection basics",
      "Operational reporting and escalation discipline",
      "Secure configuration habits and incident notes",
      "Digital hygiene for small organisations",
    ],
    assessmentMethod:
      "Timed quizzes, monitoring reports, and guided practical tasks.",
    certificate:
      "Certificate completion is issued after assessment success and practical participation checks.",
    tools: ["Browser", "Virtual lab access", "Office tools", "Email"],
    instructor: "Isaac Kato",
    startWindow: "January and September",
    enrollmentStatus: "Application review",
    featured: false,
    popular: true,
    coverLabel: "Security operations",
    coverTone: "from-zinc-900 via-zinc-800 to-zinc-500 text-white",
    modules: [
      { title: "Security Mindset and Threat Basics", lessonCount: 6, focus: "Threat awareness and common risk patterns." },
      { title: "Secure Support Practice", lessonCount: 5, focus: "Service desk routines with better operational security." },
      { title: "Monitoring and Reporting", lessonCount: 4, focus: "Detection signals, escalation, and reporting discipline." },
    ],
  },
  {
    slug: "digital-sales-and-small-business-systems",
    title: "Digital Sales and Small Business Systems",
    categorySlug: "business-digital-economy",
    category: "Business & Digital Economy",
    school: "School of Business, Entrepreneurship & Digital Economy",
    level: "Short Course",
    duration: "8 weeks",
    durationBucket: "Short",
    mode: "Online",
    skillArea: "Entrepreneurship",
    summary:
      "A practical online short course for sales workflows, customer follow-up, and digital tools for growing small business.",
    overview:
      "Designed for Uganda-first business realities, this course helps entrepreneurs and front-office teams structure customer communication, simple reporting, and online sales discipline.",
    audience:
      "Entrepreneurs, retail teams, office administrators, and learners running side businesses.",
    prerequisites: [
      "Smartphone access",
      "Basic confidence with WhatsApp and spreadsheets",
    ],
    whatYouWillLearn: [
      "Customer tracking and simple sales pipeline habits",
      "Digital follow-up workflows using accessible tools",
      "Offer presentation, response handling, and record keeping",
      "How to reduce missed opportunities in small teams",
    ],
    assessmentMethod:
      "Applied worksheets, sales process mapping, and practical weekly tasks.",
    certificate:
      "Short-course completion confirmation is issued after task submission and lesson completion.",
    tools: ["WhatsApp", "Google Sheets", "Email", "Browser"],
    instructor: "Sarah Nakato",
    startWindow: "Monthly rolling intake",
    enrollmentStatus: "Open enrollment",
    featured: true,
    popular: false,
    coverLabel: "Digital business",
    coverTone: "from-[#111111] via-[#2f2f2f] to-[#fde047] text-white",
    modules: [
      { title: "Customer Journey Basics", lessonCount: 5, focus: "Tracking inquiries from first contact to payment." },
      { title: "Digital Sales Tools", lessonCount: 4, focus: "Practical use of simple tools for follow-up and records." },
      { title: "Offer and Conversion Practice", lessonCount: 5, focus: "Responding clearly and closing with confidence." },
    ],
  },
  {
    slug: "graphic-design-and-motion-for-digital-campaigns",
    title: "Graphic Design and Motion for Digital Campaigns",
    categorySlug: "creative-media",
    category: "Creative Media",
    school: "School of Creative Arts, Media & Digital Production",
    level: "Certificate",
    duration: "10 months",
    durationBucket: "Medium",
    mode: "Blended",
    skillArea: "Digital design",
    summary:
      "A creative skills certificate covering campaign visuals, short-form motion, and client-ready digital production workflows.",
    overview:
      "Learners work through guided design lessons, recorded critiques, and project submission checkpoints. Practical studio sessions support software confidence and portfolio quality.",
    audience:
      "Creative beginners, media assistants, and learners building a commercial design portfolio.",
    prerequisites: [
      "Laptop access for software tasks",
      "Interest in design, layout, and storytelling",
    ],
    whatYouWillLearn: [
      "Visual hierarchy and brand-consistent layout",
      "Short-form motion content for campaigns",
      "Client presentation and revision discipline",
      "Portfolio planning for freelance or agency work",
    ],
    assessmentMethod:
      "Portfolio assignments, critique rounds, and software-based practical outputs.",
    certificate:
      "Certificate learners receive completion recognition after portfolio review and final submission.",
    tools: ["Canva", "Adobe Express or Adobe suite", "Browser", "Cloud storage"],
    instructor: "Patricia Ssembatya",
    startWindow: "May and September",
    enrollmentStatus: "Application review",
    featured: false,
    popular: true,
    coverLabel: "Creative production",
    coverTone: "from-zinc-100 via-white to-[#fff2a8] text-[#111111]",
    modules: [
      { title: "Design Foundations", lessonCount: 6, focus: "Layout, typography, and visual balance for campaigns." },
      { title: "Campaign Visual Production", lessonCount: 5, focus: "Ad assets, brand consistency, and content packaging." },
      { title: "Motion and Portfolio Delivery", lessonCount: 5, focus: "Short-form movement, critique, and project showcase." },
    ],
  },
  {
    slug: "service-desk-and-digital-operations",
    title: "Service Desk and Digital Operations",
    categorySlug: "ict-support",
    category: "ICT Support",
    school: "School of ICT Support & Digital Operations",
    level: "Certificate",
    duration: "7 months",
    durationBucket: "Medium",
    mode: "Blended",
    skillArea: "ICT support",
    summary:
      "A structured digital operations certificate for support teams handling requests, systems access, and end-user communication.",
    overview:
      "This course combines support desk principles with communication, ticket handling, documentation, and escalation discipline suited to schools, SMEs, and service organisations.",
    audience:
      "IT support starters, office operations staff, and learners moving into customer-facing technical roles.",
    prerequisites: [
      "Basic PC use and confidence with browser tools",
      "Availability for scheduled practical sessions",
    ],
    whatYouWillLearn: [
      "Ticket handling and service communication",
      "Basic troubleshooting and escalation records",
      "Operational discipline and user support etiquette",
      "Documentation habits that improve team continuity",
    ],
    assessmentMethod:
      "Scenario quizzes, service desk simulations, and documentation tasks.",
    certificate:
      "Verified certificate issuance follows course completion and graded support scenarios.",
    tools: ["Browser", "Spreadsheet tools", "Email", "Documentation templates"],
    instructor: "Daniel Oketcho",
    startWindow: "January, May, September",
    enrollmentStatus: "Assigned by admissions",
    featured: false,
    popular: false,
    coverLabel: "Support operations",
    coverTone: "from-[#1f2937] via-[#374151] to-[#f3f4f6] text-white",
    modules: [
      { title: "Support Desk Foundations", lessonCount: 5, focus: "Core service processes and learner-friendly communication." },
      { title: "Troubleshooting and Escalation", lessonCount: 5, focus: "Step-by-step issue handling and handover quality." },
      { title: "Operational Reporting", lessonCount: 4, focus: "Documentation, service patterns, and manager-ready reporting." },
    ],
  },
];

export const elearningBenefits = [
  {
    title: "Built for low-bandwidth realities",
    description:
      "Lessons remain readable, structured, and clear for learners who study mostly on phones or inconsistent connections.",
  },
  {
    title: "Career-facing content, not passive watching",
    description:
      "Each course is structured around tasks, assessment, evidence of learning, and practical next actions.",
  },
  {
    title: "Blended support where needed",
    description:
      "Courses that require labs or practical reinforcement clearly show what happens online and what happens in person.",
  },
  {
    title: "Trustworthy academic records",
    description:
      "Completion status, submissions, announcements, and certificates stay tied to protected learner access.",
  },
];

export const elearningSteps = [
  "Create your account or sign in with Google.",
  "Browse a course, review expectations, and enroll.",
  "Study lesson-by-lesson with downloads, quizzes, and assignments.",
  "Track progress, receive announcements, and keep moving through the classroom.",
  "Complete eligible courses and access verification-ready completion records.",
];

export const elearningTrustSignals = [
  "Structured lesson delivery with guided next steps",
  "Assessment, assignment, and completion tracking built into the classroom",
  "WhatsApp-friendly support paths for admission and learner assistance",
];

export const elearningTestimonials = testimonials.map((item) => ({
  name: item.name,
  quote: item.quote,
  detail: `${item.program} • Class of ${item.graduationYear}`,
}));

export const elearningFaqs = [
  {
    question: "Can I study using my phone?",
    answer:
      "Yes. The platform is designed to stay usable on phones for browsing, announcements, reading lessons, submitting some tasks, and receiving support updates.",
  },
  {
    question: "Are all Ruguna courses fully online?",
    answer:
      "No. Ruguna prioritises the courses that make sense online or blended. Practical-heavy delivery still uses scheduled labs or in-person reinforcement where needed.",
  },
  {
    question: "How do certificates work?",
    answer:
      "Eligible courses issue completion records or certificates once lesson completion and assessment requirements are satisfied. Verification codes are included where enabled.",
  },
  ...institutionalFaqs.filter((item) =>
    /phone|verify|weekend|evening/i.test(item.question)
  ),
];

export function getElearningCourseBySlug(slug: string) {
  return elearningCourses.find((course) => course.slug === slug);
}

export function getElearningCategoryBySlug(slug: string) {
  return elearningCategories.find((category) => category.slug === slug);
}

export function filterElearningCourses(filters: {
  query?: string;
  category?: string;
  level?: string;
  duration?: string;
  mode?: string;
  skill?: string;
}) {
  const query = filters.query?.trim().toLowerCase();

  return elearningCourses.filter((course) => {
    if (
      query &&
      ![
        course.title,
        course.category,
        course.school,
        course.summary,
        course.skillArea,
        course.instructor,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    ) {
      return false;
    }

    if (filters.category && filters.category !== "all" && course.categorySlug !== filters.category) {
      return false;
    }

    if (filters.level && filters.level !== "all" && course.level !== filters.level) {
      return false;
    }

    if (filters.duration && filters.duration !== "all" && course.durationBucket !== filters.duration) {
      return false;
    }

    if (filters.mode && filters.mode !== "all" && course.mode !== filters.mode) {
      return false;
    }

    if (
      filters.skill &&
      filters.skill !== "all" &&
      course.skillArea.toLowerCase() !== filters.skill.toLowerCase()
    ) {
      return false;
    }

    return true;
  });
}

export const featuredElearningCourses = elearningCourses.filter((course) => course.featured);

export const popularElearningCourses = elearningCourses.filter((course) => course.popular);

export const learnerAssignments = demoStudentCourses.flatMap((course) =>
  getCourseLessons(course)
    .filter((lesson) => lesson.assignment)
    .map((lesson) => ({
      id: `${course.slug}-${lesson.id}`,
      courseSlug: course.slug,
      courseTitle: course.title,
      lessonTitle: lesson.title,
      ...lesson.assignment!,
    }))
);

export const learnerQuizzes = demoStudentCourses.flatMap((course) =>
  getCourseLessons(course)
    .filter((lesson) => lesson.quiz)
    .map((lesson) => ({
      id: `${course.slug}-${lesson.id}`,
      courseSlug: course.slug,
      courseTitle: course.title,
      lessonTitle: lesson.title,
      ...lesson.quiz!,
    }))
);

export const learnerDownloads = demoStudentCourses.flatMap((course) =>
  getCourseLessons(course).flatMap((lesson) =>
    lesson.resources.map((resource) => ({
      id: `${course.slug}-${lesson.id}-${resource.label}`,
      courseSlug: course.slug,
      courseTitle: course.title,
      lessonTitle: lesson.title,
      ...resource,
    }))
  )
);

export const learnerContinueList = demoStudentCourses
  .filter((course) => course.progress < 100)
  .map((course) => {
    const nextLesson = getRecommendedLesson(course);

    return {
      courseSlug: course.slug,
      courseTitle: course.title,
      lessonId: nextLesson.id,
      lessonTitle: nextLesson.title,
      progress: course.progress,
      deadline: course.nextDeadline,
    };
  });

export const learnerProfile = {
  name: "Amina Nakalema",
  email: "amina.nakalema@ruguna.local",
  phone: "+256 700 123 456",
  location: "Kampala, Uganda",
  preferredDevice: "Android phone and laptop",
  currentGoal: "Complete software engineering modules and strengthen backend delivery skills.",
  supportPreference: "WhatsApp and email reminders",
};

export const learnerHelpChannels = [
  {
    title: "WhatsApp learning support",
    detail: "Fast assistance for access issues, class reminders, and support follow-up.",
    action: `WhatsApp ${"+256 754 000 321"}`,
  },
  {
    title: "Academic support desk",
    detail: "Submit questions about lessons, assessments, and deadlines through the support form.",
    action: "Open help request",
  },
  {
    title: "Certificate and records desk",
    detail: "Use certificate verification and records support for completion and proof-of-learning questions.",
    action: "Verify records",
  },
];

export const instructorBuilderCourses = demoStudentCourses.map((course) => ({
  id: course.slug,
  title: course.title,
  mode: course.delivery,
  learners: course.slug === "diploma-software-engineering" ? 38 : 64,
  publishState: course.progress >= 100 ? "Published" : "Live",
  modules: course.modules.map((module) => ({
    id: module.id,
    title: module.title,
    lessons: module.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      type: lesson.type,
      duration: lesson.duration,
      state: lesson.status === "upcoming" ? "Draft" : "Published",
    })),
  })),
}));

export const instructorSubmissions = [
  {
    learner: "Amina N.",
    course: "Diploma in Software Engineering",
    task: "REST API brief",
    submittedAt: "11 Apr 2026, 20:40",
    status: "Needs grading",
  },
  {
    learner: "Joel S.",
    course: "Certificate in Cybersecurity Operations",
    task: "Security incident report",
    submittedAt: "12 Apr 2026, 09:10",
    status: "Feedback drafted",
  },
  {
    learner: "Ritah M.",
    course: "AI for Digital Work",
    task: "Prompt workflow exercise",
    submittedAt: "12 Apr 2026, 16:25",
    status: "Ready to publish",
  },
];

export const instructorAnnouncementDrafts = [
  "Saturday practical lab attendance reminders for software engineering learners.",
  "Revision guidance for the data flows and endpoints quiz.",
  "Short-course completion note for AI for Digital Work graduates.",
];

export const adminElearningDashboard = {
  activeCourses: elearningCourses.length,
  activeLearners: 146,
  instructors: 12,
  announcements: 5,
};

export const adminElearningCategories = elearningCategories.map((category) => ({
  ...category,
  courseCount: elearningCourses.filter((course) => course.categorySlug === category.slug).length,
}));

export const adminElearningUsers = [
  { name: "Amina Nakalema", role: "Student", status: "Active", focus: "Software Engineering" },
  { name: "Grace Namara", role: "Instructor", status: "Active", focus: "Digital Technology" },
  { name: "Michael Tendo", role: "Instructor", status: "Active", focus: "Business and AI short courses" },
  { name: "Ruguna eLearning Admin", role: "Admin", status: "Active", focus: "Platform operations" },
];

export const adminElearningSettings = [
  { label: "Utility-header eLearning destination", value: "/elearning" },
  { label: "Primary learner login route", value: "/elearning/login" },
  { label: "WhatsApp support line", value: "+256 754 000 321" },
  { label: "Default certificate verification route", value: "/verification" },
];

export const adminElearningAnnouncements = [
  {
    title: "April blended lab schedule published",
    audience: "Learners in blended courses",
    status: "Live",
  },
  {
    title: "Password reset and verification reminder",
    audience: "All eLearning users",
    status: "Scheduled",
  },
  {
    title: "Short-course certificates issued",
    audience: "Completed short-course learners",
    status: "Live",
  },
];

export const adminAuditLog = [
  "09 Apr 2026: Hero copy updated for the eLearning landing page.",
  "10 Apr 2026: AI for Digital Work short course marked featured.",
  "11 Apr 2026: Software Engineering assessment window updated.",
  "12 Apr 2026: Certificate support contact details confirmed.",
];

export const learnerDashboardSnapshot = {
  activeCourses: demoStudentCourses.filter((course) => course.progress < 100).length,
  averageProgress: Math.round(
    demoStudentCourses.reduce((total, course) => total + course.progress, 0) /
      demoStudentCourses.length
  ),
  outstandingAssignments: learnerAssignments.length,
  availableCertificates: demoStudentCourses.filter((course) => course.certificateCode).length,
};

export {
  studentAnnouncements,
  studentDeadlines,
  studentRecentGrades,
  studentSupportTickets,
  studentTimetable,
  supportCategories,
};
