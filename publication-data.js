// Shared source of truth for the lab's publication list + small formatting
// helpers used by both publication.html (full list) and index.html (Recent
// Publications preview). Edit PUBLICATIONS here and both pages stay in sync.

export const FIELD_STYLE = {
  'First-principles calculation': { bg: 'var(--blue-100)', color: 'var(--brand-primary)' },
  'Machine learning potential': { bg: 'var(--fog-100)', color: 'var(--fog-700)' },
  'Multi-scale simulation': { bg: 'var(--sage-100)', color: 'var(--sage-600)' },
  'Generative AI for materials': { bg: 'var(--gold-200)', color: 'var(--gold-700)' },
};

// Current lab members whose author-list occurrences are bolded + underlined
// wherever the author list is rendered in full.
export const LAB_MEMBER_REGEX = /(Jung, J\.?|Bak, H\.?|Ahn, H\.?)/g;

export function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Same-name authors can belong to different people across papers, so bolding is
// resolved per paper rather than by one blanket rule:
//  - `highlightOverride: ['Jung, J.\u2020']` on a paper replaces the default regex
//    entirely for that paper — only these exact author strings get bolded.
//  - `excludeHighlight: ['Jung, J.']` keeps the default regex but un-bolds specific
//    matches (use when a match is actually a namesake, not the lab member).
export function splitAuthors(str, { highlightOverride, excludeHighlight, excludeHighlightIndex } = {}) {
  const parts = [];
  let last = 0;
  let m;
  let matchIdx = 0;
  const regex = highlightOverride && highlightOverride.length
    ? new RegExp('(' + highlightOverride.map(escapeRegex).join('|') + ')', 'g')
    : LAB_MEMBER_REGEX;
  regex.lastIndex = 0;
  while ((m = regex.exec(str))) {
    if (m.index > last) parts.push({ text: str.slice(last, m.index), bold: false, plain: true });
    const isExcludedByName = !highlightOverride && excludeHighlight && excludeHighlight.includes(m[0]);
    const isExcludedByIndex = excludeHighlightIndex && excludeHighlightIndex.includes(matchIdx);
    const isExcluded = isExcludedByName || isExcludedByIndex;
    parts.push({ text: m[0], bold: !isExcluded, plain: isExcluded });
    matchIdx += 1;
    last = m.index + m[0].length;
  }
  if (last < str.length) parts.push({ text: str.slice(last), bold: false, plain: true });
  return parts;
}

export function withComputedFields(items) {
  return items.map(it => ({
    ...it,
    fieldsStyled: it.fields.map(f => ({ label: f, bg: FIELD_STYLE[f].bg, color: FIELD_STYLE[f].color })),
    authorParts: splitAuthors(it.authors, { highlightOverride: it.highlightOverride, excludeHighlight: it.excludeHighlight, excludeHighlightIndex: it.excludeHighlightIndex }),
    doiUrl: it.doi ? `https://doi.org/${it.doi}` : '',
  }));
}

// Is Jisu Jung (the PI, "Jung, J." in author lists) the first author, a
// co-first author (marked with \u2020, regardless of list position), or a
// corresponding author (marked with *) on this paper? Respects the same
// highlightOverride/exclude options used for bolding, so a namesake "Jung, J."
// on someone else's paper is never mistaken for the PI.
export function analyzeAuthorship(it) {
  const { authors, highlightOverride, excludeHighlight, excludeHighlightIndex } = it;
  const JUNG_REGEX = /Jung, J\.?/g;
  let m;
  let idx = 0;
  let isFirstOrCoFirst = false;
  let isCorresponding = false;
  JUNG_REGEX.lastIndex = 0;
  while ((m = JUNG_REGEX.exec(authors))) {
    const isExcludedByName = !highlightOverride && excludeHighlight && excludeHighlight.includes(m[0]);
    const isExcludedByIndex = excludeHighlightIndex && excludeHighlightIndex.includes(idx);
    const isOverridden = highlightOverride && highlightOverride.length && !highlightOverride.some(h => h.startsWith('Jung, J'));
    if (!isExcludedByName && !isExcludedByIndex && !isOverridden) {
      const end = m.index + m[0].length;
      const nextChar = authors[end];
      if (m.index === 0) isFirstOrCoFirst = true;
      if (nextChar === '\u2020') isFirstOrCoFirst = true;
      if (nextChar === '*') isCorresponding = true;
    }
    idx += 1;
  }
  return { isFirstOrCoFirst, isCorresponding };
}

