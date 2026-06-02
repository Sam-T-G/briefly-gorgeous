import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../..");
const outPath = resolve(projectRoot, "src/content/index.generated.ts");

const contentDir = process.env["WEB_V1_CONTENT_DIR"] ?? resolve(projectRoot, "content");

type SlotStatus = "drafting" | "content-locked" | "rendered" | "bootstrap-fixture" | "placeholder";

type ParsedFile = {
  chapter: string;
  status: SlotStatus;
  slots: Array<{ id: string; type: string; fields: Record<string, string> }>;
};

const EXPECTED_SLOT_ORDER = [
  "opening-landing",
  "opening-world",
  "opening-pressures",
  "opening-frame",
  "opening-motif",
  "opening-framework",
  "ch1-open",
  "ch1-macaque",
  "ch1-soldier-reads",
  "ch1-verdict",
  "ch1-lens",
  "ch2-open",
  "ch2-deemed",
  "ch2-verge",
  "ch2-lens",
  "ch2-close",
  "ch3-open",
  "ch3-fragment-stream",
  "ch3-parataxis",
  "ch3-lens",
  "ch3-close",
  "closing-verb-echo",
  "closing-trajectory-soler",
  "closing-trajectory-lee",
  "closing-thesis",
  "works-cited"
];

function parseFrontmatter(src: string): { meta: Record<string, string>; body: string } {
  const match = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: src };
  const meta: Record<string, string> = {};
  for (const line of match[1]!.split("\n")) {
    const m = line.match(/^([a-z0-9_-]+):\s*(.*)$/i);
    if (m) meta[m[1]!] = m[2]!.trim();
  }
  return { meta, body: match[2]! };
}

function stripFieldValue(raw: string): string {
  return raw.replace(/\n+---\s*$/g, "").trim();
}

