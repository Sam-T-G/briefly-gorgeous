import type { Slot } from "../content/index.generated.js";

type SpanTarget = { className: string; text: string };

export function renderSlot(slot: Slot): HTMLElement {
  const section = document.createElement("section");
  section.id = slot.id;
  section.className = "slot";
  section.dataset["type"] = slot.type;
  section.dataset["status"] = slot.status;

  const inner = document.createElement("div");
  inner.className = "slot-inner";
  section.appendChild(inner);

  switch (slot.type) {
    case "chapter-title":
      renderChapterTitle(inner, slot);
      break;
    case "quote-block":
    case "quote-inline":
      if (slot.id === "ch1-recognition") {
        renderCrosscut(section, inner, slot);
      } else {
        renderQuote(inner, slot);
      }
      break;
    case "bilingual-pair":
      renderBilingual(inner, slot);
      break;
    case "lens-bundle":
      renderLensBundle(inner, slot);
      break;
    case "transition":
      renderTransition(inner, slot);
      break;
    case "info-card":
      renderInfoCard(inner, slot);
      break;
    case "thesis-reveal":
      renderThesis(inner, slot);
      break;
    case "works-cited-entry":
      renderWorksCited(inner, slot);
      break;
    case "placeholder":
      renderPlaceholder(inner, slot);
      break;
  }

  return section;
}

function renderChapterTitle(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "chapter-title" }>
): void {
  if (slot.id === "opening-landing") {
    const eyebrow = document.createElement("p");
    eyebrow.className = "chapter-title-eyebrow";
    eyebrow.textContent = "ENGL-1BH · LA#3 · presentation";
    inner.appendChild(eyebrow);
  }
  const label = document.createElement("h1");
  label.className = "chapter-title-label";
  label.textContent = slot.label;
  inner.appendChild(label);
  if (slot.subtitle) {
    const subtitle = document.createElement("p");
    subtitle.className = "chapter-title-subtitle";
    subtitle.textContent = slot.subtitle;
    inner.appendChild(subtitle);
  }
}

function renderQuote(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "quote-block" | "quote-inline" }>
): void {
  if (slot.setup) {
    const setup = document.createElement("p");
    setup.className = "setup";
    setup.textContent = slot.setup;
    inner.appendChild(setup);
  }
  const quote = document.createElement("blockquote");
  quote.className = "quote";
  quote.appendChild(buildQuoteText(slot.id, slot.quote));
  inner.appendChild(quote);

  const cite = document.createElement("cite");
  cite.className = "chrome-citation";
  cite.textContent = slot.citation;
  inner.appendChild(cite);

  const analysis = document.createElement("p");
  analysis.className = "analysis";
  analysis.textContent = slot.analysis;
  inner.appendChild(analysis);

  if (slot.id === "ch1-divider") {
    const rule = document.createElement("span");
    rule.className = "divider-rule";
    rule.setAttribute("aria-hidden", "true");
    inner.appendChild(rule);
  }
}

function buildQuoteText(slotId: string, raw: string): DocumentFragment {
  const target = quoteAccent(slotId, raw);
  const frag = document.createDocumentFragment();
  if (!target) {
    frag.appendChild(document.createTextNode(`"${raw}"`));
    return frag;
  }
  const idx = raw.indexOf(target.text);
  if (idx === -1) {
    frag.appendChild(document.createTextNode(`"${raw}"`));
    return frag;
  }
  frag.appendChild(document.createTextNode(`"${raw.slice(0, idx)}`));
  const span = document.createElement("span");
  span.className = target.className;
  const text = document.createElement("span");
  text.textContent = target.text;
  const underline = document.createElement("span");
  underline.className = target.className.startsWith("verdict")
    ? "verdict-underline"
    : "cinnamon-underline";
  underline.setAttribute("aria-hidden", "true");
  span.appendChild(text);
  span.appendChild(underline);
  frag.appendChild(span);
  frag.appendChild(document.createTextNode(`${raw.slice(idx + target.text.length)}"`));
  return frag;
}

