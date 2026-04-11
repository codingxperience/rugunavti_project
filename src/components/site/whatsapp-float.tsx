import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

import { siteConfig } from "@/data";

export function WhatsAppFloat() {
  const whatsappNumber = siteConfig.whatsapp.replace(/\D/g, "");

  return (
    <Link
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat with Ruguna on WhatsApp at ${siteConfig.whatsapp}`}
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_22px_50px_-18px_rgba(37,211,102,0.85)] transition hover:-translate-y-1 hover:bg-[#20bd5b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/30"
    >
      <span className="relative flex h-7 w-7 items-center justify-center text-white">
        <MessageCircle className="absolute h-7 w-7 text-white" strokeWidth={2.3} />
        <Phone className="relative h-3.5 w-3.5 text-white" strokeWidth={2.7} />
      </span>
      <span className="sr-only">Open WhatsApp chat</span>
    </Link>
  );
}
