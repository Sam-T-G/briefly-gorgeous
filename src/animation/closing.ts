import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./ease.js";

export function animateClosing(): void {
  attachVerbEcho("closing-verb-echo");
  attachResearchTrajectory("closing-trajectory-soler");
  attachResearchTrajectory("closing-trajectory-lee");
  attachThesisReveal("closing-thesis");
  attachWorksCited("works-cited");
}

function attachResearchTrajectory(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const eyebrow = slot.querySelector(".trajectory-eyebrow");
  const authorBlock = slot.querySelector(".trajectory-author-block");
  const quote = slot.querySelector(".trajectory-quote");
  const cite = slot.querySelector(".trajectory-citation");
  const role = slot.querySelector(".trajectory-role");
  const parts = [eyebrow, authorBlock, quote, cite, role].filter(
    (el): el is Element => el !== null
  );
  if (parts.length === 0) return;

  gsap.set(parts, { opacity: 0, y: 8 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 70%",
    once: true,
    onEnter: () =>
      gsap.to(parts, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: "power1.out",
        stagger: 0.12
      })
  });
}

function attachVerbEcho(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const items = slot.querySelectorAll(".verb-echo-item");
  if (items.length === 0) return;

  gsap.set(items, { opacity: 0, y: 10 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 70%",
    once: true,
    onEnter: () =>
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.24
      })
  });
}

function attachThesisReveal(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const thesis = slot.querySelector(".thesis") as HTMLElement | null;
  if (!thesis) {
    const inner = slot.querySelector(".slot-inner");
    if (!inner) return;
    gsap.set(inner, { opacity: 0 });
    ScrollTrigger.create({
      trigger: slot,
      start: "top 65%",
      once: true,
      onEnter: () =>
        gsap.to(inner, { opacity: 1, duration: 1.4, ease: "editorial" })
    });
    return;
  }

  gsap.set(thesis, { opacity: 0 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 65%",
    once: true,
    onEnter: () => {
      const split = new SplitText(thesis, { type: "lines" });
      const lines = split.lines;
      if (lines.length === 0) {
        gsap.to(thesis, { opacity: 1, duration: 1.4, ease: "editorial" });
        return;
      }
      gsap.set(thesis, { opacity: 1 });
      gsap.set(lines, { opacity: 0, y: 14 });
      gsap.to(lines, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "editorial",
        stagger: 0.18
      });
    }
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
