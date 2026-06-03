import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import "../animation/ease.js";

void DrawSVGPlugin;
void MotionPathPlugin;

const SVG_NS = "http://www.w3.org/2000/svg";

export function installIntroImmersive(): void {
  if (!document.getElementById("opening-landing")) return;

  decorateIntroAtmosphere();
  decorateLanding();
  decorateWorld();
  decoratePressures();
  decorateFrame();
  decorateMotif();
  decorateFramework();

  installLandingReveal();
  installWorldReveal();
  installPressuresReveal();
  installFrameReveal();
  installMotifReveal();
  installFrameworkReveal();

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

function decorateIntroAtmosphere(): void {
  const ids = [
    "opening-landing",
    "opening-world",
    "opening-pressures",
    "opening-frame",
    "opening-motif",
    "opening-framework"
  ];
  for (const id of ids) {
    const slot = document.getElementById(id);
    if (!slot) continue;
    slot.classList.add("intro-immersive");
    if (!slot.querySelector(".intro-grain")) {
      const grain = document.createElement("div");
      grain.className = "intro-grain";
      grain.setAttribute("aria-hidden", "true");
      slot.insertBefore(grain, slot.firstChild);
    }
  }
}

function decorateLanding(): void {
  const slot = document.getElementById("opening-landing");
  if (!slot) return;
  const label = slot.querySelector(".chapter-title-label") as HTMLElement | null;
  if (!label) return;
  if (slot.querySelector(".intro-landing-underline")) return;

  const wrap = document.createElement("div");
  wrap.className = "intro-landing-underline";
  wrap.setAttribute("aria-hidden", "true");
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 220 12");
  svg.setAttribute("preserveAspectRatio", "none");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute(
    "d",
    "M2,7 C40,2 90,11 150,5 C180,2 200,7 218,5"
  );
  path.setAttribute("class", "intro-landing-underline-path");
  svg.appendChild(path);
  wrap.appendChild(svg);
  label.insertAdjacentElement("afterend", wrap);
}

function decorateWorld(): void {
  const slot = document.getElementById("opening-world");
  if (!slot) return;
  const bullets = slot.querySelectorAll<HTMLElement>(".info-bullets li");
  bullets.forEach((li, idx) => {
    li.style.setProperty("--intro-tilt", `${(idx % 2 === 0 ? -1 : 1) * 0.6}deg`);
  });
}

function decoratePressures(): void {
  const slot = document.getElementById("opening-pressures");
  if (!slot) return;
  const ul = slot.querySelector<HTMLElement>(".info-bullets");
  if (!ul) return;
  if (slot.querySelector(".intro-pressures-verge")) return;

  const verge = document.createElement("div");
  verge.className = "intro-pressures-verge";
  verge.setAttribute("aria-hidden", "true");
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 2 100");
  svg.setAttribute("preserveAspectRatio", "none");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", "M1,0 L1,100");
  path.setAttribute("class", "intro-pressures-verge-path");
  svg.appendChild(path);
  verge.appendChild(svg);
  ul.parentElement?.insertBefore(verge, ul);
  ul.style.position = "relative";
}

function decorateFrame(): void {
  const slot = document.getElementById("opening-frame");
  if (!slot) return;
  const inner = slot.querySelector<HTMLElement>(".slot-inner");
  if (!inner) return;
  inner.classList.add("intro-frame-prose");
}

function decorateMotif(): void {
  const slot = document.getElementById("opening-motif");
  if (!slot) return;
  if (slot.querySelector(".intro-motif-arc")) return;
  const inner = slot.querySelector<HTMLElement>(".slot-inner");
  if (!inner) return;

  const wrap = document.createElement("div");
  wrap.className = "intro-motif-arc";
  wrap.setAttribute("aria-hidden", "true");
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 400 120");
  svg.setAttribute("preserveAspectRatio", "none");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute(
    "d",
    "M8,100 C90,30 180,90 260,40 C320,4 360,46 392,28"
  );
  path.setAttribute("class", "intro-motif-arc-path");
  path.setAttribute("id", "intro-motif-arc-path");
  svg.appendChild(path);
  const dot = document.createElementNS(SVG_NS, "circle");
  dot.setAttribute("r", "3.4");
  dot.setAttribute("cx", "0");
  dot.setAttribute("cy", "0");
  dot.setAttribute("class", "intro-motif-arc-dot");
  svg.appendChild(dot);
  wrap.appendChild(svg);
  inner.insertBefore(wrap, inner.firstChild);
}

function decorateFramework(): void {
  const slot = document.getElementById("opening-framework");
  if (!slot) return;
  const bullets = slot.querySelectorAll<HTMLElement>(".info-bullets li");
  const verbBullet = bullets[1];
  if (!verbBullet) return;
  if (verbBullet.querySelector(".intro-verbs")) return;

  const text = verbBullet.textContent ?? "";
  const verbMatch = text.match(/Three verbs:\s*(.+)$/i);
  if (!verbMatch) return;
  const verbs = verbMatch[1]!
    .replace(/\.$/, "")
    .split(/[,/]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (verbs.length < 3) return;

  verbBullet.textContent = "Three verbs.";
  const verbsWrap = document.createElement("div");
  verbsWrap.className = "intro-verbs";
  verbs.forEach((v, idx) => {
    const span = document.createElement("span");
    span.className = "intro-verb";
    span.textContent = v;
    verbsWrap.appendChild(span);
    if (idx < verbs.length - 1) {
      const arrowWrap = document.createElement("span");
      arrowWrap.className = "intro-verb-arrow";
      arrowWrap.setAttribute("aria-hidden", "true");
      const svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("viewBox", "0 0 40 10");
      svg.setAttribute("preserveAspectRatio", "none");
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", "M2,5 L34,5 M28,1 L36,5 L28,9");
      path.setAttribute("class", "intro-verb-arrow-path");
      svg.appendChild(path);
      arrowWrap.appendChild(svg);
      verbsWrap.appendChild(arrowWrap);
    }
  });
  verbBullet.appendChild(verbsWrap);
}

function installLandingReveal(): void {
  const slot = document.getElementById("opening-landing");
  if (!slot) return;
  const eyebrow = slot.querySelector(".chapter-title-eyebrow");
  const label = slot.querySelector<HTMLElement>(".chapter-title-label");
  const subtitle = slot.querySelector(".chapter-title-subtitle");
  const underlinePath = slot.querySelector(".intro-landing-underline-path");

  let chars: Element[] = [];
  if (label) {
    const split = new SplitText(label, { type: "chars,words", charsClass: "intro-char" });
    chars = split.chars;
    gsap.set(chars, { opacity: 0, y: 18, rotateX: -32, transformOrigin: "50% 100%" });
  }
  if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 6 });
  if (subtitle) gsap.set(subtitle, { opacity: 0, y: 10 });
  if (underlinePath) gsap.set(underlinePath, { drawSVG: "0% 0%" });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 75%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline({ delay: 0.15 });
      if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.8, ease: "editorial" });
      if (chars.length > 0) {
        tl.to(
          chars,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.95,
            ease: "editorial",
            stagger: { each: 0.022, from: "start" }
          },
          "-=0.35"
        );
      }
      if (underlinePath) {
        tl.to(
          underlinePath,
          { drawSVG: "0% 100%", duration: 1.4, ease: "power2.inOut" },
          "-=0.45"
        );
      }
      if (subtitle) {
        tl.to(subtitle, { opacity: 1, y: 0, duration: 0.95, ease: "editorial" }, "-=0.8");
      }
    }
  });
}

