export type School = {
  slug: string;
  name: string;
  shortName: string;
  overview: string;
  highlight: string;
  awards: string[];
  flagshipPrograms: string[];
  careerPaths: string[];
  studyModes: string[];
};

export const schools: School[] = [
  {
    slug: "digital-technology-ai-cyber-systems",
    name: "School of Digital Technology, AI & Cyber Systems",
    shortName: "Digital Technology",
    overview:
      "A future-facing school for software, AI, networking, cybersecurity, and digital operations.",
    highlight: "Build digital systems, secure networks, and create practical solutions for modern employers.",
    awards: ["Certificate", "Diploma", "Bachelor's", "Short Course"],
    flagshipPrograms: [
      "Diploma in Software Engineering",
      "Certificate in ICT Support & Networking",
      "Short Course in AI for Digital Work",
    ],
    careerPaths: ["Developer", "Support specialist", "Cyber analyst", "Digital entrepreneur"],
    studyModes: ["Day", "Evening", "Weekend", "Blended"],
  },
  {
    slug: "engineering-construction-smart-infrastructure",
    name: "School of Engineering, Construction & Smart Infrastructure",
    shortName: "Engineering & Construction",
    overview:
      "Train for the built environment through hands-on technical education in construction, drafting, and systems maintenance.",
    highlight: "Develop the applied skills needed to build, maintain, and modernize critical infrastructure.",
    awards: ["Certificate", "Diploma", "Bachelor's"],
    flagshipPrograms: [
      "Diploma in Construction Site Management",
      "Certificate in Electrical Installation",
      "Diploma in Smart Infrastructure Maintenance",
    ],
    careerPaths: ["Site supervisor", "Electrical technician", "Civil works assistant"],
    studyModes: ["Day", "Evening", "Weekend"],
  },
  {
    slug: "renewable-energy-climate-technology",
    name: "School of Renewable Energy & Climate Technology",
    shortName: "Renewable Energy",
    overview:
      "Programs focused on solar systems, clean-energy entrepreneurship, and climate-smart technical solutions.",
    highlight: "Prepare for growing opportunities in off-grid energy, installations, and climate innovation.",
    awards: ["Certificate", "Diploma", "Short Course"],
    flagshipPrograms: [
      "Certificate in Solar PV Installation",
      "Diploma in Renewable Energy Systems",
      "Short Course in Energy Auditing Basics",
    ],
    careerPaths: ["Solar installer", "Energy technician", "Green enterprise founder"],
    studyModes: ["Day", "Weekend", "Blended"],
  },
  {
    slug: "agribusiness-food-systems-agritech",
    name: "School of Agribusiness, Food Systems & AgriTech",
    shortName: "Agribusiness & AgriTech",
    overview:
      "Applied agriculture and agri-enterprise programs that connect food production, value addition, and digital tools.",
    highlight: "Learn productive, resilient, and business-minded agricultural skills for local and regional markets.",
    awards: ["Certificate", "Diploma", "Short Course"],
    flagshipPrograms: [
      "Diploma in Agribusiness Management",
      "Certificate in Food Processing Technology",
      "Short Course in Smart Farming Tools",
    ],
    careerPaths: ["Agribusiness officer", "Food processing assistant", "AgriTech operator"],
    studyModes: ["Day", "Weekend", "Blended"],
  },
  {
    slug: "health-public-health-allied-services",
    name: "School of Health, Public Health & Allied Services",
    shortName: "Health & Allied Services",
    overview:
      "Training for community-facing health support roles, wellness services, and practical public-health delivery.",
    highlight: "Combine care, discipline, and service through industry-relevant health training pathways.",
    awards: ["Certificate", "Diploma", "Bachelor's", "Short Course"],
    flagshipPrograms: [
      "Certificate in Community Health Support",
      "Diploma in Public Health Practice",
      "Short Course in Emergency Response Basics",
    ],
    careerPaths: ["Health assistant", "Community outreach worker", "Wellness coordinator"],
    studyModes: ["Day", "Weekend", "Blended"],
  },
  {
    slug: "business-entrepreneurship-digital-economy",
    name: "School of Business, Entrepreneurship & Digital Economy",
    shortName: "Business & Entrepreneurship",
    overview:
      "Programs that blend enterprise, finance basics, customer experience, and digital commerce.",
    highlight: "Train for employment and self-employment with practical business and digital-economy skills.",
    awards: ["Certificate", "Diploma", "Bachelor's", "Short Course"],
    flagshipPrograms: [
      "Diploma in Business Operations",
      "Certificate in Entrepreneurship Practice",
      "Short Course in Digital Selling",
    ],
    careerPaths: ["Business officer", "Sales coordinator", "Founder", "Operations assistant"],
    studyModes: ["Day", "Evening", "Weekend", "Blended"],
  },
  {
    slug: "creative-arts-media-digital-production",
    name: "School of Creative Arts, Media & Digital Production",
    shortName: "Creative Arts & Media",
    overview:
      "Develop creative, production, and storytelling skills for design, media, and visual communication work.",
    highlight: "Build a portfolio-led path into the creative economy with practical production experience.",
    awards: ["Certificate", "Diploma", "Short Course"],
    flagshipPrograms: [
      "Diploma in Graphic & Motion Design",
      "Certificate in Digital Photography",
      "Short Course in Content Creation for Brands",
    ],
    careerPaths: ["Designer", "Content creator", "Production assistant"],
    studyModes: ["Day", "Weekend", "Blended"],
  },
  {
    slug: "hospitality-tourism-experience-management",
    name: "School of Hospitality, Tourism & Experience Management",
    shortName: "Hospitality & Tourism",
    overview:
      "Customer-facing vocational training for tourism, service operations, food production, and guest experience.",
    highlight: "Prepare for practical service careers with confidence, professionalism, and strong communication.",
    awards: ["Certificate", "Diploma", "Short Course"],
    flagshipPrograms: [
      "Diploma in Hospitality Operations",
      "Certificate in Front Office Practice",
      "Short Course in Event Experience Support",
    ],
    careerPaths: ["Front office officer", "Hospitality assistant", "Tour coordinator"],
    studyModes: ["Day", "Weekend", "Blended"],
  },
  {
    slug: "automotive-mechanical-transport-technology",
    name: "School of Automotive, Mechanical & Transport Technology",
    shortName: "Automotive & Mechanical",
    overview:
      "Hands-on technical training in diagnostics, servicing, transport systems, and mechanical workshop practice.",
    highlight: "Work with tools, engines, and maintenance systems built around practical competence.",
    awards: ["Certificate", "Diploma", "Short Course"],
    flagshipPrograms: [
      "Diploma in Automotive Systems Technology",
      "Certificate in Motor Vehicle Mechanics",
      "Short Course in Fleet Maintenance Essentials",
    ],
    careerPaths: ["Mechanic", "Workshop technician", "Fleet support officer"],
    studyModes: ["Day", "Weekend", "Blended"],
  },
  {
    slug: "logistics-supply-chain-procurement",
    name: "School of Logistics, Supply Chain & Procurement",
    shortName: "Logistics & Supply Chain",
    overview:
      "Vocational business training for procurement operations, warehousing, distribution, and supply systems.",
    highlight: "Learn operational thinking, accountability, and process discipline for fast-moving organizations.",
    awards: ["Certificate", "Diploma", "Bachelor's"],
    flagshipPrograms: [
      "Diploma in Supply Chain Operations",
      "Certificate in Procurement Practice",
      "Bachelor's in Logistics Management",
    ],
    careerPaths: ["Procurement assistant", "Stores officer", "Logistics coordinator"],
    studyModes: ["Day", "Evening", "Weekend"],
  },
  {
    slug: "security-safety-industrial-systems",
    name: "School of Security, Safety & Industrial Systems",
    shortName: "Security & Safety",
    overview:
      "Applied training in workplace safety, industrial systems awareness, and operational security support.",
    highlight: "Support secure, compliant, and resilient work environments with practical safety knowledge.",
    awards: ["Certificate", "Diploma", "Short Course"],
    flagshipPrograms: [
      "Certificate in Occupational Safety Practice",
      "Diploma in Industrial Safety Systems",
      "Short Course in Security Operations Basics",
    ],
    careerPaths: ["Safety assistant", "Compliance support officer", "Security supervisor"],
    studyModes: ["Day", "Weekend", "Blended"],
  },
  {
    slug: "ict-support-digital-operations",
    name: "School of ICT Support & Digital Operations",
    shortName: "ICT Support",
    overview:
      "Entry and mid-level training for digital office systems, support operations, and productivity infrastructure.",
    highlight: "Prepare for dependable support roles that keep institutions and businesses running smoothly.",
    awards: ["Certificate", "Diploma", "Short Course"],
    flagshipPrograms: [
      "Certificate in Office Digital Operations",
      "Diploma in IT Service Support",
      "Short Course in Productivity Tools",
    ],
    careerPaths: ["IT support assistant", "Digital operations officer", "Helpdesk agent"],
    studyModes: ["Day", "Evening", "Weekend", "Blended", "Online"],
  },
  {
    slug: "education-training-tvet-instruction",
    name: "School of Education, Training & TVET Instruction",
    shortName: "TVET Instruction",
    overview:
      "A school focused on teaching practice, instructional delivery, and the development of vocational trainers.",
    highlight: "Equip future instructors with the tools to teach skills, assess learners, and lead practical learning.",
    awards: ["Certificate", "Diploma", "Bachelor's", "Short Course"],
    flagshipPrograms: [
      "Diploma in TVET Instruction",
      "Certificate in Training Facilitation",
      "Bachelor's in Technical Education Leadership",
    ],
    careerPaths: ["Instructor", "Trainer", "Assessment coordinator"],
    studyModes: ["Day", "Weekend", "Blended"],
  },
];

export function getSchoolBySlug(slug: string) {
  return schools.find((school) => school.slug === slug);
}
