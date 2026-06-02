export function installReadingModeToggle(): void {
  const main = document.getElementById("main");
  if (!main) return;

  window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) return;
    if (event.key !== "r" && event.key !== "R") return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement | null;
    if (target && isEditable(target)) return;
    event.preventDefault();
    toggle(main);
  });
}

function toggle(main: HTMLElement): void {
  const next = main.dataset["mode"] === "static" ? "presentation" : "static";
  main.dataset["mode"] = next;
}

function isEditable(el: HTMLElement): boolean {
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return el.isContentEditable;
}
