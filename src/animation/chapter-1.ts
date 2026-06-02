import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ease.js";
import { revealChapterTitle, revealTransition } from "./opening.js";

export function animateChapter1(): void {
  revealChapterTitle("ch1-open");

  attachQuoteReveal("ch1-macaque");
  attachQuoteReveal("ch1-napkin");
  attachQuoteReveal("ch1-verdict");
  attachQuoteReveal("ch1-divider");

  attachCinnamonUnderline("ch1-cinnamon");
  attachCinnamonUnderline("ch1-recognition");
  attachCrosscut("ch1-recognition");
  attachDividerOpens("ch1-divider");
  attachVerdictCut("ch1-verdict");

  attachLensBundle("ch1-lens");
  revealTransition("ch1-close");
}

function attachCrosscut(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const stage = slot.querySelector(".crosscut-stage");
  const dinner = slot.querySelector(".crosscut-panel-dinner");
  const checkpoint = slot.querySelector(".crosscut-panel-checkpoint");
  const divider = slot.querySelector(".crosscut-divider");
  if (!stage || !dinner || !checkpoint || !divider) return;

  gsap.set(dinner, { opacity: 1 });
  gsap.set(checkpoint, { opacity: 0 });
  gsap.set(divider, { x: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: slot,
      start: "top top",
      end: "+=180%",
      pin: stage,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  tl.to(dinner, { opacity: 0, ease: "none" }, 0);
  tl.to(checkpoint, { opacity: 1, ease: "none" }, 0);
  tl.to(divider, { x: 24, ease: "none", duration: 0.15 }, 0.85);
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

function attachCinnamonUnderline(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const target = slot.querySelector(".cinnamon-target") as HTMLElement | null;
  const underline = slot.querySelector(".cinnamon-underline");
  if (!target || !underline) return;

  gsap.set(underline, { width: 0 });

  gsap.to(underline, {
    width: () => target.getBoundingClientRect().width,
    duration: 0.8,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: slot,
      start: "top 55%",
      toggleActions: "play none none reverse",
      invalidateOnRefresh: true
    }
  });
}

function attachDividerOpens(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const rule = slot.querySelector(".divider-rule");
  if (!rule) return;
  gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });

  gsap.to(rule, {
    scaleX: 1,
    duration: 1.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: slot,
      start: "top 55%",
      toggleActions: "play none none reverse"
    }
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
