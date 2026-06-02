import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ease.js";
import { revealChapterTitle, revealTransition } from "./opening.js";

export function animateChapter3(): void {
  revealChapterTitle("ch3-open");

  attachParallelArrival("ch3-nho");
  attachParallelArrival("ch3-miss");
  attachParallelArrival("ch3-parataxis");

  attachStandardStoryRecedes("ch3-lens");

  revealTransition("ch3-close");
}

function attachParallelArrival(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const inner = slot.querySelector(".slot-inner");
  if (!inner) return;

  gsap.set(inner, { opacity: 0, y: 12 });

  gsap.to(inner, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "power2.out",
    scrollTrigger: {
      trigger: slot,
      start: "top 65%",
      toggleActions: "play none none reverse"
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
