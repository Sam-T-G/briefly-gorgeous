import { ScrollTrigger } from "gsap/ScrollTrigger";

export function refreshOnFontsReady(): void {
  if (!("fonts" in document)) return;
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
