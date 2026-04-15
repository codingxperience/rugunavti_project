import { PrismaClient, DeliveryMode, ProgramLevel } from "@prisma/client";

const prisma = new PrismaClient();

const roles = [
  ["applicant", "Applicant with access to application workflows"],
  ["student", "Learner enrolled into one or more courses"],
  ["instructor", "Instructor with access to teaching and grading tools"],
  ["registrar_admin", "Registrar and admissions administrator"],
  ["finance_admin", "Finance administrator"],
  ["super_admin", "Full system administrator"],
] as const;

const schools = [
  {
    slug: "digital-technology-ai-cyber-systems",
    name: "School of Digital Technology, AI & Cyber Systems",
    shortName: "Digital Technology",
    description:
      "Software, AI, cybersecurity, data, and digital operations pathways built for the East African labour market.",
    outcomes: ["Software delivery", "AI productivity", "Cyber hygiene", "Digital entrepreneurship"],
    studyModes: [DeliveryMode.ONLINE, DeliveryMode.BLENDED, DeliveryMode.WEEKEND, DeliveryMode.EVENING],
    heroSummary: "Practical digital learning with deployable skills and portfolio outcomes.",
  },
  {
    slug: "renewable-energy-climate-technology",
    name: "School of Renewable Energy & Climate Technology",
    shortName: "Renewable Energy",
    description:
      "Solar, energy systems, and climate-smart technical training focused on growing green opportunities.",
    outcomes: ["Solar installation", "Maintenance discipline", "Energy entrepreneurship"],
    studyModes: [DeliveryMode.BLENDED, DeliveryMode.PRACTICAL, DeliveryMode.WEEKEND],
    heroSummary: "Train for clean-energy jobs and resilient enterprise pathways.",
  },
  {
    slug: "business-entrepreneurship-digital-economy",
    name: "School of Business, Entrepreneurship & Digital Economy",
    shortName: "Business & Entrepreneurship",
    description:
      "Business operations, entrepreneurship, customer experience, and digital commerce for employability and self-employment.",
    outcomes: ["Operations leadership", "Digital selling", "SME growth capability"],
    studyModes: [DeliveryMode.DAY, DeliveryMode.EVENING, DeliveryMode.WEEKEND, DeliveryMode.BLENDED],
    heroSummary: "Flexible vocational business education for work and enterprise growth.",
  },
];

const programs = [
  {
    slug: "diploma-software-engineering",
    schoolSlug: "digital-technology-ai-cyber-systems",
    title: "Diploma in Software Engineering",
    summary: "Build, ship, and support modern web applications for real institutions and businesses.",
    overview:
      "A two-year diploma designed for learners building practical software delivery skills across frontend, backend, databases, testing, and deployment.",
    level: ProgramLevel.DIPLOMA,
    deliveryMode: DeliveryMode.BLENDED,
    durationMonths: 24,
    durationLabel: "2 years",
    skillArea: "Software Development",
    audience: "School leavers, career switchers, and technical learners who want software skills with job-ready outcomes.",
    entryRequirements: ["UACE or equivalent", "Basic computer literacy", "Problem-solving interest"],
    outcomes: ["Build production-style apps", "Work with APIs and databases", "Collaborate in teams"],
    assessments: ["Quizzes", "Assignments", "Practical builds", "Capstone"],
    toolsRequired: ["Laptop", "Stable internet for selected sessions", "VS Code or equivalent editor"],
    tuitionLabel: "UGX 2,450,000 per year",
    certification: "Diploma in Software Engineering",
    featured: true,
  },
  {
    slug: "certificate-solar-pv-installation",
    schoolSlug: "renewable-energy-climate-technology",
    title: "Certificate in Solar PV Installation",
    summary: "Learn installation, maintenance, and safety practice for small-scale solar systems.",
    overview:
      "A one-year certificate focused on practical workshop delivery, safety discipline, component selection, and customer-facing system handover.",
    level: ProgramLevel.CERTIFICATE,
    deliveryMode: DeliveryMode.BLENDED,
    durationMonths: 12,
    durationLabel: "12 months",
    skillArea: "Renewable Energy",
    audience: "Technical learners, working adults, and enterprise-minded participants targeting green jobs.",
    entryRequirements: ["UCE or equivalent", "Comfort with practical technical learning"],
    outcomes: ["Install small systems", "Apply safety procedures", "Maintain and troubleshoot installations"],
    assessments: ["Installation practicals", "Knowledge checks", "Field logbook"],
    toolsRequired: ["Safety boots", "Workshop overalls", "Calculator"],
    tuitionLabel: "UGX 1,550,000 total",
    certification: "Certificate in Solar PV Installation",
    featured: true,
  },
  {
    slug: "certificate-entrepreneurship-practice",
    schoolSlug: "business-entrepreneurship-digital-economy",
    title: "Certificate in Entrepreneurship Practice",
    summary: "Launch and manage practical business ideas with clear sales, cashflow, and customer discipline.",
    overview:
      "A one-year certificate that helps aspiring founders and operators test ideas, manage customers, price offers, and work with modern digital channels.",
    level: ProgramLevel.CERTIFICATE,
    deliveryMode: DeliveryMode.WEEKEND,
    durationMonths: 12,
    durationLabel: "12 months",
    skillArea: "Entrepreneurship",
    audience: "Founders, side-hustlers, and young professionals building income-generating skills.",
    entryRequirements: ["UCE or equivalent"],
    outcomes: ["Validate ideas", "Handle cashflow basics", "Use digital channels to reach customers"],
    assessments: ["Business pitch", "Weekly exercises", "Sales diary"],
    toolsRequired: ["Smartphone", "Notebook", "Calculator"],
    tuitionLabel: "UGX 1,260,000 total",
    certification: "Certificate in Entrepreneurship Practice",
    featured: true,
  },
];

async function main() {
  for (const [slug, description] of roles) {
    await prisma.role.upsert({
      where: { slug },
      update: { name: slug.replace(/_/g, " "), description },
      create: {
        slug,
        name: slug.replace(/_/g, " "),
        description,
      },
    });
  }

  const schoolIds = new Map<string, string>();

  for (const school of schools) {
    const record = await prisma.school.upsert({
      where: { slug: school.slug },
      update: school,
      create: school,
    });

    schoolIds.set(school.slug, record.id);
  }

  for (const program of programs) {
    const schoolId = schoolIds.get(program.schoolSlug);
    if (!schoolId) continue;
    const { schoolSlug, ...programData } = program;

    await prisma.program.upsert({
      where: { slug: program.slug },
      update: { ...programData, schoolId },
      create: { ...programData, schoolId },
    });
  }

  await prisma.siteSetting.upsert({
    where: { settingKey: "site.utility_header" },
    update: {
      category: "navigation",
      value: {
        links: [
          { label: "Apply Now", href: "/apply" },
          { label: "Student Portal", href: "/student-portal" },
          { label: "eLearning Login", href: "/e-learning-login" },
          { label: "Prospectus", href: "/prospectus" },
          { label: "Contact Admissions", href: "/contact" },
          { label: "WhatsApp Inquiry", href: "https://wa.me/256754000321" },
        ],
      },
    },
    create: {
      settingKey: "site.utility_header",
      category: "navigation",
      value: {
        links: [
          { label: "Apply Now", href: "/apply" },
          { label: "Student Portal", href: "/student-portal" },
          { label: "eLearning Login", href: "/e-learning-login" },
          { label: "Prospectus", href: "/prospectus" },
          { label: "Contact Admissions", href: "/contact" },
          { label: "WhatsApp Inquiry", href: "https://wa.me/256754000321" },
        ],
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
