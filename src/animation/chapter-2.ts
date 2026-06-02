import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ease.js";
import { revealChapterTitle, revealTransition } from "./opening.js";

export function animateChapter2(): void {
  revealChapterTitle("ch2-open");

  attachDeemedReveal("ch2-deemed");
  attachVergePivot("ch2-verge");
  attachFadeFromMargin("ch2-lens");

  revealTransition("ch2-close");
}

function attachDeemedReveal(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const setup = slot.querySelector(".setup");
  const firstHalf = slot.querySelector(".quote-half-first");
  const secondHalf = slot.querySelector(".quote-half-second");
  const cite = slot.querySelector(".chrome-citation");
  const analysis = slot.querySelector(".analysis");

  if (setup) gsap.set(setup, { opacity: 0, y: 8 });
  if (firstHalf) gsap.set(firstHalf, { opacity: 0, y: 14 });
  if (secondHalf) gsap.set(secondHalf, { opacity: 0, y: 14 });
  if (cite) gsap.set(cite, { opacity: 0, y: 6 });
  if (analysis) gsap.set(analysis, { opacity: 0, y: 8 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 65%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (setup) tl.to(setup, { opacity: 1, y: 0, duration: 0.7, ease: "editorial" });
      if (firstHalf) {
        tl.to(firstHalf, { opacity: 1, y: 0, duration: 1.1, ease: "editorial" }, "+=0.2");
      }
      if (secondHalf) {
        tl.to(secondHalf, { opacity: 1, y: 0, duration: 1.3, ease: "editorial" }, "+=1.2");
      }
      if (cite) tl.to(cite, { opacity: 1, y: 0, duration: 0.5, ease: "editorial" }, "+=0.3");
      if (analysis) tl.to(analysis, { opacity: 1, y: 0, duration: 0.7, ease: "editorial" }, "-=0.15");
    }
  });
}

function attachFadeFromMargin(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const inner = slot.querySelector(".slot-inner");
  if (!inner) return;

  gsap.set(inner, { opacity: 0, x: -24 });

  gsap.to(inner, {
    opacity: 1,
    x: 0,
    duration: 0.9,
    ease: "editorial",
    scrollTrigger: {
      trigger: slot,
      start: "top 65%",
      toggleActions: "play none none reverse"
    }
  });
}

function attachVergePivot(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const inner = slot.querySelector(".slot-inner") as HTMLElement | null;
  const pivot = slot.querySelector(".verge-pivot") as HTMLElement | null;
  if (!inner || !pivot) return;

  const deemed = pivot.querySelector(".verge-panel-deemed") as HTMLElement | null;
  const verge = pivot.querySelector(".verge-panel-verge") as HTMLElement | null;
  const hunted = pivot.querySelector(".verge-hunted") as HTMLElement | null;
  if (!deemed || !verge || !hunted) return;

  gsap.set(inner, { opacity: 0, x: -24 });
  gsap.to(inner, {
    opacity: 1,
    x: 0,
    duration: 0.9,
    ease: "editorial",
    scrollTrigger: {
      trigger: slot,
      start: "top 65%",
      toggleActions: "play none none reverse"
    }
  });

  gsap.set(pivot, { opacity: 0 });
  gsap.set(deemed, { xPercent: -50, yPercent: -50, y: "-28vh", x: 0 });
  gsap.set(verge, { xPercent: -50, yPercent: -50, y: "28vh", x: 0 });

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

  const bodyColor = getComputedStyle(hunted).color;
  const verdictColor =
    getComputedStyle(document.documentElement).getPropertyValue("--verdict").trim() ||
    "#9B2A1F";

  tl.to(pivot, { opacity: 1, ease: "none", duration: 0.1 }, 0);
  tl.to(deemed, { y: 0, x: "-22vw", ease: "none", duration: 0.3 }, 0.13);
  tl.to(verge, { y: 0, x: "22vw", ease: "none", duration: 0.3 }, 0.13);
  tl.to(hunted, { color: verdictColor, ease: "none", duration: 0.02 }, 0.58);
  tl.to(hunted, { color: bodyColor, ease: "none", duration: 0.04 }, 0.62);
  tl.to(pivot, { opacity: 0, ease: "none", duration: 0.15 }, 0.83);
}
