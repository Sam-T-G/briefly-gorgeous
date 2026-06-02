export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function applyStaticReflow(): void {
  document.documentElement.dataset["motion"] = "reduced";
  const main = document.getElementById("main");
  if (main) main.dataset["mode"] = "static";
}
