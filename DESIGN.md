---
version: alpha
name: Pls Make Website
description: A code-editor letter as the hero, and one section per line of the request. Dark "editor" ink alternates with warm "paper" bands.
colors:
  primary: "#ffd23f"
  ink: "#14161b"
  ink-raised: "#1f232b"
  ink-line: "#353b47"
  paper: "#f6f1e7"
  paper-line: "#d9cfbd"
  text-on-ink: "#ece7dc"
  muted-on-ink: "#a8a295"
  text-on-paper: "#1a1a1a"
  muted-on-paper: "#5a5248"
  accent: "#ff5a36"
  accent-strong: "#b3301a"
  success: "#5fd38d"
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 4.5rem
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  heading:
    fontFamily: Space Grotesk
    fontSize: 2.75rem
    fontWeight: 700
    lineHeight: 1.05
  body:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
  code:
    fontFamily: JetBrains Mono
    fontSize: 1.05rem
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: JetBrains Mono
    fontSize: 0.85rem
    fontWeight: 400
rounded:
  sm: 6px
  md: 12px
  pill: 999px
spacing:
  "1": 0.25rem
  "2": 0.5rem
  "3": 1rem
  "4": 1.5rem
  "5": 2.5rem
  "6": 4rem
  "7": 6rem
components:
  page-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.text-on-ink}"
    typography: "{typography.body}"
  page-ink-muted:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.muted-on-ink}"
  band-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.text-on-paper}"
    typography: "{typography.body}"
  band-paper-muted:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.muted-on-paper}"
  band-paper-link:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.accent-strong}"
  editor:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.text-on-ink}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
  editor-request-link:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.primary}"
  editor-done-comment:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.success}"
  editor-line-number:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.muted-on-ink}"
  editor-border:
    backgroundColor: "{colors.ink-line}"
    textColor: "{colors.text-on-ink}"
  quote-on-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.accent}"
    typography: "{typography.label}"
  menu-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: 44px
  menu-panel:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.text-on-ink}"
    typography: "{typography.heading}"
  font-option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.text-on-paper}"
    rounded: "{rounded.md}"
    padding: 1.5rem
  font-option-border:
    backgroundColor: "{colors.paper-line}"
    textColor: "{colors.text-on-paper}"
---

## Overview

