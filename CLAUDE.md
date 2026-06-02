# Claude Code — presentation-WEB-v1

This repo is the code root for a scroll-driven literary presentation. The vault at `Sam-Obsidian/Sam/school/current/ENGL-1BH/assignments/` is the source of truth for design and content. This file orients any agent that lands in the code root.

## Content authority sits above this lane

`conference-style-presentation-FORK-v1*` (vault) is the canonical content authority for the LA#3 presentation: scene order, source slate, voice, audience register, thesis-reveal control. The five active FORK v1 docs are read-only for this lane.

The WEB-v1 design + code build interprets FORK v1 into visual + code form. If a WEB-v1 decision would require FORK v1 to change, route the request through `## Cross-lane requests` in `presentation-WEB-v1-PIPELINE.md`. Do not edit FORK v1 directly.

## Before every implementation pass

1. Reload `presentation-WEB-v1-design-north-star.md` (vault). The seven principles bind every design decision.
2. Re-read the relevant palette dossier (`presentation-WEB-v1-palette-ci{1,2,3}-*.md`) for the chapter you are touching.
3. Re-read the relevant slot rows in `presentation-WEB-v1-section-map.md`.
4. Cross-check the corresponding FORK v1 scene in `conference-style-presentation-FORK-v1-scenes.md`. If the WEB-v1 slot drifts from the FORK v1 scene, FORK v1 wins.

## After every implementation pass

Run the eleven gates in `presentation-WEB-v1-pass-protocol.md`. A failed gate blocks the pass. If the pass touches content-shaped decisions (quote selection, source slate, scene order, voice), FORK v1's `conference-style-presentation-FORK-v1-quality-protocol.md` gates also apply.

## Lane boundaries

Three lanes interact on this project. The contract lives in `presentation-WEB-v1-PIPELINE.md` (vault).

- **FORK v1 / content-authority lane (above):** owns `conference-style-presentation-FORK-v1*`. Sets scaffold direction. Other lanes read.
- **WEB-v1 design + code lane (this repo):** owns everything under `project/presentation-WEB-v1/` and the `presentation-WEB-v1-*` design / research / palette docs. Never edits FORK v1 or `presentation-WEB-v1-content-*`.
- **WEB-v1 content lane:** owns `presentation-WEB-v1-content-*.md` in the vault. Never edits code, design docs, or FORK v1.

If you find yourself needing to change ownership, write a Cross-lane request in the pipeline doc and stop.

## Stack (locked)

Vite + vanilla TypeScript + GSAP. No frameworks. No React, Vue, Svelte, Astro. Plugins: `ScrollTrigger`, `ScrollToPlugin`, `SplitText`, `CustomEase`, `DrawSVGPlugin`. Default ease is CustomEase `"editorial"` defined in `src/animation/ease.ts`.

Rationale: `presentation-WEB-v1-research-gsap-dossier.md` §11.

## Slot ID contract

Slot IDs in `presentation-WEB-v1-section-map.md` are canonical. They must match in four places:

1. Section map slot headings.
2. `presentation-WEB-v1-content-*.md` `## slot-id` headings.
3. GSAP timeline labels in `src/animation/*.ts`.
4. DOM `id` attributes on rendered sections.

A single rename touches all four. If any are out of sync, fix before continuing.

## Content pipeline

The vault content files are the source of truth for prose. `src/build/parse-content.ts` parses them at build time and emits `src/content/index.generated.ts` (gitignored). No quote text lives in component source.

## Voice rules (binding on any prose this agent writes)

Forbidden in setup and analysis prose:

- Em dashes outside quoted passages.
- AI tells: `delve`, `navigate the complexities`, `tapestry`, `underscore`, `at its core`, `in conclusion`, `it is worth noting`, `landscape of`, `realm of`.
- Frame phrases: `this presentation argues`, `this talk shows`, `in this presentation`.
- Backward-pointing cues: `as we have seen`, `having established`, `to recap`.

Required:

- Author-as-actor: "Vuong braids," not "the novel shows."

## Motion discipline

Permitted eases: CustomEase `"editorial"`, `power1.out`, `power1.inOut`, `power2.inOut`, `power3.out`, `expo.out`, `linear` (scrubs only).

Forbidden eases: `bounce`, `elastic`, `back`, any spring, any custom ease with overshoot.

Each chapter has exactly one earned cinematic moment (named in `presentation-WEB-v1-design-north-star.md` §4). Everywhere else is quiet.

Move names in code must match move names in the chapter's palette dossier. Adding a new move requires updating the palette dossier first.

## Performance rules

- Animate only `transform` and `opacity`. No layout properties.
- `will-change: transform` applied per-tween, removed `onComplete`.
- `ScrollTrigger.refresh()` called after `document.fonts.ready`.
- `anticipatePin: 1` on every pinned section.
- Total JS gzipped ≤ 80 KB.
- Markers behind `import.meta.env.DEV`.

## Accessibility floor

- `prefers-reduced-motion` branch ships a fully working static reflow with identical content.
- `R` key toggles reading mode without losing content.
- Focus management on every snap arrival via `element.focus({ preventScroll: true })`.
- Skip-link at top of body. `?` opens keyboard help, `Esc` closes.
- AA contrast on every text-on-background pair.

## Quote integrity

Every rendered quote matches `presentation-WEB-v1-research-la3-extraction.md` verbatim. No paraphrase, no editorial cleanup, no smart-quote substitution inside a quote.

## Thesis defers

No thesis copy appears on the site until the `closing-thesis` slot. Grep targets to keep out of every earlier slot:

```
"majoritarian American demand"
"legible on dominant terms"
"precondition of love"
"mechanism of harm"
"paratactic form"
"self legible only on its own terms"
```

## Free vs ask-first

**Free (no permission prompt):**

- Edit any file under `project/presentation-WEB-v1/`.
- Run `npm install`, `npm run dev`, `npm run build`, `npm run preview`, `npm run typecheck`.
- `git status`, `git diff`, `git log` inside this repo.

**Ask first:**

- Add a runtime dependency.
- Change the stack (Vite, TypeScript, GSAP versions or plugins).
- Move or rename a file already referenced by `src/main.ts` or the section map.
- Touch anything in the vault — that's the design + content surface, owned by the spec docs and the content lane.

**Never:**

- Edit `presentation-WEB-v1-content-*.md` directly. Cross-lane request only.
- Embed quote text in component source. Read from the generated content module.
- Add motion moves not named in a palette dossier.
- Use forbidden eases or layout-property animations.

## When in doubt

- When in doubt about tone: less, slower, quieter.
- When in doubt about a motion: prefer scroll-tied scrub over auto-played animation.
- When in doubt about content: defer to the LA#3 draft v2 and the extraction doc.
- When in doubt about a color or font: stay inside the chapter's palette dossier.
- When stuck: leave a Cross-lane request in the pipeline doc rather than guessing.
