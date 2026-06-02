// Reads dist/presentation-playbook.md, converts to a styled HTML page,
// then drives Chrome headless to print HTML -> PDF.

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const MD_PATH = join(DIST, "presentation-playbook.md");
const HTML_PATH = join(DIST, "presentation-playbook.html");
const PDF_PATH = join(DIST, "presentation-playbook.pdf");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Minimal markdown -> HTML converter for the subset the playbook uses.
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s: string): string {
  // inline code first so * inside backticks doesn't get treated as italic
  s = escapeHtml(s);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return s;
}

function mdToHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inBlockquote = false;
  const bqBuf: string[] = [];
  let inList = false;

  const flushBq = () => {
    if (inBlockquote) {
      out.push(`<blockquote>${bqBuf.join("<br>")}</blockquote>`);
      bqBuf.length = 0;
      inBlockquote = false;
    }
  };
  const flushList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw;
    if (line.startsWith("> ")) {
      flushList();
      inBlockquote = true;
      bqBuf.push(inline(line.slice(2)));
      continue;
    }
    if (inBlockquote && line.trim() === "") continue;
    flushBq();
    if (line.startsWith("# ")) {
      flushList();
      out.push(`<h1>${inline(line.slice(2))}</h1>`);
    } else if (line.startsWith("## ")) {
      flushList();
      out.push(`<h2>${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith("### ")) {
      flushList();
      out.push(`<h3>${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith("- ")) {
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(`<li>${inline(line.slice(2))}</li>`);
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(`<li>${inline(line.replace(/^\d+\.\s/, ""))}</li>`);
    } else if (line.trim() === "---") {
      flushList();
      out.push('<hr>');
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  flushList();
  flushBq();
  return out.join("\n");
}

const md = readFileSync(MD_PATH, "utf-8");
const body = mdToHtml(md);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Presentation Playbook</title>
<style>
  @page { size: letter; margin: 0.6in 0.65in; }
  :root {
    --bg: #fffdf8;
    --body: #1f1a14;
    --muted: #6a5f53;
    --accent: #9B2A1F;
    --rule: #d8cfc1;
  }
  html, body { background: var(--bg); color: var(--body); }
  body {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 11.5pt;
    line-height: 1.55;
    margin: 0;
  }
  h1 {
    font-size: 22pt;
    margin: 0 0 6pt;
    color: var(--body);
    letter-spacing: -0.01em;
  }
  h2 {
    font-size: 15pt;
    margin: 18pt 0 6pt;
    color: var(--body);
    border-bottom: 1pt solid var(--rule);
    padding-bottom: 4pt;
    page-break-before: always;
  }
  h2:first-of-type { page-break-before: avoid; }
  h3 {
    font-size: 11pt;
    margin: 10pt 0 2pt;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 600;
  }
  p { margin: 4pt 0; }
  ul { margin: 6pt 0 6pt 16pt; padding: 0; }
  li { margin: 3pt 0; }
  blockquote {
    margin: 8pt 12pt;
    padding: 8pt 12pt;
    border-left: 2.5pt solid var(--accent);
    background: rgba(155, 42, 31, 0.04);
    font-style: italic;
    font-size: 12pt;
    color: var(--body);
  }
  code {
    font-family: "SF Mono", Menlo, Consolas, monospace;
    font-size: 9.5pt;
    color: var(--accent);
    background: rgba(155, 42, 31, 0.06);
    padding: 1pt 4pt;
    border-radius: 2pt;
  }
  strong { color: var(--body); font-weight: 700; }
  em { font-style: italic; }
  hr {
    border: 0;
    border-top: 0.5pt solid var(--rule);
    margin: 14pt 0;
  }
  /* Tighter spacing between H2 and the meta line under it */
  h2 + p { margin-top: 4pt; color: var(--muted); font-size: 10pt; }
  /* Talking points block (lists right after the "Talking points" bold paragraph) get accent */
  p strong:only-child { color: var(--accent); }
</style>
</head>
<body>
${body}
</body>
</html>`;

writeFileSync(HTML_PATH, html, "utf-8");
console.log(`Wrote HTML: ${HTML_PATH}`);

const fileUrl = `file://${HTML_PATH}`;
const cmd = [
  `"${CHROME}"`,
  "--headless",
  "--disable-gpu",
  "--no-pdf-header-footer",
  `--print-to-pdf="${PDF_PATH}"`,
  `--print-to-pdf-no-header`,
  `"${fileUrl}"`,
].join(" ");

execSync(cmd, { stdio: "inherit" });
console.log(`Wrote PDF: ${PDF_PATH}`);
