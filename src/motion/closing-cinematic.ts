import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import "../animation/ease.js";

void DrawSVGPlugin;

const SVG_NS = "http://www.w3.org/2000/svg";

type RecallEntry = { quote: string; citation: string };

const VERB_RECALL: Record<string, RecallEntry> = {
  EXPOSE: { quote: "printed with sunflowers", citation: "Vuong 43" },
  ANALYZE: { quote: "deemed them beautiful", citation: "Vuong 191" },
  CHALLENGE: { quote: "nhớ", citation: "Vuong 152" }
};

const THESIS_CLAUSES: { verb: string; text: string }[] = [
  {
    verb: "EXPOSE",
    text: "Through the hunter-prey motif, the novel exposes the majoritarian demand that marginalized people become readable on America's terms"
  },
  {
    verb: "ANALYZE",
    text: "and analyzes being seen as the source of both love and harm."
  },
  {
    verb: "CHALLENGE",
    text: "It challenges that demand through the letter itself, where parataxis and reclaimed language let Little Dog build a new sense of self on his own terms."
  }
];

export function installClosingCinematic(): void {
  if (!document.getElementById("closing-verb-echo")) return;

  decorateVerbEcho();
  decorateTrajectoryDiptych();
  decorateThesisTrio();
  decorateWorksCitedSignature();

  installVerbEchoReveal();
  installTrajectoryReveal("closing-trajectory-soler", true);
  installTrajectoryReveal("closing-trajectory-lee", false);
  installThesisTrioReveal();
  installWorksCitedReveal();

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

// ---------- verb-echo: cinematic triptych with proof flashes ----------

function decorateVerbEcho(): void {
  const slot = document.getElementById("closing-verb-echo");
  if (!slot) return;
  const list = slot.querySelector<HTMLElement>(".verb-echo");
  if (!list) return;
  if (list.classList.contains("verb-echo-cinematic")) return;
  list.classList.add("verb-echo-cinematic");

  const items = list.querySelectorAll<HTMLElement>(".verb-echo-item");
  items.forEach((item) => {
    const verb = (item.textContent ?? "").trim();
    item.textContent = "";

    const verbSpan = document.createElement("span");
    verbSpan.className = "verb-echo-verb";
    verbSpan.textContent = verb;
    item.appendChild(verbSpan);

    const recall = VERB_RECALL[verb];
    if (recall) {
      const recallWrap = document.createElement("span");
      recallWrap.className = "verb-echo-recall";
      const quoteSpan = document.createElement("span");
      quoteSpan.className = "verb-echo-recall-quote";
      quoteSpan.textContent = `"${recall.quote}"`;
      recallWrap.appendChild(quoteSpan);
      const citeSpan = document.createElement("span");
      citeSpan.className = "verb-echo-recall-cite";
      citeSpan.textContent = recall.citation;
      recallWrap.appendChild(citeSpan);
      item.appendChild(recallWrap);
    }
  });
}

function installVerbEchoReveal(): void {
  const slot = document.getElementById("closing-verb-echo");
  if (!slot) return;
  const items = slot.querySelectorAll<HTMLElement>(".verb-echo-item");
  if (items.length === 0) return;

  const perItem = Array.from(items).map((item) => {
    const verbEl = item.querySelector<HTMLElement>(".verb-echo-verb");
    const recall = item.querySelector<HTMLElement>(".verb-echo-recall");
    let chars: Element[] = [];
    if (verbEl) {
      const split = new SplitText(verbEl, { type: "chars", charsClass: "verb-echo-char" });
      chars = split.chars;
      gsap.set(chars, { opacity: 0, y: 24, rotateX: -32, transformOrigin: "50% 100%" });
    }
    if (recall) gsap.set(recall, { opacity: 0, y: 10 });
    return { verbEl, recall, chars };
  });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 70%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline({ delay: 0.25 });
      perItem.forEach(({ chars, recall }, idx) => {
        const lead = idx === 0 ? 0 : "+=0.15";
        if (chars.length > 0) {
          tl.to(
            chars,
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.75,
              ease: "editorial",
              stagger: 0.035
            },
            lead
          );
        }
        if (recall) {
          tl.to(recall, { opacity: 1, y: 0, duration: 0.55, ease: "editorial" }, "-=0.3");
        }
      });
      const verbs = slot.querySelectorAll<HTMLElement>(".verb-echo-verb");
      if (verbs.length > 0) {
        tl.to(
          verbs,
          { scale: 1.035, duration: 0.5, ease: "editorial", stagger: 0.06 },
          "+=0.35"
        );
        tl.to(verbs, { scale: 1, duration: 0.7, ease: "editorial", stagger: 0.04 }, "+=0.05");
      }
    }
  });
}

