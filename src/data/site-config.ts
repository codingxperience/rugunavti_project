export const siteConfig = {
  name: "Ruguna College",
  shortName: "Ruguna College",
  motto: "One Who Prevails",
  headline: "Skills That Move You Forward",
  subheadline:
    "Certificate, diploma, bachelor's, and short courses for learners ready to work, build, and lead.",
  description:
    "Ruguna College offers practical academic pathways, short courses, and learner support from inquiry to completion.",
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
  { href: "/elearning", label: "E-Learning" },
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
      { href: "/programs", label: "Bachelor's pathways", detail: "Advanced study and professional progression." },
      { href: "/programs", label: "Diploma pathways", detail: "Technical depth for career growth." },
      { href: "/programs", label: "Certificate pathways", detail: "Practical entry-level training." },
      { href: "/short-courses", label: "Short courses", detail: "Focused upskilling for current needs." },
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
      { href: "/admissions", label: "Admission requirements", detail: "Requirements, documents, and common questions." },
      { href: "/apply", label: "Apply online", detail: "Start a new application." },
      { href: "/fees-funding", label: "Fees & funding", detail: "Fee guidance and payment support." },
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
    label: "Certificate",
    detail: "Start job-ready.",
  },
  {
    label: "Diploma",
    detail: "Build technical depth.",
  },
  {
    label: "Bachelor's",
    detail: "Advance. Lead. Specialize.",
  },
  {
    label: "Short Courses",
    detail: "Upskill fast.",
  },
];

export const intakeMoments = ["May", "September"] as const;

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
      "Workshop, studio, clinic, and field-based learning linked to workplace practice.",
    icon: "hammer",
  },
  {
    title: "Market-relevant programs",
    description:
      "Programmes focus on digital, technical, health, business, and entrepreneurship needs.",
    icon: "briefcase",
  },
  {
    title: "Flexible learning modes",
    description:
      "Day, evening, weekend, blended, and selected online options are available by programme.",
    icon: "calendar",
  },
  {
    title: "Digital student portal",
    description:
      "Access applications, timetables, announcements, documents, and student services.",
    icon: "monitor",
  },
  {
    title: "Employability focus",
    description:
      "Career guidance, portfolios, attachment preparation, and workplace habits are part of the student journey.",
    icon: "rocket",
  },
  {
    title: "Supportive admissions",
    description:
      "Admissions support is clear, phone-friendly, and focused on the next step.",
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