function installWorldReveal(): void {
  const slot = document.getElementById("opening-world");
  if (!slot) return;
  const eyebrow = slot.querySelector(".info-eyebrow");
  const title = slot.querySelector(".info-title");
  const bullets = slot.querySelectorAll<HTMLElement>(".info-bullets li");
  const cover = slot.querySelector<HTMLElement>(".opening-cover");

  if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 8 });
  if (title) gsap.set(title, { opacity: 0, y: 14 });
  if (bullets.length > 0) {
    bullets.forEach((li) => {
      const tilt = li.style.getPropertyValue("--intro-tilt") || "0deg";
      gsap.set(li, {
        opacity: 0,
        y: 22,
        x: -12,
        rotate: tilt,
        transformOrigin: "0% 50%"
      });
    });
  }
  if (cover) gsap.set(cover, { opacity: 0, y: 18, rotate: -3.2, scale: 0.94 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 70%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.7, ease: "editorial" });
      if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "-=0.35");
      if (bullets.length > 0) {
        tl.to(
          bullets,
          {
            opacity: 1,
            y: 0,
            x: 0,
            rotate: 0,
            duration: 1.05,
            ease: "settle",
            stagger: 0.16
          },
          "-=0.4"
        );
      }
      if (cover) {
        tl.to(
          cover,
          { opacity: 0.45, y: 0, rotate: -2, scale: 1, duration: 1.4, ease: "editorial" },
          "-=0.7"
        );
      }
    }
  });
}

function installPressuresReveal(): void {
  const slot = document.getElementById("opening-pressures");
  if (!slot) return;
  const eyebrow = slot.querySelector(".info-eyebrow");
  const title = slot.querySelector(".info-title");
  const bullets = slot.querySelectorAll<HTMLElement>(".info-bullets li");
  const closer = slot.querySelector(".info-closer");
  const hine = slot.querySelector<HTMLElement>(".opening-hine");
  const vergePath = slot.querySelector(".intro-pressures-verge-path");

  if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 6 });
  if (title) gsap.set(title, { opacity: 0, y: 12 });
  if (bullets.length > 0) gsap.set(bullets, { opacity: 0, x: 18 });
  if (closer) gsap.set(closer, { opacity: 0, y: 8 });
  if (hine) gsap.set(hine, { opacity: 0, y: 28, rotate: 1.4 });
  if (vergePath) gsap.set(vergePath, { drawSVG: "0% 0%" });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 70%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.7, ease: "editorial" });
      if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "-=0.35");
      if (vergePath) {
        tl.to(
          vergePath,
          { drawSVG: "0% 100%", duration: 1.6, ease: "power2.inOut" },
          "-=0.4"
        );
      }
      if (bullets.length > 0) {
        tl.to(
          bullets,
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            ease: "editorial",
            stagger: 0.28
          },
          "-=1.3"
        );
      }
      if (closer) tl.to(closer, { opacity: 1, y: 0, duration: 0.9, ease: "editorial" }, "-=0.15");
      if (hine) {
        tl.to(
          hine,
          { opacity: 0.5, y: 0, rotate: 0, duration: 1.4, ease: "editorial" },
          "-=1"
        );
      }
    }
  });
}

