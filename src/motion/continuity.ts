import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import "../animation/ease.js";

void DrawSVGPlugin;

const SVG_NS = "http://www.w3.org/2000/svg";
const MOTIF_PATTERN = /\b(seen|hunted|deemed|reads?|reading)\b/gi;
const PROSE_SELECTORS = [
  ".analysis",
  ".setup",
  ".info-closer",
  ".info-bullets li",
  ".transition-paragraph"
];

type UnderlineVariant = {
  viewBox: string;
  d: string;
  strokeWidth: number;
  shape: "wavery" | "swoosh" | "straight" | "lyrical";
};

// Variant pools per motif key. Cycled in order on each occurrence,
// so repeated motif words land with different hand-drawn underlines.
// Confident, casual underlines — balanced endpoints, small flaws in the middle.
// Start and end y-values stay within ~0.4 of each other so nothing slopes overall.
const UNDERLINE_VARIANTS: Record<string, UnderlineVariant[]> = {
  // seen — gentle waves, steady horizontal trajectory
  seen: [
    { viewBox: "0 0 100 6", d: "M0,3 C18,2.4 32,3.6 50,3 C68,2.4 84,3.6 100,3", strokeWidth: 1.3, shape: "wavery" },
    { viewBox: "0 0 100 6", d: "M0,3.1 C14,2.5 28,3.6 44,3 C60,2.4 76,3.6 92,3 C96,2.9 99,3.1 100,3", strokeWidth: 1.2, shape: "wavery" },
    { viewBox: "0 0 100 6", d: "M0,3 C20,3.7 38,2.5 56,3.2 C72,3.8 88,2.6 100,3", strokeWidth: 1.3, shape: "wavery" }
  ],
  // hunted — casual energetic flicks, still horizontal overall
  hunted: [
    { viewBox: "0 0 100 8", d: "M0,4 C20,3 42,5 64,3.6 C80,2.8 92,4.4 100,4", strokeWidth: 1.7, shape: "swoosh" },
    { viewBox: "0 0 100 8", d: "M0,4 C22,5.2 44,3 64,4.4 C80,5 92,3.4 100,4", strokeWidth: 1.8, shape: "swoosh" },
    { viewBox: "0 0 100 8", d: "M0,4 C14,5.4 32,3 52,4 C70,5 86,2.8 100,3.8", strokeWidth: 1.8, shape: "swoosh" }
  ],
  // deemed — near-straight, tiny human wobble
  deemed: [
    { viewBox: "0 0 100 4", d: "M0,2 C25,1.85 50,2.15 75,1.9 L100,2", strokeWidth: 1.6, shape: "straight" },
    { viewBox: "0 0 100 4", d: "M0,2 L42,1.95 C50,1.8 58,2.1 64,1.95 L100,2", strokeWidth: 1.6, shape: "straight" }
  ],
  // read / reads / reading — lyrical s-curves, balanced ends
  read: [
    { viewBox: "0 0 100 6", d: "M0,3 C25,1.8 48,4.2 70,2.6 C85,1.8 92,3.2 100,3", strokeWidth: 1.4, shape: "lyrical" },
    { viewBox: "0 0 100 6", d: "M0,3 C18,1.6 34,4.4 52,3 C70,1.6 84,4.4 100,3", strokeWidth: 1.3, shape: "lyrical" }
  ]
};

const motifCounters: Record<string, number> = {};

function getMotifKey(word: string): string {
  const lc = word.toLowerCase();
  if (lc === "reads" || lc === "reading") return "read";
  return lc;
}

export function installContinuityThreads(): void {
  installMotifThreads();
}

function installMotifThreads(): void {
  const slots = document.querySelectorAll<HTMLElement>(".slot");
  for (const slot of slots) {
    for (const sel of PROSE_SELECTORS) {
      const nodes = slot.querySelectorAll<HTMLElement>(sel);
      nodes.forEach(wrapMotifWords);
    }
  }

  const threads = document.querySelectorAll<SVGPathElement>(".motif-thread-underline-path");
  if (threads.length === 0) return;
  gsap.set(threads, { drawSVG: "0% 0%" });

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const path = entry.target as SVGPathElement;
        observer.unobserve(path);
        gsap.to(path, {
          drawSVG: "0% 100%",
          duration: 0.75,
          delay: 0.3,
          ease: "power2.inOut"
        });
      }
    },
    { threshold: 0.45, rootMargin: "0px 0px -8% 0px" }
  );

  threads.forEach((p) => observer.observe(p));
}

function wrapMotifWords(el: HTMLElement): void {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const parent = (node as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest(".motif-thread")) return NodeFilter.FILTER_REJECT;
      MOTIF_PATTERN.lastIndex = 0;
      return MOTIF_PATTERN.test(node.nodeValue ?? "")
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    }
  });
  const targets: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) targets.push(n as Text);

  for (const text of targets) {
    const raw = text.nodeValue ?? "";
    MOTIF_PATTERN.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let lastIdx = 0;
    let m: RegExpExecArray | null;
    while ((m = MOTIF_PATTERN.exec(raw)) !== null) {
      if (m.index > lastIdx) {
        frag.appendChild(document.createTextNode(raw.slice(lastIdx, m.index)));
      }
      frag.appendChild(buildMotifSpan(m[0]));
      lastIdx = m.index + m[0].length;
    }
    if (lastIdx < raw.length) {
      frag.appendChild(document.createTextNode(raw.slice(lastIdx)));
    }
    text.replaceWith(frag);
  }
}

function buildMotifSpan(word: string): HTMLElement {
  const key = getMotifKey(word);
  const variants = UNDERLINE_VARIANTS[key] ?? UNDERLINE_VARIANTS["seen"]!;
  const idx = (motifCounters[key] ?? 0) % variants.length;
  motifCounters[key] = (motifCounters[key] ?? 0) + 1;
  const variant = variants[idx]!;

  const wrap = document.createElement("span");
  wrap.className = "motif-thread";
  wrap.dataset["motif"] = key;
  wrap.dataset["shape"] = variant.shape;

  const wordSpan = document.createElement("span");
  wordSpan.className = "motif-thread-word";
  wordSpan.textContent = word;
  wrap.appendChild(wordSpan);

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", variant.viewBox);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.classList.add("motif-thread-underline");

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", variant.d);
  path.setAttribute("stroke-width", String(variant.strokeWidth));
  path.setAttribute("class", "motif-thread-underline-path");
  svg.appendChild(path);
  wrap.appendChild(svg);

  return wrap;
}
