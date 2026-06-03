import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CHAPTER_TARGETS: Array<{ id: string; label: string }> = [
  { id: "opening", label: "Opening" },
  { id: "ch1-open", label: "I. Porcelain" },
  { id: "ch2-open", label: "II. Sunset" },
  { id: "ch3-open", label: "III. Fragment" },
  { id: "closing-thesis", label: "Closing" }
];

export function installHud(): void {
  const existing = document.querySelector(".hud");
  if (existing) existing.remove();

  const hud = document.createElement("div");
  hud.className = "hud";
  hud.setAttribute("aria-hidden", "true");

  const progress = document.createElement("div");
  progress.className = "hud-progress";
  const progressFill = document.createElement("div");
  progressFill.className = "hud-progress-fill";
  progress.appendChild(progressFill);

  const label = document.createElement("div");
  label.className = "hud-label";
  label.textContent = CHAPTER_TARGETS[0]?.label ?? "";

  const dots = document.createElement("nav");
  dots.className = "hud-dots";
  dots.setAttribute("aria-label", "Chapter navigation");
  for (const target of CHAPTER_TARGETS) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "hud-dot";
    dot.dataset.target = target.id;
    dot.setAttribute("aria-label", `Jump to ${target.label}`);
    dot.addEventListener("click", () => jumpTo(target.id));
    dots.appendChild(dot);
  }

  hud.appendChild(progress);
  hud.appendChild(label);
  hud.appendChild(dots);
  document.body.appendChild(hud);

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      gsap.to(progressFill, {
        scaleX: self.progress,
        duration: 0.15,
        ease: "none",
        overwrite: true
      });
    }
  });

  const dotButtons = Array.from(dots.querySelectorAll<HTMLButtonElement>(".hud-dot"));
  for (let i = 0; i < CHAPTER_TARGETS.length; i++) {
    const target = CHAPTER_TARGETS[i];
    if (!target) continue;
    const el = document.getElementById(target.id);
    if (!el) continue;
    const labelText = target.label;
    ScrollTrigger.create({
      trigger: el,
      start: "top 60%",
      end: "bottom 40%",
      onToggle: (self) => {
        if (!self.isActive) return;
        for (const btn of dotButtons) btn.dataset.active = "false";
        const active = dotButtons[i];
        if (active) active.dataset.active = "true";
        label.textContent = labelText;
      }
    });
  }
}

function jumpTo(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  gsap.to(window, {
    scrollTo: { y: top, autoKill: true },
    duration: 1.1,
    ease: "power2.inOut"
  });
}
