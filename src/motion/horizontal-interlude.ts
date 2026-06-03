import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Panel = {
  eyebrow?: string;
  word: string;
  meta?: string;
  tone: string;
};

const PANELS: Panel[] = [
  { eyebrow: "Interlude", word: "On", tone: "oklch(72% 0.12 240)" },
  { word: "Earth", meta: "the ground we stand on", tone: "oklch(68% 0.14 180)" },
  { word: "We're", meta: "a first-person plural", tone: "oklch(74% 0.16 120)" },
  { word: "Briefly", meta: "a duration, not a verdict", tone: "oklch(70% 0.18 60)" },
  { word: "Gorgeous", meta: "the title, finally", tone: "oklch(64% 0.20 20)" }
];

export function installHorizontalInterlude(insertAfterId: string = "ch2-close"): void {
  const anchor = document.getElementById(insertAfterId);
  if (!anchor) {
    console.warn(`[horizontal-interlude] anchor #${insertAfterId} not found`);
    return;
  }
  if (document.getElementById("horizontal-interlude")) {
    console.info(`[horizontal-interlude] already mounted`);
    return;
  }
  console.info(`[horizontal-interlude] mounting after #${insertAfterId}`);

  const section = document.createElement("section");
  section.id = "horizontal-interlude";
  section.className = "horizontal-interlude";
  section.setAttribute("aria-label", "Interlude");

  const track = document.createElement("div");
  track.className = "h-track";

  for (const panel of PANELS) {
    const cell = document.createElement("article");
    cell.className = "h-panel";
    cell.style.setProperty("--panel-tone", panel.tone);
    if (panel.eyebrow) {
      const eyebrow = document.createElement("div");
      eyebrow.className = "h-eyebrow";
      eyebrow.textContent = panel.eyebrow;
      cell.appendChild(eyebrow);
    }
    const word = document.createElement("h2");
    word.className = "h-word";
    word.textContent = panel.word;
    cell.appendChild(word);
    if (panel.meta) {
      const meta = document.createElement("p");
      meta.className = "h-meta";
      meta.textContent = panel.meta;
      cell.appendChild(meta);
    }
    track.appendChild(cell);
  }

  const progress = document.createElement("div");
  progress.className = "h-progress";
  const progressFill = document.createElement("div");
  progressFill.className = "h-progress-fill";
  progress.appendChild(progressFill);

  section.appendChild(track);
  section.appendChild(progress);

  anchor.insertAdjacentElement("afterend", section);
  console.info(
    `[horizontal-interlude] mounted. track.scrollWidth=${track.scrollWidth} section.clientWidth=${section.clientWidth}`
  );

  const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);

  const masterTween = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${distance()}`,
      pin: true,
      anticipatePin: 1,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        gsap.set(progressFill, { scaleX: self.progress });
      }
    }
  });

  const panels = Array.from(track.querySelectorAll<HTMLElement>(".h-panel"));
  panels.forEach((panel) => {
    const word = panel.querySelector(".h-word") as HTMLElement | null;
    const meta = panel.querySelector(".h-meta") as HTMLElement | null;
    if (word) {
      gsap.fromTo(
        word,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: masterTween,
            start: "left 85%",
            end: "left 45%",
            scrub: 1
          }
        }
      );
    }
    if (meta) {
      gsap.fromTo(
        meta,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: masterTween,
            start: "left 75%",
            end: "left 35%",
            scrub: 1
          }
        }
      );
    }
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}
