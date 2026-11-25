import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { siteConfig } from "@/data/site-config";

export const dynamic = "force-static";

export async function GET() {
  const logo = await readFile(join(process.cwd(), "public", siteConfig.logoPath));

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "78px 88px",
          borderTop: "14px solid #f6d54a",
          background: "linear-gradient(135deg, #181817 15%, #292517 100%)",
          color: "#fffdf5",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span style={{ fontSize: 25, letterSpacing: 2, color: "#f6d54a" }}>
            VOCATIONAL TRAINING INSTITUTE
          </span>
          <span style={{ fontSize: 80, fontWeight: 700, lineHeight: 1.08 }}>
            {siteConfig.name}
          </span>
          <span style={{ fontSize: 33, color: "#eee7d0" }}>{siteConfig.motto}</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 272,
            height: 272,
            borderRadius: 32,
            background: "#fff",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/jpeg;base64,${logo.toString("base64")}`}
            width={224}
            height={224}
            style={{ objectFit: "contain" }}
            alt=""
          />
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
