import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ease.js";
import { revealChapterTitle, revealTransition } from "./opening.js";

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

  if (setup) gsap.set(setup, { opacity: 0, y: 8 });
  pairs.forEach((pair) => {
    const en = pair.querySelector(".quote-en");
    const vi = pair.querySelector(".quote-vi");
    const cite = pair.querySelector(".chrome-citation");
    if (en) gsap.set(en, { opacity: 0, y: 8 });
    if (vi) gsap.set(vi, { opacity: 0, y: 8 });
    if (cite) gsap.set(cite, { opacity: 0, y: 6 });
  });
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
        const anchor: number | string = i === 0 ? (setup ? "-=0.3" : 0) : "+=0.18";
        if (en) tl.to(en, { opacity: 1, y: 0, duration: 0.75, ease: "editorial" }, anchor);
        if (vi) tl.to(vi, { opacity: 1, y: 0, duration: 0.65, ease: "editorial" }, "-=0.45");
        if (cite) tl.to(cite, { opacity: 1, y: 0, duration: 0.5, ease: "editorial" }, "-=0.3");
      });
      if (analysis) {
        tl.to(analysis, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "+=0.15");
      }
    }
  });
}

function attachParataxisQuote(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const setup = slot.querySelector(".setup");
  const quote = slot.querySelector(".quote");
  const cite = slot.querySelector(".chrome-citation");
  const analysis = slot.querySelector(".analysis");
  const parts = [setup, quote, cite, analysis].filter(
    (el): el is Element => el !== null
  );
  if (parts.length === 0) return;

  gsap.set(parts, { opacity: 0, y: 10 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 65%",
    once: true,
    onEnter: () =>
      gsap.to(parts, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "editorial",
        stagger: 0.18
      })
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
