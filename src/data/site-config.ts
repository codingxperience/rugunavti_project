export const siteConfig = {
  name: "Ruguna Vocational Training Institute",
  shortName: "Ruguna",
  motto: "Learn Skills. Build Futures.",
  headline: "Build Practical Skills for the Jobs of Today and Tomorrow",
  subheadline:
    "Certificate, diploma, bachelor's, and short courses designed for Uganda and the modern economy.",
  description:
    "A modern Ugandan vocational institute platform that moves learners from interest to enrollment, certification, and employability.",
  location: "Uganda",
  phone: "+256 700 123 456",
  whatsapp: "+256 754 000 321",
  email: "admissions@ruguna.ac.ug",
  address: "Ruguna Campus, Kampala Road, Uganda",
  hours: "Monday to Friday, 8:00 AM to 5:00 PM",
  prospectusHref: "/prospectus",
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/schools", label: "Schools" },
  { href: "/programs", label: "Programs" },
  { href: "/short-courses", label: "Short Courses" },
  { href: "/admissions", label: "Admissions" },
  { href: "/fees-funding", label: "Fees & Funding" },
  { href: "/student-life", label: "Student Life" },
  { href: "/news-events", label: "News & Events" },
  { href: "/verification", label: "Verification" },
  { href: "/contact", label: "Contact" },
];

export const utilityLinks = [
  { href: "/fees-funding", label: "Fees & Funding" },
  { href: "/news-events", label: "Campus News" },
  { href: "/e-learning", label: "E-Learning" },
  { href: "/e-library", label: "E-Library" },
  { href: "/verification", label: "Verification" },
  { href: "/student-portal", label: "Student Portal" },
  { href: "/staff-portal", label: "Staff Portal" },
];

type MenuLink = {
  href: string;
  label: string;
  detail?: string;
};

type MenuGroup = {
  title: string;
  links: MenuLink[];
};

export const academicMenuGroups: MenuGroup[] = [
  {
    title: "Program pathways",
    links: [
      { href: "/programs", label: "Bachelor's pathways", detail: "Advanced leadership and progression routes." },
      { href: "/programs", label: "Diploma pathways", detail: "Career-oriented technical depth and supervision skills." },
      { href: "/programs", label: "Certificate pathways", detail: "Strong entry-level practical training." },
      { href: "/short-courses", label: "Short courses", detail: "Fast, flexible upskilling for current needs." },
    ],
  },
  {
    title: "Top schools",
    links: [
      { href: "/schools/digital-technology-ai-cyber-systems", label: "Digital Technology" },
      { href: "/schools/health-public-health-allied-services", label: "Health & Allied Services" },
      { href: "/schools/engineering-construction-smart-infrastructure", label: "Engineering & Construction" },
      { href: "/schools/automotive-mechanical-transport-technology", label: "Automotive & Mechanical" },
    ],
  },
  {
    title: "Quick academic actions",
    links: [
      { href: "/programs", label: "Browse all programs" },
      { href: "/schools", label: "Explore all schools" },
      { href: "/short-courses", label: "Compare short courses" },
      { href: "/contact", label: "Speak to admissions" },
    ],
  },
];

export const admissionsMenuGroups: MenuGroup[] = [
  {
    title: "Admissions",
    links: [
      { href: "/admissions", label: "Admission requirements", detail: "Requirements, documents, and FAQs." },
      { href: "/apply", label: "Apply online", detail: "Start with the guided digital flow." },
      { href: "/fees-funding", label: "Fees & funding", detail: "Transparent payment guidance and support." },
      { href: "/verification", label: "Verify documents", detail: "Confirm admission and certificate records." },
    ],
  },
  {
    title: "Related links",
    links: [
      { href: "/programs", label: "Program directory" },
      { href: "/contact", label: "Contact admissions" },
      { href: "/news-events", label: "Intake news & events" },
      { href: "/student-portal", label: "Student portal" },
    ],
  },
];

export const applyTracks = [
  {
    label: "Certificate Application",
    detail: "Entry-level practical training with direct employability focus.",
  },
  {
    label: "Diploma Application",
    detail: "Deeper technical and supervisory vocational pathways.",
  },
  {
    label: "Bachelor's Application",
    detail: "Advanced progression for leadership and specialization.",
  },
  {
    label: "Short Course Interest",
    detail: "Fast upskilling for digital, technical, and business needs.",
  },
];

export const intakeMoments = ["January", "May", "September"] as const;

export const publicStats = [
  { label: "Schools", value: "13" },
  { label: "Study modes", value: "5" },
  { label: "Career pathways", value: "40+" },
  { label: "Flexible intakes", value: "3" },
];

export const socialProof = [
  "Practical training",
  "Industry-focused curriculum",
  "Career-ready pathways",
  "Flexible intakes",
];

export const whyChooseRuguna = [
  {
    title: "Practical training",
    description:
      "Workshop-led, studio-based, and clinic-informed learning that keeps theory close to real work.",
    icon: "hammer",
  },
  {
    title: "Market-relevant programs",
    description:
      "Courses are shaped around today's digital, industrial, health, and entrepreneurship opportunities.",
    icon: "briefcase",
  },
  {
    title: "Flexible learning modes",
    description:
      "Choose day, evening, weekend, blended, and selected online formats that fit your schedule.",
    icon: "calendar",
  },
  {
    title: "Digital student portal",
    description:
      "Track applications, timetables, announcements, documents, and student services in one place.",
    icon: "monitor",
  },
  {
    title: "Employability focus",
    description:
      "Attachment readiness, portfolio building, and workplace expectations are woven into the student journey.",
    icon: "rocket",
  },
  {
    title: "Supportive admissions",
    description:
      "Applicants get guided steps, clear requirements, and phone-friendly workflows from first inquiry to offer.",
    icon: "shield",
  },
];

export const careerOutcomes = [
  "Technician",
  "Developer",
  "Health assistant",
  "Solar installer",
  "Designer",
  "Entrepreneur",
] as const;

export const awardLevels = [
  "Short Course",
  "Certificate",
  "Diploma",
  "Bachelor's",
] as const;

export const studyModes = [
  "Day",
  "Evening",
  "Weekend",
  "Blended",
  "Online",
] as const;
