import { gsap } from "gsap";

export const CHECKPOINT_IDS = [
  "opening-landing",
  "opening-world",
  "opening-pressures",
  "opening-frame",
  "opening-motif",
  "opening-framework",
  "ch1-open",
  "ch1-macaque",
  "ch1-napkin",
  "ch1-cinnamon",
  "ch1-recognition",
  "ch1-verdict",
  "ch1-divider",
  "ch1-lens",
  "ch1-close",
  "ch2-open",
  "ch2-deemed",
  "ch2-verge",
  "ch2-lens",
  "ch2-close",
  "ch3-open",
  "ch3-nho",
  "ch3-miss",
  "ch3-parataxis",
  "ch3-lens",
  "ch3-close",
  "closing-thesis",
  "works-cited"
] as const;

export type CheckpointId = (typeof CHECKPOINT_IDS)[number];

const TOLERANCE = 4;
let activeTween: gsap.core.Tween | null = null;

type Entry = { id: string; y: number };

const SUB_STOPS: Record<string, number[]> = {
  "ch1-recognition": [1.7]
};

function collectEntries(): Entry[] {
  const entries: Entry[] = [];
  for (const id of CHECKPOINT_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top + window.scrollY;
    entries.push({ id, y: top });
    const subs = SUB_STOPS[id];
    if (subs) {
      for (const frac of subs) {
        entries.push({ id, y: top + frac * window.innerHeight });
      }
    }
  }
  entries.sort((a, b) => a.y - b.y);
  return entries;
}

export function collectCheckpointPositions(): number[] {
  return collectEntries().map((e) => e.y);
}

export function goToNext(): void {
  const entries = collectEntries();
  const y = window.scrollY;
  for (const entry of entries) {
    if (entry.y > y + TOLERANCE) {
      scrollToEntry(entry);
      return;
    }
  }
}

export function goToPrev(): void {
  const entries = collectEntries();
  const y = window.scrollY;
  for (let i = entries.length - 1; i >= 0; i -= 1) {
    const entry = entries[i];
    if (entry && entry.y < y - TOLERANCE) {
      scrollToEntry(entry);
      return;
    }
  }
}

export function goToFirst(): void {
  const entries = collectEntries();
  if (entries[0]) scrollToEntry(entries[0]);
}

export function goToLast(): void {
  const entries = collectEntries();
  const last = entries[entries.length - 1];
  if (last) scrollToEntry(last);
}

function scrollToEntry(entry: Entry): void {
  if (activeTween) activeTween.kill();
  activeTween = gsap.to(window, {
    duration: 0.65,
    ease: "editorial",
    scrollTo: { y: entry.y, autoKill: false },
    onComplete: () => {
      activeTween = null;
      focusEntry(entry.id);
    },
    onInterrupt: () => {
      activeTween = null;
    }
  });
}

function focusEntry(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}
