import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

void DrawSVGPlugin;
void MotionPathPlugin;

const SVG_NS = "http://www.w3.org/2000/svg";
const CH2_SLOT_IDS = ["ch2-open", "ch2-deemed", "ch2-verge", "ch2-lens", "ch2-close"];

export function installChapter2Horizontal(): void {
  const slots = CH2_SLOT_IDS
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  if (slots.length === 0) {
    console.warn("[ch2-horizontal] no Ch2 slots found");
    return;
  }
  if (document.getElementById("ch2-horizontal")) return;

  const firstSlot = slots[0];
  if (!firstSlot || !firstSlot.parentNode) return;

  const section = document.createElement("section");
  section.id = "ch2-horizontal";
  section.className = "ch2-horizontal";
  section.setAttribute("aria-label", "Chapter 2 — Sunset");

  const track = document.createElement("div");
  track.className = "ch2-track";

  firstSlot.parentNode.insertBefore(section, firstSlot);
  for (const slot of slots) {
    slot.classList.add("ch2-panel");
    track.appendChild(slot);
  }
  section.appendChild(track);

  decorateOpenPanel();
  decorateVergePanel();
  splitLensIntoPanels(track);

  const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);

  const masterTween = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${distance()}`,
      pin: true,
      anticipatePin: 1,
      scrub: 1,
      invalidateOnRefresh: true
    }
  });

  installSunsetColorArc(section, masterTween);
  installSunArcMeridian(section, masterTween);
  installOpenPanel(masterTween);
  installDeemedPanel(masterTween);
  installVergePanel(masterTween);
  installLensPanel(masterTween);
  installClosePanel(masterTween);

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

function installSunsetColorArc(section: HTMLElement, master: gsap.core.Tween): void {
  if (!master.scrollTrigger) return;
  const track = section.querySelector(".ch2-track") as HTMLElement | null;
  if (!track) return;

  const sky = document.createElement("div");
  sky.className = "ch2-sky";
  sky.setAttribute("aria-hidden", "true");

  const sun = document.createElement("div");
  sun.className = "ch2-sun";
  sun.setAttribute("aria-hidden", "true");

  const afterglow = document.createElement("div");
  afterglow.className = "ch2-afterglow";
  afterglow.setAttribute("aria-hidden", "true");

  section.insertBefore(sky, track);
  section.insertBefore(afterglow, track);
  section.insertBefore(sun, track);

  gsap.set(section, {
    "--ch2-sky-top": "#C7D0D6",
    "--ch2-sky-mid": "#F0E5D0",
    "--ch2-sky-bottom": "#F6F2EA",
    "--ch2-sun-core": "#F2DCAD",
    "--ch2-afterglow": "rgba(248, 215, 168, 0)",
    "--ch2-ink": "#3A3025",
    "--ch2-ink-soft": "#5A4A3A"
  });
  gsap.set(sun, { scale: 0.85, opacity: 0.35 });
  gsap.set(afterglow, { opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${Math.max(0, track.scrollWidth - section.clientWidth)}`,
      scrub: 1,
      invalidateOnRefresh: true
    }
  });

  tl.to(section, {
    "--ch2-sky-top": "#D4B89C",
    "--ch2-sky-mid": "#EBD4A8",
    "--ch2-sky-bottom": "#F4E8D0",
    "--ch2-sun-core": "#FBC97A",
    "--ch2-ink": "#2E2A30",
    "--ch2-ink-soft": "#4A4248",
    duration: 1, ease: "power1.inOut"
  }, 0);
  tl.to(sun, { scale: 0.95, opacity: 0.6, duration: 1, ease: "power1.inOut" }, 0);
  tl.to(afterglow, { opacity: 0.15, duration: 1, ease: "power1.inOut" }, 0);

  tl.to(section, {
    "--ch2-sky-top": "#C6907A",
    "--ch2-sky-mid": "#EBB283",
    "--ch2-sky-bottom": "#F4D2A8",
    "--ch2-sun-core": "#FBA86A",
    "--ch2-afterglow": "rgba(248, 168, 110, 0.45)",
    "--ch2-ink": "#252836",
    "--ch2-ink-soft": "#414652",
    duration: 1, ease: "power1.inOut"
  });
  tl.to(sun, { scale: 1.05, opacity: 0.8, duration: 1, ease: "power1.inOut" }, "<");
  tl.to(afterglow, { opacity: 0.4, duration: 1, ease: "power1.inOut" }, "<");

  tl.to(section, {
    "--ch2-sky-top": "#A86F5C",
    "--ch2-sky-mid": "#E69E70",
    "--ch2-sky-bottom": "#F0C28E",
    "--ch2-sun-core": "#F88B45",
    "--ch2-afterglow": "rgba(248, 130, 70, 0.7)",
    "--ch2-ink": "#1E2433",
    "--ch2-ink-soft": "#3B4252",
    duration: 1, ease: "power1.inOut"
  });
  tl.to(sun, { scale: 1.15, opacity: 0.95, duration: 1, ease: "power1.inOut" }, "<");
  tl.to(afterglow, { opacity: 0.65, duration: 1, ease: "power1.inOut" }, "<");

  tl.to(section, {
    "--ch2-sky-top": "#B5836B",
    "--ch2-sky-mid": "#E8B583",
    "--ch2-sky-bottom": "#EBCEA8",
    "--ch2-sun-core": "#DB6F2A",
    "--ch2-afterglow": "rgba(220, 110, 60, 0.55)",
    "--ch2-ink": "#27313F",
    "--ch2-ink-soft": "#42495A",
    duration: 1, ease: "power1.inOut"
  });
  tl.to(sun, { scale: 1.05, opacity: 0.6, duration: 1, ease: "power1.inOut" }, "<");
  tl.to(afterglow, { opacity: 0.55, duration: 1, ease: "power1.inOut" }, "<");

  tl.to(section, {
    "--ch2-sky-top": "#D4C0AA",
    "--ch2-sky-mid": "#EDE0C8",
    "--ch2-sky-bottom": "#F6F1E6",
    "--ch2-sun-core": "#C25C28",
    "--ch2-afterglow": "rgba(220, 130, 80, 0.2)",
    "--ch2-ink": "#3A3025",
    "--ch2-ink-soft": "#5A4A3A",
    duration: 1, ease: "power1.inOut"
  });
  tl.to(sun, { scale: 0.95, opacity: 0, duration: 1, ease: "power1.inOut" }, "<");
  tl.to(afterglow, { opacity: 0.15, duration: 1, ease: "power1.inOut" }, "<");
}