function installFrameReveal(): void {
  const slot = document.getElementById("opening-frame");
  if (!slot) return;
  const paragraphs = slot.querySelectorAll<HTMLElement>(".transition-paragraph");
  if (paragraphs.length === 0) return;

  const allWords: Element[] = [];
  paragraphs.forEach((p) => {
    const split = new SplitText(p, { type: "words,lines", wordsClass: "intro-frame-word" });
    allWords.push(...split.words);
  });
  gsap.set(allWords, { opacity: 0, y: 10 });
  gsap.set(paragraphs, { opacity: 1 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 72%",
    once: true,
    onEnter: () => {
      gsap.to(allWords, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "editorial",
        stagger: 0.025
      });
    }
  });
}

function installMotifReveal(): void {
  const slot = document.getElementById("opening-motif");
  if (!slot) return;
  const eyebrow = slot.querySelector(".info-eyebrow");
  const title = slot.querySelector(".info-title");
  const bullets = slot.querySelectorAll<HTMLElement>(".info-bullets li");
  const closer = slot.querySelector(".info-closer");
  const arcPath = slot.querySelector<SVGPathElement>(".intro-motif-arc-path");
  const arcDot = slot.querySelector<SVGCircleElement>(".intro-motif-arc-dot");

  if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 6 });
  if (title) gsap.set(title, { opacity: 0, y: 12 });
  if (bullets.length > 0) gsap.set(bullets, { opacity: 0, y: 10 });
  if (closer) gsap.set(closer, { opacity: 0, y: 8 });
  if (arcPath) gsap.set(arcPath, { drawSVG: "0% 0%" });
  if (arcDot) gsap.set(arcDot, { opacity: 0 });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 70%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.7, ease: "editorial" });
      if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "-=0.35");
      if (arcPath) {
        tl.to(
          arcPath,
          { drawSVG: "0% 100%", duration: 1.6, ease: "power2.inOut" },
          "-=0.4"
        );
      }
      if (arcDot && arcPath) {
        tl.to(arcDot, { opacity: 1, duration: 0.35, ease: "editorial" }, "-=1.55");
        tl.to(
          arcDot,
          {
            duration: 1.55,
            ease: "power2.inOut",
            motionPath: {
              path: arcPath,
              align: arcPath,
              alignOrigin: [0.5, 0.5],
              autoRotate: false
            }
          },
          "-=1.55"
        );
        tl.to(arcDot, { opacity: 0, duration: 0.5, ease: "editorial" }, "-=0.2");
      }
      if (bullets.length > 0) {
        tl.to(
          bullets,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "editorial",
            stagger: 0.2
          },
          "-=1.2"
        );
      }
      if (closer) tl.to(closer, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "-=0.15");
    }
  });
}

function installFrameworkReveal(): void {
  const slot = document.getElementById("opening-framework");
  if (!slot) return;
  const eyebrow = slot.querySelector(".info-eyebrow");
  const title = slot.querySelector(".info-title");
  const bullets = slot.querySelectorAll<HTMLElement>(".info-bullets li");
  const closer = slot.querySelector(".info-closer");
  const verbs = slot.querySelectorAll<HTMLElement>(".intro-verb");
  const arrows = slot.querySelectorAll<SVGPathElement>(".intro-verb-arrow-path");

  if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 6 });
  if (title) gsap.set(title, { opacity: 0, y: 12 });
  if (bullets.length > 0) gsap.set(bullets, { opacity: 0, y: 10 });
  if (closer) gsap.set(closer, { opacity: 0, y: 8 });
  if (verbs.length > 0) gsap.set(verbs, { opacity: 0, y: 12, scale: 0.94, transformOrigin: "50% 50%" });
  if (arrows.length > 0) gsap.set(arrows, { drawSVG: "0% 0%" });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 70%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.7, ease: "editorial" });
      if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.85, ease: "editorial" }, "-=0.35");
      if (bullets.length > 0) {
        tl.to(
          bullets,
          { opacity: 1, y: 0, duration: 0.8, ease: "editorial", stagger: 0.18 },
          "-=0.3"
        );
      }
      verbs.forEach((verb, idx) => {
        tl.to(
          verb,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "editorial"
          },
          idx === 0 ? "+=0.2" : "-=0.15"
        );
        const arrow = arrows[idx];
        if (arrow) {
          tl.to(
            arrow,
            { drawSVG: "0% 100%", duration: 0.55, ease: "power2.inOut" },
            "-=0.3"
          );
        }
      });
      if (closer) tl.to(closer, { opacity: 1, y: 0, duration: 0.9, ease: "editorial" }, "+=0.15");
    }
  });
}