function quoteAccent(slotId: string, raw: string): SpanTarget | null {
  if (slotId === "ch1-cinnamon" && raw.includes("errant cinnamon tint"))
    return { className: "cinnamon-target", text: "errant cinnamon tint" };
  if (slotId === "ch1-recognition" && raw.includes("fringed blond around the temples"))
    return { className: "cinnamon-target", text: "fringed blond around the temples" };
  if (slotId === "ch1-verdict" && raw.includes("He could be her father"))
    return { className: "verdict-target", text: "He could be her father" };
  return null;
}

function renderCrosscut(
  section: HTMLElement,
  inner: HTMLElement,
  slot: Extract<Slot, { type: "quote-block" | "quote-inline" }>
): void {
  section.classList.add("crosscut");

  const stage = document.createElement("div");
  stage.className = "crosscut-stage";

  const dinner = document.createElement("div");
  dinner.className = "crosscut-panel crosscut-panel-dinner";
  const dinnerEcho = document.createElement("p");
  dinnerEcho.className = "crosscut-echo";
  dinnerEcho.textContent = "the porcelain plate, the sunflower napkin";
  const dinnerNote = document.createElement("p");
  dinnerNote.className = "crosscut-note";
  dinnerNote.textContent = "the dinner";
  dinner.appendChild(dinnerNote);
  dinner.appendChild(dinnerEcho);

  const divider = document.createElement("span");
  divider.className = "crosscut-divider";
  divider.setAttribute("aria-hidden", "true");

  const checkpoint = document.createElement("div");
  checkpoint.className = "crosscut-panel crosscut-panel-checkpoint";
  const checkpointNote = document.createElement("p");
  checkpointNote.className = "crosscut-note";
  checkpointNote.textContent = "the checkpoint";
  checkpoint.appendChild(checkpointNote);
  renderQuote(checkpoint, slot);

  stage.appendChild(dinner);
  stage.appendChild(divider);
  stage.appendChild(checkpoint);

  inner.classList.add("crosscut-inner");
  inner.appendChild(stage);
}

function renderBilingual(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "bilingual-pair" }>
): void {
  if (slot.setup) {
    const setup = document.createElement("p");
    setup.className = "setup";
    setup.textContent = slot.setup;
    inner.appendChild(setup);
  }
  const en = document.createElement("blockquote");
  en.className = "quote quote-en";
  en.textContent = `"${slot.en}"`;
  inner.appendChild(en);
  const vi = document.createElement("blockquote");
  vi.className = "quote quote-vi";
  vi.lang = "vi";
  vi.textContent = slot.vi;
  inner.appendChild(vi);
  const cite = document.createElement("cite");
  cite.className = "chrome-citation";
  cite.textContent = slot.citation;
  inner.appendChild(cite);
  const analysis = document.createElement("p");
  analysis.className = "analysis";
  analysis.textContent = slot.analysis;
  inner.appendChild(analysis);
}

function renderLensBundle(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "lens-bundle" }>
): void {
  if (slot.setup) {
    const setup = document.createElement("p");
    setup.className = "setup";
    setup.textContent = slot.setup;
    inner.appendChild(setup);
  }
  inner.appendChild(buildLensItem("Methodology", slot.methodology));
  inner.appendChild(buildLensItem("Lens", slot.lens));
  const analysis = document.createElement("p");
  analysis.className = "analysis";
  analysis.textContent = slot.analysis;
  inner.appendChild(analysis);
}

function buildLensItem(label: string, item: { quote: string; citation: string }): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "lens-item";
  const labelEl = document.createElement("span");
  labelEl.className = "lens-label";
  labelEl.textContent = label;
  const quote = document.createElement("blockquote");
  quote.className = "quote";
  quote.textContent = `"${item.quote}"`;
  const cite = document.createElement("cite");
  cite.className = "chrome-citation";
  cite.textContent = item.citation;
  wrap.appendChild(labelEl);
  wrap.appendChild(quote);
  wrap.appendChild(cite);
  return wrap;
}

function renderTransition(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "transition" }>
): void {
  const paragraphs = slot.prose.split(/\n\n+/);
  for (const text of paragraphs) {
    const p = document.createElement("p");
    p.className = "transition-paragraph";
    p.textContent = text;
    inner.appendChild(p);
  }
}