function installSunArcMeridian(section: HTMLElement, master: gsap.core.Tween): void {
  if (!master.scrollTrigger) return;
  const track = section.querySelector(".ch2-track") as HTMLElement | null;
  const sun = section.querySelector(".ch2-sun") as HTMLElement | null;
  if (!track || !sun) return;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "ch2-meridian-svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");

  // Sun rides this hidden arc from upper-left across to lower-right.
  const sunPath = document.createElementNS(SVG_NS, "path");
  sunPath.setAttribute("d", "M 6,30 Q 50,40 94,82");
  sunPath.setAttribute("class", "ch2-meridian-track");
  sunPath.setAttribute("id", "ch2-meridian-sun-path");
  svg.appendChild(sunPath);

  // Foreground flock — each bird gets its own trajectory and size.
  type Trajectory = {
    pathD: string;
    birdD: string;
    ease: string;
    start: number;
    duration: number;
    opacity: number;
    strokeWidth: number;
  };
  const trajectories: Trajectory[] = [
    {
      // Large near bird — high lazy arc across the upper sky.
      pathD: "M -10,26 Q 30,16 60,22 Q 88,28 112,32",
      birdD: "M -1.8,0.7 Q -0.9,-1.2 0,0.7 Q 0.9,-1.2 1.8,0.7",
      ease: "power1.inOut",
      start: 0.02,
      duration: 0.92,
      opacity: 0.82,
      strokeWidth: 0.75
    },
    {
      // Mid bird — dipping path that crosses the sun's altitude midway.
      pathD: "M -6,58 Q 28,76 56,48 Q 80,28 110,40",
      birdD: "M -1.0,0.45 Q -0.5,-0.7 0,0.45 Q 0.5,-0.7 1.0,0.45",
      ease: "power2.in",
      start: 0.14,
      duration: 0.78,
      opacity: 0.7,
      strokeWidth: 0.55
    },
    {
      // Small distant bird — quick shallow cross low in the frame.
      pathD: "M -4,80 Q 26,90 58,76 Q 84,64 110,82",
      birdD: "M -0.55,0.28 Q -0.275,-0.4 0,0.28 Q 0.275,-0.4 0.55,0.28",
      ease: "none",
      start: 0.22,
      duration: 0.66,
      opacity: 0.6,
      strokeWidth: 0.4
    }
  ];

  const flock = trajectories.map((t, i) => {
    const trail = document.createElementNS(SVG_NS, "path");
    trail.setAttribute("d", t.pathD);
    trail.setAttribute("class", "ch2-meridian-track");
    trail.setAttribute("id", `ch2-flock-trail-${i}`);
    svg.appendChild(trail);
    const bird = document.createElementNS(SVG_NS, "path");
    bird.setAttribute("d", t.birdD);
    bird.setAttribute("class", `ch2-flock-bird ch2-flock-bird-${i}`);
    bird.setAttribute("stroke-width", String(t.strokeWidth));
    svg.appendChild(bird);
    return { bird, trail, traj: t };
  });

  section.appendChild(svg);

  gsap.set(sun, { xPercent: -50, yPercent: -50 });
  for (const { bird } of flock) gsap.set(bird, { opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${Math.max(0, track.scrollWidth - section.clientWidth)}`,
      scrub: 1,
      invalidateOnRefresh: true
    }
  });

  tl.to(sun, {
    duration: 1,
    ease: "none",
    motionPath: {
      path: sunPath,
      align: sunPath,
      alignOrigin: [0.5, 0.5],
      autoRotate: false
    }
  }, 0);

  for (const { bird, trail, traj } of flock) {
    tl.to(bird, { opacity: traj.opacity, duration: 0.06, ease: "none" }, traj.start);
    tl.to(
      bird,
      {
        duration: traj.duration,
        ease: traj.ease,
        motionPath: {
          path: trail,
          align: trail,
          alignOrigin: [0.5, 0.5],
          autoRotate: false
        }
      },
      traj.start
    );
    tl.to(bird, { opacity: 0, duration: 0.08, ease: "none" }, traj.start + traj.duration - 0.06);
  }
}

function decorateOpenPanel(): void {
  const panel = document.getElementById("ch2-open");
  if (!panel) return;
  const inner = panel.querySelector(".slot-inner");
  if (!inner) return;
  inner.appendChild(buildHorizon("ch2-sunset-horizon"));
}

function decorateVergePanel(): void {
  const panel = document.getElementById("ch2-verge");
  if (!panel) return;
  const secondHalf = panel.querySelector(".quote-half-second");
  if (secondHalf) wrapTextOccurrences(secondHalf, ["To be", "first be seen", "to be seen"], "verge-seen-h");
  panel.appendChild(buildHorizon("ch2-verge-horizon"));
}

function splitLensIntoPanels(track: HTMLElement): void {
  const original = document.getElementById("ch2-lens");
  if (!original) return;
  const inner = original.querySelector(".slot-inner") as HTMLElement | null;
  if (!inner) return;

  const methodology = inner.querySelector(".lens-item:nth-of-type(1)") as HTMLElement | null;
  const lens = inner.querySelector(".lens-item:nth-of-type(2)") as HTMLElement | null;
  const analysis = inner.querySelector(".analysis") as HTMLElement | null;
  if (!methodology || !lens || !analysis) return;

  const cls = original.className;
  const dataType = original.getAttribute("data-type");

  const buildPanel = (id: string, card: HTMLElement, variant: string): HTMLElement => {
    const panel = document.createElement("section");
    panel.id = id;
    panel.className = cls;
    panel.classList.add("ch2-lens-panel");
    panel.dataset.lensVariant = variant;
    if (dataType) panel.setAttribute("data-type", dataType);
    const slotInner = document.createElement("div");
    slotInner.className = "slot-inner";
    slotInner.appendChild(card);
    panel.appendChild(slotInner);
    return panel;
  };

  const a = buildPanel("ch2-lens-methodology", methodology, "methodology");
  const b = buildPanel("ch2-lens-lens", lens, "lens");
  const c = buildPanel("ch2-lens-analysis", analysis, "analysis");

  track.insertBefore(a, original);
  track.insertBefore(b, original);
  track.insertBefore(c, original);
  original.remove();
}

type PanelTimelineOpts = { firstPanel?: boolean };

function panelTimeline(
  panel: HTMLElement,
  master: gsap.core.Tween,
  opts: PanelTimelineOpts = {},
  onUpdate?: (self: ScrollTrigger) => void
): gsap.core.Timeline {
  const start = opts.firstPanel ? "left left" : "left right";
  const stVars: ScrollTrigger.Vars = {
    trigger: panel,
    containerAnimation: master,
    start,
    end: "right left",
    scrub: true,
    invalidateOnRefresh: true
  };
  if (onUpdate) stVars.onUpdate = onUpdate;
  return gsap.timeline({ scrollTrigger: stVars });
}

function installOpenPanel(master: gsap.core.Tween): void {
  const panel = document.getElementById("ch2-open");
  if (!panel) return;
  const label = panel.querySelector(".chapter-title-label") as HTMLElement | null;
  const subtitle = panel.querySelector(".chapter-title-subtitle") as HTMLElement | null;
  const horizon = panel.querySelector(".ch2-sunset-horizon line") as SVGElement | null;
  if (!label || !subtitle) return;

  const charSplit = new SplitText(subtitle, { type: "chars", charsClass: "split-char" });

  gsap.set(label, { opacity: 0, y: 18 });
  gsap.set(charSplit.chars, { opacity: 0, y: 44, rotateX: -55 });
  if (horizon) gsap.set(horizon, { scaleX: 0, transformOrigin: "left center", opacity: 0.85 });

  const tl = panelTimeline(panel, master, { firstPanel: true });

  // ENTER (0 → 0.5): sun rises
  tl.to(label, { opacity: 0.7, y: 0, duration: 0.18, ease: "power2.out" }, 0);
  tl.to(charSplit.chars, {
    opacity: 1, y: 0, rotateX: 0,
    stagger: 0.035, duration: 0.32, ease: "power3.out"
  }, 0.05);
  if (horizon) {
    tl.to(horizon, { scaleX: 1, duration: 0.45, ease: "power2.inOut" }, 0.15);
  }

  // EXIT (0.55 → 1): sun sets — horizon dims, title settles in place and fades
  if (horizon) tl.to(horizon, { opacity: 0.25, duration: 0.3, ease: "power2.in" }, 0.65);
  tl.to([label, subtitle], {
    y: 14,
    scale: 0.985,
    opacity: 0.22,
    duration: 0.38,
    ease: "power2.in",
    transformOrigin: "50% 50%"
  }, 0.62);
}

function installDeemedPanel(master: gsap.core.Tween): void {
  const panel = document.getElementById("ch2-deemed");
  if (!panel) return;
  const setup = panel.querySelector(".setup") as HTMLElement | null;
  const first = panel.querySelector(".quote-half-first") as HTMLElement | null;
  const second = panel.querySelector(".quote-half-second") as HTMLElement | null;
  const cite = panel.querySelector(".chrome-citation") as HTMLElement | null;
  const analysis = panel.querySelector(".analysis") as HTMLElement | null;
  if (!first || !second) return;

  const splitFirst = new SplitText(first, { type: "words", wordsClass: "split-word" });
  const splitSecond = new SplitText(second, { type: "words", wordsClass: "split-word" });

  const tail = [setup, cite, analysis].filter((el): el is HTMLElement => el !== null);
  gsap.set(tail, { opacity: 0, y: 16 });
  gsap.set(splitFirst.words, { opacity: 0, y: 28, x: 18 });
  gsap.set(splitSecond.words, { opacity: 0, y: 28, x: 18 });

  const tl = panelTimeline(panel, master);

  // ENTER (0 → 0.5): setup, half 1, beat, half 2 — verdict arrives
  if (setup) tl.to(setup, { opacity: 0.92, y: 0, duration: 0.1, ease: "power2.out" }, 0.04);
  tl.to(splitFirst.words, {
    opacity: 1, y: 0, x: 0,
    stagger: 0.012, duration: 0.16, ease: "power2.out"
  }, 0.08);
  tl.to(splitSecond.words, {
    opacity: 1, y: 0, x: 0,
    stagger: 0.014, duration: 0.18, ease: "power2.out"
  }, 0.32);
  if (cite) tl.to(cite, { opacity: 0.88, y: 0, duration: 0.1, ease: "power2.out" }, 0.46);
  if (analysis) tl.to(analysis, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.5);

  // EXIT (0.7 → 1): drift left, fade
  const exitTargets = [first, second, setup, cite, analysis]
    .filter((el): el is HTMLElement => el !== null);
  tl.to(exitTargets, {
    x: () => -panel.clientWidth * 0.06,
    opacity: 0.2, duration: 0.3, ease: "power2.in"
  }, 0.72);
}

function installVergePanel(master: gsap.core.Tween): void {
  const panel = document.getElementById("ch2-verge");
  if (!panel) return;
  const setup = panel.querySelector(".setup") as HTMLElement | null;
  const first = panel.querySelector(".quote-half-first") as HTMLElement | null;
  const second = panel.querySelector(".quote-half-second") as HTMLElement | null;
  const cite = panel.querySelector(".chrome-citation") as HTMLElement | null;
  const analysis = panel.querySelector(".analysis") as HTMLElement | null;
  const horizon = panel.querySelector(".ch2-verge-horizon line") as SVGElement | null;
  const accents = Array.from(panel.querySelectorAll(".verge-seen-h")) as HTMLElement[];
  if (!first || !second) return;

  const splitFirst = new SplitText(first, { type: "words", wordsClass: "split-word" });
  const splitSecond = new SplitText(second, { type: "words", wordsClass: "split-word" });

  const tail = [setup, cite, analysis].filter((el): el is HTMLElement => el !== null);
  gsap.set(tail, { opacity: 0, y: 16 });
  gsap.set(splitFirst.words, { opacity: 0, y: 32, x: 20 });
  gsap.set(splitSecond.words, { opacity: 0, y: 32, x: 20 });
  if (horizon) gsap.set(horizon, { scaleX: 0, transformOrigin: "left center", opacity: 0.6 });

  let lit = false;
  const tl = panelTimeline(panel, master, {}, (self) => {
    const shouldLight = self.progress > 0.52 && self.progress < 0.86;
    if (shouldLight !== lit) {
      lit = shouldLight;
      for (const el of accents) el.classList.toggle("is-lit", lit);
    }
  });

  // ENTER (0 → 0.55): setup, half 1, horizon, beat, half 2 — the chapter thesis lands
  if (setup) tl.to(setup, { opacity: 0.92, y: 0, duration: 0.08, ease: "power2.out" }, 0.04);
  tl.to(splitFirst.words, {
    opacity: 1, y: 0, x: 0,
    stagger: 0.012, duration: 0.16, ease: "power2.out"
  }, 0.08);
  if (horizon) tl.to(horizon, { scaleX: 1, duration: 0.4, ease: "power2.inOut" }, 0.15);
  tl.to(splitSecond.words, {
    opacity: 1, y: 0, x: 0,
    stagger: 0.014, duration: 0.2, ease: "power2.out"
  }, 0.32);
  if (cite) tl.to(cite, { opacity: 0.88, y: 0, duration: 0.1, ease: "power2.out" }, 0.5);
  if (analysis) tl.to(analysis, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.52);

  // FOCAL (0.55 → 0.7): horizon parallax drift — sun sliding along the verge
  if (horizon) tl.to(horizon, {
    x: () => panel.clientWidth * 0.03,
    duration: 0.18, ease: "none"
  }, 0.55);

  // EXIT (0.78 → 1): everything dims and drifts left
  const exitTargets = [first, second, setup, cite, analysis]
    .filter((el): el is HTMLElement => el !== null);
  tl.to(exitTargets, {
    x: () => -panel.clientWidth * 0.06,
    opacity: 0.18, duration: 0.25, ease: "power2.in"
  }, 0.78);
  if (horizon) tl.to(horizon, { opacity: 0, duration: 0.22, ease: "power2.in" }, 0.8);
}

function installLensPanel(master: gsap.core.Tween): void {
  const panels = [
    document.getElementById("ch2-lens-methodology"),
    document.getElementById("ch2-lens-lens"),
    document.getElementById("ch2-lens-analysis")
  ].filter((el): el is HTMLElement => el !== null);

  for (const panel of panels) {
    const card = panel.querySelector(".lens-item, .analysis") as HTMLElement | null;
    if (!card) continue;

    gsap.set(card, { opacity: 0, y: 40, x: 32, scale: 0.985 });

    const tl = panelTimeline(panel, master);

    // ENTER (0 → 0.4): card arrives, settles
    tl.to(card, {
      opacity: 1, y: 0, x: 0, scale: 1,
      duration: 0.32, ease: "power2.out"
    }, 0.06);

    // FOCAL (0.4 → 0.7): quiet breath — barely-there lift
    tl.to(card, { y: -4, duration: 0.3, ease: "power2.inOut" }, 0.42);

    // EXIT (0.72 → 1): drift left and dim
    tl.to(card, {
      x: () => -panel.clientWidth * 0.05,
      opacity: 0.2,
      duration: 0.26,
      ease: "power2.in"
    }, 0.74);
  }
}

function installClosePanel(master: gsap.core.Tween): void {
  const panel = document.getElementById("ch2-close");
  if (!panel) return;
  const paragraphs = Array.from(panel.querySelectorAll(".transition-paragraph")) as HTMLElement[];
  if (paragraphs.length === 0) return;
  gsap.set(paragraphs, { opacity: 0, y: 20, x: 24 });

  const tl = panelTimeline(panel, master);
  tl.to(paragraphs, {
    opacity: 1, y: 0, x: 0,
    stagger: 0.18, duration: 0.28, ease: "power2.out"
  }, 0.1);
  tl.to(paragraphs, {
    x: () => -panel.clientWidth * 0.05,
    opacity: 0.3, duration: 0.3, ease: "power2.in"
  }, 0.75);
}

function buildHorizon(className: string): SVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", className);
  svg.setAttribute("viewBox", "0 0 1000 2");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", "0");
  line.setAttribute("y1", "1");
  line.setAttribute("x2", "1000");
  line.setAttribute("y2", "1");
  svg.appendChild(line);
  return svg;
}

function wrapTextOccurrences(root: Element, targets: string[], className: string): void {
  function walk(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      let textNode = node as Text;
      let text = textNode.nodeValue ?? "";
      while (true) {
        let earliest: { idx: number; target: string } | null = null;
        for (const target of targets) {
          const idx = text.indexOf(target);
          if (idx >= 0 && (earliest === null || idx < earliest.idx)) {
            earliest = { idx, target };
          }
        }
        if (!earliest) break;
        const parent = textNode.parentNode;
        if (!parent) break;
        const before = text.slice(0, earliest.idx);
        const match = earliest.target;
        const afterText = text.slice(earliest.idx + match.length);
        const beforeNode = document.createTextNode(before);
        const span = document.createElement("span");
        span.className = className;
        span.textContent = match;
        const afterNode = document.createTextNode(afterText);
        parent.insertBefore(beforeNode, textNode);
        parent.insertBefore(span, textNode);
        parent.insertBefore(afterNode, textNode);
        parent.removeChild(textNode);
        textNode = afterNode;
        text = afterText;
      }
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const kids = Array.from(node.childNodes);
      for (const k of kids) walk(k);
    }
  }
  walk(root);
}
