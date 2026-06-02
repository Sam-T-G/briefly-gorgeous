import { content, type Slot, type Landing } from "../content/index.generated.js";

type SpanTarget = { className: string; text: string };

const INLINE_ITALIC = /\*([^*\n]+)\*/g;

const assetUrl = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

function applyLanding(el: HTMLElement, landing: Landing | undefined): void {
  if (!landing) return;
  el.dataset["landingWeight"] = landing.weight;
  if (landing.splitAt) el.dataset["landingSplit"] = "true";
}

function splitQuoteHalves(raw: string, splitAt: string): [string, string] | null {
  const idx = raw.indexOf(splitAt);
  if (idx === -1) return null;
  const cut = idx + splitAt.length;
  const first = raw.slice(0, cut).trim();
  const second = raw.slice(cut).trim();
  if (!first || !second) return null;
  return [first, second];
}

function appendInline(parent: Node, text: string): void {
  let lastIndex = 0;
  INLINE_ITALIC.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = INLINE_ITALIC.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parent.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    }
    const em = document.createElement("em");
    em.textContent = match[1]!;
    parent.appendChild(em);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parent.appendChild(document.createTextNode(text.slice(lastIndex)));
  }
}

function setInline(el: HTMLElement, text: string): void {
  el.textContent = "";
  appendInline(el, text);
}

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
      renderQuote(inner, slot);
      break;
    case "bilingual-pair":
      renderBilingual(inner, slot);
      break;
    case "bilingual-stream":
      renderBilingualStream(inner, slot);
      break;
    case "paired-fragment":
      renderPairedFragment(inner, slot);
      break;
    case "lens-bundle":
      renderLensBundle(inner, slot);
      break;
    case "transition":
      renderTransition(inner, slot);
      break;
    case "quote-transition":
      renderQuoteTransition(inner, slot);
      break;
    case "info-card":
      renderInfoCard(inner, slot);
      break;
    case "thesis-reveal":
      renderThesis(inner, slot);
      break;
    case "verb-echo":
      renderVerbEcho(inner, slot);
      break;
    case "research-trajectory":
      renderResearchTrajectory(inner, slot);
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
    setInline(subtitle, slot.subtitle);
    inner.appendChild(subtitle);
  }

  if (slot.id === "opening-landing") {
    const portrait = document.createElement("figure");
    portrait.className = "vuong-portrait";
    const img = document.createElement("img");
    img.src = assetUrl("images/vuong-portrait-2019.jpg");
    img.alt = "Portrait of Ocean Vuong, 2019. Photograph by slowking4, CC BY-SA 2.0.";
    img.loading = "lazy";
    img.decoding = "async";
    const caption = document.createElement("figcaption");
    caption.className = "vuong-portrait-caption";
    caption.textContent = "Ocean Vuong · 2019 · slowking4, CC BY-SA 2.0";
    portrait.appendChild(img);
    portrait.appendChild(caption);
    inner.parentElement?.appendChild(portrait);
  }
}

