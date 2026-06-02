# public/images/ — Asset Manifest

Local copies of Tier A image assets. Pre-fetched 2026-06-02 by the DESIGN lane ahead of the image-implementation pass. Companion to [[Sam-Obsidian/Sam/school/current/ENGL-1BH/assignments/presentation-WEB-v1-image-candidates.md]] in the vault.

## Why local copies

The two images currently in production (`opening-world` Penguin cover, `opening-pressures` Hine 1917) are hot-linked from CDN URLs in `src/render/slot.ts`. CDN URLs rotate, the LoC service path could change, and offline-mode demos break without local fallback. The implementing pass should switch the two existing `<img>` tags from CDN URLs to these local paths, and ship any new images from this folder.

Vite's convention: anything in `public/` is copied verbatim to `dist/` at build, served at the URL path matching its position. `/images/vuong-portrait-2019.jpg` resolves to this file at both dev and production.

## Files

### `vuong-portrait-2019.jpg` — Ocean Vuong portrait, 2019

- **🎯 Locked slot (Samuel 2026-06-02):** `opening-landing`. `figure-aside` composition, image as a vertical side column next to the chapter-title block. Year-of-publication timeline rhyme — reader meets Vuong at the moment the letter was made.
- **Dimensions:** 1122 × 1596 px (vertical portrait)
- **File size:** 375 KB original. **Optimize to ~80 KB WebP before shipping** to stay under the strategy doc's 400 KB total cap.
- **Photographer:** slowking4
- **Source:** [Flickr](https://www.flickr.com/photos/73455099@N07/48458986647/) → [Wikimedia Commons file page](https://commons.wikimedia.org/wiki/File:Ocean_vuong_8045064_(48458986647)_(cropped).jpg)
- **Direct URL fetched from:** `https://upload.wikimedia.org/wikipedia/commons/7/7e/Ocean_vuong_8045064_%2848458986647%29_%28cropped%29.jpg`
- **License:** **CC BY-SA 2.0 Generic** (Creative Commons Attribution-ShareAlike 2.0). Any reuse must credit the photographer and carry the same license.
- **Capture metadata:** Olympus OM-D E-M10 Mark II, f/6.3, 1/60s, ISO 1600, 180mm. Captured 2019-08-04.
- **Argument fit:** the year *On Earth We're Briefly Gorgeous* was published. Vertical orientation works as a side column next to chapter-title typography.
- **Paste-ready alt text:** `Portrait of Ocean Vuong, 2019. Photograph by slowking4, CC BY-SA 2.0.`
- **Paste-ready figcaption:** `Ocean Vuong · 2019 · slowking4, CC BY-SA 2.0`
- **Required attribution string (anywhere it ships):** `Ocean Vuong (2019) by slowking4, licensed under CC BY-SA 2.0 via Wikimedia Commons.`

### `vuong-loc-reading-2015.jpg` — Vuong reading at the Library of Congress, 2015

- **🎯 Locked slot (Samuel 2026-06-02):** `works-cited`. `figure-aside` or top-of-slot composition (depending on the implementing agent's read of the bullet-list density). Structural rhyme — the photo shows Vuong reading at the Library of Congress; the works-cited entries name sources held at the Library of Congress and adjacent institutional archives. The site's archival argument visualizes itself at the closing.
- **Dimensions:** 1600 × 1200 px (landscape)
- **File size:** 972 KB original. **Must be optimized before shipping** — likely down-rez to 1200 × 900 and WebP convert (~120 KB target).
- **Photographer:** slowking4 (own work)
- **Source:** [Wikimedia Commons file page](https://commons.wikimedia.org/wiki/File:Ocean_vuong_6873.JPG)
- **Direct URL fetched from:** `https://upload.wikimedia.org/wikipedia/commons/b/be/Ocean_vuong_6873.JPG`
- **License:** **CC BY-NC 3.0 Unported** AND **GNU Free Documentation License v1.2** (dual-licensed). The NC clause forbids commercial use; an academic class talk is non-commercial. Cannot reuse in any commercial portfolio.
- **Capture metadata:** Canon PowerShot SX110 IS. Captured 2015-05-04 at the AALR (Asian American Literary Review) Lettres Fellowship reading at the Library of Congress.
- **Argument fit:** Vuong at the Library of Congress — the institution that holds most of this presentation's archival sources (Hine NCLC, Vietnamese Nôm holdings, NARA-adjacent collections). Structural resonance with the closing.
- **Paste-ready alt text:** `Ocean Vuong reading at the Library of Congress, 2015. Photograph by slowking4, CC BY-NC 3.0.`
- **Paste-ready figcaption:** `Vuong reading at the Library of Congress · 2015 · slowking4, CC BY-NC 3.0`
- **Required attribution string:** `Ocean Vuong reading at the Library of Congress (2015) by slowking4, licensed under CC BY-NC 3.0 via Wikimedia Commons.`

### `penguin-cover-on-earth-2019.jpg` — Penguin Press jacket, *On Earth We're Briefly Gorgeous*

- **Dimensions:** 294 × 450 px (vertical book cover, low res — this is the size Penguin distributes)
- **File size:** 31 KB
- **Source:** Penguin Random House cover service. `https://images1.penguinrandomhouse.com/cover/9780525562047`
- **License:** **Fair use** for academic context. Penguin Press 2019.
- **Argument fit:** the physical object the talk reads from. Already shipping at `opening-world` as `figure-ambient`; Phase 1 promotion candidate to `figure-aside`. Also the proposed `closing-thesis` return image (blocked on FORK v1).
- **Paste-ready alt text:** `Cover of On Earth We're Briefly Gorgeous, Penguin Press 2019.`
- **Paste-ready figcaption:** none (cover speaks for itself; works-cited already pays the citation).
- **Note:** the existing code uses this same alt text. When switching from CDN URL to local path, leave the alt string unchanged.

### `hine-hartford-tobacco-1917.jpg` — Lewis Hine, Hartford tobacco workers, 1917

- **Dimensions:** 1024 × 747 px (landscape)
- **File size:** 157 KB original. Acceptable as-is.
- **Photographer:** Lewis Wickes Hine
- **Source:** [LoC item 2018678645](https://www.loc.gov/item/2018678645/). NCLC collection, Hine no. 4895.
- **Permanent identifier:** `https://hdl.loc.gov/loc.pnp/res.097.hine`
- **Direct URL fetched from:** `https://cdn.loc.gov/service/pnp/nclc/00700/00724v.jpg`
- **License:** **Public domain** (LoC NCLC, no known restrictions).
- **Original title:** *"6:00 A.M. at Post Office Square, Truck load of tobacco workers bound for American Sumatra Tobacco Farm. S[outh] Windsor. They return about 7 P.M. Location: Hartford, Connecticut."* — captured 1917 by Lewis Hine for the National Child Labor Committee.
- **Argument fit:** Trevor's row at `opening-pressures`. Hartford 1917 tobacco labor is the world Trevor enters at fifteen on a tobacco farm. Already shipping; Phase 1 promotion candidate.
- **Paste-ready alt text (already in code, do not change):** `Truck of tobacco workers leaving Post Office Square at 6:00 A.M. bound for the American Sumatra Tobacco Farm, Hartford, Connecticut. Lewis Hine, 1917.`
- **Paste-ready figcaption (already in code):** `Lewis Hine, Hartford, 1917 · LoC NCLC`

---

## Switching from CDN to local — code diff snippet

For the implementing pass. Two small edits in `src/render/slot.ts`:

```typescript
// In renderInfoCard, opening-world branch (currently ~line 525):
img.src = "/images/penguin-cover-on-earth-2019.jpg";  // was: https://images1.penguinrandomhouse.com/cover/9780525562047

// In renderInfoCard, opening-pressures branch (currently ~line 538):
img.src = "/images/hine-hartford-tobacco-1917.jpg";   // was: https://cdn.loc.gov/service/pnp/nclc/00700/00724v.jpg
```

Both alt texts stay unchanged. Both `loading="lazy"` + `decoding="async"` stay unchanged.

## New Vuong portrait — paste-ready snippets (slots locked)

Samuel locked the pairing 2026-06-02: 2019 portrait at `opening-landing`, 2015 LoC reading at `works-cited`. Both target slots already exist in the section map; no new slot type, no `EXPECTED_SLOT_ORDER` change, no `CHECKPOINT_IDS` increment. Paste these branches at the bottom of `renderChapterTitle` (for the 2019 portrait) and `renderWorksCited` (for the 2015 photo):

### 2019 portrait at `opening-landing` — extend `renderChapterTitle`

```typescript
// At the end of renderChapterTitle, after the existing subtitle block:
if (slot.id === "opening-landing") {
  const portrait = document.createElement("figure");
  portrait.className = "vuong-portrait-2019"; // new CSS class
  const img = document.createElement("img");
  img.src = "/images/vuong-portrait-2019.jpg";
  img.alt = "Portrait of Ocean Vuong, 2019. Photograph by slowking4, CC BY-SA 2.0.";
  img.loading = "lazy";
  img.decoding = "async";
  const caption = document.createElement("figcaption");
  caption.className = "vuong-portrait-caption"; // citation-chrome treatment
  caption.textContent = "Ocean Vuong · 2019 · slowking4, CC BY-SA 2.0";
  portrait.appendChild(img);
  portrait.appendChild(caption);
  inner.parentElement?.appendChild(portrait);
}
```

### 2015 LoC reading at `works-cited` — extend `renderWorksCited`

```typescript
// Inside renderWorksCited, BEFORE the heading append. The photo reads first; the citation list reads second.
const photo = document.createElement("figure");
photo.className = "vuong-loc-reading-2015";
const img = document.createElement("img");
img.src = "/images/vuong-loc-reading-2015.jpg";
img.alt = "Ocean Vuong reading at the Library of Congress, 2015. Photograph by slowking4, CC BY-NC 3.0.";
img.loading = "lazy";
img.decoding = "async";
const caption = document.createElement("figcaption");
caption.className = "vuong-portrait-caption";
caption.textContent = "Vuong reading at the Library of Congress · 2015 · slowking4, CC BY-NC 3.0";
photo.appendChild(img);
photo.appendChild(caption);
inner.appendChild(photo);
// then the existing heading + ul code follows
```

```typescript
const portrait = document.createElement("figure");
portrait.className = "vuong-portrait"; // new CSS class — define in chapters.css
const img = document.createElement("img");
img.src = "/images/vuong-portrait-2019.jpg";
img.alt = "Portrait of Ocean Vuong, 2019. Photograph by slowking4, CC BY-SA 2.0.";
img.loading = "lazy";
img.decoding = "async";
const caption = document.createElement("figcaption");
caption.className = "vuong-portrait-caption"; // citation-chrome treatment
caption.textContent = "Ocean Vuong · 2019 · slowking4, CC BY-SA 2.0";
portrait.appendChild(img);
portrait.appendChild(caption);
inner.parentElement?.appendChild(portrait); // matches existing pattern at opening-world / opening-pressures
```

The CSS counterpart needs a `.vuong-portrait` rule that mirrors `.opening-cover` / `.opening-hine` style (positioned figure, `clamp()` width, opacity-controlled fade-in, `:root[data-motion="reduced"]` settled-state fallback). Reuse the existing `figure-aside` move from the strategy doc once it's defined in CSS.

## Optimization checklist before shipping (image-implementation pass)

- [ ] `vuong-portrait-2019.jpg` → WebP at ~1000 px wide, target ~80 KB.
- [ ] `vuong-loc-reading-2015.jpg` → WebP at ~1200 px wide, target ~120 KB.
- [ ] Both new WebPs co-located here in `public/images/`. JPEGs kept as `<picture>` fallback.
- [ ] Re-verify total image weight ≤ 400 KB gzipped (strategy doc Phase 5 gate).
- [ ] Re-run `npm run build` and confirm JS gzipped ≤ 80 KB cap holds.

## License footer (must appear somewhere on the site)

Per CC-BY-SA 2.0 and CC-BY-NC 3.0 attribution requirements, the site must surface photographer credit somewhere visible to the audience. Options:

1. **Per-image figcaption** — already covered by the paste-ready figcaption strings above. Cleanest.
2. **Image-credits row in the closing works-cited slot** — could add a sub-section under works-cited listing all image attributions. Belt-and-suspenders.
3. **A dedicated `closing-credits` slot after works-cited** — overlaps with the proposed Vuong slot home; can serve both purposes.

Option 1 alone satisfies the license. Option 3 satisfies it more visibly and also gives Vuong a slot home. Surface to Samuel.
