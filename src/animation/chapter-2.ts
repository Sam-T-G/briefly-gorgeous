import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import "./ease.js";
import { revealChapterTitle, revealTransition } from "./opening.js";

void DrawSVGPlugin;

export function animateChapter2(): void {
  revealChapterTitle("ch2-open");

  attachDeemedReveal("ch2-deemed");
  attachVergePivot("ch2-verge");
  attachAllowsMechanism("ch2-verge");
  attachGorgeousEbb("ch2-verge");
  attachFadeFromMargin("ch2-lens");

  revealTransition("ch2-close");
}

function attachDeemedReveal(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const setup = slot.querySelector(".setup");
  const firstHalf = slot.querySelector(".quote-half-first");
  const secondHalf = slot.querySelector(".quote-half-second");
  const deemed = slot.querySelector(".deemed-target") as HTMLElement | null;
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
      if (deemed) {
        tl.to(
          deemed,
          {
            color: "#8E4127",
            letterSpacing: "0.06em",
            duration: 1.4,
            ease: "power2.inOut"
          },
          "-=0.5"
        );
      }
      if (cite) tl.to(cite, { opacity: 1, y: 0, duration: 0.5, ease: "editorial" }, "+=0.3");
      if (analysis) tl.to(analysis, { opacity: 1, y: 0, duration: 0.7, ease: "editorial" }, "-=0.15");
    }
  });
}

function attachAllowsMechanism(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const allows = slot.querySelector(".allows-target") as HTMLElement | null;
  if (!allows) return;

  gsap.set(allows, { display: "inline-block", transformOrigin: "left center" });

  gsap.fromTo(
    allows,
    { scale: 1.0 },
    {
      scale: 1.06,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: slot,
        start: "top 60%",
        end: "+=80%",
        scrub: 1
      }
    }
  );
}

function attachGorgeousEbb(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const gorgeous = slot.querySelector(".gorgeous-target") as HTMLElement | null;
  if (!gorgeous) return;

  gsap.set(gorgeous, { "--gorgeous-weight": 400 });

  gsap.to(gorgeous, {
    "--gorgeous-weight": 200,
    ease: "none",
    scrollTrigger: {
      trigger: slot,
      start: "top 40%",
      end: "+=40%",
      scrub: 0.8
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
  const horizonWrap = pivot.querySelector(".verge-horizon") as HTMLElement | null;
  const horizonLine = pivot.querySelector(".verge-horizon-line") as SVGElement | null;
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
  if (horizonWrap) gsap.set(horizonWrap, { opacity: 0 });
  if (horizonLine) gsap.set(horizonLine, { drawSVG: "0%" });

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

  const bodyColor = "#5C4632";
  const verdictColor = "#9B2A1F";

  tl.to(pivot, { opacity: 1, ease: "none", duration: 0.1 }, 0);
  tl.to(deemed, { y: 0, x: "-22vw", ease: "none", duration: 0.3 }, 0.13);
  tl.to(verge, { y: 0, x: "22vw", ease: "none", duration: 0.3 }, 0.13);
  if (horizonWrap && horizonLine) {
    tl.to(horizonWrap, { opacity: 1, ease: "none", duration: 0.06 }, 0.43);
    tl.to(horizonLine, { drawSVG: "100%", ease: "none", duration: 0.3 }, 0.45);
    tl.to(verge, { opacity: 0.22, ease: "none", duration: 0.18 }, 0.75);
  }
  tl.to(hunted, { color: verdictColor, ease: "none", duration: 0.02 }, 0.58);
  tl.to(hunted, { color: bodyColor, ease: "none", duration: 0.04 }, 0.62);
  tl.to(pivot, { opacity: 0, ease: "none", duration: 0.15 }, 0.85);
}