function renderQuote(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "quote-block" | "quote-inline" }>
): void {
  if (slot.setup) {
    const setup = document.createElement("p");
    setup.className = "setup";
    setInline(setup, slot.setup);
    inner.appendChild(setup);
  }
  const quote = document.createElement("blockquote");
  quote.className = "quote";
  applyLanding(quote, slot.landing);

  const splitPair = slot.landing?.splitAt
    ? splitQuoteHalves(slot.quote, slot.landing.splitAt)
    : null;
  if (splitPair) {
    const [firstRaw, secondRaw] = splitPair;
    const firstHalf = document.createElement("span");
    firstHalf.className = "quote-half quote-half-first";
    firstHalf.appendChild(buildQuoteText(slot.id, firstRaw, { openOnly: true }));
    const secondHalf = document.createElement("span");
    secondHalf.className = "quote-half quote-half-second";
    secondHalf.appendChild(buildQuoteText(slot.id, secondRaw, { closeOnly: true }));
    quote.appendChild(firstHalf);
    quote.appendChild(secondHalf);
  } else {
    quote.appendChild(buildQuoteText(slot.id, slot.quote));
  }
  inner.appendChild(quote);

  const cite = document.createElement("cite");
  cite.className = "chrome-citation";
  cite.textContent = slot.citation;
  inner.appendChild(cite);

  const analysis = document.createElement("p");
  analysis.className = "analysis";
  setInline(analysis, slot.analysis);
  inner.appendChild(analysis);

  if (slot.type === "quote-block" && slot.pullQuote) {
    const aside = document.createElement("aside");
    aside.className = "pull-quote";
    const pullText = document.createElement("blockquote");
    pullText.className = "quote pull-quote-text";
    pullText.textContent = `"${slot.pullQuote.text}"`;
    applyLanding(pullText, slot.pullQuote.landing);
    const pullCite = document.createElement("cite");
    pullCite.className = "chrome-citation";
    pullCite.textContent = slot.pullQuote.citation;
    aside.appendChild(pullText);
    aside.appendChild(pullCite);
    inner.appendChild(aside);
  }

  if (slot.id === "ch1-verdict") {
    const wash = document.createElement("div");
    wash.className = "verdict-wash";
    wash.setAttribute("aria-hidden", "true");
    const display = document.createElement("p");
    display.className = "verdict-display";
    display.textContent = "He could be her father.";
    wash.appendChild(display);
    inner.parentElement?.appendChild(wash);
  }

  if (slot.id === "ch2-verge") {
    const deemed = content.slots.find(
      (s): s is Extract<Slot, { type: "quote-block" }> =>
        s.id === "ch2-deemed" && s.type === "quote-block"
    );
    if (deemed) {
      const pivot = document.createElement("div");
      pivot.className = "verge-pivot";
      pivot.setAttribute("aria-hidden", "true");

      pivot.appendChild(
        buildVergePanel("deemed", deemed.quote, deemed.citation, false)
      );
      pivot.appendChild(
        buildVergePanel("verge", slot.quote, slot.citation, true)
      );

      inner.parentElement?.appendChild(pivot);
    }
  }
}

function buildVergePanel(
  variant: "deemed" | "verge",
  raw: string,
  citation: string,
  marked: boolean
): HTMLElement {
  const panel = document.createElement("div");
  panel.className = `verge-panel verge-panel-${variant}`;
  const quote = document.createElement("blockquote");
  quote.className = "quote";
  if (marked) {
    quote.appendChild(buildVergeQuoteText(raw));
  } else {
    quote.textContent = `"${raw}"`;
  }
  const cite = document.createElement("cite");
  cite.className = "chrome-citation";
  cite.textContent = citation;
  panel.appendChild(quote);
  panel.appendChild(cite);
  return panel;
}

function buildVergeQuoteText(raw: string): DocumentFragment {
  const frag = document.createDocumentFragment();
  const seen1 = "first be seen";
  const seen2 = "to be seen";
  const hunted = "hunted";

  const i1 = raw.indexOf(seen1);
  const i2 = raw.indexOf(seen2, i1 + seen1.length);
  const i3 = raw.lastIndexOf(hunted);

  if (i1 < 0 || i2 < 0 || i3 < 0 || i2 <= i1 || i3 <= i2) {
    frag.appendChild(document.createTextNode(`"${raw}"`));
    return frag;
  }

  frag.appendChild(document.createTextNode(`"${raw.slice(0, i1)}`));
  const a = document.createElement("span");
  a.className = "verge-seen";
  a.textContent = seen1;
  frag.appendChild(a);
  frag.appendChild(document.createTextNode(raw.slice(i1 + seen1.length, i2)));
  const b = document.createElement("span");
  b.className = "verge-seen";
  b.textContent = seen2;
  frag.appendChild(b);
  frag.appendChild(document.createTextNode(raw.slice(i2 + seen2.length, i3)));
  const h = document.createElement("span");
  h.className = "verge-hunted";
  h.textContent = hunted;
  frag.appendChild(h);
  frag.appendChild(document.createTextNode(`${raw.slice(i3 + hunted.length)}"`));
  return frag;
}