function parseBody(body: string): ParsedFile["slots"] {
  const slots: ParsedFile["slots"] = [];
  const sections = body.split(/\n(?=## )/g);
  for (const section of sections) {
    const headingMatch = section.match(/^## ([a-z0-9-]+)\s*\n([\s\S]*)$/);
    if (!headingMatch) continue;
    const id = headingMatch[1]!;
    const rest = headingMatch[2]!;
    const typeMatch = rest.match(/^type:\s*([a-z-]+)\s*\n/);
    if (!typeMatch) continue;
    const type = typeMatch[1]!;
    const afterType = rest.slice(typeMatch[0].length);
    const fields: Record<string, string> = {};
    const fieldBlocks = afterType.split(/\n(?=### )/g);
    for (const block of fieldBlocks) {
      const fieldMatch = block.match(/^### ([a-z0-9_-]+)\s*\n([\s\S]*)$/);
      if (fieldMatch) {
        fields[fieldMatch[1]!] = stripFieldValue(fieldMatch[2]!);
        continue;
      }
      const inlineFields = block.matchAll(/^([a-z0-9_-]+):\s*(.+)$/gm);
      for (const m of inlineFields) {
        if (m[1] === "type") continue;
        fields[m[1]!] = m[2]!.trim();
      }
    }
    slots.push({ id, type, fields });
  }
  return slots;
}

function loadFile(path: string): ParsedFile | null {
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, "utf8");
  const { meta, body } = parseFrontmatter(raw);
  const status = (meta["status"] ?? "drafting") as SlotStatus;
  const chapter = meta["chapter"] ?? "";
  return { chapter, status, slots: parseBody(body) };
}

function collectSlots(): Array<{ id: string; type: string; fields: Record<string, string>; status: SlotStatus }> {
  const fileMap = new Map<string, ParsedFile>();
  if (existsSync(contentDir)) {
    for (const name of readdirSync(contentDir)) {
      if (!name.endsWith(".md")) continue;
      const parsed = loadFile(join(contentDir, name));
      if (parsed) fileMap.set(name, parsed);
    }
  }
  const slotById = new Map<string, { id: string; type: string; fields: Record<string, string>; status: SlotStatus }>();
  for (const file of fileMap.values()) {
    for (const slot of file.slots) {
      slotById.set(slot.id, { ...slot, status: file.status });
    }
  }
  const out: Array<{ id: string; type: string; fields: Record<string, string>; status: SlotStatus }> = [];
  for (const id of EXPECTED_SLOT_ORDER) {
    const found = slotById.get(id);
    if (found) {
      out.push(found);
    } else {
      out.push({ id, type: "placeholder", fields: { note: `[awaiting content: ${id}]` }, status: "placeholder" });
    }
  }
  return out;
}

function escape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

const VALID_LANDING_WEIGHTS = new Set(["cinematic", "high", "normal", "quiet"]);

function landingLiteral(
  f: Record<string, string>,
  prefix: "landing" | "pull_quote_landing"
): string {
  const weight = (f[`${prefix}_weight`] ?? "").trim().toLowerCase();
  if (!VALID_LANDING_WEIGHTS.has(weight)) return "";
  const splitAt = f[`${prefix}_split_at`];
  const note = f[`${prefix}_note`];
  const parts = [`weight: "${weight}"`];
  if (splitAt) parts.push(`splitAt: \`${escape(splitAt)}\``);
  if (note) parts.push(`note: \`${escape(note)}\``);
  return `, landing: { ${parts.join(", ")} }`;
}

function emit(slots: ReturnType<typeof collectSlots>): string {
  const header = `// Generated by src/build/parse-content.ts. Do not edit.\n\n`;
  const types = `export type LensItem = { quote: string; citation: string };

export type LandingWeight = "cinematic" | "high" | "normal" | "quiet";

export type Landing = { weight: LandingWeight; splitAt?: string; note?: string };

export type PullQuote = { text: string; citation: string; landing?: Landing };

export type BilingualPair = { en: string; vi: string; citation: string };

export type Slot =
  | { id: string; status: SlotStatus; type: "chapter-title"; label: string; subtitle?: string }
  | { id: string; status: SlotStatus; type: "quote-block"; quote: string; citation: string; setup?: string; analysis: string; pullQuote?: PullQuote; landing?: Landing }
  | { id: string; status: SlotStatus; type: "quote-inline"; quote: string; citation: string; setup?: string; analysis: string; landing?: Landing }
  | { id: string; status: SlotStatus; type: "bilingual-pair"; en: string; vi: string; citation: string; setup?: string; analysis: string }
  | { id: string; status: SlotStatus; type: "bilingual-stream"; pairs: BilingualPair[]; setup?: string; analysis: string }
  | { id: string; status: SlotStatus; type: "paired-fragment"; left: string; right: string; citation: string; setup?: string; analysis: string }
  | { id: string; status: SlotStatus; type: "lens-bundle"; methodology: LensItem; lens: LensItem; setup?: string; analysis: string }
  | { id: string; status: SlotStatus; type: "transition"; prose: string }
  | { id: string; status: SlotStatus; type: "quote-transition"; quote: string; citation: string; prose: string; setup?: string; landing?: Landing }
  | { id: string; status: SlotStatus; type: "info-card"; eyebrow?: string; title: string; bullets: string[]; closer?: string }
  | { id: string; status: SlotStatus; type: "thesis-reveal"; thesis: string }
  | { id: string; status: SlotStatus; type: "verb-echo"; verbs: [string, string, string] }
  | { id: string; status: SlotStatus; type: "research-trajectory"; eyebrow: string; author: string; workTitle: string; quote: string; citation: string; role: string }
  | { id: string; status: SlotStatus; type: "works-cited-entry"; entries: string[] }
  | { id: string; status: SlotStatus; type: "placeholder"; note: string };

export type SlotStatus = "drafting" | "content-locked" | "rendered" | "bootstrap-fixture" | "placeholder";\n\n`;
  const items: string[] = [];
  for (const slot of slots) {
    const f = slot.fields;
    const base = `id: \`${slot.id}\`, status: \`${slot.status}\``;
    switch (slot.type) {
      case "chapter-title":
        items.push(`{ ${base}, type: "chapter-title", label: \`${escape(f["label"] ?? slot.id)}\`${f["subtitle"] ? `, subtitle: \`${escape(f["subtitle"]!)}\`` : ""} }`);
        break;
      case "quote-block": {
        let pull = "";
        if (f["pull_quote_text"] && f["pull_quote_citation"]) {
          const pullLanding = landingLiteral(f, "pull_quote_landing");
          pull = `, pullQuote: { text: \`${escape(f["pull_quote_text"]!)}\`, citation: \`${escape(f["pull_quote_citation"]!)}\`${pullLanding} }`;
        }
        const landing = landingLiteral(f, "landing");
        items.push(`{ ${base}, type: "quote-block", quote: \`${escape(f["quote"] ?? "")}\`, citation: \`${escape(f["citation"] ?? "")}\`${f["setup"] ? `, setup: \`${escape(f["setup"]!)}\`` : ""}, analysis: \`${escape(f["analysis"] ?? "")}\`${pull}${landing} }`);
        break;
      }
      case "quote-inline": {
        const landing = landingLiteral(f, "landing");
        items.push(`{ ${base}, type: "quote-inline", quote: \`${escape(f["quote"] ?? "")}\`, citation: \`${escape(f["citation"] ?? "")}\`${f["setup"] ? `, setup: \`${escape(f["setup"]!)}\`` : ""}, analysis: \`${escape(f["analysis"] ?? "")}\`${landing} }`);
        break;
      }
      case "bilingual-pair":
        items.push(`{ ${base}, type: "bilingual-pair", en: \`${escape(f["en"] ?? "")}\`, vi: \`${escape(f["vi"] ?? "")}\`, citation: \`${escape(f["citation"] ?? "")}\`${f["setup"] ? `, setup: \`${escape(f["setup"]!)}\`` : ""}, analysis: \`${escape(f["analysis"] ?? "")}\` }`);
        break;
      case "bilingual-stream": {
        const pairs: string[] = [];
        for (let i = 1; i <= 8; i += 1) {
          const en = f[`pair_${i}_en`];
          const vi = f[`pair_${i}_vi`];
          const citation = f[`pair_${i}_citation`];
          if (!en || !vi || !citation) continue;
          pairs.push(`{ en: \`${escape(en)}\`, vi: \`${escape(vi)}\`, citation: \`${escape(citation)}\` }`);
        }
        items.push(`{ ${base}, type: "bilingual-stream", pairs: [${pairs.join(", ")}]${f["setup"] ? `, setup: \`${escape(f["setup"]!)}\`` : ""}, analysis: \`${escape(f["analysis"] ?? "")}\` }`);
        break;
      }
      case "paired-fragment":
        items.push(`{ ${base}, type: "paired-fragment", left: \`${escape(f["left"] ?? "")}\`, right: \`${escape(f["right"] ?? "")}\`, citation: \`${escape(f["citation"] ?? "")}\`${f["setup"] ? `, setup: \`${escape(f["setup"]!)}\`` : ""}, analysis: \`${escape(f["analysis"] ?? "")}\` }`);
        break;
      case "quote-transition": {
        const landing = landingLiteral(f, "landing");
        items.push(`{ ${base}, type: "quote-transition", quote: \`${escape(f["quote"] ?? "")}\`, citation: \`${escape(f["citation"] ?? "")}\`, prose: \`${escape(f["prose"] ?? "")}\`${f["setup"] ? `, setup: \`${escape(f["setup"]!)}\`` : ""}${landing} }`);
        break;
      }
      case "verb-echo": {
        const v1 = escape(f["verb_1"] ?? "");
        const v2 = escape(f["verb_2"] ?? "");
        const v3 = escape(f["verb_3"] ?? "");
        items.push(`{ ${base}, type: "verb-echo", verbs: [\`${v1}\`, \`${v2}\`, \`${v3}\`] }`);
        break;
      }
      case "research-trajectory": {
        items.push(`{ ${base}, type: "research-trajectory", eyebrow: \`${escape(f["eyebrow"] ?? "")}\`, author: \`${escape(f["author"] ?? "")}\`, workTitle: \`${escape(f["work_title"] ?? "")}\`, quote: \`${escape(f["quote"] ?? "")}\`, citation: \`${escape(f["citation"] ?? "")}\`, role: \`${escape(f["role"] ?? "")}\` }`);
        break;
      }
      case "lens-bundle":
        items.push(`{ ${base}, type: "lens-bundle", methodology: { quote: \`${escape(f["methodology_quote"] ?? "")}\`, citation: \`${escape(f["methodology_citation"] ?? "")}\` }, lens: { quote: \`${escape(f["lens_quote"] ?? "")}\`, citation: \`${escape(f["lens_citation"] ?? "")}\` }${f["setup"] ? `, setup: \`${escape(f["setup"]!)}\`` : ""}, analysis: \`${escape(f["analysis"] ?? "")}\` }`);
        break;
      case "transition":
        items.push(`{ ${base}, type: "transition", prose: \`${escape(f["prose"] ?? "")}\` }`);
        break;
      case "info-card": {
        const bullets = (f["bullets"] ?? "").split(/\n/).map((s) => s.trim()).filter((s) => s.length > 0).map((s) => `\`${escape(s)}\``);
        const eyebrow = f["eyebrow"] ? `, eyebrow: \`${escape(f["eyebrow"]!)}\`` : "";
        const closer = f["closer"] ? `, closer: \`${escape(f["closer"]!)}\`` : "";
        items.push(`{ ${base}, type: "info-card"${eyebrow}, title: \`${escape(f["title"] ?? "")}\`, bullets: [${bullets.join(", ")}]${closer} }`);
        break;
      }
      case "thesis-reveal":
        items.push(`{ ${base}, type: "thesis-reveal", thesis: \`${escape(f["thesis"] ?? "")}\` }`);
        break;
      case "works-cited-entry": {
        const entries = (f["entries"] ?? "").split(/\n/).filter((s) => s.trim().length > 0).map((s) => `\`${escape(s.trim())}\``);
        items.push(`{ ${base}, type: "works-cited-entry", entries: [${entries.join(", ")}] }`);
        break;
      }
      default:
        items.push(`{ ${base}, type: "placeholder", note: \`${escape(f["note"] ?? `[awaiting content: ${slot.id}]`)}\` }`);
    }
  }
  return header + types + `export const content: { slots: Slot[] } = {\n  slots: [\n    ${items.join(",\n    ")}\n  ]\n};\n`;
}

mkdirSync(dirname(outPath), { recursive: true });
const out = emit(collectSlots());
writeFileSync(outPath, out, "utf8");
console.log(`[parse-content] wrote ${outPath}`);