// ---------- trajectories: diptych with shared drawn thread ----------

function decorateTrajectoryDiptych(): void {
  ["closing-trajectory-soler", "closing-trajectory-lee"].forEach((id, idx) => {
    const slot = document.getElementById(id);
    if (!slot) return;
    slot.classList.add("trajectory-immersive");
    slot.dataset["trajectoryRole"] = idx === 0 ? "enter" : "continue";
    if (slot.querySelector(".trajectory-thread")) return;

    const thread = document.createElement("div");
    thread.className = "trajectory-thread";
    thread.setAttribute("aria-hidden", "true");
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 2 100");
    svg.setAttribute("preserveAspectRatio", "none");
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M1,0 L1,100");
    path.setAttribute("class", "trajectory-thread-path");
    svg.appendChild(path);
    thread.appendChild(svg);
    slot.insertBefore(thread, slot.firstChild);

    if (idx === 0) {
      const cont = document.createElement("div");
      cont.className = "trajectory-continuation";
      cont.setAttribute("aria-hidden", "true");
      const csvg = document.createElementNS(SVG_NS, "svg");
      csvg.setAttribute("viewBox", "0 0 60 60");
      csvg.setAttribute("preserveAspectRatio", "none");
      const cpath = document.createElementNS(SVG_NS, "path");
      cpath.setAttribute(
        "d",
        "M30,2 C24,18 36,32 30,46 M22,40 L30,52 L38,40"
      );
      cpath.setAttribute("class", "trajectory-continuation-path");
      csvg.appendChild(cpath);
      cont.appendChild(csvg);
      slot.appendChild(cont);
    }
  });
}

function installTrajectoryReveal(id: string, isFirst: boolean): void {
  const slot = document.getElementById(id);
  if (!slot) return;
  const threadPath = slot.querySelector(".trajectory-thread-path");
  const continuationPath = slot.querySelector(".trajectory-continuation-path");
  const eyebrow = slot.querySelector(".trajectory-eyebrow");
  const authorBlock = slot.querySelector(".trajectory-author-block");
  const quote = slot.querySelector(".trajectory-quote");
  const cite = slot.querySelector(".trajectory-citation");
  const roleEl = slot.querySelector(".trajectory-role");
  const parts = [eyebrow, authorBlock, quote, cite, roleEl].filter(
    (el): el is Element => el !== null
  );

  if (parts.length > 0) gsap.set(parts, { opacity: 0, y: 12 });
  if (threadPath) gsap.set(threadPath, { drawSVG: isFirst ? "0% 0%" : "100% 100%" });
  if (continuationPath) gsap.set(continuationPath, { drawSVG: "0% 0%" });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 72%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (threadPath) {
        tl.to(threadPath, {
          drawSVG: isFirst ? "0% 100%" : "0% 100%",
          duration: 1.5,
          ease: "power2.inOut"
        });
      }
      if (parts.length > 0) {
        tl.to(
          parts,
          { opacity: 1, y: 0, duration: 0.75, ease: "editorial", stagger: 0.16 },
          "-=1.2"
        );
      }
      if (continuationPath) {
        tl.to(
          continuationPath,
          { drawSVG: "0% 100%", duration: 1.2, ease: "power2.inOut" },
          "+=0.35"
        );
      }
    }
  });
}

// ---------- thesis: three clauses tied to verbs ----------