function buildQuoteText(
  slotId: string,
  raw: string,
  opts: { openOnly?: boolean; closeOnly?: boolean } = {}
): DocumentFragment {
  const open = opts.closeOnly ? "" : `"`;
  const close = opts.openOnly ? "" : `"`;
  const target = quoteAccent(slotId, raw);
  const frag = document.createDocumentFragment();
  if (!target) {
    frag.appendChild(document.createTextNode(`${open}${raw}${close}`));
    return frag;
  }
  const idx = raw.indexOf(target.text);
  if (idx === -1) {
    frag.appendChild(document.createTextNode(`${open}${raw}${close}`));
    return frag;
  }
  frag.appendChild(document.createTextNode(`${open}${raw.slice(0, idx)}`));
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
  frag.appendChild(document.createTextNode(`${raw.slice(idx + target.text.length)}${close}`));
  return frag;
}

function quoteAccent(slotId: string, raw: string): SpanTarget | null {
  if (slotId === "ch1-verdict" && raw.includes("He could be her father"))
    return { className: "verdict-target", text: "He could be her father" };
  return null;
}

function renderBilingual(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "bilingual-pair" }>
): void {
  if (slot.setup) {
    const setup = document.createElement("p");
    setup.className = "setup";
    setInline(setup, slot.setup);
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
  setInline(analysis, slot.analysis);
  inner.appendChild(analysis);
}

function renderLensBundle(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "lens-bundle" }>
): void {
  if (slot.setup) {
    const setup = document.createElement("p");
    setup.className = "setup";
    setInline(setup, slot.setup);
    inner.appendChild(setup);
  }
  inner.appendChild(buildLensItem("Methodology", slot.methodology));
  inner.appendChild(buildLensItem("Lens", slot.lens));
  const analysis = document.createElement("p");
  analysis.className = "analysis";
  setInline(analysis, slot.analysis);
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
    setInline(p, text);
    inner.appendChild(p);
  }
}

function renderBilingualStream(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "bilingual-stream" }>
): void {
  if (slot.setup) {
    const setup = document.createElement("p");
    setup.className = "setup";
    setInline(setup, slot.setup);
    inner.appendChild(setup);
  }
  const stream = document.createElement("div");
  stream.className = "bilingual-stream";
  for (const pair of slot.pairs) {
    const item = document.createElement("div");
    item.className = "bilingual-stream-pair";
    const en = document.createElement("blockquote");
    en.className = "quote quote-en";
    en.textContent = `"${pair.en}"`;
    const vi = document.createElement("blockquote");
    vi.className = "quote quote-vi";
    vi.lang = "vi";
    vi.textContent = pair.vi;
    const cite = document.createElement("cite");
    cite.className = "chrome-citation";
    cite.textContent = pair.citation;
    item.appendChild(en);
    item.appendChild(vi);
    item.appendChild(cite);
    stream.appendChild(item);
  }
  inner.appendChild(stream);
  const analysis = document.createElement("p");
  analysis.className = "analysis";
  setInline(analysis, slot.analysis);
  inner.appendChild(analysis);
}

function renderPairedFragment(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "paired-fragment" }>
): void {
  if (slot.setup) {
    const setup = document.createElement("p");
    setup.className = "setup";
    setInline(setup, slot.setup);
    inner.appendChild(setup);
  }
  const pair = document.createElement("div");
  pair.className = "paired-fragment";
  const left = document.createElement("blockquote");
  left.className = "quote paired-fragment-left";
  left.textContent = `"${slot.left}"`;
  const right = document.createElement("blockquote");
  right.className = "quote paired-fragment-right";
  right.textContent = `"${slot.right}"`;
  pair.appendChild(left);
  pair.appendChild(right);
  inner.appendChild(pair);
  const cite = document.createElement("cite");
  cite.className = "chrome-citation";
  cite.textContent = slot.citation;
  inner.appendChild(cite);
  const analysis = document.createElement("p");
  analysis.className = "analysis";
  setInline(analysis, slot.analysis);
  inner.appendChild(analysis);
}

