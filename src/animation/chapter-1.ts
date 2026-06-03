import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./ease.js";
import { revealChapterTitle } from "./opening.js";

export function animateChapter1(): void {
  revealChapterTitle("ch1-open");

  attachPorcelainReveal("ch1-macaque");
  attachPairedFragment("ch1-soldier-reads");
  attachCinnamonRecognition("ch1-soldier-reads");
  attachQuoteReveal("ch1-verdict");

  attachVerdictCut("ch1-verdict");

  attachLensBundle("ch1-lens");
}

function attachPorcelainReveal(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const setup = slot.querySelector(".setup");
  const quote = slot.querySelector(".quote") as HTMLElement | null;
  const cite = slot.querySelector(".chrome-citation");
  const analysis = slot.querySelector(".analysis");
  const pullQuote = slot.querySelector(".pull-quote-text") as HTMLElement | null;
  const pullCite = slot.querySelector(".pull-quote .chrome-citation");

  if (setup) gsap.set(setup, { opacity: 0, y: 10 });
  if (cite) gsap.set(cite, { opacity: 0, y: 6 });
  if (analysis) gsap.set(analysis, { opacity: 0, y: 10 });
  if (pullQuote) gsap.set(pullQuote, { opacity: 0, y: 14 });
  if (pullCite) gsap.set(pullCite, { opacity: 0, y: 6 });

  let words: Element[] = [];
  if (quote) {
    const split = new SplitText(quote, { type: "words", wordsClass: "split-word" });
    words = split.words;
    gsap.set(words, { opacity: 0, y: 6 });
  }

  ScrollTrigger.create({
    trigger: slot,
    start: "top 65%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (setup) tl.to(setup, { opacity: 1, y: 0, duration: 0.75, ease: "editorial" });
      if (words.length > 0) {
        tl.to(
          words,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power1.out",
            stagger: 0.04
          },
          setup ? "-=0.25" : 0
        );
      }
      if (cite) tl.to(cite, { opacity: 1, y: 0, duration: 0.55, ease: "editorial" }, "+=0.2");
      if (analysis) tl.to(analysis, { opacity: 1, y: 0, duration: 0.8, ease: "editorial" }, "-=0.15");
      if (pullQuote) tl.to(pullQuote, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "+=0.45");
      if (pullCite) tl.to(pullCite, { opacity: 1, y: 0, duration: 0.5, ease: "editorial" }, "-=0.35");
    }
  });
}

function attachQuoteReveal(id: string): void {
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

  gsap.set(parts, { opacity: 0, y: 12 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 65%",
    once: true,
    onEnter: () =>
      gsap.to(parts, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "editorial",
        stagger: 0.15
      })
  });
}

function attachVerdictCut(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const target = slot.querySelector(".verdict-target") as HTMLElement | null;
  const underline = slot.querySelector(".verdict-underline");
  if (!target || !underline) return;

  gsap.set(underline, { width: 0 });

  gsap.to(underline, {
    width: () => target.getBoundingClientRect().width,
    duration: 0.55,
    ease: "expo.out",
    delay: 0.2,
    scrollTrigger: {
      trigger: slot,
      start: "top 55%",
      toggleActions: "play none none reverse",
      invalidateOnRefresh: true
    }
  });
}

function attachCinnamonRecognition(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const wrap = slot.querySelector(".cinnamon-fragment") as HTMLElement | null;
  const underline = slot.querySelector(".cinnamon-fragment-underline") as HTMLElement | null;
  if (!wrap || !underline) return;

  gsap.set(underline, { scaleX: 0, transformOrigin: "left center" });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 60%",
    once: true,
    onEnter: () =>
      gsap.to(underline, {
        scaleX: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.35
      })
  });
}

function attachPairedFragment(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const setup = slot.querySelector(".setup");
  const left = slot.querySelector(".paired-fragment-left");
  const right = slot.querySelector(".paired-fragment-right");
  const cite = slot.querySelector(".chrome-citation");
  const analysis = slot.querySelector(".analysis");

  if (setup) gsap.set(setup, { opacity: 0, y: 8 });
  if (left) gsap.set(left, { opacity: 0, x: -22 });
  if (right) gsap.set(right, { opacity: 0, x: 22 });
  if (cite) gsap.set(cite, { opacity: 0, y: 6 });
  if (analysis) gsap.set(analysis, { opacity: 0, y: 8 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 65%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (setup) tl.to(setup, { opacity: 1, y: 0, duration: 0.7, ease: "editorial" });
      const panes: Element[] = [];
      if (left) panes.push(left);
      if (right) panes.push(right);
      if (panes.length > 0) {
        tl.to(
          panes,
          { opacity: 1, x: 0, duration: 0.9, ease: "editorial" },
          setup ? "-=0.3" : 0
        );
      }
      if (cite) tl.to(cite, { opacity: 1, y: 0, duration: 0.55, ease: "editorial" }, "-=0.35");
      if (analysis) tl.to(analysis, { opacity: 1, y: 0, duration: 0.8, ease: "editorial" }, "-=0.2");
    }
  });
}

function attachLensBundle(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const items = slot.querySelectorAll(".lens-item");
  const analysis = slot.querySelector(".analysis");
  const setup = slot.querySelector(".setup");

  if (setup) gsap.set(setup, { opacity: 0 });
  gsap.set(items, { opacity: 0, x: -18 });
  if (analysis) gsap.set(analysis, { opacity: 0, y: 8 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 65%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (setup) tl.to(setup, { opacity: 1, duration: 0.7, ease: "editorial" });
      tl.to(
        items,
        {
          opacity: 0.9,
          x: 0,
          duration: 0.9,
          ease: "editorial",
          stagger: 0.25
        },
        setup ? "-=0.3" : 0
      );
      if (analysis) {
        tl.to(
          analysis,
          { opacity: 1, y: 0, duration: 0.8, ease: "editorial" },
          "-=0.3"
        );
      }
    }
  });
}
