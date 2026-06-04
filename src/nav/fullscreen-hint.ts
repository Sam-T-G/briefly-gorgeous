// Persistent fullscreen affordance.
//
// Not fullscreen: a small clickable pill at bottom-right of the landing slot
// inviting "F  full screen". When the viewer scrolls off the landing slot the
// pill stows to the right rail next to the chapter navigation dots, collapsing
// to just the key chip. Scrolling back to the landing un-stows it. The pill
// itself is clickable so a mouse-only viewer never needs to know the F key.
//
// Fullscreen: a transient "ESC  exit full screen" hint that auto-fades.
//
// Touch-only devices have no keyboard and no fullscreen affordance, so we skip.

import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../animation/register.js";

const ESC_FADE_AFTER_MS = 8000;

let landingBtn: HTMLButtonElement | null = null;
let stowTrigger: ScrollTrigger | null = null;
let escHint: HTMLElement | null = null;
let escTimer: number | null = null;

export function installFullscreenHint(): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

  if (!document.fullscreenElement) installLandingButton();

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      removeLandingButton();
      showEscHint();
    } else {
      hideEscHint();
      installLandingButton();
    }
  });
}

function installLandingButton(): void {
  if (landingBtn) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "fullscreen-hint fullscreen-hint-landing";
  btn.setAttribute("aria-label", "Enter full screen");

  const key = document.createElement("kbd");
  key.className = "fullscreen-hint-key";
  key.textContent = "F";

  const label = document.createElement("span");
  label.className = "fullscreen-hint-label";
  label.textContent = "full screen";

  btn.appendChild(key);
  btn.appendChild(label);
  document.body.appendChild(btn);
  landingBtn = btn;

  btn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen?.();
    }
  });

  attachStowTrigger(btn);
}

function attachStowTrigger(btn: HTMLButtonElement): void {
  const landing = document.getElementById("opening-landing");
  if (!landing) return;

  const setStowed = (stowed: boolean): void => {
    btn.classList.toggle("is-stowed", stowed);
  };

  stowTrigger?.kill();
  stowTrigger = ScrollTrigger.create({
    trigger: landing,
    start: "top 60%",
    end: "bottom 40%",
    onToggle: (self) => setStowed(!self.isActive)
  });

  // Initial state: stow if landing isn't already in view at install time.
  const rect = landing.getBoundingClientRect();
  const vh = window.innerHeight;
  const inView = rect.top < vh * 0.6 && rect.bottom > vh * 0.4;
  setStowed(!inView);
}

function removeLandingButton(): void {
  stowTrigger?.kill();
  stowTrigger = null;
  if (!landingBtn) return;
  landingBtn.remove();
  landingBtn = null;
}

function showEscHint(): void {
  hideEscHint();

  const hint = document.createElement("div");
  hint.className = "fullscreen-hint fullscreen-hint-esc";
  hint.setAttribute("aria-hidden", "true");

  const key = document.createElement("kbd");
  key.className = "fullscreen-hint-key";
  key.textContent = "ESC";

  const label = document.createElement("span");
  label.className = "fullscreen-hint-label";
  label.textContent = "exit full screen";

  hint.appendChild(key);
  hint.appendChild(label);
  document.body.appendChild(hint);
  escHint = hint;

  escTimer = window.setTimeout(hideEscHint, ESC_FADE_AFTER_MS);
}

function hideEscHint(): void {
  if (escTimer !== null) {
    window.clearTimeout(escTimer);
    escTimer = null;
  }
  if (!escHint) return;
  escHint.classList.add("is-dismissed");
  const el = escHint;
  escHint = null;
  window.setTimeout(() => el.remove(), 900);
}