function renderQuoteTransition(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "quote-transition" }>
): void {
  if (slot.setup) {
    const setup = document.createElement("p");
    setup.className = "setup";
    setInline(setup, slot.setup);
    inner.appendChild(setup);
  }
  const quote = document.createElement("blockquote");
  quote.className = "quote quote-transition-quote";
  applyLanding(quote, slot.landing);
  quote.textContent = `"${slot.quote}"`;
  inner.appendChild(quote);
  const cite = document.createElement("cite");
  cite.className = "chrome-citation";
  cite.textContent = slot.citation;
  inner.appendChild(cite);
  const paragraphs = slot.prose.split(/\n\n+/);
  for (const text of paragraphs) {
    const p = document.createElement("p");
    p.className = "transition-paragraph";
    setInline(p, text);
    inner.appendChild(p);
  }
}

function renderVerbEcho(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "verb-echo" }>
): void {
  const list = document.createElement("ol");
  list.className = "verb-echo";
  for (const verb of slot.verbs) {
    const li = document.createElement("li");
    li.className = "verb-echo-item";
    li.textContent = verb;
    list.appendChild(li);
  }
  inner.appendChild(list);
}

function renderThesis(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "thesis-reveal" }>
): void {
  const p = document.createElement("p");
  p.className = "thesis";
  setInline(p, slot.thesis);
  inner.appendChild(p);
}

function renderResearchTrajectory(
  inner: HTMLElement,
  slot: Extract<Slot, { type: "research-trajectory" }>
): void {
  if (slot.eyebrow) {
    const eyebrow = document.createElement("p");
    eyebrow.className = "trajectory-eyebrow";
    eyebrow.textContent = slot.eyebrow;
    inner.appendChild(eyebrow);
  }
  const authorBlock = document.createElement("div");
  authorBlock.className = "trajectory-author-block";
  const author = document.createElement("p");
  author.className = "trajectory-author";
  author.textContent = slot.author;
  authorBlock.appendChild(author);
  if (slot.workTitle) {
    const title = document.createElement("p");
    title.className = "trajectory-work-title";
    setInline(title, slot.workTitle);
    authorBlock.appendChild(title);
  }
  inner.appendChild(authorBlock);

  const quote = document.createElement("blockquote");
  quote.className = "trajectory-quote";
  quote.textContent = `"${slot.quote}"`;
  inner.appendChild(quote);

  const cite = document.createElement("cite");
  cite.className = "chrome-citation trajectory-citation";
  cite.textContent = slot.citation;
  inner.appendChild(cite);

  const role = document.createElement("p");
  role.className = "trajectory-role";
  setInline(role, slot.role);
  inner.appendChild(role);
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
    appendInline(li, entry);
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
    setInline(eyebrow, slot.eyebrow);
    inner.appendChild(eyebrow);
  }
  const title = document.createElement("h2");
  title.className = "info-title";
  setInline(title, slot.title);
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
    appendInline(li, text);
    ul.appendChild(li);
  });
  inner.appendChild(ul);
  if (slot.closer) {
    const closer = document.createElement("p");
    closer.className = "info-closer";
    setInline(closer, slot.closer);
    inner.appendChild(closer);
  }
  if (slot.id === "opening-world") {
    const figure = document.createElement("figure");
    figure.className = "opening-cover";
    const img = document.createElement("img");
    img.src = assetUrl("images/penguin-cover-on-earth-2019.jpg");
    img.alt = "Cover of On Earth We're Briefly Gorgeous, Penguin Press 2019";
    img.loading = "lazy";
    img.decoding = "async";
    figure.appendChild(img);
    inner.parentElement?.appendChild(figure);
  }

  if (slot.id === "opening-pressures") {
    const figure = document.createElement("figure");
    figure.className = "opening-hine";
    const img = document.createElement("img");
    img.src = assetUrl("images/hine-hartford-tobacco-1917.jpg");
    img.alt =
      "Truck of tobacco workers leaving Post Office Square at 6:00 A.M. bound for the American Sumatra Tobacco Farm, Hartford, Connecticut. Lewis Hine, 1917.";
    img.loading = "lazy";
    img.decoding = "async";
    const caption = document.createElement("figcaption");
    caption.className = "opening-hine-caption";
    caption.textContent = "Lewis Hine, Hartford, 1917 · LoC NCLC";
    figure.appendChild(img);
    figure.appendChild(caption);
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
