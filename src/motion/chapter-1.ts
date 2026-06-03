import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import "../animation/ease.js";

void DrawSVGPlugin;

export function installChapter1Immersive(): void {
  if (!document.getElementById("ch1-open")) return;

  decorateOpenPanel();
  decorateMacaquePanel();
  decorateSoldierReadsPanel();
  decorateVerdictPanel();

  installOpenPanel();
  installMacaquePanel();
  installSoldierReadsPanel();
  installVerdictPanel();
  installLensPanel();

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

function decorateOpenPanel(): void {
  const slot = document.getElementById("ch1-open");
  if (!slot) return;
  const inner = slot.querySelector(".slot-inner");
  if (!inner) return;
  if (inner.querySelector(".ch1-open-horizon")) return;
  inner.appendChild(buildHorizon("ch1-open-horizon"));
}

function decorateMacaquePanel(): void {
  const slot = document.getElementById("ch1-macaque");
  if (!slot) return;
  const pullQuote = slot.querySelector(".pull-quote") as HTMLElement | null;
  if (!pullQuote) return;
  if (pullQuote.querySelector(".pull-quote-bloom")) return;
  const bloom = document.createElement("div");
  bloom.className = "pull-quote-bloom";
  bloom.setAttribute("aria-hidden", "true");
  pullQuote.insertBefore(bloom, pullQuote.firstChild);
}

function decorateSoldierReadsPanel(): void {
  const slot = document.getElementById("ch1-soldier-reads");
  if (!slot) return;
  const right = slot.querySelector(".paired-fragment-right") as HTMLElement | null;
  if (!right) return;
  if (right.querySelector(".blond-fragment")) return;

  const raw = right.textContent ?? "";
  const stripped = raw.replace(/^"|"$/g, "");
  right.textContent = "";
  right.appendChild(document.createTextNode(`"`));
  const wrap = document.createElement("span");
  wrap.className = "blond-fragment";
  wrap.textContent = stripped;
  const underline = document.createElement("span");
  underline.className = "blond-fragment-underline";
  underline.setAttribute("aria-hidden", "true");
  wrap.appendChild(underline);
  right.appendChild(wrap);
  right.appendChild(document.createTextNode(`"`));
}

function decorateVerdictPanel(): void {
  const slot = document.getElementById("ch1-verdict");
  if (!slot) return;
  const inner = slot.querySelector(".slot-inner") as HTMLElement | null;
  if (!inner) return;
  if (inner.querySelector(".verdict-afterbleed")) return;
  const bleed = document.createElement("div");
  bleed.className = "verdict-afterbleed";
  bleed.setAttribute("aria-hidden", "true");
  inner.appendChild(bleed);
}

function installOpenPanel(): void {
  const slot = document.getElementById("ch1-open");
  if (!slot) return;
  const eyebrow = slot.querySelector(".chapter-title-eyebrow") as HTMLElement | null;
  const label = slot.querySelector(".chapter-title-label") as HTMLElement | null;
  const subtitle = slot.querySelector(".chapter-title-subtitle") as HTMLElement | null;
  const horizon = slot.querySelector(".ch1-open-horizon line") as SVGElement | null;
  if (!label) return;

  let labelChars: Element[] = [];
  if (label) {
    const split = new SplitText(label, { type: "chars", charsClass: "split-char" });
    labelChars = split.chars;
    gsap.set(labelChars, { opacity: 0, y: 28, rotateX: -45 });
  }
  if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 8 });
  if (subtitle) gsap.set(subtitle, { opacity: 0, y: 18 });
  if (horizon) gsap.set(horizon, { drawSVG: "0%" });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 70%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (eyebrow) tl.to(eyebrow, { opacity: 0.7, y: 0, duration: 0.6, ease: "editorial" });
      tl.to(labelChars, {
        opacity: 1, y: 0, rotateX: 0,
        stagger: 0.04, duration: 0.7, ease: "power3.out"
      }, "-=0.3");
      if (horizon) tl.to(horizon, { drawSVG: "100%", duration: 0.7, ease: "power2.inOut" }, "-=0.45");
      if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "-=0.35");
    }
  });
}

