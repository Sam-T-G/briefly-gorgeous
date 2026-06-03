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
  // viewBox sized to comfortably contain the rendered text
  viewBox: string;
  fontSize: number;
  // baseline y so the text sits properly inside the viewBox
  yBaseline: number;
  xStart: number;
  // write-in duration in seconds
  duration: number;
};

// Caveat + Dancing Script both ship a Vietnamese subset on Google Fonts;
// fallback to generic cursive if neither loads.
const HAND_STACK = '"Caveat", "Dancing Script", "Segoe Script", cursive';

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

export function installHandwriting(): void {
  installNhoSignature();
  installTrevorMarginalia();
}

function installNhoSignature(): void {
  const thesisSlot = document.getElementById("closing-thesis");
  if (!thesisSlot || thesisSlot.querySelector(".handwriting-nho")) return;
  const challengeClause = thesisSlot.querySelector<HTMLElement>(
    '.thesis-clause-block[data-verb="CHALLENGE"]'
  );
  const host =
    challengeClause ??
    thesisSlot.querySelector<HTMLElement>(".slot-inner") ??
    thesisSlot;

  const overlay = buildWordOverlay(NHO, "handwriting-nho");
  host.appendChild(overlay);
  scheduleRevealOnIntersect(overlay, NHO, { delay: 1.4 });
}

function installTrevorMarginalia(): void {
  const slot = document.getElementById("ch2-verge");
  if (!slot || slot.querySelector(".handwriting-trevor")) return;
  const inner = slot.querySelector<HTMLElement>(".slot-inner") ?? slot;
  const overlay = buildWordOverlay(FOR_TREVOR, "handwriting-trevor");
  inner.appendChild(overlay);
  scheduleRevealOnIntersect(overlay, FOR_TREVOR, { delay: 1.1 });
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