function decorateThesisTrio(): void {
  const slot = document.getElementById("closing-thesis");
  if (!slot) return;
  const inner = slot.querySelector<HTMLElement>(".slot-inner");
  if (!inner) return;
  if (inner.querySelector(".thesis-trio")) return;

  inner.querySelectorAll(".thesis-split, .thesis").forEach((el) => el.remove());

  const trio = document.createElement("div");
  trio.className = "thesis-trio";
  THESIS_CLAUSES.forEach((c) => {
    const block = document.createElement("div");
    block.className = "thesis-clause-block";
    block.dataset["verb"] = c.verb;

    const label = document.createElement("span");
    label.className = "thesis-verb-label";
    label.textContent = c.verb;
    block.appendChild(label);

    const p = document.createElement("p");
    p.className = "thesis thesis-clause";
    p.textContent = c.text;
    block.appendChild(p);

    trio.appendChild(block);
  });
  inner.appendChild(trio);
}

function installThesisTrioReveal(): void {
  const slot = document.getElementById("closing-thesis");
  if (!slot) return;
  const blocks = slot.querySelectorAll<HTMLElement>(".thesis-clause-block");
  if (blocks.length === 0) return;

  const perBlock = Array.from(blocks).map((block) => {
    const label = block.querySelector<HTMLElement>(".thesis-verb-label");
    const clause = block.querySelector<HTMLElement>(".thesis-clause");
    let words: Element[] = [];
    if (clause) {
      const split = new SplitText(clause, { type: "words", wordsClass: "thesis-word" });
      words = split.words;
      gsap.set(words, { opacity: 0, y: 8 });
    }
    if (label) gsap.set(label, { opacity: 0, y: 4 });
    return { label, words };
  });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 70%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline({ delay: 0.2 });
      perBlock.forEach(({ label, words }, idx) => {
        if (label) {
          tl.to(
            label,
            { opacity: 1, y: 0, duration: 0.5, ease: "editorial" },
            idx === 0 ? 0 : "+=0.35"
          );
          tl.to(label, { opacity: 0.45, duration: 0.6, ease: "editorial" }, "+=0.9");
        }
        if (words.length > 0) {
          tl.to(
            words,
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "editorial",
              stagger: 0.025
            },
            "-=1.45"
          );
        }
      });
    }
  });
}

// ---------- works-cited: signature flourish closes the letter ----------

function decorateWorksCitedSignature(): void {
  const slot = document.getElementById("works-cited");
  if (!slot) return;
  const inner = slot.querySelector<HTMLElement>(".slot-inner");
  if (!inner) return;
  if (inner.querySelector(".works-cited-signature")) return;

  const sig = document.createElement("div");
  sig.className = "works-cited-signature";
  sig.setAttribute("aria-hidden", "true");
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 200 60");
  svg.setAttribute("preserveAspectRatio", "xMinYMid meet");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute(
    "d",
    "M4,36 C20,12 40,4 56,22 C70,38 50,50 38,38 C28,28 48,18 66,26 C92,38 116,12 150,22 C168,27 182,32 196,26"
  );
  path.setAttribute("class", "works-cited-signature-path");
  svg.appendChild(path);
  sig.appendChild(svg);
  inner.appendChild(sig);
}

function installWorksCitedReveal(): void {
  const slot = document.getElementById("works-cited");
  if (!slot) return;
  const photo = slot.querySelector(".vuong-loc-reading");
  const heading = slot.querySelector(".chapter-title-label");
  const items = slot.querySelectorAll(".works-cited-list li");
  const signaturePath = slot.querySelector(".works-cited-signature-path");

  if (photo) gsap.set(photo, { opacity: 0, y: 14 });
  if (heading) gsap.set(heading, { opacity: 0, y: 8 });
  if (items.length > 0) gsap.set(items, { opacity: 0, y: 6 });
  if (signaturePath) gsap.set(signaturePath, { drawSVG: "0% 0%" });

  ScrollTrigger.create({
    trigger: slot,
    start: "top 75%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (photo) tl.to(photo, { opacity: 1, y: 0, duration: 0.95, ease: "editorial" });
      if (heading)
        tl.to(heading, { opacity: 1, y: 0, duration: 0.7, ease: "editorial" }, "-=0.45");
      if (items.length > 0) {
        tl.to(
          items,
          { opacity: 1, y: 0, duration: 0.55, ease: "editorial", stagger: 0.06 },
          "-=0.25"
        );
      }
      if (signaturePath) {
        tl.to(
          signaturePath,
          { drawSVG: "0% 100%", duration: 1.9, ease: "power2.inOut" },
          "+=0.55"
        );
      }
    }
  });
}
