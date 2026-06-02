// Standalone presenter's playbook generator.
// Reads project/presentation-WEB-v1/content/*.md, same shape as build-pptx,
// and emits a tablet-friendly markdown playbook at
// dist/presentation-playbook.md with on-screen content + talking points
// for each rendered slide.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "content");
const OUTPUT = join(ROOT, "dist", "presentation-playbook.md");

const CHAPTER_ORDER = [
  "opening.md",
  "ch1-exposure.md",
  "ch2-sunset.md",
  "ch3-parataxis.md",
  "closing.md",
];

const SKIP_SLOTS = new Set([
  "ch1-open",
  "ch2-open",
  "ch3-open",
  "ch2-close",
  "ch3-close",
  "closing-verb-echo",
]);

const TITLE_SLOT = "opening-landing";

interface Slot {
  id: string;
  type: string;
  fields: Record<string, string>;
}

function parseFile(text: string): Slot[] {
  const lines = text.split("\n");
  let i = 0;
  if (lines[0]?.trim() === "---") {
    i = 1;
    while (i < lines.length && lines[i].trim() !== "---") i++;
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
    let buf: string[] = [];
    const flush = () => {
      if (currentField) fields[currentField] = buf.join("\n").trim();
      currentField = null;
      buf = [];
    };
    for (const line of blockLines) {
      const idMatch = line.match(/^##\s+(.+)$/);
      const typeMatch = line.match(/^type:\s*(.+)$/);
      const labelMatch = line.match(/^label:\s*(.+)$/);
      const subtitleMatch = line.match(/^subtitle:\s*(.+)$/);
      const fieldMatch = line.match(/^###\s+(.+)$/);
      if (idMatch && !id) id = idMatch[1].trim();
      else if (typeMatch && !type) type = typeMatch[1].trim();
      else if (labelMatch) fields["label"] = labelMatch[1].trim();
      else if (subtitleMatch) fields["subtitle"] = subtitleMatch[1].trim();
      else if (fieldMatch) {
        flush();
        currentField = fieldMatch[1].trim();
      } else if (currentField !== null) {
        buf.push(line);
      }
    }
    flush();
    if (id && type) slots.push({ id, type, fields });
  }
  return slots;
}

function loadAllSlots(): Slot[] {
  const all: Slot[] = [];
  for (const file of CHAPTER_ORDER) {
    const raw = readFileSync(join(CONTENT_DIR, file), "utf-8");
    all.push(...parseFile(raw));
  }
  return all;
}

// Per-slot delivery notes authored for tonight's talk.
// Keyed by slot ID. Used in addition to setup + analysis fields.
const DELIVERY_NOTES: Record<string, string[]> = {
  "opening-landing": [
    "Open by stating your name, the course, and the novel.",
    "Brief eye sweep across the room. Don't rush the title slide.",
    "Transition: \"Vuong's letter to his mother carries one motif that does all the political work I want to show you tonight.\"",
  ],
  "opening-world": [
    "Orient the audience to the novel for anyone who hasn't read it. Don't apologize for orienting.",
    "Two key facts: it's a letter to a mother who can't read English. Hartford 1990s, Vietnamese American immigrant family.",
    "Plant the word \"motif\" so the audience is listening for it.",
  ],
  "opening-pressures": [
    "Three rows in sequence: Family / Trevor / The world. Read each row label and one supporting fact.",
    "Closer line: \"The letter is written from inside all three pressures at once.\"",
    "This grounds peers who haven't read the book — pacing-wise, give it ~30 seconds.",
  ],
  "opening-frame": [
    "Read the prose slowly. This is the question the talk is answering.",
    "Land the key phrase: \"being visible is what lets a person be loved. It is also what makes them available to harm.\"",
    "Hold the eye-line up after you finish — don't look down at notes.",
  ],
  "opening-motif": [
    "Name the motif explicitly: hunter and prey, looking and being looked at.",
    "Three chapters, three jobs: exposure, sunset, parataxis.",
    "Don't preview the thesis here. Just promise the structure.",
  ],
  "opening-framework": [
    "Name the methodological frame: Critical Race Methodology, Solórzano and Yosso.",
    "One-sentence gloss: counter-storytelling exposes the standard story by talking back to it.",
    "Tell the room you'll also bring in Snyder-Young, Getsy, and Ha and Tompkins where each does specific work.",
  ],
  "ch1-macaque": [
    "Set the scene: \"Early in the novel, five Vietnamese men in a Hartford garage are about to eat the brain of a live macaque, a small monkey.\"",
    "Read the quote. Don't theatricalize. Flat, analytical.",
    "Drop in the pull-quote landing: the napkin is \"printed with sunflowers.\" That detail is the whole point.",
    "Close-read: \"The civility is the cover the killing wears. The polite yellow of a sunflower napkin does the same work as the porcelain plate. Belonging and predation share one vocabulary.\"",
  ],
  "ch1-soldier-reads": [
    "Cue the crosscut: \"Vuong cuts mid-paragraph from the garage to a 1968 checkpoint. The soldier reads the mother's hair before he reads her.\"",
    "Read both fragments out loud: \"errant cinnamon tint\" and \"fringed blond around the temples.\"",
    "Close-read: \"The cinnamon names the difference. The blond names the likeness. What the soldier sees is not the woman. It is a likeness to whiteness. Recognition precedes personhood.\"",
  ],
  "ch1-verdict": [
    "**EARNED CINEMATIC MOMENT — CI 1.** Slow down. This is the verdict cut.",
    "Read the line alone: \"He could be her father.\" (Vuong 44.)",
    "PAUSE. Let it sit. Eye contact across the room.",
    "Then deliver the close-read: \"The verdict that spares Rose is the same logic that kills the macaque. The mother has been read; the page cannot un-read her.\"",
  ],
  "ch1-lens": [
    "Pivot from close-read to framework.",
    "Read Solórzano and Yosso's methodology fragment: the standard the soldier reads by — \"white, male, middle-class, straight.\"",
    "Bring in Snyder-Young: \"To maintain white racial comfort, white spectators ignore the adverse impacts of well-intentioned actions.\"",
    "Land the synthesis: \"The well-intentioned action is the cover that lets the verdict feel like mercy. Rose lives because the soldier reads the same logic onto her that kills the macaque.\"",
  ],
  "ch1-close": [
    "Quote: \"the first soldier steps back. The second one moves the wooden divider, waves the woman forward\" (Vuong 45).",
    "Deliver the close-read: \"The barrier does not lift. It gives. The reading is finished and the body is allowed through.\"",
    "Transition: \"The next chapter takes that exposure and asks what visibility itself is.\"",
  ],
  "ch2-deemed": [
    "**EARNED CINEMATIC MOMENT — CI 2 (part one of two).** Set the scene gently: barn → tobacco field. Little Dog thinks he's following a wounded animal.",
    "Read the first half slowly: \"I am thinking of beauty again,\"",
    "PAUSE. Let the audience think the sentence is finished.",
    "Then drop the second half: \"how some things are hunted because we have deemed them beautiful.\"",
    "Close-read: \"Vuong puts the verb first. The reading precedes the harm.\"",
  ],
  "ch2-verge": [
    "**EARNED CINEMATIC MOMENT — CI 2 (part two of two).** Two pages later, same field, sun going.",
    "Read sentence one quietly: \"Because the sunset, like survival, exists only on the verge of its own disappearing.\"",
    "Then split: \"To be gorgeous, you must first be seen,\" — beat — \"but to be seen allows you to be hunted.\"",
    "Highlight the echo: \"The same three words sit in both halves. To be seen. One verb, one act.\"",
    "Land: \"Allows treats visibility as something the body grants. The body does not.\"",
  ],
  "ch2-lens": [
    "Bring back Solórzano and Yosso: sorting bodies as \"good\" or \"bad\" is covert and overt.",
    "Add Getsy: \"His personal resolve to live openly had the effect of casting him as an object of others' inquiries and intrusions.\"",
    "Synthesis: \"Kinship-asking and violation flow from one act of being seen.\"",
    "**DELIVERY NOTE (charged sentence ahead).** If you reference the rape-reading from CI 1 here, deliver it flat. Eye-contact level. Do not pause for room reaction.",
  ],
  "ch3-fragment-stream": [
    "Set the scene: \"Early in Part III, the prose stops narrating scenes and runs in fragments. Vuong names the Vietnamese word, then sets Rose's question beside an English answer that pulls the word apart.\"",
    "Pair 1: gloss the word — \"In Vietnamese, the word for missing someone and remembering them is the same: nhớ.\"",
    "Pronounce: approximately /ɲɤ́/. (sắc tone, high-rising. Don't over-explain the IPA.)",
    "Pair 2: Rose asks \"Con nhớ mẹ không?\" Little Dog answers in English: \"I miss you more than I remember you.\"",
    "Close-read: \"One word holds both verbs. English needs two; Vietnamese has one. The English sentence names what Vietnamese cannot help but say.\"",
  ],
  "ch3-parataxis": [
    "**EARNED CINEMATIC MOMENT — CI 3.** This is Vuong naming his own device mid-use.",
    "Read the first sentence to demonstrate the no-verb parataxis: \"A person beside a person inside a life.\"",
    "PAUSE.",
    "Then stack the next two declarations: \"That's called parataxis. That's called the future.\"",
    "Close-read: \"No main verb in the first sentence. Three noun phrases, side by side. The next two sentences name what the grammar already did.\"",
  ],
  "ch3-lens": [
    "Bring in Ikemoto qtd. in Solórzano and Yosso: \"By responding only to the standard story, we let it dominate the discourse.\"",
    "Then Ha and Tompkins: \"Historical amnesia in the United States is an organized, systematic, and intentional mechanism for maintaining dominance.\"",
    "Synthesis: \"Vuong's parataxis is not decoration. It is the grammar Little Dog had to invent because the standard grammar was disqualified from telling his family's story.\"",
    "Land: \"Vietnamese American memory gets left out as a feature, not an accident.\"",
  ],
  "closing-trajectory-soler": [
    "**TRAJECTORY BEAT — where the argument extends (1 of 2).** Frame it: \"The argument I just made stops here. Two recent critics show where it keeps going.\"",
    "Name the critic: Sara Soler i Arjona, *Humanities* 2024. (Full Catalan surname — not just \"Soler.\")",
    "One-sentence frame: Soler reads refugeehood as queered ongoing temporality — not a finite arrival, an ongoing condition.",
    "Read the quote: \"By queering the normative temporality of the refugee experience, the novel envisions another way of 'living historically'...\"",
    "Where it extends: refugee time never closes, so the demand to be legible on America's terms never closes either. The bind is generational.",
  ],
  "closing-trajectory-lee": [
    "**TRAJECTORY BEAT — where the argument extends (2 of 2).**",
    "Name the critic: Rachel Lee, *Journal of Transnational American Studies* 2022.",
    "One-sentence frame: Lee reads the violence as chemical and biopolitical. Agent Orange and the opioid economy as two faces of the same regime.",
    "Read the quote: \"On Earth portrays the lingering afterlives of the military-poison complex and the narcotic-pharmaceutical industries...\"",
    "Where it extends: the macaque hunt and the soldier-reads aren't only metaphors. They're events inside a chemical regime that targets some bodies for harm and preserves others.",
    "Transition: \"That's the next paper. Here is the thesis for this one.\"",
  ],
  "closing-thesis": [
    "**THE EARNED MOMENT OF THE TALK.** Slow down completely.",
    "Read the thesis sentence by sentence. Do not rush.",
    "First half: \"Through the hunter-prey motif, the novel exposes the majoritarian demand that marginalized people become readable on America's terms and analyzes being seen as the source of both love and harm.\"",
    "Beat.",
    "Second half: \"It challenges that demand through the letter itself, where parataxis and reclaimed language let Little Dog build a new sense of self on his own terms.\"",
    "Eye contact across the room. Do not move to Works Cited until the silence breaks.",
  ],
  "works-cited": [
    "Brief acknowledgment slide. Do not read entries aloud.",
    "If you want, say: \"Full Works Cited on the slide; happy to point you to any of these in Q&A.\"",
    "Then open the floor: \"I'd love your questions.\"",
  ],
};

function header(text: string): string {
  return `\n---\n\n## ${text}\n`;
}

function block(label: string, content: string): string {
  if (!content) return "";
  return `\n**${label}:**\n\n${content}\n`;
}

function quoteBlock(text: string, citation?: string): string {
  const lines = text.split("\n").map((l) => `> ${l}`).join("\n");
  const cite = citation ? `\n> \n> — *${citation}*` : "";
  return `\n${lines}${cite}\n`;
}

function bullets(items: string[]): string {
  return items.map((b) => `- ${b}`).join("\n");
}

function renderSlot(slot: Slot, num: number): string {
  const f = slot.fields;
  const landing = f["landing_weight"];
  const landingTag = landing && landing !== "normal" ? ` · **Landing:** \`${landing}\`` : "";
  let md = header(`Slide ${num} · \`${slot.id}\``);
  md += `\n**Type:** \`${slot.type}\`${landingTag}\n`;

  // ON SCREEN
  md += `\n### On screen\n`;
  switch (slot.type) {
    case "chapter-title": {
      md += `\n${f["label"] ?? ""} — *${f["subtitle"] ?? ""}*\n`;
      if (slot.id === TITLE_SLOT) {
        md += `\n*Samuel Gerungan · ENGL-1BH Literary Analysis Presentation · June 2, 2026*\n`;
      }
      break;
    }
    case "info-card": {
      if (f["eyebrow"]) md += `\n*${f["eyebrow"]}*\n`;
      if (f["title"]) md += `\n**${f["title"]}**\n`;
      if (f["bullets"]) {
        md += "\n";
        for (const b of f["bullets"].split("\n")) {
          if (b.trim()) md += `- ${b.trim()}\n`;
        }
      }
      if (f["closer"]) md += `\n*${f["closer"]}*\n`;
      break;
    }
    case "quote-block":
    case "quote-inline":
    case "quote-transition": {
      md += quoteBlock(f["quote"] ?? "", f["citation"]);
      if (f["pull_quote_text"]) {
        md += `\n*Pull-quote (landing):* "${f["pull_quote_text"]}" — *${f["pull_quote_citation"] ?? ""}*\n`;
      }
      break;
    }
    case "paired-fragment": {
      md += `\n**Left:** "${f["left"] ?? ""}"  ·  **Right:** "${f["right"] ?? ""}"\n`;
      if (f["citation"]) md += `\n*— ${f["citation"]}*\n`;
      break;
    }
    case "bilingual-stream": {
      let n = 1;
      md += "\n";
      while (f[`pair_${n}_en`] || f[`pair_${n}_vi`]) {
        md += `${n}. **EN:** ${f[`pair_${n}_en`] ?? ""}  ·  **VI:** ${f[`pair_${n}_vi`] ?? ""}`;
        if (f[`pair_${n}_citation`]) md += ` *(${f[`pair_${n}_citation`]})*`;
        md += "\n";
        n++;
      }
      break;
    }
    case "lens-bundle": {
      md += `\n**Methodology:** "${f["methodology_quote"] ?? ""}" — *${f["methodology_citation"] ?? ""}*\n`;
      md += `\n**Lens:** "${f["lens_quote"] ?? ""}" — *${f["lens_citation"] ?? ""}*\n`;
      break;
    }
    case "transition": {
      md += `\n*${f["prose"] ?? ""}*\n`;
      break;
    }
    case "verb-echo": {
      md += `\n**${f["verb_1"] ?? ""}** · **${f["verb_2"] ?? ""}** · **${f["verb_3"] ?? ""}**\n`;
      break;
    }
    case "thesis-reveal": {
      md += `\n*Thesis*\n`;
      md += quoteBlock(f["thesis"] ?? "");
      break;
    }
    case "research-trajectory": {
      if (f["eyebrow"]) md += `\n*${f["eyebrow"]}*\n`;
      md += `\n**${f["author"] ?? ""}** — *${f["work_title"] ?? ""}*\n`;
      md += quoteBlock(f["quote"] ?? "", f["citation"]);
      break;
    }
    case "works-cited-entry": {
      md += `\n*Works Cited (full list on slide)*\n`;
      const entries = (f["entries"] ?? "").split("\n").filter((e) => e.trim());
      md += "\n";
      for (const e of entries) md += `- ${e}\n`;
      break;
    }
    default:
      md += `\n*[no preview for type ${slot.type}]*\n`;
  }

  // ORIENT / CLOSE-READ from source fields
  if (f["setup"]) md += block("Setup (orient the room)", f["setup"]);
  if (f["analysis"]) md += block("Close-read", f["analysis"]);

  // TALKING POINTS authored per slot
  const notes = DELIVERY_NOTES[slot.id];
  if (notes && notes.length) {
    md += `\n**Talking points:**\n\n${bullets(notes)}\n`;
  }

  return md;
}

function build() {
  const slots = loadAllSlots();
  const filtered = slots.filter((s) => !SKIP_SLOTS.has(s.id));

  let md = `# Presentation Playbook\n\n`;
  md += `*On Earth We're Briefly Gorgeous — visibility, counter-story, and the construction of self.*\n\n`;
  md += `Samuel Gerungan · ENGL-1BH Literary Analysis · 2026-06-02 · ${filtered.length} slides\n\n`;
  md += `This document is the presenter's companion to \`presentation-backup.pptx\`. View on tablet during delivery. Each section shows what is on the corresponding slide and what to say while it is up.\n\n`;
  md += `**Three earned cinematic moments to hold for:** the verdict cut in CI 1 (\`ch1-verdict\`), the deemed-and-verge pair in CI 2 (\`ch2-deemed\` + \`ch2-verge\`), and the parataxis hinge in CI 3 (\`ch3-parataxis\`). Plus the thesis-reveal at the end. On each of these, slow down, let the line land, and do not advance until the silence breaks.\n`;

  let n = 1;
  for (const slot of filtered) {
    md += renderSlot(slot, n);
    n++;
  }

  md += `\n---\n\n*End of playbook. Total rendered slides: ${filtered.length}.*\n`;

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, md, "utf-8");
  console.log(`Wrote playbook with ${filtered.length} slides to ${OUTPUT}`);
}

build();
