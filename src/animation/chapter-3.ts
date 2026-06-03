import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import "./ease.js";
import { revealChapterTitle, revealTransition } from "./opening.js";

void DrawSVGPlugin;

export function animateChapter3(): void {
  revealChapterTitle("ch3-open");

  attachBilingualStream("ch3-fragment-stream");
  attachParataxisQuote("ch3-parataxis");

  attachStandardStoryRecedes("ch3-lens");

  revealTransition("ch3-close");
}

function attachBilingualStream(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const setup = slot.querySelector(".setup");
  const pairs = slot.querySelectorAll(".bilingual-stream-pair");
  const analysis = slot.querySelector(".analysis");
  const allFills = slot.querySelectorAll(".nho-fill");
  const allDiacritics = slot.querySelectorAll(".nho-diacritic-path");

  if (setup) gsap.set(setup, { opacity: 0, y: 8 });
  pairs.forEach((pair) => {
    const en = pair.querySelector(".quote-en");
    const vi = pair.querySelector(".quote-vi");
    const cite = pair.querySelector(".chrome-citation");
    if (en) gsap.set(en, { opacity: 0, y: 12 });
    if (vi) gsap.set(vi, { opacity: 0, y: 12 });
    if (cite) gsap.set(cite, { opacity: 0, y: 6 });
  });
  if (allFills.length > 0) gsap.set(allFills, { yPercent: 100 });
  if (allDiacritics.length > 0) gsap.set(allDiacritics, { drawSVG: "0%" });
  if (analysis) gsap.set(analysis, { opacity: 0, y: 8 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 65%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (setup) tl.to(setup, { opacity: 1, y: 0, duration: 0.7, ease: "editorial" });
      pairs.forEach((pair, i) => {
        const en = pair.querySelector(".quote-en");
        const vi = pair.querySelector(".quote-vi");
        const cite = pair.querySelector(".chrome-citation");
        const fills = pair.querySelectorAll(".nho-fill");
        const diacritics = pair.querySelectorAll(".nho-diacritic-path");
        const anchor: number | string = i === 0 ? (setup ? "-=0.2" : 0) : "+=0.6";
        if (en) {
          tl.to(
            en,
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
            anchor
          );
        }
        if (vi) {
          tl.to(
            vi,
            { opacity: 0.85, y: 0, duration: 0.7, ease: "power2.out" },
            en ? "<" : anchor
          );
        }
        if (fills.length > 0) {
          tl.to(
            fills,
            { yPercent: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 },
            "-=0.2"
          );
          if (diacritics.length > 0) {
            tl.to(
              diacritics,
              { drawSVG: "100%", duration: 0.2, ease: "power1.out", stagger: 0.08 },
              "-=0.45"
            );
          }
        }
        if (cite) tl.to(cite, { opacity: 1, y: 0, duration: 0.5, ease: "editorial" }, "-=0.25");
      });
      if (analysis) {
        tl.to(analysis, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "+=0.3");
      }
    }
  });
}

function attachParataxisQuote(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const setup = slot.querySelector(".setup");
  const quote = slot.querySelector(".quote");
  const firstHalf = slot.querySelector(".quote-half-first") as HTMLElement | null;
  const secondHalf = slot.querySelector(".quote-half-second");
  const hairline = slot.querySelector(".parataxis-hairline");
  const cite = slot.querySelector(".chrome-citation");
  const analysis = slot.querySelector(".analysis");

  let firstWords: Element[] = [];
  if (firstHalf) {
    const split = new SplitText(firstHalf, { type: "words", wordsClass: "split-word" });
    firstWords = split.words;
  }

  if (setup) gsap.set(setup, { opacity: 0, y: 10 });
  if (firstWords.length > 0) {
    gsap.set(firstWords, { opacity: 0, y: 10 });
  } else if (firstHalf) {
    gsap.set(firstHalf, { opacity: 0, y: 14 });
  }
  if (secondHalf) {
    gsap.set(secondHalf, { opacity: 0, y: 14 });
  } else if (!firstHalf && quote) {
    gsap.set(quote, { opacity: 0, y: 10 });
  }
  if (hairline) gsap.set(hairline, { scaleX: 0, transformOrigin: "left center" });
  if (cite) gsap.set(cite, { opacity: 0, y: 6 });
  if (analysis) gsap.set(analysis, { opacity: 0, y: 10 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 65%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (setup) {
        tl.to(setup, { opacity: 1, y: 0, duration: 0.8, ease: "editorial" });
      }
      if (firstWords.length > 0) {
        tl.to(
          firstWords,
          { opacity: 1, y: 0, duration: 0.55, ease: "power1.out", stagger: 0.07 },
          setup ? "+=0.2" : 0
        );
      } else if (firstHalf) {
        tl.to(
          firstHalf,
          { opacity: 1, y: 0, duration: 0.9, ease: "power1.inOut" },
          setup ? "+=0.2" : 0
        );
      }
      if (hairline) {
        tl.to(
          hairline,
          { scaleX: 1, duration: 0.9, ease: "power1.inOut" },
          "+=0.35"
        );
      }
      if (secondHalf) {
        tl.to(
          secondHalf,
          { opacity: 1, y: 0, duration: 0.9, ease: "power1.inOut" },
          hairline ? "-=0.45" : "+=0.45"
        );
      } else if (!firstHalf && quote) {
        tl.to(quote, { opacity: 1, y: 0, duration: 0.9, ease: "editorial" }, "+=0.2");
      }
      if (cite) {
        tl.to(cite, { opacity: 1, y: 0, duration: 0.55, ease: "editorial" }, "+=0.3");
      }
      if (analysis) {
        tl.to(analysis, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "-=0.2");
      }
    }
  });
}

function attachStandardStoryRecedes(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const inner = slot.querySelector(".slot-inner");
  if (!inner) return;

  gsap.set(inner, { opacity: 0, y: 12 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 70%",
    once: true,
    onEnter: () =>
      gsap.to(inner, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      })
  });
}

