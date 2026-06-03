import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import "./ease.js";

void DrawSVGPlugin;

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
  const split = slot.querySelector(".thesis-split") as HTMLElement | null;
  if (split) {
    attachThesisColumnSplit(slot, split);
    return;
  }
  const fallback = slot.querySelector(".thesis") as HTMLElement | null;
  if (fallback) {
    gsap.set(fallback, { opacity: 0 });
    ScrollTrigger.create({
      trigger: slot,
      start: "top 65%",
      once: true,
      onEnter: () =>
        gsap.to(fallback, { opacity: 1, duration: 1.4, ease: "editorial" })
    });
    return;
  }
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
}

function attachThesisColumnSplit(slot: HTMLElement, split: HTMLElement): void {
  const left = split.querySelector(".thesis-clause-left") as HTMLElement | null;
  const right = split.querySelector(".thesis-clause-right") as HTMLElement | null;
  const hairline = split.querySelector(".thesis-hairline-line") as SVGElement | null;
  if (!left || !right) return;

  gsap.set(split, { opacity: 0 });
  gsap.set(left, { xPercent: 50 });
  gsap.set(right, { xPercent: -50 });
  if (hairline) gsap.set(hairline, { drawSVG: "50% 50%" });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 65%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      tl.to(
        [left, right],
        {
          xPercent: 0,
          duration: 1.4,
          ease: "power3.out"
        },
        0
      );
      tl.to(
        split,
        { opacity: 1, duration: 0.9, ease: "editorial" },
        0.2
      );
      if (hairline) {
        tl.to(
          hairline,
          { drawSVG: "0% 100%", duration: 1.1, ease: "power2.inOut" },
          0.55
        );
      }
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
