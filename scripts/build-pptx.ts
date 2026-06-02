// Standalone PPTX builder for the WEB-v1 content files.
// Reads project/presentation-WEB-v1/content/*.md, parses the slot structure,
// and emits a one-slide-per-slot backup deck at dist/presentation-backup.pptx.
//
// Lives independent of src/build/parse-content.ts so the backup deliverable
// is unblocked by the in-flight parser/renderer pass on the WEB-v1 build.

import { readFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pptxgenLib from "pptxgenjs";
import type pptxgen from "pptxgenjs";

const PptxGenJS = ((pptxgenLib as unknown as { default?: typeof pptxgen }).default
  ?? (pptxgenLib as unknown as typeof pptxgen));

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "content");
const OUTPUT = join(ROOT, "dist", "presentation-backup.pptx");

const CHAPTER_ORDER = [
  "opening.md",
  "ch1-exposure.md",
  "ch2-sunset.md",
  "ch3-parataxis.md",
  "closing.md",
];

// Slot IDs to omit from the backup deck. Empty chapter dividers and
// emphasis-only slides that work in a scroll-driven web flow but read
// as filler in a slide deck.
const SKIP_SLOTS = new Set([
  "ch1-open",
  "ch2-open",
  "ch3-open",
  "ch2-close",
  "ch3-close",
  "closing-verb-echo",
]);

const TITLE_SLOT = "opening-landing";
const TITLE_AUTHOR = "Samuel Gerungan";
const TITLE_COURSE = "ENGL-1BH — Literary Analysis Presentation";
const TITLE_DATE = "June 2, 2026";

// Per-slot field overrides applied only to the PPTX deck. The source
// content files stay canonical; this map condenses prose for the slide
// format where reading time is shorter than the scroll-driven web flow.
// Setting a field to "" suppresses it from rendering. Quote / citation
// fields are never overridden — quote integrity is the floor.
const PPTX_OVERRIDES: Record<string, Record<string, string>> = {
  "opening-frame": {
    prose:
      "If being seen is the same act as being hunted, how does a person build a self out of being looked at? Being visible is what lets a person be loved. It is also what makes them available to harm.",
  },
  "ch1-macaque": {
    setup: "",
  },
  "ch1-soldier-reads": {
    setup: "",
  },
  "ch1-verdict": {
    setup: "",
  },
  "ch1-close": {
    prose:
      "The barrier does not lift. It gives. The reading is finished and the body is allowed through. The crosscut exposes what civility hides.",
  },
  "ch2-deemed": {
    setup: "",
  },
  "ch2-verge": {
    setup: "",
  },
  "ch3-fragment-stream": {
    setup: "",
  },
  "ch3-parataxis": {
    setup: "",
  },
};

function applyOverrides(slot: Slot): Slot {
  const overrides = PPTX_OVERRIDES[slot.id];
  if (!overrides) return slot;
  return { ...slot, fields: { ...slot.fields, ...overrides } };
}

interface Slot {
  id: string;
  type: string;
  fields: Record<string, string>;
}

interface ChapterFile {
  chapter: string;
  slots: Slot[];
}

const BG = "FAF7F2";
const BODY = "2A2520";
const MUTED = "8B7E70";
const ACCENT = "9B2A1F";
const SERIF = "Georgia";
const SANS = "Calibri";

// Landing flag system. Slots can carry `landing_weight` + `landing_note`
// (+ optional `landing_split_at`) fields to mark visual elements that
// must land harder than the default render. Read by quote-block,
// quote-inline. PPTX maps weight to color + size bumps and renders the
// split. WEB-v1 reads the same fields for motion + emphasis treatment.
type LandingWeight = "cinematic" | "high" | "normal" | "quiet";

function readLandingWeight(value: string | undefined, fallback: LandingWeight = "normal"): LandingWeight {
  if (value === "cinematic" || value === "high" || value === "quiet") return value;
  return fallback;
}

function landingColor(weight: LandingWeight): string {
  if (weight === "cinematic" || weight === "high") return ACCENT;
  if (weight === "quiet") return MUTED;
  return BODY;
}

function landingSize(weight: LandingWeight, base: number): number {
  if (weight === "cinematic") return Math.round(base * 1.35);
  if (weight === "high") return Math.round(base * 1.15);
  if (weight === "quiet") return Math.round(base * 0.9);
  return base;
}

