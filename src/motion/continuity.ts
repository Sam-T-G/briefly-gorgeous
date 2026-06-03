import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import "../animation/ease.js";

void DrawSVGPlugin;
void ScrollTrigger;

const SVG_NS = "http://www.w3.org/2000/svg";
const MOTIF_PATTERN = /\b(seen|hunted|deemed|reads?|reading)\b/gi;
const PROSE_SELECTORS = [
  ".analysis",
  ".setup",
  ".info-closer",
  ".info-bullets li",
  ".transition-paragraph"
];

export function installContinuityThreads(): void {
  installLetterSpine();
  installMotifThreads();
}

function installLetterSpine(): void {
  if (document.querySelector(".letter-spine")) return;

  const spine = document.createElement("div");
  spine.className = "letter-spine";
  spine.setAttribute("aria-hidden", "true");

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 2 1000");
  svg.setAttribute("preserveAspectRatio", "none");

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", "M1,0 L1,1000");
  path.setAttribute("class", "letter-spine-path");
  svg.appendChild(path);
  spine.appendChild(svg);
  document.body.appendChild(spine);

  gsap.set(path, { drawSVG: "0% 0%" });
  gsap.to(path, {
    drawSVG: "0% 100%",
    ease: "none",
    scrollTrigger: {
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6
    }
  });
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
  const wrap = document.createElement("span");
  wrap.className = "motif-thread";
  wrap.dataset["motif"] = word.toLowerCase();

  const wordSpan = document.createElement("span");
  wordSpan.className = "motif-thread-word";
  wordSpan.textContent = word;
  wrap.appendChild(wordSpan);

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 100 4");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.classList.add("motif-thread-underline");

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", "M0,2 C18,0.4 36,3.4 58,1.9 C78,0.6 90,3 100,2");
  path.setAttribute("class", "motif-thread-underline-path");
  svg.appendChild(path);
  wrap.appendChild(svg);

  return wrap;
}
