// Subtle pulsing hint at bottom-right that prompts the next available action:
//   - Not fullscreen → "F  full screen"
//   - Fullscreen     → "ESC  exit full screen"
// Each hint shows on its triggering state-transition, then fades away on its
// own after a short timer (or sooner on user interaction). Touch-only devices
// have no keyboard, so the hint is skipped entirely there.

const FADE_AFTER_MS = 8000;
const SCROLL_DISMISS_PX = 600;

type HintState = "enter-fullscreen" | "exit-fullscreen";

let currentHint: HTMLElement | null = null;
let cleanup: (() => void) | null = null;

export function installFullscreenHint(): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

  // Initial: prompt fullscreen entry if we're not already there.
  if (!document.fullscreenElement) show("enter-fullscreen");

  document.addEventListener("fullscreenchange", () => {
    show(document.fullscreenElement ? "exit-fullscreen" : "enter-fullscreen");
  });
}

function show(state: HintState): void {
  dismissNow();

  const hint = document.createElement("div");
  hint.className = "fullscreen-hint";
  hint.setAttribute("aria-hidden", "true");

  const key = document.createElement("kbd");
  key.className = "fullscreen-hint-key";
  key.textContent = state === "enter-fullscreen" ? "F" : "ESC";

  const label = document.createElement("span");
  label.className = "fullscreen-hint-label";
  label.textContent =
    state === "enter-fullscreen" ? "full screen" : "exit full screen";

  hint.appendChild(key);
  hint.appendChild(label);
  document.body.appendChild(hint);
  currentHint = hint;

  // dismiss on the key the hint is prompting for (or any of the obvious
  // ack signals: scroll past a threshold, auto-fade timer)
  const onKey = (e: KeyboardEvent): void => {
    if (state === "enter-fullscreen" && (e.key === "f" || e.key === "F")) {
      fade();
    } else if (state === "exit-fullscreen" && e.key === "Escape") {
      fade();
    }
  };
  const onScroll = (): void => {
    if (window.scrollY > SCROLL_DISMISS_PX) fade();
  };
  const timer = window.setTimeout(fade, FADE_AFTER_MS);

  window.addEventListener("keydown", onKey, { capture: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  cleanup = (): void => {
    window.removeEventListener("keydown", onKey, { capture: true });
    window.removeEventListener("scroll", onScroll);
    window.clearTimeout(timer);
  };
}

function fade(): void {
  if (!currentHint) return;
  currentHint.classList.add("is-dismissed");
  const el = currentHint;
  currentHint = null;
  cleanup?.();
  cleanup = null;
  window.setTimeout(() => el.remove(), 900);
}

function dismissNow(): void {
  cleanup?.();
  cleanup = null;
  if (currentHint) {
    currentHint.remove();
    currentHint = null;
  }
}
