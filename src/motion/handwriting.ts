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

// Two-line definition that appears below the Chapter 3 / Parataxis title,
// written like a margin gloss the speaker adds in the moment.
const PARATAXIS_LINE_1: ScriptWord = {
  text: "clauses set side by side,",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 560 80",
  fontSize: 52,
  yBaseline: 56,
  xStart: 6,
  duration: 2.1
};

const PARATAXIS_LINE_2: ScriptWord = {
  text: "no clause ruling another",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 560 80",
  fontSize: 52,
  yBaseline: 56,
  xStart: 6,
  duration: 2.0
};

// Twenty-four margin annotations scattered across ch3-close, written one at a
// time on a momentum curve (slow open, dense fast middle, decelerating final
// beats) so the slot reads as a notebook page filling up before the thesis.
// Sizes tier by gravitas: HEAVY motifs (Dear Ma, Lan, deemed/beloved binary,
// tenderness) are largest; small background notes (place names, objects) sit
// in lower weight so the eye reads hierarchy as it fills.
const CLOSE_DEAR_MA: ScriptWord = {
  text: "Dear Ma,",
  fontFamily: HAND_STACK,
  fontWeight: 600,
  viewBox: "0 0 300 100",
  fontSize: 72,
  yBaseline: 72,
  xStart: 8,
  duration: 0.55
};
const CLOSE_LITTLE_DOG: ScriptWord = {
  text: "Little Dog",
  fontFamily: HAND_STACK,
  fontWeight: 600,
  viewBox: "0 0 300 90",
  fontSize: 60,
  yBaseline: 64,
  xStart: 6,
  duration: 0.42
};
const CLOSE_LAN: ScriptWord = {
  text: "Lan",
  fontFamily: HAND_STACK,
  fontWeight: 700,
  viewBox: "0 0 160 110",
  fontSize: 84,
  yBaseline: 86,
  xStart: 8,
  duration: 0.4
};
const CLOSE_MONARCHS: ScriptWord = {
  text: "monarchs",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 260 80",
  fontSize: 52,
  yBaseline: 58,
  xStart: 6,
  duration: 0.34
};
const CLOSE_HARTFORD: ScriptWord = {
  text: "Hartford",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 240 80",
  fontSize: 50,
  yBaseline: 56,
  xStart: 6,
  duration: 0.32
};
const CLOSE_I_MISS_YOU: ScriptWord = {
  text: "I miss you",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 280 80",
  fontSize: 52,
  yBaseline: 58,
  xStart: 6,
  duration: 0.36
};
const CLOSE_US: ScriptWord = {
  text: "us",
  fontFamily: HAND_STACK,
  fontWeight: 700,
  viewBox: "0 0 100 70",
  fontSize: 46,
  yBaseline: 52,
  xStart: 6,
  duration: 0.22
};
const CLOSE_REMEMBER: ScriptWord = {
  text: "remember",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 280 80",
  fontSize: 52,
  yBaseline: 58,
  xStart: 6,
  duration: 0.34
};
const CLOSE_STILL_HERE: ScriptWord = {
  text: "still here",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 260 80",
  fontSize: 52,
  yBaseline: 58,
  xStart: 6,
  duration: 0.36
};
const CLOSE_AGAIN: ScriptWord = {
  text: "again",
  fontFamily: HAND_STACK,
  fontWeight: 600,
  viewBox: "0 0 200 90",
  fontSize: 64,
  yBaseline: 66,
  xStart: 8,
  duration: 0.42
};
const CLOSE_DEEMED: ScriptWord = {
  text: "deemed",
  fontFamily: HAND_STACK,
  fontWeight: 700,
  viewBox: "0 0 260 100",
  fontSize: 78,
  yBaseline: 76,
  xStart: 8,
  duration: 0.48
};
const CLOSE_BELOVED: ScriptWord = {
  text: "beloved",
  fontFamily: HAND_STACK,
  fontWeight: 700,
  viewBox: "0 0 280 100",
  fontSize: 78,
  yBaseline: 76,
  xStart: 8,
  duration: 0.5
};
const CLOSE_TENDERNESS: ScriptWord = {
  text: "tenderness",
  fontFamily: HAND_STACK,
  fontWeight: 600,
  viewBox: "0 0 360 90",
  fontSize: 70,
  yBaseline: 68,
  xStart: 8,
  duration: 0.55
};
const CLOSE_BEING_HUNTED: ScriptWord = {
  text: "being hunted",
  fontFamily: HAND_STACK,
  fontWeight: 600,
  viewBox: "0 0 340 80",
  fontSize: 58,
  yBaseline: 60,
  xStart: 6,
  duration: 0.46
};
const CLOSE_YEAR_MONKEY: ScriptWord = {
  text: "Year of the Monkey",
  fontFamily: HAND_STACK,
  fontWeight: 600,
  viewBox: "0 0 480 80",
  fontSize: 54,
  yBaseline: 58,
  xStart: 6,
  duration: 0.55
};
const CLOSE_VERGE: ScriptWord = {
  text: "the verge",
  fontFamily: HAND_STACK,
  fontWeight: 600,
  viewBox: "0 0 280 90",
  fontSize: 62,
  yBaseline: 64,
  xStart: 6,
  duration: 0.4
};
const CLOSE_MEMORY: ScriptWord = {
  text: "memory",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 240 80",
  fontSize: 54,
  yBaseline: 58,
  xStart: 6,
  duration: 0.32
};
const CLOSE_BESIDE: ScriptWord = {
  text: "beside",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 200 80",
  fontSize: 54,
  yBaseline: 58,
  xStart: 6,
  duration: 0.3
};
const CLOSE_INHERIT: ScriptWord = {
  text: "inherit",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 200 80",
  fontSize: 52,
  yBaseline: 58,
  xStart: 6,
  duration: 0.3
};
const CLOSE_BROKEN_EN: ScriptWord = {
  text: "broken English",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 360 80",
  fontSize: 50,
  yBaseline: 58,
  xStart: 6,
  duration: 0.4
};
const CLOSE_GREEN_APPLE: ScriptWord = {
  text: "Green Apple",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 280 70",
  fontSize: 42,
  yBaseline: 50,
  xStart: 6,
  duration: 0.3
};
const CLOSE_BLUE_SHAWL: ScriptWord = {
  text: "blue shawl",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 260 70",
  fontSize: 42,
  yBaseline: 50,
  xStart: 6,
  duration: 0.28
};
const CLOSE_SHIPWRECK: ScriptWord = {
  text: "shipwreck",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 260 70",
  fontSize: 44,
  yBaseline: 52,
  xStart: 6,
  duration: 0.3
};
const CLOSE_SAIGON: ScriptWord = {
  text: "Saigon",
  fontFamily: HAND_STACK,
  fontWeight: 500,
  viewBox: "0 0 200 70",
  fontSize: 42,
  yBaseline: 50,
  xStart: 6,
  duration: 0.26
};

