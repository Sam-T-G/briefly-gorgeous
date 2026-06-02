import "./animation/register.js";
import "./animation/ease.js";

import { content } from "./content/index.generated.js";
import { renderSlot } from "./render/slot.js";

import { applyStaticReflow, prefersReducedMotion } from "./a11y/reduce-motion.js";
import { installReadingModeToggle } from "./a11y/reading-mode.js";

import { installKeyboardNav } from "./nav/keyboard.js";
import { installHelpOverlay } from "./nav/help-overlay.js";

import { refreshOnFontsReady } from "./util/refresh-on-fonts.js";

import { animateOpening } from "./animation/opening.js";
import { animateChapter1 } from "./animation/chapter-1.js";
import { animateChapter2 } from "./animation/chapter-2.js";
import { animateChapter3 } from "./animation/chapter-3.js";
import { animateClosing } from "./animation/closing.js";
import { animateBackground } from "./animation/background.js";

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

if (prefersReducedMotion()) {
  applyStaticReflow();
} else {
  animateBackground();
  animateOpening();
  animateChapter1();
  animateChapter2();
  animateChapter3();
  animateClosing();
}

refreshOnFontsReady();