function applyLandingSplit(text: string, splitAt: string | undefined): string {
  if (!splitAt || !text.includes(splitAt)) return text;
  const idx = text.indexOf(splitAt);
  const before = text.slice(0, idx + splitAt.length).trim();
  const after = text.slice(idx + splitAt.length).trim();
  return after ? `${before}\n\n${after}` : before;
}

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;
const MARGIN_X = 0.85;
const CONTENT_W = SLIDE_W - MARGIN_X * 2;

function parseFile(text: string): ChapterFile {
  const lines = text.split("\n");
  let chapter = "";
  let i = 0;

  if (lines[0]?.trim() === "---") {
    i = 1;
    while (i < lines.length && lines[i].trim() !== "---") {
      const m = lines[i].match(/^chapter:\s*(.+)$/);
      if (m) chapter = m[1].trim();
      i++;
    }
    i++;
  }

  const body = lines.slice(i).join("\n");
  const blocks = body.split(/^---\s*$/m).map((b) => b.trim()).filter((b) => b);

  const slots: Slot[] = [];
  for (const block of blocks) {
    const blockLines = block.split("\n");
    let id = "";
    let type = "";
    const fields: Record<string, string> = {};
    let currentField: string | null = null;
    let currentBuf: string[] = [];

    const flush = () => {
      if (currentField) {
        fields[currentField] = currentBuf.join("\n").trim();
      }
      currentField = null;
      currentBuf = [];
    };

    for (const line of blockLines) {
      const idMatch = line.match(/^##\s+(.+)$/);
      const typeMatch = line.match(/^type:\s*(.+)$/);
      const fieldMatch = line.match(/^###\s+(.+)$/);

      if (idMatch && !id) {
        id = idMatch[1].trim();
      } else if (typeMatch && !type) {
        type = typeMatch[1].trim();
      } else if (fieldMatch) {
        flush();
        currentField = fieldMatch[1].trim();
      } else if (currentField !== null) {
        currentBuf.push(line);
      }
    }
    flush();

    if (id && type) slots.push({ id, type, fields });
  }

  return { chapter, slots };
}

function loadAllSlots(): Slot[] {
  const all: Slot[] = [];
  for (const file of CHAPTER_ORDER) {
    const path = join(CONTENT_DIR, file);
    const raw = readFileSync(path, "utf-8");
    const parsed = parseFile(raw);
    all.push(...parsed.slots);
  }
  return all;
}

// Splits a string on *italic* markdown into pptxgenjs rich-text segments.
type RichRun = { text: string; options?: { italic?: boolean } };
function parseInline(text: string): RichRun[] {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts
    .filter((p) => p.length > 0)
    .map((p) => {
      if (p.startsWith("*") && p.endsWith("*") && p.length > 2) {
        return { text: p.slice(1, -1), options: { italic: true } };
      }
      return { text: p };
    });
}

function addEyebrow(slide: pptxgen.Slide, slotId: string) {
  slide.addText(slotId, {
    x: MARGIN_X,
    y: 0.35,
    w: CONTENT_W,
    h: 0.3,
    fontFace: SANS,
    fontSize: 10,
    color: MUTED,
    charSpacing: 6,
    bold: false,
  });
}

function addCitation(slide: pptxgen.Slide, citation: string, y: number = SLIDE_H - 0.55) {
  slide.addText(`— ${citation}`, {
    x: MARGIN_X,
    y,
    w: CONTENT_W,
    h: 0.3,
    fontFace: SANS,
    fontSize: 11,
    color: MUTED,
    italic: true,
    align: "right",
  });
}

function renderTitleSlide(pres: pptxgen, slot: Slot): void {
  const slide = pres.addSlide();
  slide.background = { color: BG };
  const f = slot.fields;

  slide.addText(f["label"] ?? "", {
    x: MARGIN_X,
    y: 2.4,
    w: CONTENT_W,
    h: 1.6,
    fontFace: SERIF,
    fontSize: 60,
    color: BODY,
    align: "center",
    valign: "middle",
  });
  slide.addText(f["subtitle"] ?? "", {
    x: MARGIN_X + 1.0,
    y: 4.1,
    w: CONTENT_W - 2.0,
    h: 1.0,
    fontFace: SERIF,
    fontSize: 22,
    color: BODY,
    align: "center",
    italic: true,
  });
  slide.addText(
    [
      { text: TITLE_AUTHOR + "\n", options: { bold: false } },
      { text: TITLE_COURSE + "\n", options: { color: MUTED } },
      { text: TITLE_DATE, options: { color: MUTED } },
    ],
    {
      x: MARGIN_X,
      y: SLIDE_H - 1.4,
      w: CONTENT_W,
      h: 1.0,
      fontFace: SANS,
      fontSize: 13,
      color: BODY,
      align: "center",
      paraSpaceAfter: 2,
    },
  );
}

function renderSlot(pres: pptxgen, slot: Slot): void {
  if (slot.id === TITLE_SLOT) {
    renderTitleSlide(pres, slot);
    return;
  }
  const slide = pres.addSlide();
  slide.background = { color: BG };
  addEyebrow(slide, slot.id);

  const f = slot.fields;

  switch (slot.type) {
    case "chapter-title": {
      slide.addText(f["label"] ?? "", {
        x: MARGIN_X,
        y: 2.6,
        w: CONTENT_W,
        h: 0.8,
        fontFace: SANS,
        fontSize: 22,
        color: MUTED,
        align: "center",
        charSpacing: 8,
      });
      slide.addText(f["subtitle"] ?? "", {
        x: MARGIN_X,
        y: 3.4,
        w: CONTENT_W,
        h: 1.5,
        fontFace: SERIF,
        fontSize: 64,
        color: BODY,
        align: "center",
        italic: true,
      });
      break;
    }

    case "info-card": {
      let y = 1.2;
      if (f["eyebrow"]) {
        slide.addText(f["eyebrow"], {
          x: MARGIN_X,
          y,
          w: CONTENT_W,
          h: 0.4,
          fontFace: SANS,
          fontSize: 13,
          color: MUTED,
          charSpacing: 6,
        });
        y += 0.5;
      }
      if (f["title"]) {
        slide.addText(parseInline(f["title"]), {
          x: MARGIN_X,
          y,
          w: CONTENT_W,
          h: 1.0,
          fontFace: SERIF,
          fontSize: 40,
          color: BODY,
        });
        y += 1.2;
      }
      if (f["bullets"]) {
        const bullets = f["bullets"].split("\n").filter((b) => b.trim());
        slide.addText(
          bullets.map((b) => ({ text: b, options: { bullet: { code: "2022" } } })),
          {
            x: MARGIN_X,
            y,
            w: CONTENT_W,
            h: 3.5,
            fontFace: SANS,
            fontSize: 20,
            color: BODY,
            paraSpaceAfter: 8,
          },
        );
        y += 3.6;
      }
      if (f["closer"]) {
        slide.addText(parseInline(f["closer"]), {
          x: MARGIN_X,
          y: SLIDE_H - 1.2,
          w: CONTENT_W,
          h: 0.6,
          fontFace: SERIF,
          fontSize: 20,
          color: BODY,
          italic: true,
        });
      }
      break;
    }

    case "quote-block": {
      const landing = readLandingWeight(f["landing_weight"]);
      const quoteText = applyLandingSplit(f["quote"] ?? "", f["landing_split_at"]);
      slide.addText(`"${quoteText}"`, {
        x: MARGIN_X,
        y: 1.2,
        w: CONTENT_W,
        h: 2.8,
        fontFace: SERIF,
        fontSize: landingSize(landing, 26),
        color: landingColor(landing),
        italic: true,
        valign: "top",
        paraSpaceAfter: landing === "cinematic" ? 12 : 0,
      });
      if (f["citation"]) addCitation(slide, f["citation"], 4.05);
      let y = 4.45;
      if (f["pull_quote_text"]) {
        const pqLanding = readLandingWeight(f["pull_quote_landing_weight"], "high");
        const pq = `"${f["pull_quote_text"]}" — ${f["pull_quote_citation"] ?? ""}`;
        slide.addText(pq, {
          x: MARGIN_X,
          y,
          w: CONTENT_W,
          h: 0.45,
          fontFace: SERIF,
          fontSize: landingSize(pqLanding, 14),
          color: ACCENT,
          italic: true,
          align: "left",
          bold: pqLanding === "cinematic",
        });
        y += pqLanding === "cinematic" ? 0.65 : 0.55;
      }
      if (f["setup"]) {
        slide.addText(parseInline(f["setup"]), {
          x: MARGIN_X,
          y,
          w: CONTENT_W,
          h: 0.6,
          fontFace: SANS,
          fontSize: 13,
          color: MUTED,
          italic: true,
        });
        y += 0.65;
      }
      if (f["analysis"]) {
        slide.addText(parseInline(f["analysis"]), {
          x: MARGIN_X,
          y,
          w: CONTENT_W,
          h: SLIDE_H - y - 0.5,
          fontFace: SANS,
          fontSize: 15,
          color: BODY,
        });
      }
      break;
    }

    case "quote-inline": {
      const landing = readLandingWeight(f["landing_weight"]);
      const quoteText = applyLandingSplit(f["quote"] ?? "", f["landing_split_at"]);
      slide.addText(`"${quoteText}"`, {
        x: MARGIN_X,
        y: 2.0,
        w: CONTENT_W,
        h: 1.4,
        fontFace: SERIF,
        fontSize: landingSize(landing, 36),
        color: landingColor(landing),
        italic: true,
        align: "center",
        bold: landing === "cinematic",
      });
      if (f["citation"]) {
        slide.addText(`— ${f["citation"]}`, {
          x: MARGIN_X,
          y: 3.5,
          w: CONTENT_W,
          h: 0.4,
          fontFace: SANS,
          fontSize: 12,
          color: MUTED,
          italic: true,
          align: "center",
        });
      }
      let y = 4.3;
      if (f["setup"]) {
        slide.addText(parseInline(f["setup"]), {
          x: MARGIN_X,
          y,
          w: CONTENT_W,
          h: 0.5,
          fontFace: SANS,
          fontSize: 13,
          color: MUTED,
          italic: true,
        });
        y += 0.6;
      }
      if (f["analysis"]) {
        slide.addText(parseInline(f["analysis"]), {
          x: MARGIN_X,
          y,
          w: CONTENT_W,
          h: SLIDE_H - y - 0.5,
          fontFace: SANS,
          fontSize: 15,
          color: BODY,
        });
      }
      break;
    }

    case "paired-fragment": {
      const halfW = (CONTENT_W - 0.5) / 2;
      slide.addText(`"${f["left"] ?? ""}"`, {
        x: MARGIN_X,
        y: 1.4,
        w: halfW,
        h: 1.6,
        fontFace: SERIF,
        fontSize: 28,
        color: BODY,
        italic: true,
        align: "center",
        valign: "middle",
      });
      slide.addText(`"${f["right"] ?? ""}"`, {
        x: MARGIN_X + halfW + 0.5,
        y: 1.4,
        w: halfW,
        h: 1.6,
        fontFace: SERIF,
        fontSize: 28,
        color: BODY,
        italic: true,
        align: "center",
        valign: "middle",
      });
      if (f["citation"]) addCitation(slide, f["citation"], 3.15);
      let y = 3.7;
      if (f["setup"]) {
        slide.addText(parseInline(f["setup"]), {
          x: MARGIN_X,
          y,
          w: CONTENT_W,
          h: 0.6,
          fontFace: SANS,
          fontSize: 13,
          color: MUTED,
          italic: true,
        });
        y += 0.7;
      }
      if (f["analysis"]) {
        slide.addText(parseInline(f["analysis"]), {
          x: MARGIN_X,
          y,
          w: CONTENT_W,
          h: SLIDE_H - y - 0.5,
          fontFace: SANS,
          fontSize: 16,
          color: BODY,
        });
      }
      break;
    }

    case "bilingual-stream": {
      const pairs: Array<{ en: string; vi: string; cite: string }> = [];
      let n = 1;
      while (f[`pair_${n}_en`] || f[`pair_${n}_vi`]) {
        pairs.push({
          en: f[`pair_${n}_en`] ?? "",
          vi: f[`pair_${n}_vi`] ?? "",
          cite: f[`pair_${n}_citation`] ?? "",
        });
        n++;
      }
      const colW = (CONTENT_W - 0.5) / 2;
      const rowH = pairs.length === 1 ? 2.0 : 1.4;
      let y = 1.1;
      for (const p of pairs) {
        slide.addText(p.en, {
          x: MARGIN_X,
          y,
          w: colW,
          h: rowH,
          fontFace: SERIF,
          fontSize: 20,
          color: BODY,
          italic: true,
          valign: "middle",
        });
        slide.addText(p.vi, {
          x: MARGIN_X + colW + 0.5,
          y,
          w: colW,
          h: rowH,
          fontFace: SERIF,
          fontSize: 22,
          color: BODY,
          align: "center",
          valign: "middle",
        });
        y += rowH;
        if (p.cite) {
          slide.addText(`— ${p.cite}`, {
            x: MARGIN_X,
            y: y - 0.1,
            w: CONTENT_W,
            h: 0.3,
            fontFace: SANS,
            fontSize: 10,
            color: MUTED,
            italic: true,
            align: "right",
          });
        }
        y += 0.15;
      }
      y += 0.1;
      if (f["setup"]) {
        slide.addText(parseInline(f["setup"]), {
          x: MARGIN_X,
          y,
          w: CONTENT_W,
          h: 0.6,
          fontFace: SANS,
          fontSize: 13,
          color: MUTED,
          italic: true,
        });
        y += 0.65;
      }
      if (f["analysis"]) {
        slide.addText(parseInline(f["analysis"]), {
          x: MARGIN_X,
          y,
          w: CONTENT_W,
          h: SLIDE_H - y - 0.5,
          fontFace: SANS,
          fontSize: 14,
          color: BODY,
        });
      }
      break;
    }

    case "lens-bundle": {
      const halfW = (CONTENT_W - 0.4) / 2;
      slide.addText(
        [
          { text: "METHODOLOGY\n", options: { fontFace: SANS, fontSize: 10, color: MUTED, charSpacing: 4, bold: false } },
          { text: `"${f["methodology_quote"] ?? ""}"\n`, options: { fontFace: SERIF, fontSize: 14, color: BODY, italic: true } },
          { text: `— ${f["methodology_citation"] ?? ""}`, options: { fontFace: SANS, fontSize: 10, color: MUTED, italic: true } },
        ],
        { x: MARGIN_X, y: 1.1, w: halfW, h: 3.0, valign: "top", paraSpaceAfter: 4 },
      );
      slide.addText(
        [
          { text: "LENS\n", options: { fontFace: SANS, fontSize: 10, color: MUTED, charSpacing: 4, bold: false } },
          { text: `"${f["lens_quote"] ?? ""}"\n`, options: { fontFace: SERIF, fontSize: 14, color: BODY, italic: true } },
          { text: `— ${f["lens_citation"] ?? ""}`, options: { fontFace: SANS, fontSize: 10, color: MUTED, italic: true } },
        ],
        { x: MARGIN_X + halfW + 0.4, y: 1.1, w: halfW, h: 3.0, valign: "top", paraSpaceAfter: 4 },
      );
      if (f["analysis"]) {
        slide.addText(parseInline(f["analysis"]), {
          x: MARGIN_X,
          y: 4.4,
          w: CONTENT_W,
          h: SLIDE_H - 4.9,
          fontFace: SANS,
          fontSize: 14,
          color: BODY,
        });
      }
      break;
    }

    case "transition": {
      slide.addText(parseInline(f["prose"] ?? ""), {
        x: MARGIN_X + 1.0,
        y: 2.5,
        w: CONTENT_W - 2.0,
        h: 2.5,
        fontFace: SERIF,
        fontSize: 22,
        color: BODY,
        italic: true,
        align: "center",
        valign: "middle",
      });
      break;
    }

    case "quote-transition": {
      slide.addText(`"${f["quote"] ?? ""}"`, {
        x: MARGIN_X,
        y: 1.2,
        w: CONTENT_W,
        h: 1.6,
        fontFace: SERIF,
        fontSize: 24,
        color: BODY,
        italic: true,
        valign: "top",
      });
      if (f["citation"]) addCitation(slide, f["citation"], 2.9);
      if (f["prose"]) {
        slide.addText(parseInline(f["prose"]), {
          x: MARGIN_X,
          y: 3.6,
          w: CONTENT_W,
          h: SLIDE_H - 4.1,
          fontFace: SANS,
          fontSize: 16,
          color: BODY,
        });
      }
      break;
    }

    case "verb-echo": {
      const verbs = [f["verb_1"] ?? "", f["verb_2"] ?? "", f["verb_3"] ?? ""];
      const colW = CONTENT_W / 3;
      verbs.forEach((v, i) => {
        slide.addText(v, {
          x: MARGIN_X + i * colW,
          y: 3.0,
          w: colW,
          h: 1.5,
          fontFace: SANS,
          fontSize: 36,
          color: BODY,
          align: "center",
          valign: "middle",
          charSpacing: 8,
        });
      });
      break;
    }

    case "thesis-reveal": {
      slide.addText("Thesis", {
        x: MARGIN_X,
        y: 0.8,
        w: CONTENT_W,
        h: 0.4,
        fontFace: SANS,
        fontSize: 12,
        color: MUTED,
        charSpacing: 8,
        align: "center",
      });
      slide.addText(parseInline(f["thesis"] ?? ""), {
        x: MARGIN_X + 0.5,
        y: 1.6,
        w: CONTENT_W - 1.0,
        h: 5.0,
        fontFace: SERIF,
        fontSize: 22,
        color: BODY,
        align: "left",
        valign: "middle",
      });
      break;
    }

    case "research-trajectory": {
      if (f["eyebrow"]) {
        slide.addText(f["eyebrow"], {
          x: MARGIN_X,
          y: 0.95,
          w: CONTENT_W,
          h: 0.35,
          fontFace: SANS,
          fontSize: 11,
          color: MUTED,
          charSpacing: 8,
        });
      }
      slide.addText(
        [
          { text: f["author"] ?? "", options: { fontFace: SERIF, fontSize: 22, color: BODY } },
          ...(f["work_title"]
            ? [
                { text: "\n", options: { fontSize: 8 } },
                ...parseInline(f["work_title"]).map((r) => ({
                  text: r.text,
                  options: { fontFace: SERIF, fontSize: 14, color: MUTED, italic: r.options?.italic },
                })),
              ]
            : []),
        ],
        {
          x: MARGIN_X,
          y: 1.45,
          w: CONTENT_W,
          h: 1.3,
          valign: "top",
          paraSpaceAfter: 2,
        },
      );
      slide.addText(`"${f["quote"] ?? ""}"`, {
        x: MARGIN_X + 0.3,
        y: 2.85,
        w: CONTENT_W - 0.3,
        h: 2.0,
        fontFace: SERIF,
        fontSize: 16,
        color: BODY,
        italic: true,
        valign: "top",
      });
      if (f["citation"]) addCitation(slide, f["citation"], 4.95);
      if (f["role"]) {
        slide.addText(parseInline(f["role"]), {
          x: MARGIN_X,
          y: 5.45,
          w: CONTENT_W,
          h: SLIDE_H - 5.95,
          fontFace: SANS,
          fontSize: 13,
          color: BODY,
        });
      }
      break;
    }

    case "works-cited-entry": {
      slide.addText("Works Cited", {
        x: MARGIN_X,
        y: 0.7,
        w: CONTENT_W,
        h: 0.5,
        fontFace: SERIF,
        fontSize: 24,
        color: BODY,
        align: "center",
      });
      const entries = (f["entries"] ?? "").split("\n").filter((e) => e.trim());
      slide.addText(
        entries.flatMap((e) => {
          const runs = parseInline(e);
          return [
            ...runs.map((r, i) => ({
              text: r.text + (i === runs.length - 1 ? "\n" : ""),
              options: { ...r.options },
            })),
          ];
        }),
        {
          x: MARGIN_X,
          y: 1.5,
          w: CONTENT_W,
          h: 5.5,
          fontFace: SANS,
          fontSize: 13,
          color: BODY,
          paraSpaceAfter: 10,
          indentLevel: 0,
        },
      );
      break;
    }

    default: {
      slide.addText(`[unsupported slot type: ${slot.type}]`, {
        x: MARGIN_X,
        y: 3.5,
        w: CONTENT_W,
        h: 0.5,
        fontFace: SANS,
        fontSize: 16,
        color: ACCENT,
        align: "center",
      });
    }
  }
}

async function build() {
  const slots = loadAllSlots();
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";
  pres.title = "On Earth We're Briefly Gorgeous — visibility, counter-story, and the construction of self";
  pres.author = "Samuel Gerungan";
  pres.subject = "ENGL-1BH literary analysis presentation (backup deck)";

  let rendered = 0;
  for (const slot of slots) {
    if (SKIP_SLOTS.has(slot.id)) continue;
    renderSlot(pres, applyOverrides(slot));
    rendered++;
  }

  mkdirSync(dirname(OUTPUT), { recursive: true });
  await pres.writeFile({ fileName: OUTPUT });
  console.log(`Wrote ${rendered} slides to ${OUTPUT} (${slots.length - rendered} skipped)`);
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
