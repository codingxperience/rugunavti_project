import { NextResponse } from "next/server";

const documents: Record<string, { filename: string; body: string }> = {
  "institutional-prospectus-2026": {
    filename: "ruguna-institutional-prospectus-2026.txt",
    body: `Ruguna Vocational Training Institute\nInstitutional Prospectus 2026\n\nSchools:\n- Digital Technology, AI & Cyber Systems\n- Engineering, Construction & Smart Infrastructure\n- Renewable Energy & Climate Technology\n- Agribusiness, Food Systems & AgriTech\n- Health, Public Health & Allied Services\n- Business, Entrepreneurship & Digital Economy\n\nAdmissions:\n- Intakes: January, May, September\n- Application channel: Online or guided admissions support\n- Core document set: transcripts, identification, photo, prior certificates where required\n\nLearning modes:\n- Online\n- Blended\n- Practical\n- Day\n- Evening\n- Weekend\n\nFor full admissions guidance, visit /admissions on the platform.`,
  },
  "short-course-guide-2026": {
    filename: "ruguna-short-course-guide-2026.txt",
    body: `Ruguna Vocational Training Institute\nShort Course Guide 2026\n\nHighlighted short courses:\n- AI for Digital Work\n- Entrepreneurship Practice\n- Digital Selling\n- Solar and energy upskilling pathways\n\nDesigned for:\n- Working professionals\n- Entrepreneurs\n- School leavers needing fast upskilling\n- Regional applicants needing flexible study schedules`,
  },
  "fees-and-payment-guide": {
    filename: "ruguna-fees-and-payment-guide.txt",
    body: `Ruguna Vocational Training Institute\nFees and Payment Guide\n\nFinance workflow:\n- Applicant or student receives invoice reference\n- Payment is submitted with reference number\n- Finance team verifies payment and updates status\n- Enrollment holds may apply where balances remain outstanding\n\nSupport:\n- admissions@ruguna.ac.ug\n- +256 700 123 456\n- WhatsApp: +256 754 000 321`,
  },
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const document = documents[slug];

  if (!document) {
    return new NextResponse("Document not found.", { status: 404 });
  }

  return new NextResponse(document.body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${document.filename}"`,
    },
  });
}