function renderThesis(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "thesis-reveal" }>
): void {
  const p = document.createElement("p");
  p.className = "thesis";
  p.textContent = slot.thesis;
  inner.appendChild(p);
}

function renderWorksCited(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "works-cited-entry" }>
): void {
  const heading = document.createElement("h2");
  heading.className = "chapter-title-label";
  heading.textContent = "Works Cited";
  inner.appendChild(heading);
  const ul = document.createElement("ul");
  ul.className = "works-cited-list";
  for (const entry of slot.entries) {
    const li = document.createElement("li");
    li.textContent = entry;
    ul.appendChild(li);
  }
  inner.appendChild(ul);
}

function renderInfoCard(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "info-card" }>
): void {
  if (slot.eyebrow) {
    const eyebrow = document.createElement("p");
    eyebrow.className = "info-eyebrow";
    eyebrow.textContent = slot.eyebrow;
    inner.appendChild(eyebrow);
  }
  const title = document.createElement("h2");
  title.className = "info-title";
  title.textContent = slot.title;
  inner.appendChild(title);
  const ul = document.createElement("ul");
  ul.className = "info-bullets";
  slot.bullets.forEach((text, idx) => {
    const li = document.createElement("li");
    const glyph = pressuresGlyph(slot.id, idx);
    if (glyph) {
      li.classList.add("has-glyph");
      li.appendChild(glyph);
    }
    li.appendChild(document.createTextNode(text));
    ul.appendChild(li);
  });
  inner.appendChild(ul);
  if (slot.closer) {
    const closer = document.createElement("p");
    closer.className = "info-closer";
    closer.textContent = slot.closer;
    inner.appendChild(closer);
  }
  if (slot.id === "opening-world") {
    const figure = document.createElement("figure");
    figure.className = "opening-cover";
    const img = document.createElement("img");
    img.src = "https://images1.penguinrandomhouse.com/cover/9780525562047";
    img.alt = "Cover of On Earth We're Briefly Gorgeous, Penguin Press 2019";
    img.loading = "lazy";
    img.decoding = "async";
    figure.appendChild(img);
    inner.parentElement?.appendChild(figure);
  }
}

function renderPlaceholder(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "placeholder" }>
): void {
  const p = document.createElement("p");
  p.textContent = slot.note;
  inner.appendChild(p);
}

function pressuresGlyph(slotId: string, idx: number): SVGElement | null {
  if (slotId !== "opening-pressures") return null;
  if (idx === 0) return buildSvgGlyph("family", FAMILY_GLYPH_D);
  if (idx === 1) return buildSvgGlyph("trevor", TREVOR_GLYPH_D);
  if (idx === 2) return buildSvgGlyph("world", WORLD_GLYPH_D);
  return null;
}

function buildSvgGlyph(name: string, paths: string[]): SVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", `bullet-glyph bullet-glyph-${name}`);
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  for (const d of paths) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    svg.appendChild(path);
  }
  return svg;
}

const FAMILY_GLYPH_D = [
  "M3.5 6.5 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0 z",
  "M9.5 6.5 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0 z",
  "M2.5 12.5 c0 -2 1.2 -3.2 2.5 -3.2 s2.5 1.2 2.5 3.2",
  "M8.5 12.5 c0 -2 1.2 -3.2 2.5 -3.2 s2.5 1.2 2.5 3.2"
];

const TREVOR_GLYPH_D = [
  "M8 13.5 C4.5 11 1.5 8.5 1.5 5.5 C1.5 3.6 3 2.2 4.9 2.2 C6.2 2.2 7.2 2.9 8 4 C8.8 2.9 9.8 2.2 11.1 2.2 C13 2.2 14.5 3.6 14.5 5.5 C14.5 8.5 11.5 11 8 13.5 Z"
];

const WORLD_GLYPH_D = [
  "M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z",
  "M1.5 8h13",
  "M8 1.5c1.8 1.8 2.8 4.1 2.8 6.5S9.8 12.7 8 14.5",
  "M8 1.5c-1.8 1.8-2.8 4.1-2.8 6.5S6.2 12.7 8 14.5"
];
