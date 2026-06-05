import { gsap } from "gsap";
import "./ease.js";

const PORCELAIN = "#F6F2EA";
const DEEMED_VELLUM = "#F4EDE0";
const VERGE_BONE = "#EBE1CF";
const LATE_TOBACCO = "#D4B994";
const DISAPPEARING_INDIGO = "#27313F";
const BESIDE_PAPER = "#F4F0E8";

const BODY_LIGHT = "#5C4632";
const DISPLAY_LIGHT = "#2A2F34";
const CHROME_LIGHT = "#DCC592";

const BODY_INVERTED = VERGE_BONE;
const DISPLAY_INVERTED = PORCELAIN;
const CHROME_INVERTED = LATE_TOBACCO;

type Frame = {
  id: string;
  bg: string;
  body: string;
  display: string;
  chrome: string;
  share: number;
};

// Both bg and body/display/chrome land on their ch3-open values at the
// ch2-close keyframe (timeline progress 0.8). The interpolations complete
// between ch2-lens and ch2-close — well inside the ch2-horizontal pin, where
// the opaque ch2-sky still covers the viewport. That makes the ch2-close →
// ch3-open segment a no-op for every var, so scrub catch-up after pin release
// cannot bleed a color shift onto ch3-open's visible entry.
const KEYFRAMES: Frame[] = [
  { id: "ch2-open",   bg: DEEMED_VELLUM,       body: BODY_LIGHT,    display: DISPLAY_LIGHT,    chrome: CHROME_LIGHT,    share: 1 },
  { id: "ch2-deemed", bg: VERGE_BONE,          body: BODY_LIGHT,    display: DISPLAY_LIGHT,    chrome: CHROME_LIGHT,    share: 1 },
  { id: "ch2-verge",  bg: LATE_TOBACCO,        body: PORCELAIN,     display: PORCELAIN,        chrome: PORCELAIN,       share: 1 },
  { id: "ch2-lens",   bg: DISAPPEARING_INDIGO, body: BODY_INVERTED, display: DISPLAY_INVERTED, chrome: CHROME_INVERTED, share: 1 },
  { id: "ch2-close",  bg: BESIDE_PAPER,        body: BODY_LIGHT,    display: DISPLAY_LIGHT,    chrome: CHROME_LIGHT,    share: 1 },
  { id: "ch3-open",   bg: BESIDE_PAPER,        body: BODY_LIGHT,    display: DISPLAY_LIGHT,    chrome: CHROME_LIGHT,    share: 1 }
];

export function animateBackground(): void {
  const root = document.documentElement;
  const first = KEYFRAMES[0]!;
  root.style.setProperty("--bg", first.bg);
  root.style.setProperty("--body", first.body);
  root.style.setProperty("--display", first.display);
  root.style.setProperty("--chrome", first.chrome);

  const startId = first.id;
  const endId = KEYFRAMES[KEYFRAMES.length - 1]!.id;
  if (!document.getElementById(startId) || !document.getElementById(endId)) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: `#${startId}`,
      start: "top 50%",
      endTrigger: `#${endId}`,
      end: "top 50%",
      scrub: 1,
      refreshPriority: -10
    }
  });

  tl.set(root, {
    "--bg": first.bg,
    "--body": first.body,
    "--display": first.display,
    "--chrome": first.chrome
  });
  let t = 0;
  for (let i = 1; i < KEYFRAMES.length; i++) {
    const f = KEYFRAMES[i]!;
    tl.to(
      root,
      {
        "--bg": f.bg,
        "--body": f.body,
        "--display": f.display,
        "--chrome": f.chrome,
        ease: "none",
        duration: f.share
      },
      t
    );
    t += f.share;
  }
}
