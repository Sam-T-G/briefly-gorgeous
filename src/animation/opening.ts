import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./ease.js";

export function animateOpening(): void {
  revealChapterTitle("opening-landing", { delay: 0.2 });
  revealInfoCard("opening-world");
  revealInfoCard("opening-pressures");
  revealTransition("opening-frame");
  revealInfoCard("opening-motif");
  revealInfoCard("opening-framework");
}

function revealInfoCard(id: string): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const eyebrow = slot.querySelector(".info-eyebrow");
  const title = slot.querySelector(".info-title");
  const bullets = slot.querySelectorAll(".info-bullets li");
  const closer = slot.querySelector(".info-closer");
  const cover = slot.querySelector(".opening-cover");
  const hine = slot.querySelector(".opening-hine");

  if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 8 });
  if (title) gsap.set(title, { opacity: 0, y: 12 });
  if (bullets.length > 0) gsap.set(bullets, { opacity: 0, y: 8 });
  if (closer) gsap.set(closer, { opacity: 0, y: 8 });
  if (cover) gsap.set(cover, { opacity: 0, y: 6 });
  if (hine) gsap.set(hine, { opacity: 0, y: 6 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 70%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.7, ease: "editorial" });
      if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "-=0.35");
      if (bullets.length > 0) {
        tl.to(
          bullets,
          { opacity: 1, y: 0, duration: 0.75, ease: "editorial", stagger: 0.12 },
          "-=0.45"
        );
      }
      if (closer) tl.to(closer, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "-=0.2");
      if (cover) tl.to(cover, { opacity: 0.4, y: 0, duration: 1.1, ease: "editorial" }, "+=0.15");
      if (hine) tl.to(hine, { opacity: 0.55, y: 0, duration: 1.2, ease: "editorial" }, "+=0.1");
    }
  });
}

export function revealChapterTitle(
  id: string,
  opts: { delay?: number } = {}
): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const eyebrow = slot.querySelector(".chapter-title-eyebrow");
  const label = slot.querySelector(".chapter-title-label") as HTMLElement | null;
  const subtitle = slot.querySelector(".chapter-title-subtitle");
  const portrait = slot.querySelector(".vuong-portrait");

  let words: Element[] = [];
  if (label) {
    const split = new SplitText(label, { type: "words", wordsClass: "split-word" });
    words = split.words;
    gsap.set(words, { opacity: 0, y: 18 });
  }
  if (eyebrow) gsap.set(eyebrow, { opacity: 0 });
  if (subtitle) gsap.set(subtitle, { opacity: 0, y: 8 });
  if (portrait) gsap.set(portrait, { opacity: 0, y: 6 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 70%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline({ delay: opts.delay ?? 0 });
      if (eyebrow) tl.to(eyebrow, { opacity: 1, duration: 0.8, ease: "editorial" });
      if (words.length > 0) {
        tl.to(
          words,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "editorial",
            stagger: 0.06
          },
          "-=0.4"
        );
      }
      if (subtitle) {
        tl.to(
          subtitle,
          { opacity: 1, y: 0, duration: 0.9, ease: "editorial" },
          "-=0.3"
        );
      }
      if (portrait) {
        tl.to(
          portrait,
          { opacity: 0.55, y: 0, duration: 1.2, ease: "editorial" },
          "+=0.1"
        );
      }
    }
  });
}

export function revealTransition(id: string): void {
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
