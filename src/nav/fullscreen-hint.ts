// Persistent fullscreen affordance.
//
// Not fullscreen: a small clickable pill at bottom-right of the landing slot
// inviting "F  full screen". When the viewer scrolls off the landing slot the
// pill stows to the right rail just under the chapter navigation dots and
// quiets to a near-dormant chip. Returning to the landing un-stows it. GSAP
// drives the stow/un-stow choreography so the motion stays seamless.
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
const STOWED_OPACITY = 0.32;

let landingBtn: HTMLButtonElement | null = null;
let landingLabel: HTMLSpanElement | null = null;
let stowTrigger: ScrollTrigger | null = null;
let pulseTween: gsap.core.Tween | null = null;
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
  landingLabel = label;
  void key;

  btn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen?.();
    }
  });

  // Initial: hidden, then GSAP enters it into the active state.
  gsap.set(btn, { opacity: 0, yPercent: 30 });
  gsap.set(label, { maxWidth: "12rem", opacity: 1, marginInlineStart: 0 });
  gsap.to(btn, {
    opacity: ACTIVE_OPACITY,
    yPercent: 0,
    duration: 0.7,
    delay: 0.3,
    ease: "editorial"
  });
  startPulse();

  attachStowTrigger();
}

function startPulse(): void {
  if (!landingBtn || pulseTween) return;
  pulseTween = gsap.to(landingBtn, {
    opacity: ACTIVE_OPACITY * 0.72,
    duration: 1.6,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });
}

function stopPulse(): void {
  pulseTween?.kill();
  pulseTween = null;
}

function attachStowTrigger(): void {
  const landing = document.getElementById("opening-landing");
  if (!landing) return;

  stowTrigger?.kill();
  stowTrigger = ScrollTrigger.create({
    trigger: landing,
    start: "top 60%",
    end: "bottom 40%",
    onToggle: (self) => (self.isActive ? unstowLanding() : stowLanding())
  });

  // Initial state: if landing isn't in view at install, snap-stow without
  // animating in from the active position.
  const rect = landing.getBoundingClientRect();
  const vh = window.innerHeight;
  const inView = rect.top < vh * 0.6 && rect.bottom > vh * 0.4;
  if (!inView) snapToStowed();
}

function stowLanding(): void {
  if (!landingBtn || !landingLabel) return;
  stopPulse();
  landingBtn.classList.add("is-stowed");

  gsap.killTweensOf([landingBtn, landingLabel]);
  const tl = gsap.timeline({
    onComplete: () => {
      // After the stow lands, restart a quieter pulse on the docked chip.
      pulseTween = gsap.to(landingBtn, {
        opacity: STOWED_OPACITY * 0.6,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }
  });
  tl.to(
    landingLabel,
    {
      maxWidth: 0,
      opacity: 0,
      marginInlineStart: "-0.55rem",
      duration: 0.42,
      ease: "hush"
    },
    0
  );
  tl.to(
    landingBtn,
    {
      bottom: "auto",
      top: "calc(50% + 5.25rem)",
      right: "0.9rem",
      yPercent: -50,
      paddingTop: "0.28rem",
      paddingBottom: "0.28rem",
      paddingLeft: "0.28rem",
      paddingRight: "0.28rem",
      gap: 0,
      opacity: STOWED_OPACITY,
      duration: 0.92,
      ease: "settle"
    },
    0.04
  );
}

function unstowLanding(): void {
  if (!landingBtn || !landingLabel) return;
  stopPulse();
  landingBtn.classList.remove("is-stowed");

  gsap.killTweensOf([landingBtn, landingLabel]);
  const tl = gsap.timeline({
    onComplete: () => startPulse()
  });
  tl.to(
    landingBtn,
    {
      top: "auto",
      bottom: "clamp(1rem, 2.6vh, 1.75rem)",
      right: "clamp(1rem, 2.6vw, 1.75rem)",
      yPercent: 0,
      paddingTop: "0.4rem",
      paddingBottom: "0.4rem",
      paddingLeft: "0.45rem",
      paddingRight: "0.85rem",
      gap: "0.55rem",
      opacity: ACTIVE_OPACITY,
      duration: 0.85,
      ease: "editorial"
    },
    0
  );
  tl.to(
    landingLabel,
    {
      maxWidth: "12rem",
      opacity: 1,
      marginInlineStart: 0,
      duration: 0.55,
      ease: "editorial"
    },
    0.18
  );
}

function snapToStowed(): void {
  if (!landingBtn || !landingLabel) return;
  stopPulse();
  landingBtn.classList.add("is-stowed");
  gsap.killTweensOf([landingBtn, landingLabel]);

  gsap.set(landingLabel, {
    maxWidth: 0,
    opacity: 0,
    marginInlineStart: "-0.55rem"
  });
  gsap.set(landingBtn, {
    bottom: "auto",
    top: "calc(50% + 5.25rem)",
    right: "0.9rem",
    yPercent: -50,
    paddingTop: "0.28rem",
    paddingBottom: "0.28rem",
    paddingLeft: "0.28rem",
    paddingRight: "0.28rem",
    gap: 0,
    opacity: STOWED_OPACITY
  });
  pulseTween = gsap.to(landingBtn, {
    opacity: STOWED_OPACITY * 0.6,
    duration: 2.4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });
}

function removeLandingButton(): void {
  stowTrigger?.kill();
  stowTrigger = null;
  stopPulse();
  if (!landingBtn) return;
  gsap.killTweensOf(landingBtn);
  landingBtn.remove();
  landingBtn = null;
  landingLabel = null;
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
