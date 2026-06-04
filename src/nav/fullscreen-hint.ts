// Fullscreen affordance.
//
// Not fullscreen: a clickable "F  full screen" pill anchored bottom-right of
// the landing slot. It fades in on load, fades out when the viewer scrolls past
// the landing, and fades back in when they return.
//
// Fullscreen: a transient "ESC  exit full screen" hint that auto-fades.
//
// Touch-only devices have no keyboard and no fullscreen affordance, so we skip.

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../animation/register.js";
import "../animation/ease.js";

const ESC_FADE_AFTER_MS = 8000;
const ACTIVE_OPACITY = 0.88;

let landingBtn: HTMLButtonElement | null = null;
let visibilityTrigger: ScrollTrigger | null = null;
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

  gsap.set(btn, { opacity: 0, yPercent: 30, pointerEvents: "none" });
  gsap.to(btn, {
    opacity: ACTIVE_OPACITY,
    yPercent: 0,
    pointerEvents: "auto",
    duration: 0.7,
    delay: 0.3,
    ease: "editorial"
  });

  attachVisibilityTrigger();
}

function attachVisibilityTrigger(): void {
  const landing = document.getElementById("opening-landing");
  if (!landing) return;

  visibilityTrigger?.kill();
  visibilityTrigger = ScrollTrigger.create({
    trigger: landing,
    start: "top 60%",
    end: "bottom 40%",
    onToggle: (self) => (self.isActive ? fadeIn() : fadeOut())
  });

  const rect = landing.getBoundingClientRect();
  const vh = window.innerHeight;
  const inView = rect.top < vh * 0.6 && rect.bottom > vh * 0.4;
  if (!inView && landingBtn) {
    gsap.set(landingBtn, { opacity: 0, pointerEvents: "none" });
  }
}

function fadeIn(): void {
  if (!landingBtn) return;
  gsap.killTweensOf(landingBtn);
  gsap.to(landingBtn, {
    opacity: ACTIVE_OPACITY,
    yPercent: 0,
    pointerEvents: "auto",
    duration: 0.65,
    ease: "editorial"
  });
}

function fadeOut(): void {
  if (!landingBtn) return;
  gsap.killTweensOf(landingBtn);
  gsap.to(landingBtn, {
    opacity: 0,
    yPercent: 8,
    pointerEvents: "none",
    duration: 0.55,
    ease: "hush"
  });
}

function removeLandingButton(): void {
  visibilityTrigger?.kill();
  visibilityTrigger = null;
  if (!landingBtn) return;
  gsap.killTweensOf(landingBtn);
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
