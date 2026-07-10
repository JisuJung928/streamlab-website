# STREAM Lab site — GitHub update package

This mirrors the `JisuJung928/streamlab-website` repo layout exactly — same
filenames, same `support.js` runtime. To publish:

1. Unzip this into the repo root, overwriting the existing `index.html`,
   `research.html`, `members.html`, `publication.html`, `presentation.html`,
   `news.html`, `contact.html`, `support.js`, `publication-data.js`,
   `news-data.js`, `assets/`, and `_ds/`.
2. Add the new `responsive.css` (not in the repo before).
3. Delete `.image-slots.state.json` — no longer used; all photos (including
   the nav logo) are now explicit file paths in the data files / `assets/logo.png`.
4. Commit and push to `master`.

If you'd rather do this with Claude Code: point it at the repo locally,
ask it to replace the files above with the contents of this package, then
commit and push — Claude Code has real git/GitHub access from your machine,
which I don't have from here.

## What changed since the last GitHub version
- Nav logo sits on a white circle on every page (patched into `_ds`'s NavBar).
- All photos (news, publications, nav logo) now use explicit file paths with
  extensions instead of the hidden drag-and-drop slot state.
- Homepage "Recent News" cards are text-only (no photos) for a clean, even
  3-up grid; full photos still show on the News page timeline.
- All 7 pages are responsive: mobile hamburger nav, grids collapse to 1–2
  columns, hero/type sizes and paddings scale down below ~640–900px.
