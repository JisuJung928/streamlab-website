# assets/

Drop image files here with these exact names and the site will pick them up automatically (no code changes needed).

## Required files

- `logo.jpg` — lab logo/mark, shown in the white circle next to "STREAM Lab" in the nav bar (works best as a square image with transparent or white background)
- `hero-bg.jpg` — lab/institute building photo, used as the dark hero background on every page
- `pi-photo.jpg` — PI photo (Members page)
- `member-hb.jpg` — Hyeongeun Bak
- `member-ha.jpg` — Hyeonseung Ahn
- `alumni-yk.jpg` — Yeojin Kim (Alumni)
- `news-pnu-seminar.jpg` — News: Invited seminar at MSE of PNU
- `news-bak-join.jpg` — News: 2026 Spring M.S. course student
- `news-kim-seminar.jpg` — News: Seminar with Prof. Byungjo Kim
- `pub-diffusion-2026.jpg` — Home page publication card thumbnail
- `pub-reactive-mlip-2026.jpg` — Home page publication card thumbnail
- `pub-nonmelting-2025.jpg` — Home page publication card thumbnail

## Other files here

- `animations/first-principles-loop.jsx`, `animations/mlip-loop.jsx`, `animations/multiscale-loop.jsx`, `animations/generative-ai-loop.jsx` — the four looping SVG research-topic animations used on the Research page, each a separate self-contained file. Not photos — leave them as-is; `research.dc.html` loads them directly.

## Notes

- Recommended: JPG, roughly 3:2 or 16:9, at least 1200px on the long edge.
- Any missing file simply shows a soft blue/navy placeholder box until you add it — nothing breaks.
- To add more member/alumni photos later, follow the same `member-*` / `alumni-*` naming used in each person's `photoId` in `members.dc.html`.
