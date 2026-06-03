import { gsap } from "gsap";
import "../animation/ease.js";

const SVG_NS = "http://www.w3.org/2000/svg";

// A handwritten word rendered with a real cursive font and revealed
// left-to-right by an animated SVG mask, so the letterforms read as
// accurate writing rather than hand-crafted squiggles.
type ScriptWord = {
  text: string;
  fontFamily: string;
  fontWeight: number;
  viewBox: string;
  fontSize: number;
  yBaseline: number;
  xStart: number;
  duration: number;
};

// Caveat + Dancing Script both ship a Vietnamese subset on Google Fonts;
// fallback to generic cursive if neither loads.
const HAND_STACK = '"Caveat", "Dancing Script", "Segoe Script", cursive';

const LETS_BEGIN_AGAIN: ScriptWord = {
  text: "lets begin again",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 440 80",
  fontSize: 56,
  yBaseline: 54,
  xStart: 6,
  duration: 2.4
};

const DEAR_MA: ScriptWord = {
  text: "Dear Ma",
  fontFamily: HAND_STACK,
  fontWeight: 600,
  viewBox: "0 0 280 100",
  fontSize: 78,
  yBaseline: 72,
  xStart: 8,
  duration: 1.7
};

const MA: ScriptWord = {
  text: "M\u00e1",
  fontFamily: HAND_STACK,
  fontWeight: 700,
  viewBox: "0 0 140 120",
  fontSize: 92,
  yBaseline: 96,
  xStart: 8,
  duration: 1.0
};

const FOR_TREVOR: ScriptWord = {
  text: "for Trevor \u2014",
  fontFamily: HAND_STACK,
  fontWeight: 600,
  viewBox: "0 0 420 90",
  fontSize: 68,
  yBaseline: 62,
  xStart: 6,
  duration: 2.2
};

const OURS: ScriptWord = {
  text: "ours",
  fontFamily: HAND_STACK,
  fontWeight: 600,
  viewBox: "0 0 180 80",
  fontSize: 60,
  yBaseline: 60,
  xStart: 6,
  duration: 1.0
};

const NHO: ScriptWord = {
  text: "nh\u1edb",
  fontFamily: HAND_STACK,
  fontWeight: 700,
  viewBox: "0 0 220 130",
  fontSize: 108,
  yBaseline: 100,
  xStart: 8,
  duration: 1.6
};

type HandwritingTarget = {
  slotId: string;
  className: string;
  word: ScriptWord;
  delay: number;
  // optional child selector inside the slot to host the overlay
  hostSelector?: string;
};

// Six-moment arc across the talk:
//  - lets begin again  (opening-landing)    Vuong's own letter-restart phrase
//  - Dear Ma           (opening-frame)      establishes the letter form
//  - Má                (ch1-verdict)        mother named at the verdict
//  - for Trevor —      (ch2-verge)          silent second addressee
//  - ours              (ch3-fragment-stream) speaker claiming kinship in bilingual line
//  - nhớ               (closing-thesis)     reclaimed word as proof of thesis
const TARGETS: HandwritingTarget[] = [
  { slotId: "opening-landing", className: "handwriting-begin", word: LETS_BEGIN_AGAIN, delay: 0.4 },
  { slotId: "opening-frame", className: "handwriting-dearma", word: DEAR_MA, delay: 0.9 },
  { slotId: "ch1-verdict", className: "handwriting-ma", word: MA, delay: 2.4 },
  { slotId: "ch2-verge", className: "handwriting-trevor", word: FOR_TREVOR, delay: 1.1 },
  { slotId: "ch3-fragment-stream", className: "handwriting-ours", word: OURS, delay: 1.8 },
  {
    slotId: "closing-thesis",
    className: "handwriting-nho",
    word: NHO,
    delay: 1.4,
    hostSelector: '.thesis-clause-block[data-verb="CHALLENGE"]'
  }
];

export function installHandwriting(): void {
  for (const target of TARGETS) {
    installOne(target);
  }
}

function installOne(target: HandwritingTarget): void {
  const slot = document.getElementById(target.slotId);
  if (!slot) return;
  if (slot.querySelector(`.${target.className}`)) return;

  let host: HTMLElement | null = null;
  if (target.hostSelector) {
    host = slot.querySelector<HTMLElement>(target.hostSelector);
  }
  if (!host) host = slot;

  const overlay = buildWordOverlay(target.word, target.className);
  host.appendChild(overlay);
  scheduleRevealOnIntersect(overlay, target.word, { delay: target.delay });
}

function buildWordOverlay(word: ScriptWord, className: string): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = `handwriting ${className}`;
  wrap.setAttribute("aria-hidden", "true");

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", word.viewBox);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.classList.add("handwriting-svg");

  const maskId = `hw-mask-${className}-${Math.random().toString(36).slice(2, 8)}`;
  const defs = document.createElementNS(SVG_NS, "defs");
  const mask = document.createElementNS(SVG_NS, "mask");
  mask.setAttribute("id", maskId);
  mask.setAttribute("maskUnits", "userSpaceOnUse");
  mask.setAttribute("maskContentUnits", "userSpaceOnUse");

  const vb = word.viewBox.split(/\s+/).map(Number);
  const vbW = vb[2] ?? 200;
  const vbH = vb[3] ?? 100;

  const maskRect = document.createElementNS(SVG_NS, "rect");
  maskRect.setAttribute("x", "0");
  maskRect.setAttribute("y", "0");
  maskRect.setAttribute("width", "0");
  maskRect.setAttribute("height", String(vbH));
  maskRect.setAttribute("fill", "white");
  maskRect.classList.add("handwriting-mask-rect");
  maskRect.dataset["fullWidth"] = String(vbW);
  mask.appendChild(maskRect);
  defs.appendChild(mask);
  svg.appendChild(defs);

  const text = document.createElementNS(SVG_NS, "text");
  text.setAttribute("x", String(word.xStart));
  text.setAttribute("y", String(word.yBaseline));
  text.setAttribute("font-family", word.fontFamily);
  text.setAttribute("font-size", String(word.fontSize));
  text.setAttribute("font-weight", String(word.fontWeight));
  text.setAttribute("mask", `url(#${maskId})`);
  text.classList.add("handwriting-text");
  text.textContent = word.text;
  svg.appendChild(text);

  wrap.appendChild(svg);
  return wrap;
}

function scheduleRevealOnIntersect(
  host: HTMLElement,
  word: ScriptWord,
  opts: { delay: number }
): void {
  const rect = host.querySelector<SVGRectElement>(".handwriting-mask-rect");
  if (!rect) return;
  const fullWidth = Number(rect.dataset["fullWidth"] ?? 200);

  gsap.set(host, { opacity: 0 });

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const tl = gsap.timeline({ delay: opts.delay });
        tl.to(host, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0);
        tl.to(
          rect,
          {
            attr: { width: fullWidth },
            duration: word.duration,
            ease: "power1.inOut"
          },
          0
        );
      }
    },
    { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
  );
  observer.observe(host);
}
