import { goToFirst, goToLast, goToNext, goToPrev } from "./checkpoints.js";

export function installKeyboardNav(): void {
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && isEditable(target)) return;

      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
        case "PageDown":
        case " ":
          event.preventDefault();
          goToNext();
          return;
        case "ArrowUp":
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault();
          goToPrev();
          return;
        case "Home":
          event.preventDefault();
          goToFirst();
          return;
        case "End":
          event.preventDefault();
          goToLast();
          return;
        case "f":
        case "F":
          event.preventDefault();
          toggleFullscreen();
          return;
      }
    },
    { capture: true }
  );
}

function toggleFullscreen(): void {
  if (document.fullscreenElement) {
    void document.exitFullscreen();
  } else {
    void document.documentElement.requestFullscreen();
  }
}

function isEditable(el: HTMLElement): boolean {
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return el.isContentEditable;
}
