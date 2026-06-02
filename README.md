# presentation-WEB-v1

A scroll-driven, keyboard-navigable web presentation of Literary Analysis #3.

## What this is

A literary essay rendered as a web presentation where the form does the same argument the prose does. Three chapters (Exposure, Sunset, Parataxis), three palettes, three motion vocabularies.

## Stack

Vite + vanilla TypeScript + GSAP (core, ScrollTrigger, ScrollToPlugin, SplitText, CustomEase, DrawSVGPlugin).

## Run

```
npm install
npm run dev
```

## Source of truth

Design and content specs live in the vault at `Sam-Obsidian/Sam/school/current/ENGL-1BH/assignments/`. Start at `presentation-WEB-v1.md` (hub).

**Content authority sits above this build:** `conference-style-presentation-FORK-v1*` in the vault holds scene order, source slate, voice, and audience register. This repo implements FORK v1; it does not override it.

Before every implementation pass: reload `presentation-WEB-v1-design-north-star.md` and cross-check `conference-style-presentation-FORK-v1-scenes.md`. After every implementation pass: run the gates in `presentation-WEB-v1-pass-protocol.md`.

## Build pipeline

`npm run dev` and `npm run build` parse the vault content files into `src/content/index.generated.ts` (gitignored) before Vite starts. The generated module is the runtime source for all prose.
