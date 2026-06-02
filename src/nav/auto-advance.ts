import { goToNext } from "./checkpoints.js";

type Config = {
  triggerSlotIds: ReadonlyArray<string>;
  delayMs: number;
  delayOverridesMs?: Readonly<Record<string, number>>;
  scrollDurationS?: number;
  intersectionRatio?: number;
};

export function installAutoAdvance(config: Config): void {
  const triggers = new Set(config.triggerSlotIds);
  const fired = new Set<string>();
  const threshold = config.intersectionRatio ?? 0.6;
  const scrollDuration = config.scrollDurationS ?? 0.8;

  let pendingId: string | null = null;
  let pendingTimer: ReturnType<typeof setTimeout> | null = null;

  function cancel(markFired: boolean): void {
    if (pendingTimer !== null) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
    if (pendingId !== null && markFired) {
      fired.add(pendingId);
    }
    pendingId = null;
  }

  function isReadingMode(): boolean {
    return document.getElementById("main")?.dataset["mode"] === "static";
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = entry.target.id;
        if (!triggers.has(id) || fired.has(id)) continue;

        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          if (pendingId === id) continue;
          if (pendingId !== null) cancel(true);
          if (isReadingMode()) continue;
          pendingId = id;
          const delay = config.delayOverridesMs?.[id] ?? config.delayMs;
          pendingTimer = setTimeout(() => {
            if (pendingId === null) return;
            fired.add(pendingId);
            pendingId = null;
            pendingTimer = null;
            goToNext({ duration: scrollDuration });
          }, delay);
        } else if (pendingId === id) {
          cancel(true);
        }
      }
    },
    { threshold: [threshold] }
  );

  for (const id of triggers) {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  }

  const cancelEvents = ["keydown", "wheel", "touchstart", "mousedown", "pointerdown"] as const;
  const onUserInput = (): void => {
    if (pendingId !== null) cancel(true);
  };
  for (const ev of cancelEvents) {
    window.addEventListener(ev, onUserInput, { capture: true, passive: true });
  }
}