**Primary user task:** a developer who knows the "Machine, pls make website" meme lands on the page. Within 10–20 seconds they should see the joke (the letter, rendered as in the meme's editor) and see that every line of it was actually done. Surface type is **Decide/Learn**: one idea per section, so a hero is appropriate here.

**Composition.** The letter *is* the hero and the table of contents. Each request line in the editor links to the section that fulfils it, followed by a green `// ✓` comment saying how. Below it, the six sections alternate between **ink** (editor dark) and **paper** (warm off-white) bands. Each one starts with a mono `> quoted line` from the letter, then a plain-language heading that answers it. The footer is line 6: `bugs: 0`.

**Tone.** Deadpan. The machine takes every vague line literally and completely. Copy is short and dry, and the visuals do the joke. No emoji, no fake testimonials, no filler stats. Every number shown must be real (the image byte size and, in phase 2, the live load metrics).

## Colors

Two grounds, one accent per ground, and a yellow that means "this is interactive or the thing you asked for."

- **Ink (#14161b) / Ink raised (#1f232b):** editor chrome, hero, menu panel, footer.
- **Paper (#f6f1e7):** content bands, so the long page has rhythm and the BIG picture's sky flows out of the band.
- **Primary yellow (#ffd23f):** request-line links in the editor, the menu button, the focus ring on ink. Never used as text on paper (it fails contrast there).
- **Tomato accent (#ff5a36):** quoted letter lines on ink and the BIG picture's sun. On paper, use **accent-strong (#b3301a)** instead, which passes AA for text (≈6:1).
- **Success (#5fd38d):** `// ✓` comments, "shipped", the `0` in `bugs: 0`.

Contrast: every text/background pair in `components` passes WCAG AA 4.5:1 (checked by `design.md lint` and axe). Focus rings are 3px yellow on ink and 3px near-black on paper.

## Typography

- **Display/heading:** set by the visitor's chosen font pair (the "fav fonts" requirement). The default pair, **Shipped**, is Space Grotesk headings with Atkinson Hyperlegible Next body: friendly and techy, and the body face is built for legibility.
- **Code/labels:** JetBrains Mono in every pair, so the editor always looks like an editor.
- **Font pairs** (all OFL-1.1, self-hosted woff2, latin subset, `font-display: swap`):
  1. *Shipped*: Space Grotesk + Atkinson Hyperlegible Next (default)
  2. *Legally distinct*: Comic Neue (the Comic Sans joke, but legible)
  3. *Fancy client*: Fraunces + Source Serif 4
  4. *8-bit*: Press Start 2P headings (scaled to 0.62× via `--display-scale`) + IBM Plex Mono body
- Front-matter font sizes are the **maximums**. In CSS each one is fluid: display `clamp(2.25rem, 1.6rem + 3.2vw, 4.5rem)`, heading `clamp(1.75rem, 1.4rem + 1.6vw, 2.75rem)`, body `clamp(1rem, 0.96rem + 0.2vw, 1.125rem)`, code `clamp(0.8rem, 0.7rem + 0.7vw, 1.05rem)`, plus `--step-big` for the giant "ooo".

## Layout

- Fluid from **320px** to wide screens with no breakpoint-specific content. The hero becomes two columns at 60rem. Content is capped at 72rem, and text at a 62ch measure. The BIG picture is the one deliberate exception: full-bleed at 100vw.
- The editor's request lines wrap their `// ✓` comment under the line on narrow screens instead of scrolling horizontally. There is no horizontal overflow at 320px (checked).
- Sticky masthead, 3.75rem tall. `scroll-padding-top` keeps anchored headings clear of it.
- Below-the-fold sections use `content-visibility: auto`, so font specimens don't fetch every font at load.

## Elevation & Depth

Flat. The only shadow is the editor window's soft drop shadow, which sells "this is a window." Selected font options get a hard 4px offset shadow, so the selected state reads like a pressed key rather than a glow.

## Shapes

- 12px radius for windows and cards, and 6px for small boxes.
- Pills (999px) for the menu, close buttons and anything you press in the header.
- The BIG picture uses hard geometric layers, with no rounding.

## Components

- **Editor hero (`figure.editor`):** window bar with three dots and a filename tab, then CSS-counter line numbers that are hidden from assistive tech (`content: counter(line) / ""`). Request lines are real links.
- **Whooosh menu (`dialog#menu`):** a native modal `<dialog>`, which gives a focus trap, Esc to close and focus return to the button for free. Opening it sweeps a circular clip-path out from the menu button, staggers the six links in from the right with a slight skew, and sends two yellow speed lines across the panel (≈0.5s total). Choosing a link closes the menu, updates the URL hash and moves focus to the target section. **Reduced motion:** all of that is removed and the menu simply appears. **No JS:** the menu button is hidden and a plain inline anchor nav is shown in the header instead.
- **Font picker (`form.fontpicker`):** a native radio group in a fieldset, so it works by keyboard with no custom widget. Each card previews its own pair. JS sets `html[data-font]` and saves the choice to `localStorage` (`pmw-font`), and an inline head script restores it before first paint, so there's no flash. **No JS:** `html:has(input:checked)` still switches the pair for the current visit. A polite live region confirms the switch.
- **BIG picture (`figure.bleed`):** `<picture>` with AVIF, then WebP, at 640/1024/1600/2400w. It has explicit `width`/`height`, `loading="lazy"` and `decoding="async"`, and a caption stating the real format and size. The giant "ooo" heading overlaps the top of the picture.
- **Bugs counter (footer):** `bugs: <output>0</output>`. The phase 2 easter egg must stay harmless: no network calls, no stored data beyond the page, and fully reversible.

## Do's and Don'ts

- **Do** quote the letter line verbatim at the top of each section, then answer it plainly.
- **Do** keep every claim on the page real and measured. If a number is shown, it comes from the build or the visitor's own browser.
- **Do** keep JS optional. Every feature must have a working no-JS version.
- **Don't** add third-party requests: no font CDN, analytics or embeds.
- **Don't** put yellow or tomato text on paper. Use accent-strong.
- **Don't** add motion beyond the menu whooosh and small hover nudges, and always gate it behind `prefers-reduced-motion: no-preference`.
- **Don't** use images of real people. Art is original, with its license recorded in `ASSETS.md`.
