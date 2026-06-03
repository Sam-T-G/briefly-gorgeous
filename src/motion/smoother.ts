import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";

let instance: ScrollSmoother | null = null;

export function initSmoother(): ScrollSmoother | null {
  if (instance) return instance;
  const wrapper = document.getElementById("smooth-wrapper");
  const content = document.getElementById("smooth-content");
  if (!wrapper || !content) return null;

  instance = ScrollSmoother.create({
    wrapper,
    content,
    smooth: 1.1,
    effects: true,
    smoothTouch: 0.1,
    normalizeScroll: true,
    ignoreMobileResize: true
  });

  gsap.ticker.lagSmoothing(500, 33);

  return instance;
}

export function getSmoother(): ScrollSmoother | null {
  return instance;
}
