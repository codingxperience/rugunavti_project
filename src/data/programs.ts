export type Program = {
  slug: string;
  title: string;
  schoolSlug: string;
  level: "Short Course" | "Certificate" | "Diploma" | "Bachelor's";
  durationText: string;
  durationMonths: number;
  studyMode: "Day" | "Evening" | "Weekend" | "Blended" | "Online";
  intakeMonths: string[];
  overview: string;
  whoItsFor: string;
  learningOutcomes: string[];
  entryRequirements: string[];
  tuitionText: string;
  certificationOutcome: string;
  careerOpportunities: string[];
  modules: string[];
  featured?: boolean;
};

export const programs: Program[] = [
  {
    slug: "diploma-software-engineering",
    title: "Diploma in Software Engineering",
    schoolSlug: "digital-technology-ai-cyber-systems",
    level: "Diploma",
    durationText: "2 years",
    durationMonths: 24,
    studyMode: "Blended",
    intakeMonths: ["January", "May", "September"],
    overview:
      "A practical software path covering modern web development, data foundations, teamwork, and deployment thinking.",
    whoItsFor:
      "Students who want to build real applications, solve business problems, and grow into digital product careers.",
    learningOutcomes: [
      "Build responsive web applications with modern tools.",
      "Work with databases, APIs, and deployment-ready workflows.",
      "Collaborate on projects using version control and product thinking.",
    ],
    entryRequirements: ["UACE or equivalent", "Basic digital literacy", "Interest in problem solving"],
    tuitionText: "UGX 2,450,000 per year",
    certificationOutcome: "Diploma in Software Engineering",
    careerOpportunities: ["Junior developer", "QA assistant", "Technical support engineer"],
    modules: ["Programming fundamentals", "Frontend systems", "Backend services", "Database design", "Industry project"],
    featured: true,
  },
  {
    slug: "certificate-ict-support-networking",
    title: "Certificate in ICT Support & Networking",
    schoolSlug: "ict-support-digital-operations",
    level: "Certificate",
    durationText: "12 months",
    durationMonths: 12,
    studyMode: "Weekend",
    intakeMonths: ["January", "May", "September"],
    overview:
      "A support-focused route into troubleshooting, office systems, connectivity, and digital service delivery.",
    whoItsFor:
      "Learners seeking a practical entry point into IT support, helpdesk, and operations environments.",
    learningOutcomes: [
      "Troubleshoot common devices, networks, and digital office tools.",
      "Support users with basic systems administration tasks.",
      "Document issues and deliver dependable frontline support.",
    ],
    entryRequirements: ["UCE or equivalent", "Basic English communication"],
    tuitionText: "UGX 1,380,000 total",
    certificationOutcome: "Certificate in ICT Support & Networking",
    careerOpportunities: ["Helpdesk assistant", "ICT support officer", "Field support technician"],
    modules: ["Computer systems", "Networking basics", "Office productivity", "Customer support", "Practical attachment"],
    featured: true,
  },
  {
    slug: "short-course-ai-digital-work",
    title: "Short Course in AI for Digital Work",
    schoolSlug: "digital-technology-ai-cyber-systems",
    level: "Short Course",
    durationText: "8 weeks",
    durationMonths: 2,
    studyMode: "Online",
    intakeMonths: ["March", "July", "November"],
    overview:
      "Learn practical AI use for research, productivity, content workflows, and ethical digital work.",
    whoItsFor:
      "Students, professionals, and entrepreneurs who want to improve workflow quality and speed with AI tools.",
    learningOutcomes: [
      "Use AI tools for research, drafting, analysis, and productivity.",
      "Identify safe, ethical, and high-quality usage patterns.",
      "Create a simple AI-enabled workflow for study or work.",
    ],
    entryRequirements: ["No formal requirement", "Access to a smartphone or laptop"],
    tuitionText: "UGX 380,000 total",
    certificationOutcome: "Certificate of Completion in AI for Digital Work",
    careerOpportunities: ["Digital assistant", "Content support", "Operations support"],
    modules: ["AI essentials", "Prompting practice", "Responsible use", "Workflow design"],
    featured: true,
  },
  {
    slug: "diploma-public-health-practice",
    title: "Diploma in Public Health Practice",
    schoolSlug: "health-public-health-allied-services",
    level: "Diploma",
    durationText: "2 years",
    durationMonths: 24,
    studyMode: "Day",
    intakeMonths: ["January", "September"],
    overview:
      "An applied public-health pathway grounded in prevention, outreach, records, and service coordination.",
    whoItsFor:
      "Learners interested in community wellness, practical health support, and service-based careers.",
    learningOutcomes: [
      "Support community health education and outreach activities.",
      "Interpret basic public-health data and reporting needs.",
      "Operate professionally within health service environments.",
    ],
    entryRequirements: ["UACE or equivalent", "Science background preferred"],
    tuitionText: "UGX 2,100,000 per year",
    certificationOutcome: "Diploma in Public Health Practice",
    careerOpportunities: ["Public-health assistant", "Outreach coordinator", "Program support officer"],
    modules: ["Health promotion", "Community outreach", "Records and reporting", "Practicum"],
    featured: true,
  },
  {
    slug: "certificate-solar-pv-installation",
    title: "Certificate in Solar PV Installation",
    schoolSlug: "renewable-energy-climate-technology",
    level: "Certificate",
    durationText: "12 months",
    durationMonths: 12,
    studyMode: "Blended",
    intakeMonths: ["February", "June", "October"],
    overview:
      "A practical technical program in solar components, installation safety, and small-system maintenance.",
    whoItsFor:
      "Learners aiming for work in clean-energy installations, maintenance, and off-grid service provision.",
    learningOutcomes: [
      "Install and maintain small-scale solar PV systems safely.",
      "Assess basic power needs and select suitable components.",
      "Communicate system use and care to clients.",
    ],
    entryRequirements: ["UCE or equivalent", "Interest in technical work"],
    tuitionText: "UGX 1,550,000 total",
    certificationOutcome: "Certificate in Solar PV Installation",
    careerOpportunities: ["Solar installer", "Energy technician assistant", "Independent installer"],
    modules: ["Electrical basics", "Solar components", "Installation workshop", "Maintenance practice"],
    featured: true,
  },
  {
    slug: "diploma-construction-site-management",
    title: "Diploma in Construction Site Management",
    schoolSlug: "engineering-construction-smart-infrastructure",
    level: "Diploma",
    durationText: "2 years",
    durationMonths: 24,
    studyMode: "Weekend",
    intakeMonths: ["January", "May", "September"],
    overview:
      "Develop practical site coordination skills in planning, supervision, materials, and technical documentation.",
    whoItsFor:
      "Students seeking construction leadership pathways rooted in real site execution and team coordination.",
    learningOutcomes: [
      "Coordinate basic site operations and workflow planning.",
      "Read technical drawings and communicate with work teams.",
      "Apply safe, organized, and accountable site practices.",
    ],
    entryRequirements: ["UACE or equivalent", "Numeracy confidence"],
    tuitionText: "UGX 2,280,000 per year",
    certificationOutcome: "Diploma in Construction Site Management",
    careerOpportunities: ["Site supervisor", "Construction coordinator", "Project assistant"],
    modules: ["Construction methods", "Drawing interpretation", "Site supervision", "Materials practice"],
  },
  {
    slug: "diploma-automotive-systems-technology",
    title: "Diploma in Automotive Systems Technology",
    schoolSlug: "automotive-mechanical-transport-technology",
    level: "Diploma",
    durationText: "2 years",
    durationMonths: 24,
    studyMode: "Day",
    intakeMonths: ["January", "September"],
    overview:
      "A workshop-led program in diagnostics, servicing, systems understanding, and transport maintenance routines.",
    whoItsFor:
      "Learners who enjoy mechanical systems, diagnostics, and practical transport technology work.",
    learningOutcomes: [
      "Carry out diagnostics and maintenance on common automotive systems.",
      "Use workshop tools and procedures safely and effectively.",
      "Prepare service reports and basic repair recommendations.",
    ],
    entryRequirements: ["UACE or equivalent", "Technical interest"],
    tuitionText: "UGX 2,320,000 per year",
    certificationOutcome: "Diploma in Automotive Systems Technology",
    careerOpportunities: ["Workshop technician", "Fleet maintenance assistant", "Service advisor"],
    modules: ["Engine systems", "Electrical diagnostics", "Workshop operations", "Attachment"],
    featured: true,
  },
  {
    slug: "certificate-community-health-support",
    title: "Certificate in Community Health Support",
    schoolSlug: "health-public-health-allied-services",
    level: "Certificate",
    durationText: "12 months",
    durationMonths: 12,
    studyMode: "Weekend",
    intakeMonths: ["January", "May", "September"],
    overview:
      "Prepare for supportive frontline roles in wellness education, outreach assistance, and community service coordination.",
    whoItsFor:
      "Learners seeking a practical pathway into community-facing care and support work.",
    learningOutcomes: [
      "Support community outreach and health education tasks.",
      "Maintain records and basic service documentation.",
      "Communicate professionally with clients and teams.",
    ],
    entryRequirements: ["UCE or equivalent", "Strong interest in care and service"],
    tuitionText: "UGX 1,420,000 total",
    certificationOutcome: "Certificate in Community Health Support",
    careerOpportunities: ["Health support assistant", "Outreach worker", "Community mobilizer"],
    modules: ["Community care", "Client communication", "Basic records", "Field practice"],
  },
  {
    slug: "diploma-business-operations",
    title: "Diploma in Business Operations",
    schoolSlug: "business-entrepreneurship-digital-economy",
    level: "Diploma",
    durationText: "2 years",
    durationMonths: 24,
    studyMode: "Evening",
    intakeMonths: ["January", "May", "September"],
    overview:
      "A practical business pathway in operations, customer handling, financial basics, and digital workflow discipline.",
    whoItsFor:
      "Students aiming for administrative, customer-facing, and small-business management roles.",
    learningOutcomes: [
      "Coordinate day-to-day business operations confidently.",
      "Interpret basic financial and sales information.",
      "Use digital tools for reporting, planning, and service delivery.",
    ],
    entryRequirements: ["UACE or equivalent", "Strong communication skills"],
    tuitionText: "UGX 2,050,000 per year",
    certificationOutcome: "Diploma in Business Operations",
    careerOpportunities: ["Operations assistant", "Sales coordinator", "Business support officer"],
    modules: ["Business systems", "Customer experience", "Digital commerce", "Entrepreneurship lab"],
  },
  {
    slug: "diploma-graphic-motion-design",
    title: "Diploma in Graphic & Motion Design",
    schoolSlug: "creative-arts-media-digital-production",
    level: "Diploma",
    durationText: "2 years",
    durationMonths: 24,
    studyMode: "Blended",
    intakeMonths: ["February", "June", "October"],
    overview:
      "Portfolio-driven design training in branding, digital graphics, motion principles, and production workflows.",
    whoItsFor:
      "Learners who want to turn creativity into employable design and media output.",
    learningOutcomes: [
      "Create brand-ready visual communication assets.",
      "Use digital design tools for print and motion output.",
      "Present a practical portfolio for freelance or studio work.",
    ],
    entryRequirements: ["UACE or equivalent", "Creative interest"],
    tuitionText: "UGX 2,180,000 per year",
    certificationOutcome: "Diploma in Graphic & Motion Design",
    careerOpportunities: ["Graphic designer", "Content designer", "Production assistant"],
    modules: ["Design foundations", "Brand systems", "Motion graphics", "Portfolio studio"],
  },
  {
    slug: "certificate-entrepreneurship-practice",
    title: "Certificate in Entrepreneurship Practice",
    schoolSlug: "business-entrepreneurship-digital-economy",
    level: "Certificate",
    durationText: "12 months",
    durationMonths: 12,
    studyMode: "Weekend",
    intakeMonths: ["January", "May", "September"],
    overview:
      "Build the mindset and tools to test business ideas, manage customers, and operate with discipline.",
    whoItsFor:
      "Aspiring founders, side-hustlers, and community-based business builders.",
    learningOutcomes: [
      "Validate a simple business idea and basic market approach.",
      "Track cash flow, customer needs, and daily operations.",
      "Present a lean business plan and launch checklist.",
    ],
    entryRequirements: ["UCE or equivalent"],
    tuitionText: "UGX 1,260,000 total",
    certificationOutcome: "Certificate in Entrepreneurship Practice",
    careerOpportunities: ["Founder", "Sales representative", "Business assistant"],
    modules: ["Business ideation", "Customer validation", "Money basics", "Growth habits"],
  },
  {
    slug: "bachelors-logistics-management",
    title: "Bachelor's in Logistics Management",
    schoolSlug: "logistics-supply-chain-procurement",
    level: "Bachelor's",
    durationText: "3 years",
    durationMonths: 36,
    studyMode: "Blended",
    intakeMonths: ["January", "September"],
    overview:
      "A practical leadership pathway for logistics planning, procurement coordination, warehousing, and distribution systems.",
    whoItsFor:
      "Students aiming for supervisory and management roles across supply and distribution operations.",
    learningOutcomes: [
      "Plan logistics and procurement workflows with operational clarity.",
      "Interpret inventory, sourcing, and movement data.",
      "Lead teams with accountability, compliance, and service quality.",
    ],
    entryRequirements: ["UACE with relevant passes or equivalent diploma", "Strong numeracy"],
    tuitionText: "UGX 2,780,000 per year",
    certificationOutcome: "Bachelor's in Logistics Management",
    careerOpportunities: ["Logistics officer", "Procurement analyst", "Warehouse supervisor"],
    modules: ["Supply systems", "Procurement planning", "Warehousing", "Distribution strategy", "Industry capstone"],
    featured: true,
  },
];

export const featuredPrograms = programs.filter((program) => program.featured);

export function getProgramBySlug(slug: string) {
  return programs.find((program) => program.slug === slug);
}

export function getProgramsBySchool(schoolSlug: string) {
  return programs.filter((program) => program.schoolSlug === schoolSlug);
}
