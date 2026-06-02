import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ease.js";

export function animateClosing(): void {
  attachThesisReveal("closing-thesis");
  attachWorksCited("works-cited");
}

function attachThesisReveal(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const inner = slot.querySelector(".slot-inner");
  if (!inner) return;

  gsap.set(inner, { opacity: 0 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 65%",
    once: true,
    onEnter: () =>
      gsap.to(inner, {
        opacity: 1,
        duration: 1.4,
        ease: "editorial"
      })
  });
}

function attachWorksCited(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const heading = slot.querySelector(".chapter-title-label");
  const items = slot.querySelectorAll(".works-cited-list li");
  const inner = slot.querySelector(".slot-inner");

  const headingTargets = heading ? [heading] : [];
  const itemTargets = Array.from(items);
  const targets: Element[] =
    headingTargets.length + itemTargets.length > 0
      ? [...headingTargets, ...itemTargets]
      : inner
        ? [inner]
        : [];

  if (targets.length === 0) return;

  gsap.set(targets, { opacity: 0, y: 8 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 75%",
    once: true,
    onEnter: () =>
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08
      })
  });
}
