---
version: 1.0
name: Huayu Drama Club Product UI
description: A calm, editorial community interface for a student drama club, with cinematic scene media and focused reading surfaces.
source: https://github.com/abhayjnayakk/awesome-design-md
---

## Visual Theme & Atmosphere

The product is a small cultural community, not a marketing landing page. Keep the existing scene video or animated wallpaper as the atmospheric layer. UI surfaces sit above it as quiet paper-glass planes so the media remains visible without competing with text.

The emotional register is observant, warm, and slightly theatrical: editorial reading rhythm, restrained club-red accents, soft blue-green neutrals, and a small amount of stage-light contrast. Do not replace a user-provided scene asset with a new background.

## Color Palette & Roles

- `--ui-ink`: `#17232B` for headings and primary body text.
- `--ui-ink-muted`: `#65727A` for timestamps, helper text, and metadata.
- `--ui-paper`: `rgba(255, 252, 245, 0.92)` for primary reading surfaces.
- `--ui-paper-soft`: `rgba(248, 250, 247, 0.76)` for secondary surfaces over media.
- `--ui-line`: `rgba(35, 53, 61, 0.15)` for dividers and quiet boundaries.
- `--ui-accent`: `#A62642` for destructive actions and the single primary action.
- `--ui-accent-soft`: `rgba(166, 38, 66, 0.10)` for selected states and tags.
- `--ui-teal`: `#2F6F6A` for supportive status and subtle focus states.

Use contrast before decoration. Text must remain readable against every supplied wallpaper. When a media focal point sits behind text, add a local translucent surface or a directional overlay rather than globally darkening the whole page.

## Typography

- Narrative titles: a Chinese serif stack such as `Noto Serif SC`, `Source Han Serif SC`, `Songti SC`, serif.
- Controls and metadata: `Inter`, `Noto Sans SC`, `Microsoft YaHei`, sans-serif.
- Use large title scale only for the current page title. Body copy is comfortable, not oversized: 1.05rem to 1.2rem with 1.85 to 2 line-height.
- Keep letter spacing at `0` for Chinese reading text. Use uppercase labels sparingly for compact English section markers.

## Layout Principles

- Use one shared content max-width, page gutter, header offset, and title gap across every route.
- Detail pages use a desktop rail plus a dominant reading column. On mobile they become a single column with the rail hidden, never a squeezed two-column layout.
- Keep an intentional reading measure: long-form copy should not stretch across the whole viewport.
- Prefer a small number of strong zones over many nested cards. Use whitespace to show hierarchy.
- Keep attachments, comments, and composer sections collapsed when empty or secondary. Their summaries must state what is inside and how many items exist.

## Component Stylings

- Primary action: solid club-red, compact radius, clear label, visible focus ring.
- Secondary action: translucent paper surface with a 1px line; use for navigation and non-destructive actions.
- Article surface: paper-glass background, 20 to 24px radius, thin border, soft shadow only where it separates content from motion.
- Metadata: muted, small, and aligned to the same baseline; never compete with a title.
- Interaction row: four explicit actions in a stable order: like, comments, write, share.
- Comments: a collapsed summary row first; each reply editor is independently expandable to keep the page scannable.
- Empty states: short, specific, and placed inside the relevant collapsed section rather than occupying the whole page.

## Depth & Motion

The scene layer supplies motion. UI motion is supplemental: 160 to 240ms ease-out for fold expansion, selected-state changes, and route transitions. Use a small translate-y and opacity change, never a dramatic zoom. Respect `prefers-reduced-motion`.

## Responsive Behavior

- Desktop: rail 240 to 280px, reading column min-width 0, title actions aligned to the right.
- Tablet: keep the reading column dominant and reduce rail padding before reducing type.
- Mobile: hide the rail, keep the back action in the hero, turn action rows into wrapping controls, and make textareas full width.
- Never allow title, metadata, or button labels to overflow their container. Long Chinese text must wrap naturally.

## Do's and Don'ts

Do:

- Keep existing scene media and let it show through restrained surfaces.
- Make the first screen useful: title, author, body, and the next interaction are visible.
- Give every important action a clear focus and pressed state.
- Keep desktop and mobile routes data-equivalent.

Don't:

- Do not use a black dashboard shell for a reading page.
- Do not repeat the same background image inside every card.
- Do not hide the only route back to the module.
- Do not turn every field, attachment, or comment into a permanently open panel.

## Agent Prompt Guide

### Welcome entrance — approved 2026-09-09

The welcome screen follows the user's C composition: warm paper on the left (58%), a full-height theatre image on the right (42%). After rejecting generic components and then the overly bare revision, the user requested subtle patterns and deliberate UI details. The implemented surface uses an offset two-line club title, a faint engraved theatre seating plan, a thin inset rule and a single burgundy admission-ticket button with semicircular notches and a perforated stub. Hover lifts the ticket slightly and brightens the stage. No pill CTA, feature list or generic card shell. Keep this exception scoped to `#cinemaIntro`; the website header appears after entry.

On mobile the identity and ticket come before the theatre image; the image fills the remaining height. The paper is `#f5f0e7`, the burgundy is `#753842`, and body text is `#514b44`. The seating plan is decorative SVG geometry rather than a raster texture or a literal venue map. The club emblem remains an existing asset. `intro-theatre-programme.webp` is generated decorative theatre imagery, not a claim that it depicts the club's own venue. Text and controls stay in HTML.

The overlay isolates keyboard focus from the underlying page. Entry takes 420ms, then focus moves to the homepage title. The existing session-level skip, reduced-motion skip and constrained-connection skip remain. Session storage failure must not prevent entry. Existing intro PNGs remain on disk but are no longer loaded by this screen.

Before editing a page, read this file as the visual source of truth. Preserve the scene media already mapped to the route. Reuse the existing state, API, event bindings, and route identifiers. When adding a surface, first decide whether it is primary content, supporting context, or an expandable interaction. Verify the result at desktop and mobile widths, and check readable contrast over the actual wallpaper.