type HandwritingTarget = {
  slotId: string;
  className: string;
  word: ScriptWord;
  delay: number;
  // optional child selector inside the slot to host the overlay
  hostSelector?: string;
};

// Arc across the talk:
//  - lets begin again         (opening-landing)      letter-restart phrase
//  - Dear Ma                  (opening-frame)        establishes the letter form
//  - Má                       (ch1-verdict)          mother named at the verdict
//  - for Trevor —             (ch2-verge)            silent second addressee
//  - parataxis definition     (ch3-open)             two-line margin gloss under the chapter title
//  - ours                     (ch3-fragment-stream)  speaker claiming kinship in bilingual line
//  - ch3-close cascade        (ch3-close)            24 motifs filling the page on a momentum curve
//  - nhớ                      (closing-thesis)       reclaimed word as proof of thesis
//
// Delay values on ch3-close are tuned so each snippet starts ~when the
// previous one finishes (slow at the start, tight through the middle,
// decelerating at the end). Adjust the duration field on the word, not
// these delays, if you retime a single snippet.
const TARGETS: HandwritingTarget[] = [
  { slotId: "opening-landing", className: "handwriting-begin", word: LETS_BEGIN_AGAIN, delay: 0.4 },
  { slotId: "opening-frame", className: "handwriting-dearma", word: DEAR_MA, delay: 0.9 },
  { slotId: "ch1-verdict", className: "handwriting-ma", word: MA, delay: 2.4 },
  { slotId: "ch2-verge", className: "handwriting-trevor", word: FOR_TREVOR, delay: 1.1 },
  { slotId: "ch3-open", className: "handwriting-parataxis-1", word: PARATAXIS_LINE_1, delay: 0.9 },
  { slotId: "ch3-open", className: "handwriting-parataxis-2", word: PARATAXIS_LINE_2, delay: 3.3 },
  { slotId: "ch3-fragment-stream", className: "handwriting-ours", word: OURS, delay: 1.8 },
  { slotId: "ch3-close", className: "handwriting-close-dear-ma", word: CLOSE_DEAR_MA, delay: 0.4 },
  { slotId: "ch3-close", className: "handwriting-close-little-dog", word: CLOSE_LITTLE_DOG, delay: 0.95 },
  { slotId: "ch3-close", className: "handwriting-close-lan", word: CLOSE_LAN, delay: 1.4 },
  { slotId: "ch3-close", className: "handwriting-close-memory", word: CLOSE_MEMORY, delay: 1.78 },
  { slotId: "ch3-close", className: "handwriting-close-monarchs", word: CLOSE_MONARCHS, delay: 2.05 },
  { slotId: "ch3-close", className: "handwriting-close-hartford", word: CLOSE_HARTFORD, delay: 2.28 },
  { slotId: "ch3-close", className: "handwriting-close-beside", word: CLOSE_BESIDE, delay: 2.48 },
  { slotId: "ch3-close", className: "handwriting-close-verge", word: CLOSE_VERGE, delay: 2.66 },
  { slotId: "ch3-close", className: "handwriting-close-miss", word: CLOSE_I_MISS_YOU, delay: 2.85 },
  { slotId: "ch3-close", className: "handwriting-close-blue-shawl", word: CLOSE_BLUE_SHAWL, delay: 3.02 },
  { slotId: "ch3-close", className: "handwriting-close-inherit", word: CLOSE_INHERIT, delay: 3.18 },
  { slotId: "ch3-close", className: "handwriting-close-broken-en", word: CLOSE_BROKEN_EN, delay: 3.34 },
  { slotId: "ch3-close", className: "handwriting-close-us", word: CLOSE_US, delay: 3.5 },
  { slotId: "ch3-close", className: "handwriting-close-remember", word: CLOSE_REMEMBER, delay: 3.66 },
  { slotId: "ch3-close", className: "handwriting-close-saigon", word: CLOSE_SAIGON, delay: 3.84 },
  { slotId: "ch3-close", className: "handwriting-close-being-hunted", word: CLOSE_BEING_HUNTED, delay: 4.03 },
  { slotId: "ch3-close", className: "handwriting-close-year-monkey", word: CLOSE_YEAR_MONKEY, delay: 4.24 },
  { slotId: "ch3-close", className: "handwriting-close-shipwreck", word: CLOSE_SHIPWRECK, delay: 4.48 },
  { slotId: "ch3-close", className: "handwriting-close-green-apple", word: CLOSE_GREEN_APPLE, delay: 4.7 },
  { slotId: "ch3-close", className: "handwriting-close-deemed", word: CLOSE_DEEMED, delay: 4.95 },
  { slotId: "ch3-close", className: "handwriting-close-beloved", word: CLOSE_BELOVED, delay: 5.28 },
  { slotId: "ch3-close", className: "handwriting-close-still", word: CLOSE_STILL_HERE, delay: 5.65 },
  { slotId: "ch3-close", className: "handwriting-close-tenderness", word: CLOSE_TENDERNESS, delay: 6.05 },
  { slotId: "ch3-close", className: "handwriting-close-again", word: CLOSE_AGAIN, delay: 6.55 },
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
