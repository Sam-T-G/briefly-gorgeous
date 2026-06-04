import "./animation/register.js";
import "./animation/ease.js";

import { content } from "./content/index.generated.js";
import { renderSlot } from "./render/slot.js";

import { applyStaticReflow, prefersReducedMotion } from "./a11y/reduce-motion.js";
import { installReadingModeToggle } from "./a11y/reading-mode.js";

import { installKeyboardNav } from "./nav/keyboard.js";
import { installHelpOverlay } from "./nav/help-overlay.js";
import { installHud } from "./nav/hud.js";
import { installFullscreenHint } from "./nav/fullscreen-hint.js";

import { refreshOnFontsReady } from "./util/refresh-on-fonts.js";

import { animateChapter3 } from "./animation/chapter-3.js";
import { animateBackground } from "./animation/background.js";

import { initSmoother } from "./motion/smoother.js";
import { installCursor } from "./interactive/cursor.js";
import { installIntroImmersive } from "./motion/intro.js";
import { installChapter1Immersive } from "./motion/chapter-1.js";
import { installChapter2Horizontal } from "./motion/chapter-2-horizontal.js";
import { installClosingCinematic } from "./motion/closing-cinematic.js";
import { installContinuityThreads } from "./motion/continuity.js";
import { installHandwriting } from "./motion/handwriting.js";

const main = document.getElementById("main");
if (!main) throw new Error("missing #main");

const fragment = document.createDocumentFragment();
for (const slot of content.slots) {
  fragment.appendChild(renderSlot(slot));
}
main.appendChild(fragment);

installReadingModeToggle();
installKeyboardNav();
installHelpOverlay();
installFullscreenHint();

if (prefersReducedMotion()) {
  applyStaticReflow();
} else {
  initSmoother();
  installHud();
  installCursor();
  animateBackground();
  installIntroImmersive();
  installChapter1Immersive();
  installChapter2Horizontal();
  animateChapter3();
  installClosingCinematic();
  installContinuityThreads();
  installHandwriting();
}

refreshOnFontsReady();