export const PUBLICATIONS = [
  { year: 'Submitted', items: [
    { fields: ['First-principles calculation'], title: 'Decoupling of topological surface states from catalytic activity in the chiral topological semimetal PtGa', authors: 'Jung, J.\u2020, Jung, J.\u2020, Kim, H., Lee, Y., Lee, J., Lee, J. H., Chung, D. Y., Han, S., Kim, C., Mun, B. S. & Yoo, S. J.*', venue: 'Submitted', doi: '', excludeHighlightIndex: [0] },
    { fields: ['First-principles calculation'], title: 'Field-free ovonic threshold switching at the glass transition with transient and inhomogeneous covalent-to-metavalent conversion', authors: 'Kim, D.\u2020*, Miao, N.\u2020, Jung, J.\u2020, Jung, T. S.\u2020, Zhou, Y., Lee, S., Sch\u00f6n, C.-F., Yu, Y., Kim, J. H.*, & Han, S.*', venue: 'Submitted', doi: '' },
  ]},
  { year: '2026', items: [
    { fields: ['Generative AI for materials'], title: 'Are diffusion models ready for materials discovery in unexplored chemical space?', authors: 'Kim, S., Jeon, G., Hwang, S., Lee, J., Jung, J., Han, S., & Kang, S.*', venue: 'Patterns 7, 101537', doi: '10.1016/j.patter.2026.101537' },
    { fields: ['Machine learning potential'], title: 'Reactive machine learning interatomic potentials for chemistry and materials science', authors: 'Kim, J., Cho, H., Jeon, H., Jung, J.*, & Han, S.*', venue: 'Chemical Reviews 126, 4467\u20134510', doi: '10.1021/acs.chemrev.5c00728' },
  ]},
  { year: '2025', items: [
    { fields: ['First-principles calculation'], title: 'Nonmelting disordering facilitated by electron delocalization', authors: 'Kim, D.\u2020, Kim, S.\u2020, Jung, J.\u2020, Kim, J., Choi, S., Sch\u00f6n, C.-F., Lee, C., Lim, H., Jeong, J., Yu, S., Jeong, Y., Lee, H., Kim, S., Nam, D., Eom, I., Jang, D., Kim, K. S., Im, S., Han, S.*, Kim, H.*, & Cho, M.-H.*', venue: 'ACS Nano 19, 9317\u20139326', doi: '10.1021/acsnano.5c00755' },
  ]},
  { year: '2024', items: [
    { fields: ['Multi-scale simulation'], title: 'Modified activation-relaxation technique (ARTn) method tuned for efficient identification of transition states in surface reactions', authors: 'Jung, J., An, H., Lee, J. & Han, S.*', venue: 'J. Chem. Theory Comput. 20, 8024', doi: '10.1021/acs.jctc.4c00767' },
    { fields: ['Machine learning potential', 'Multi-scale simulation'], title: 'Disorder-dependent Li diffusion in Li6PS5Cl investigated by machine learning potential', authors: 'Lee, J.\u2020, Ju, S.\u2020, Hwang, S., You, J., Jung, J., Kang, Y.* & Han, S.*', venue: 'ACS Appl. Mater. Interface 16, 46442', doi: '10.1021/acsami.4c08865' },
    { fields: ['Generative AI for materials', 'Machine learning potential'], title: 'Predicting melting temperature of inorganic crystals via crystal graph neural network enhanced by transfer learning', authors: 'Kim, J.\u2020, Jung, J.\u2020, Kim, S. & Han, S.*', venue: 'Comput. Mater. Sci. 234, 112783', doi: '10.1016/j.commatsci.2024.112783' },
  ]},
  { year: '2023', items: [
    { fields: ['Multi-scale simulation', 'Machine learning potential'], title: 'Electrochemical degradation of Pt3Co nanoparticles investigated by off-lattice kinetic Monte Carlo simulations with machine-learned potentials', authors: 'Jung, J.\u2020, Ju, S.\u2020, Kim, P.-H., Hong, D., Jeong, W., Lee, J., Han, S.* & Kang, S.*', venue: 'ACS Catal. 13, 16078\u201316087', doi: '10.1021/acscatal.3c04964' },
    { fields: ['Machine learning potential'], title: 'Applications and training sets of machine learning potentials', authors: 'Hong, C.\u2020, Kim, J.\u2020, Kim, J., Jung, J., Ju, S., Choi, J. M. & Han, S.*', venue: 'Sci. Technol. Adv. Mater.: Methods 3, 2269948', doi: '10.1080/27660400.2023.2269948' },
    { fields: ['Machine learning potential', 'First-principles calculation'], title: 'Stability and equilibrium structures of unknown ternary metal oxides explored by machine-learned potentials', authors: 'Hwang, S., Jung, J., Hong, C., Jeong, W., Kang, S.* & Han, S.*', venue: 'J. Am. Chem. Soc. 145, 19378\u201319386 \u2014 Supplementary cover', doi: '10.1021/jacs.3c06210' },
  ]},
  { year: '2022', items: [
    { fields: ['Multi-scale simulation'], title: 'Atomistic kinetic Monte Carlo simulation on atomic layer deposition of TiN thin film', authors: 'Kim, S., An, H., Oh, S., Jung, J., Kim, B., Nam, S. K. & Han, S.*', venue: 'Comput. Mater. Sci. 231, 111620', doi: '10.1016/j.commatsci.2022.111620' },
  ]},
  { year: '2021', items: [
    { fields: ['Machine learning potential'], title: 'Metadynamics sampling in atomic environment space for collecting training data for machine learning potentials', authors: 'Yoo, D.\u2020, Jung, J.\u2020, Jeong, W. & Han, S.*', venue: 'npj Comput. Mater. 7, 131', doi: '10.1038/s41524-021-00595-5' },
  ]},
  { year: '2020', items: [
    { fields: ['Machine learning potential'], title: 'Training machine-learning potentials for crystal structure prediction using disordered structures', authors: 'Hong, C.\u2020, Choi, J. M.\u2020, Jeong, W.\u2020, Kang, S.\u2020, Ju, S., Lee, K., Jung, J., Youn, Y. & Han, S.*', venue: 'Phys. Rev. B 102, 224104', doi: '10.1103/PhysRevB.102.224104' },
    { fields: ['First-principles calculation'], title: 'AMP2: A fully automated program for ab initio calculations of crystalline materials', authors: 'Youn, Y., Lee, M., Hong, C., Kim, D., Kim, S., Jung, J., Kim, Y. & Han, S.*', venue: 'Comput. Phys. Commun. 256, 107450', doi: '10.1016/j.cpc.2020.107450' },
    { fields: ['Machine learning potential'], title: 'Efficient atomic-resolution uncertainty estimation for neural network potentials using a replica ensemble', authors: 'Jeong, W., Yoo, D., Lee, K., Jung, J. & Han, S.*', venue: 'J. Phys. Chem. Lett. 11, 6090\u20136096 \u2014 Supplementary cover', doi: '10.1021/acs.jpclett.0c01614' },
  ]},
];
