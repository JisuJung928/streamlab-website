// Shared source of truth for the lab's news feed, used by both News.dc.html
// (full timeline) and Index.dc.html (Recent News preview) — so the same
// item, with the same photo, shows up in both places automatically.
//
// Attach a photo by giving an item an `imageId` (any stable string) and
// dropping the image onto its slot on the News page — it will also appear
// in the homepage's Recent News preview, since both key off the same id.
//
// Attach a link by setting `link` to a URL. When present, a link-preview
// card renders under the item with a live thumbnail of that page.

export const NEWS_ITEMS = [
  { id: 'pnu-seminar', date: '2026.03.19', title: 'Invited seminar at MSE of PNU', excerpt: 'AI-driven atomistic simulation: from property prediction to long-timescale behavior analysis — invited seminar at the Dept. of Materials Science and Engineering, Pusan National University', imageId: 'news-pnu-seminar', link: 'https://streamlab.re.kr' },
  { id: 'bak-join', date: '2026.03.02', title: '2026 Spring M.S. course student', excerpt: 'B.S. Hyeongeun Bak joined the lab as an M.S. student, affiliated with both KICET and UNIST. Welcome!', imageId: 'news-bak-join' },
  { id: 'kim-seminar', date: '2026.02.24', title: 'Seminar with Prof. Byungjo Kim (UNIST)', excerpt: 'Prof. Byungjo Kim presented a seminar titled "Leveraging Computational Science for Advanced Semiconductor Process Design" at KICET. Thanks!', imageId: 'news-byungjo', imageSrc: 'assets/news_byungjo.jpg' },
  { id: 'kimms-symposium', date: '2026.01.22', title: 'Invited presentation at 2026 Computational Material Science Winter Symposium', excerpt: 'Korean Institute of Metals and Materials, Pohang (Korea), Jan. 23\u201325', imageId: 'news-kimms-symposium' },
  { id: 'ahn-trainee', date: '2026.01.05', title: '2026 Q1 Research Trainee', excerpt: 'Mr. Hyeonseung Ahn (UNIST) joined the lab as a research trainee for six months. Welcome!' },
  { id: 'kim-intern', date: '2025.11.03', title: '2025 Q3 Research Intern', excerpt: 'M.S. Yeojin Kim joined the lab as a research intern for a year. Welcome!' },
  { id: 'beginning', date: '2025.03.04', title: 'Beginning', excerpt: 'Ph.D. Jisu Jung has been a researcher at KICET since 2025.', imageId: 'news-beginning' },
];

// Builds a live thumbnail URL for a link preview card (via a public
// screenshot service — no API key needed for light use). Falls back to a
// plain link row if the image fails to load (handled in the template).
export function linkThumbnailUrl(link) {
  return `https://api.microlink.io/?url=${encodeURIComponent(link)}&screenshot=true&meta=false&embed=screenshot.url`;
}

export function linkDomain(link) {
  try { return new URL(link).hostname.replace(/^www\./, ''); } catch (e) { return link; }
}
