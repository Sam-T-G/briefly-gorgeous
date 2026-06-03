import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import "../animation/ease.js";

void DrawSVGPlugin;

const SVG_NS = "http://www.w3.org/2000/svg";

// Each handwritten word is a sequence of pen-strokes (sub-paths) drawn in order.
// Designed loose, not calligraphic — small wobbles read as a real hand.
type ScriptGlyph = {
  viewBox: string;
  strokeWidth: number;
  paths: string[];
  // per-path duration in seconds; sub-paths are staggered by ~70% of their duration
  durations: number[];
};

// "nhớ" — Vietnamese reclaimed word from the closing thesis.
// Three logical strokes: the connected n-h-ơ body, the ơ horn, the sắc tone.
const NHO: ScriptGlyph = {
  viewBox: "0 0 150 90",
  strokeWidth: 2.1,
  paths: [
    // n: down-stem, arch over to second leg
    "M 8,72 C 8,58 8,38 9,32 C 11,22 18,20 24,26 C 30,32 30,52 32,72",
    // h: tall ascender with subtle loop, then arch to second leg
    "M 40,74 C 40,60 42,30 42,14 C 42,9 46,7 49,9 C 52,11 52,16 50,22 C 48,30 46,42 48,46 C 50,38 56,30 64,30 C 72,30 78,40 80,74",
    // ơ body: oval, leaving the connector subtle
    "M 124,52 C 124,38 116,30 106,30 C 96,30 90,38 90,52 C 90,66 96,72 106,72 C 116,72 124,66 124,52",
    // ơ horn: small flag at top-right of o
    "M 122,30 C 126,24 130,22 132,24 C 130,28 126,32 122,34",
    // sắc tone: acute slant above
    "M 108,12 L 122,4"
  ],
  durations: [0.95, 1.25, 0.85, 0.5, 0.35]
};

// "for Trevor —" — marginal dedication beside the love-and-harm slot.
// One pen-stroke per letter, ending with an em-dash flick.
const FOR_TREVOR: ScriptGlyph = {
  viewBox: "0 0 250 70",
  strokeWidth: 1.8,
  paths: [
    // f: top curl, descending stem
    "M 14,18 C 14,10 22,6 26,10 C 24,14 18,16 14,18 L 14,58",
    // f crossbar
    "M 6,32 L 22,30",
    // o: oval
    "M 30,40 C 30,32 36,28 42,30 C 48,32 50,40 46,46 C 42,52 32,50 30,42 Z",
    // r: hook + tail
    "M 56,32 C 56,28 58,26 60,28 L 60,54 C 60,56 62,58 66,56",
    // T vertical
    "M 86,12 L 86,58",
    // T crossbar
    "M 76,14 L 96,12",
    // r: hook + tail
    "M 102,30 C 102,26 104,24 106,26 L 106,52 C 106,54 108,56 112,54",
    // e: loop with horizontal crossbar
    "M 118,40 C 118,32 124,28 130,30 C 134,32 134,38 128,40 L 118,40 C 118,48 124,52 132,50",
    // v: down and up
    "M 138,30 L 145,54 L 152,30",
    // o: oval
    "M 158,40 C 158,32 164,28 170,30 C 176,32 178,40 174,46 C 170,52 160,50 158,42 Z",
    // r: hook + tail
    "M 184,30 C 184,26 186,24 188,26 L 188,52 C 188,54 190,56 194,54",
    // em-dash flick
    "M 204,40 L 232,38"
  ],
  durations: [0.55, 0.25, 0.45, 0.4, 0.5, 0.25, 0.4, 0.55, 0.45, 0.45, 0.4, 0.45]
};

export function installHandwriting(): void {
  installNhoSignature();
  installTrevorMarginalia();
}

function installNhoSignature(): void {
  const thesisSlot = document.getElementById("closing-thesis");
  if (!thesisSlot) return;
  if (thesisSlot.querySelector(".handwriting-nho")) return;

  // The closing-cinematic builds thesis as a trio of clause blocks.
  // Attach "nhớ" to the CHALLENGE clause — the one naming reclaimed language.
  const challengeClause = thesisSlot.querySelector<HTMLElement>(
    '.thesis-clause-block[data-verb="CHALLENGE"]'
  );
  const host =
    challengeClause ?? thesisSlot.querySelector<HTMLElement>(".slot-inner") ?? thesisSlot;

  const overlay = buildGlyphOverlay(NHO, "handwriting-nho");
  host.appendChild(overlay);

  scheduleDrawOnIntersect(overlay, NHO, { delay: 1.4 });
}

function installTrevorMarginalia(): void {
  const slot = document.getElementById("ch2-verge");
  if (!slot) return;
  if (slot.querySelector(".handwriting-trevor")) return;

  const inner = slot.querySelector<HTMLElement>(".slot-inner") ?? slot;
  const overlay = buildGlyphOverlay(FOR_TREVOR, "handwriting-trevor");
  inner.appendChild(overlay);

  scheduleDrawOnIntersect(overlay, FOR_TREVOR, { delay: 1.1 });
}

function buildGlyphOverlay(glyph: ScriptGlyph, className: string): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = `handwriting ${className}`;
  wrap.setAttribute("aria-hidden", "true");

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", glyph.viewBox);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.classList.add("handwriting-svg");

  for (const d of glyph.paths) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke-width", String(glyph.strokeWidth));
    path.classList.add("handwriting-stroke");
    svg.appendChild(path);
  }
  wrap.appendChild(svg);
  return wrap;
}

function scheduleDrawOnIntersect(
  host: HTMLElement,
  glyph: ScriptGlyph,
  opts: { delay: number }
): void {
  const strokes = host.querySelectorAll<SVGPathElement>(".handwriting-stroke");
  if (strokes.length === 0) return;
  gsap.set(strokes, { drawSVG: "0% 0%" });
  gsap.set(host, { opacity: 0 });

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        runDraw(host, strokes, glyph, opts.delay);
      }
    },
    { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
  );
  observer.observe(host);
}

function runDraw(
  host: HTMLElement,
  strokes: NodeListOf<SVGPathElement>,
  glyph: ScriptGlyph,
  delay: number
): void {
  const tl = gsap.timeline({ delay });
  tl.to(host, { opacity: 1, duration: 0.35, ease: "power1.out" }, 0);

  let cursor = 0;
  strokes.forEach((path, i) => {
    const dur = glyph.durations[i] ?? 0.6;
    tl.to(
      path,
      { drawSVG: "0% 100%", duration: dur, ease: "power1.inOut" },
      cursor
    );
    // Next stroke starts at ~70% through this one — pen lifts feel natural
    cursor += dur * 0.7;
  });
}
