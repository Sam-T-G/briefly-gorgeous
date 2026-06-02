export function installHelpOverlay(): void {
  const overlay = buildOverlay();
  document.body.appendChild(overlay);

  window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement | null;
    if (target && isEditable(target)) return;

    if (event.key === "?" || (event.shiftKey && event.key === "/")) {
      event.preventDefault();
      open(overlay);
      return;
    }
    if (event.key === "Escape" && overlay.dataset["open"] === "true") {
      event.preventDefault();
      close(overlay);
    }
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close(overlay);
  });
}

function buildOverlay(): HTMLDivElement {
  const overlay = document.createElement("div");
  overlay.className = "help-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Keyboard shortcuts");
  overlay.dataset["open"] = "false";

  const card = document.createElement("div");
  card.className = "help-overlay-card";
  card.innerHTML = `
    <h2>Keyboard shortcuts</h2>
    <dl>
      <dt>↓ / Space</dt><dd>Next slot</dd>
      <dt>↑</dt><dd>Previous slot</dd>
      <dt>Home / End</dt><dd>Jump to start or end</dd>
      <dt>R</dt><dd>Toggle reading mode</dd>
      <dt>F</dt><dd>Toggle fullscreen</dd>
      <dt>?</dt><dd>Show this help</dd>
      <dt>Esc</dt><dd>Close this help</dd>
    </dl>`;
  overlay.appendChild(card);
  return overlay;
}

function open(overlay: HTMLElement): void {
  overlay.dataset["open"] = "true";
}

function close(overlay: HTMLElement): void {
  overlay.dataset["open"] = "false";
}

function isEditable(el: HTMLElement): boolean {
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return el.isContentEditable;
}