function installMacaquePanel(): void {
  const slot = document.getElementById("ch1-macaque");
  if (!slot) return;
  const setup = slot.querySelector(".setup") as HTMLElement | null;
  const quote = slot.querySelector(".quote") as HTMLElement | null;
  const cite = slot.querySelector(".chrome-citation") as HTMLElement | null;
  const analysis = slot.querySelector(".analysis") as HTMLElement | null;
  const pullQuote = slot.querySelector(".pull-quote") as HTMLElement | null;
  const pullText = slot.querySelector(".pull-quote-text") as HTMLElement | null;
  const pullCite = slot.querySelector(".pull-quote .chrome-citation") as HTMLElement | null;
  const bloom = slot.querySelector(".pull-quote-bloom") as HTMLElement | null;

  let words: Element[] = [];
  if (quote) {
    const split = new SplitText(quote, { type: "words", wordsClass: "split-word" });
    words = split.words;
    gsap.set(words, { opacity: 0, y: 14, x: 6 });
  }
  let pullWords: Element[] = [];
  if (pullText) {
    const split = new SplitText(pullText, { type: "words", wordsClass: "split-word" });
    pullWords = split.words;
    gsap.set(pullWords, { opacity: 0, y: 12 });
  }
  if (setup) gsap.set(setup, { opacity: 0, y: 10 });
  if (cite) gsap.set(cite, { opacity: 0, y: 6 });
  if (analysis) gsap.set(analysis, { opacity: 0, y: 12 });
  if (pullQuote) gsap.set(pullQuote, { opacity: 1 });
  if (pullCite) gsap.set(pullCite, { opacity: 0, y: 6 });
  if (bloom) gsap.set(bloom, { opacity: 0, scale: 0.85 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 65%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (setup) tl.to(setup, { opacity: 1, y: 0, duration: 0.75, ease: "editorial" });
      if (words.length > 0) {
        tl.to(words, {
          opacity: 1, y: 0, x: 0,
          stagger: 0.018, duration: 0.5, ease: "power2.out"
        }, "-=0.2");
      }
      if (cite) tl.to(cite, { opacity: 0.7, y: 0, duration: 0.5, ease: "editorial" }, "+=0.15");
      if (analysis) tl.to(analysis, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "-=0.1");

      tl.addLabel("punctum", "+=0.45");
      if (bloom) {
        tl.to(bloom, { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" }, "punctum");
      }
      if (pullWords.length > 0) {
        tl.to(pullWords, {
          opacity: 1, y: 0,
          stagger: 0.06, duration: 0.65, ease: "editorial"
        }, "punctum+=0.15");
      }
      if (pullCite) tl.to(pullCite, { opacity: 0.7, y: 0, duration: 0.5, ease: "editorial" }, "-=0.25");
    }
  });
}

function installSoldierReadsPanel(): void {
  const slot = document.getElementById("ch1-soldier-reads");
  if (!slot) return;
  const setup = slot.querySelector(".setup") as HTMLElement | null;
  const left = slot.querySelector(".paired-fragment-left") as HTMLElement | null;
  const right = slot.querySelector(".paired-fragment-right") as HTMLElement | null;
  const cinnamonUnder = slot.querySelector(".cinnamon-fragment-underline") as HTMLElement | null;
  const blondUnder = slot.querySelector(".blond-fragment-underline") as HTMLElement | null;
  const cite = slot.querySelector(".chrome-citation") as HTMLElement | null;
  const analysis = slot.querySelector(".analysis") as HTMLElement | null;

  if (setup) gsap.set(setup, { opacity: 0, y: 10 });
  if (left) gsap.set(left, { opacity: 0, x: -28 });
  if (right) gsap.set(right, { opacity: 0, x: 28 });
  if (cinnamonUnder) gsap.set(cinnamonUnder, { width: 0 });
  if (blondUnder) gsap.set(blondUnder, { width: 0 });
  if (cite) gsap.set(cite, { opacity: 0, y: 6 });
  if (analysis) gsap.set(analysis, { opacity: 0, y: 12 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 65%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (setup) tl.to(setup, { opacity: 1, y: 0, duration: 0.7, ease: "editorial" });
      if (left) tl.to(left, { opacity: 1, x: 0, duration: 0.9, ease: "editorial" }, "-=0.3");
      if (cinnamonUnder) {
        tl.to(cinnamonUnder, {
          width: () => measureFragmentWidth(slot, ".cinnamon-fragment"),
          duration: 0.55, ease: "power2.out"
        }, "-=0.5");
      }
      if (right) tl.to(right, { opacity: 1, x: 0, duration: 0.9, ease: "editorial" }, "-=0.7");
      if (blondUnder) {
        tl.to(blondUnder, {
          width: () => measureFragmentWidth(slot, ".blond-fragment"),
          duration: 0.55, ease: "power2.out"
        }, "-=0.45");
      }
      if (cite) tl.to(cite, { opacity: 0.7, y: 0, duration: 0.55, ease: "editorial" }, "+=0.15");
      if (analysis) tl.to(analysis, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "-=0.25");
    }
  });
}

