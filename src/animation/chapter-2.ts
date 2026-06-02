import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ease.js";
import { revealChapterTitle, revealTransition } from "./opening.js";

export function animateChapter2(): void {
  revealChapterTitle("ch2-open");

  attachFadeFromMargin("ch2-deemed");
  attachBreathReveal("ch2-verge");
  attachFadeFromMargin("ch2-lens");

  revealTransition("ch2-close");
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

function attachBreathReveal(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const inner = slot.querySelector(".slot-inner");
  if (!inner) return;

  gsap.set(inner, { opacity: 0 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 70%",
    once: true,
    onEnter: () =>
      gsap.to(inner, { opacity: 1, duration: 1.4, ease: "power1.out" })
  });
}
