import { gsap } from "gsap";

type AccentSpec = { selector: string; cssVar: string; scale: number };

const ACCENT_TARGETS: AccentSpec[] = [
  { selector: ".deemed-target", cssVar: "--majoritarian-graphite", scale: 3.2 },
  { selector: ".gorgeous-target", cssVar: "--gorgeous-ember", scale: 3.6 },
  { selector: ".allows-target", cssVar: "--hunted-rust", scale: 3.2 },
  { selector: ".verge-seen-h", cssVar: "--gorgeous-ember", scale: 3.4 }
];

export function installCursor(): void {
  if (window.matchMedia("(hover: none)").matches) return;

  const cursor = document.createElement("div");
  cursor.className = "magnetic-cursor";
  cursor.setAttribute("aria-hidden", "true");
  const inner = document.createElement("div");
  inner.className = "magnetic-cursor-inner";
  cursor.appendChild(inner);
  document.body.appendChild(cursor);

  const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3" });
  const scaleTo = gsap.quickTo(inner, "scale", { duration: 0.3, ease: "power2.out" });

  window.addEventListener("pointermove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  }, { passive: true });

  const accentSelector = ACCENT_TARGETS.map((t) => t.selector).join(", ");
  const interactiveSelector = "a, button, .hud-dot, [role='button']";
  const fullSelector = `${interactiveSelector}, ${accentSelector}`;

  const rootStyles = getComputedStyle(document.documentElement);

  document.addEventListener("pointerover", (e) => {
    const t = e.target as Element | null;
    if (!t) return;
    const accent = matchAccent(t);
    if (accent) {
      const color = rootStyles.getPropertyValue(accent.cssVar).trim();
      if (color) {
        gsap.to(inner, { backgroundColor: color, duration: 0.3, ease: "power2.out" });
      }
      cursor.classList.add("is-reading");
      scaleTo(accent.scale);
      return;
    }
    if (t.closest(interactiveSelector)) scaleTo(2.4);
  });
  document.addEventListener("pointerout", (e) => {
    const t = e.target as Element | null;
    if (!t) return;
    if (matchAccent(t)) {
      gsap.to(inner, { backgroundColor: "#ffffff", duration: 0.3, ease: "power2.out" });
      cursor.classList.remove("is-reading");
      scaleTo(1);
      return;
    }
    if (t.closest(fullSelector)) scaleTo(1);
  });

  window.addEventListener("pointerleave", () => cursor.classList.add("is-hidden"));
  window.addEventListener("pointerenter", () => cursor.classList.remove("is-hidden"));
}

function matchAccent(el: Element): AccentSpec | null {
  for (const t of ACCENT_TARGETS) {
    if (el.closest(t.selector)) return t;
  }
  return null;
}
