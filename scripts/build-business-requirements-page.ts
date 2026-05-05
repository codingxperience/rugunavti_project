import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const sourcePath = join(root, "reports", "business-requirements", "ruguna-college-business-requirements.md");
const reportHtmlPath = join(root, "reports", "business-requirements", "ruguna-college-business-requirements.html");
const docsHtmlPath = join(root, "docs", "index.html");
const logoSourcePath = join(root, "public", "brand", "ruguna_logo_v2.jpeg");
const reportLogoPath = join(root, "reports", "business-requirements", "assets", "ruguna_logo_v2.jpeg");
const docsLogoPath = join(root, "docs", "assets", "ruguna_logo_v2.jpeg");

type Token =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; rows: string[][] };

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderInline(value: string) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function isTableDivider(line: string) {
  return /^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const tokens: Token[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    const trimmed = line.trim();

    if (!trimmed || trimmed === "---") {
      index += 1;
      continue;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (heading) {
      tokens.push({
        type: "heading",
        level: heading[1].length,
        text: heading[2],
      });
      index += 1;
      continue;
    }

    if (trimmed.startsWith("|") && isTableDivider(lines[index + 1] ?? "")) {
      const rows = [splitTableRow(trimmed)];
      index += 2;

      while (index < lines.length && lines[index]?.trim().startsWith("|")) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }

      tokens.push({ type: "table", rows });
      continue;
    }

    if (/^-\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const ordered = /^\d+\.\s+/.test(trimmed);
      const items: string[] = [];

      while (index < lines.length) {
        const current = lines[index]?.trim() ?? "";
        const match = ordered ? /^\d+\.\s+(.+)$/.exec(current) : /^-\s+(.+)$/.exec(current);

        if (!match) {
          break;
        }

        items.push(match[1]);
        index += 1;
      }

      tokens.push({ type: "list", ordered, items });
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length) {
      const current = lines[index] ?? "";
      const currentTrimmed = current.trim();

      if (
        !currentTrimmed ||
        currentTrimmed === "---" ||
        /^(#{1,6})\s+/.test(currentTrimmed) ||
        currentTrimmed.startsWith("|") ||
        /^-\s+/.test(currentTrimmed) ||
        /^\d+\.\s+/.test(currentTrimmed)
      ) {
        break;
      }

      paragraph.push(currentTrimmed);
      index += 1;
    }

    tokens.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return tokens;
}

function getMeta(markdown: string) {
  const valueFor = (label: string) => {
    const match = new RegExp(`^${label}:\\s*(.+?)\\s*$`, "m").exec(markdown);
    return match?.[1].replace(/\s{2,}$/g, "") ?? "";
  };

  return {
    date: valueFor("Document date"),
    version: valueFor("Version"),
    contact: valueFor("Primary contact"),
  };
}

function buildToc(tokens: Token[]) {
  return tokens
    .filter((token): token is Extract<Token, { type: "heading" }> => token.type === "heading" && token.level === 2)
    .map((heading) => ({ id: slugify(heading.text), text: heading.text }));
}

function renderTokens(tokens: Token[]) {
  return tokens
    .map((token) => {
      if (token.type === "heading") {
        const tag = `h${Math.min(token.level, 4)}`;
        const id = token.level === 2 ? ` id="${slugify(token.text)}"` : "";
        return `<${tag}${id}>${renderInline(token.text)}</${tag}>`;
      }

      if (token.type === "paragraph") {
        return `<p>${renderInline(token.text)}</p>`;
      }

      if (token.type === "list") {
        const tag = token.ordered ? "ol" : "ul";
        return `<${tag}>${token.items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</${tag}>`;
      }

      const [headings, ...rows] = token.rows;
      return `<div class="table-wrap"><table><thead><tr>${headings
        .map((cell) => `<th>${renderInline(cell)}</th>`)
        .join("")}</tr></thead><tbody>${rows
        .map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`)
        .join("")}</tbody></table></div>`;
    })
    .join("\n");
}

function renderPage(markdown: string) {
  const tokens = parseMarkdown(markdown);
  const meta = getMeta(markdown);
  const toc = buildToc(tokens);
  const body = renderTokens(tokens);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Ruguna College Platform Requirements</title>
<style>
:root{--ink:#111;--muted:#667085;--line:#e7e1d2;--paper:#f8f6ef;--gold:#fde047;--card:#fff;--soft:#fbfaf4}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:Aptos,Calibri,"Segoe UI",Arial,sans-serif;line-height:1.6}
.shell{width:min(1180px,calc(100% - 32px));margin:28px auto 48px}
.cover{background:linear-gradient(135deg,#111 0%,#272111 100%);color:#fff;border-radius:30px;padding:42px;box-shadow:0 38px 110px -78px rgba(0,0,0,.8)}
.cover-top{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}.brand{display:flex;align-items:center;gap:14px}.seal{width:62px;height:62px;border-radius:18px;background:#fff;padding:6px;object-fit:contain}.brand strong{display:block;font-size:20px}.brand span{display:block;margin-top:2px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.64)}
.pill{display:inline-flex;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);border-radius:999px;padding:8px 12px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.75)}
.cover h1{max-width:820px;margin:42px 0 14px;font-size:clamp(36px,7vw,72px);line-height:.95;letter-spacing:-.065em}.cover p{max-width:790px;margin:0;color:rgba(255,255,255,.74);font-size:17px}
.meta{margin-top:34px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.meta div{border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:14px;background:rgba(255,255,255,.06);font-size:14px}.meta strong{display:block;margin-bottom:4px;color:rgba(255,255,255,.55);font-size:10px;letter-spacing:.16em;text-transform:uppercase}
.layout{display:grid;grid-template-columns:280px minmax(0,1fr);gap:18px;margin-top:18px}.toc{position:sticky;top:18px;align-self:start;background:rgba(255,255,255,.82);border:1px solid var(--line);border-radius:26px;padding:22px;box-shadow:0 24px 80px -70px rgba(17,17,17,.55);backdrop-filter:blur(18px)}.toc h2{margin:0 0 12px;border:0;padding:0;font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}.toc a{display:block;border-radius:14px;padding:8px 10px;color:#303642;text-decoration:none;font-size:13px}.toc a:hover{background:var(--soft);color:var(--ink)}
.content{background:var(--card);border:1px solid var(--line);border-radius:28px;padding:42px 48px;box-shadow:0 30px 90px -72px rgba(17,17,17,.5)}h1:first-child{display:none}h2{margin:34px 0 12px;padding-top:18px;border-top:1px solid var(--line);font-size:28px;line-height:1.12;letter-spacing:-.025em}h2:first-child{border-top:0;margin-top:0;padding-top:0}h3{margin:25px 0 10px;font-size:19px;letter-spacing:-.012em}h4{margin:18px 0 8px;font-size:16px}p{margin:8px 0;color:#303642}ul,ol{margin:10px 0 18px 22px;padding:0}li{margin:5px 0;color:#303642}.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:18px;margin:14px 0 24px}table{width:100%;border-collapse:collapse;font-size:13.5px}th{background:#f2efe4;text-align:left;color:#111;padding:11px 13px;border-bottom:1px solid var(--line);white-space:nowrap}td{border-top:1px solid var(--line);padding:11px 13px;vertical-align:top;color:#303642}tr:nth-child(even) td{background:#fffdf7}code{background:#f4f0df;border-radius:8px;padding:1px 5px}
.footer{margin-top:18px;text-align:center;color:var(--muted);font-size:13px}@media(max-width:980px){.layout{grid-template-columns:1fr}.toc{position:static}.content{padding:28px}.meta{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:640px){.shell{width:min(100% - 18px,1180px);margin:10px auto}.cover,.content,.toc{border-radius:22px;padding:22px}.meta{grid-template-columns:1fr}}@media print{body{background:white}.shell{width:auto;margin:0}.cover,.content,.toc{box-shadow:none;border-radius:0}.toc{display:none}.layout{display:block}.cover{page-break-after:always}.table-wrap{break-inside:avoid}}
</style>
</head>
<body>
<div class="shell">
<section class="cover">
<div class="cover-top"><div class="brand"><img class="seal" src="assets/ruguna_logo_v2.jpeg" alt="Ruguna College seal" /><div><strong>Ruguna College</strong><span>One Who Prevails</span></div></div><span class="pill">Requirements document</span></div>
<h1>Admissions and eLearning Platform</h1>
<p>Operating requirements for the Ruguna College website, admissions flow, authenticated eLearning, staff workspaces, payments, security, integrations, and launch readiness.</p>
<div class="meta"><div><strong>Prepared for</strong>Ruguna College Leadership</div><div><strong>Date</strong>${escapeHtml(meta.date)}</div><div><strong>Version</strong>${escapeHtml(meta.version)}</div><div><strong>Contact</strong>${escapeHtml(meta.contact)}</div></div>
</section>
<div class="layout">
<aside class="toc"><h2>Contents</h2>${toc.map((item) => `<a href="#${item.id}">${renderInline(item.text)}</a>`).join("")}</aside>
<main class="content">${body}</main>
</div>
<p class="footer">Ruguna College Digital Platform Requirements. Generated from the maintained project requirements source.</p>
</div>
</body>
</html>`;
}

function writePage(outputPath: string, html: string) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html);
}

function copyLogo(outputPath: string) {
  mkdirSync(dirname(outputPath), { recursive: true });
  copyFileSync(logoSourcePath, outputPath);
}

const markdown = readFileSync(sourcePath, "utf8");
const html = renderPage(markdown);

writePage(reportHtmlPath, html);
writePage(docsHtmlPath, html);
copyLogo(reportLogoPath);
copyLogo(docsLogoPath);
writeFileSync(join(root, "docs", ".nojekyll"), "");

console.log("Business requirements HTML generated for reports and GitHub Pages.");
