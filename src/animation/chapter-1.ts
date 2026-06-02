import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ease.js";
import { revealChapterTitle } from "./opening.js";

export function animateChapter1(): void {
  revealChapterTitle("ch1-open");

  attachQuoteReveal("ch1-macaque");
  attachPairedFragment("ch1-soldier-reads");
  attachQuoteReveal("ch1-verdict");

  attachVerdictCut("ch1-verdict");

  attachLensBundle("ch1-lens");
  attachQuoteTransition("ch1-close");
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

  const wash = slot.querySelector(".verdict-wash") as HTMLElement | null;
  const display = slot.querySelector(".verdict-display") as HTMLElement | null;
  if (!wash || !display) return;

  gsap.set(wash, { opacity: 0 });
  gsap.set(display, { opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: slot,
      start: "top top",
      end: "+=200%",
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: -5
    }
  });

  tl.to(wash, { opacity: 1, ease: "none", duration: 0.12 }, 0);
  tl.to(display, { opacity: 1, ease: "none", duration: 0.1 }, 0.04);
  tl.to(display, { opacity: 0, ease: "none", duration: 0.18 }, 0.62);
  tl.to(wash, { opacity: 0, ease: "none", duration: 0.2 }, 0.7);
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

function attachQuoteTransition(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const setup = slot.querySelector(".setup");
  const quote = slot.querySelector(".quote-transition-quote");
  const cite = slot.querySelector(".chrome-citation");
  const paragraphs = slot.querySelectorAll(".transition-paragraph");

  if (setup) gsap.set(setup, { opacity: 0, y: 8 });
  if (quote) gsap.set(quote, { opacity: 0, y: 10 });
  if (cite) gsap.set(cite, { opacity: 0, y: 6 });
  if (paragraphs.length > 0) gsap.set(paragraphs, { opacity: 0, y: 8 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 70%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (setup) tl.to(setup, { opacity: 1, y: 0, duration: 0.7, ease: "editorial" });
      if (quote) {
        tl.to(
          quote,
          { opacity: 1, y: 0, duration: 0.9, ease: "editorial" },
          setup ? "-=0.3" : 0
        );
      }
      if (cite) tl.to(cite, { opacity: 1, y: 0, duration: 0.55, ease: "editorial" }, "-=0.4");
      if (paragraphs.length > 0) {
        tl.to(
          paragraphs,
          { opacity: 1, y: 0, duration: 0.85, ease: "editorial", stagger: 0.14 },
          "+=0.1"
        );
      }
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
          opacity: 1,
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