function measureFragmentWidth(slot: HTMLElement, selector: string): number {
  const el = slot.querySelector(selector) as HTMLElement | null;
  if (!el) return 0;
  return el.getBoundingClientRect().width;
}

function installVerdictPanel(): void {
  const slot = document.getElementById("ch1-verdict");
  if (!slot) return;
  const setup = slot.querySelector(".setup") as HTMLElement | null;
  const quote = slot.querySelector(".quote") as HTMLElement | null;
  const target = slot.querySelector(".verdict-target") as HTMLElement | null;
  const underline = slot.querySelector(".verdict-underline") as HTMLElement | null;
  const cite = slot.querySelector(".chrome-citation") as HTMLElement | null;
  const analysis = slot.querySelector(".analysis") as HTMLElement | null;
  const bleed = slot.querySelector(".verdict-afterbleed") as HTMLElement | null;
  if (!quote) return;

  const split = new SplitText(quote, { type: "words", wordsClass: "split-word" });
  const words = split.words;

  if (setup) gsap.set(setup, { opacity: 0, y: 10 });
  gsap.set(words, { opacity: 0, y: 26 });
  if (underline) gsap.set(underline, { width: 0 });
  if (cite) gsap.set(cite, { opacity: 0, y: 6 });
  if (analysis) gsap.set(analysis, { opacity: 0, y: 12 });
  if (bleed) gsap.set(bleed, { opacity: 0 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 60%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (setup) tl.to(setup, { opacity: 0.78, y: 0, duration: 0.7, ease: "editorial" });
      tl.to(words, {
        opacity: 1, y: 0,
        stagger: 0.14, duration: 0.7, ease: "editorial"
      }, "-=0.15");
      tl.addLabel("held", "+=0.55");
      if (bleed) tl.to(bleed, { opacity: 1, duration: 1.1, ease: "power2.out" }, "held-=0.4");
      if (underline && target) {
        tl.to(underline, {
          width: () => target.getBoundingClientRect().width,
          duration: 0.55, ease: "expo.out"
        }, "held");
      }
      if (cite) tl.to(cite, { opacity: 0.7, y: 0, duration: 0.55, ease: "editorial" }, "held+=0.4");
      if (analysis) tl.to(analysis, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "-=0.25");
    }
  });
}

function installLensPanel(): void {
  const slot = document.getElementById("ch1-lens");
  if (!slot) return;
  const setup = slot.querySelector(".setup") as HTMLElement | null;
  const items = Array.from(slot.querySelectorAll(".lens-item")) as HTMLElement[];
  const analysis = slot.querySelector(".analysis") as HTMLElement | null;

  if (setup) gsap.set(setup, { opacity: 0, y: 12 });
  gsap.set(items, { opacity: 0, y: 28, x: 18 });
  if (analysis) gsap.set(analysis, { opacity: 0, y: 12 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 65%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (setup) tl.to(setup, { opacity: 0.78, y: 0, duration: 0.7, ease: "editorial" });
      tl.to(items, {
        opacity: 0.95, y: 0, x: 0,
        stagger: 0.22, duration: 0.85, ease: "editorial"
      }, "-=0.3");
      if (items.length >= 2) {
        tl.to(items[0]!, { x: -6, duration: 0.6, ease: "power1.inOut" }, "-=0.2");
        tl.to(items[1]!, { x: 6, duration: 0.6, ease: "power1.inOut" }, "<");
      }
      if (analysis) tl.to(analysis, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "-=0.35");
    }
  });
}

function buildHorizon(className: string): SVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", className);
  svg.setAttribute("viewBox", "0 0 1000 2");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", "0");
  line.setAttribute("y1", "1");
  line.setAttribute("x2", "1000");
  line.setAttribute("y2", "1");
  svg.appendChild(line);
  return svg;
}
