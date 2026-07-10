// Shared source of truth for the lab's publication list + small formatting
// helpers used by both Publication.dc.html (full list) and Index.dc.html
// (Recent Publications preview). Edit PUBLICATIONS here and both pages stay
// in sync.
//
// Highlighting a name in the author list is manual, per paper: wrap the
// exact text you want bolded in double asterisks, e.g. '**Jung, J.**'. This
// replaces the old global-regex approach — nothing is auto-bolded, so
// duplicate/namesake names on different papers are never mixed up.
//
// Attach a photo to a paper by giving it a `photoId` — any string you like,
// just keep it stable. Drop the figure onto that paper's thumbnail on the
// Publication page and it will also show up automatically wherever that
// paper appears (e.g. the Recent Publications preview on the homepage),
// since both pages key their <image-slot> off the same photoId.

export const FIELD_STYLE = {
  'First-principles calculation': { bg: 'var(--blue-100)', color: 'var(--brand-primary)' },
  'Machine learning potential': { bg: 'var(--fog-100)', color: 'var(--fog-700)' },
  'Multi-scale simulation': { bg: 'var(--sage-100)', color: 'var(--sage-600)' },
  'Generative AI for materials': { bg: 'var(--gold-200)', color: 'var(--gold-700)' },
};

// Parses manual '**...**' bold markup in an author string into styled parts.
export function splitAuthors(str) {
  const parts = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m;
  while ((m = re.exec(str))) {
    if (m.index > last) parts.push({ text: str.slice(last, m.index), bold: false, plain: true });
    parts.push({ text: m[1], bold: true, plain: false });
    last = re.lastIndex;
  }
  if (last < str.length) parts.push({ text: str.slice(last), bold: false, plain: true });
  return parts;
}

function stripHighlightMarkup(str) {
  return str.replace(/\*\*/g, '');
}

export function withComputedFields(items) {
  return items.map(it => ({
    ...it,
    fieldsStyled: it.fields.map(f => ({ label: f, bg: FIELD_STYLE[f].bg, color: FIELD_STYLE[f].color })),
    authorParts: splitAuthors(it.authors),
    doiUrl: it.doi ? `https://doi.org/${it.doi}` : '',
  }));
}

// Is Jisu Jung (the PI, "Jung, J." in author lists) the first author, a
// co-first author (marked with †, regardless of list position), or a
// corresponding author (marked with *) on this paper? This is a purely
// structural check (position + marker), independent of the manual bold
// markup above. `authorshipIgnoreIndex` skips specific "Jung, J." matches
// that are actually a namesake, not the PI (rare — only needed when a paper
// lists more than one "Jung, J.").
export function analyzeAuthorship(it) {
  const authors = stripHighlightMarkup(it.authors);
  const JUNG_REGEX = /Jung, J\.?/g;
  const ignore = it.authorshipIgnoreIndex || [];
  let m;
  let idx = 0;
  let isFirstOrCoFirst = false;
  let isCorresponding = false;
  while ((m = JUNG_REGEX.exec(authors))) {
    if (!ignore.includes(idx)) {
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
    { photoId: 'pub-topo-ptga', fields: ['First-principles calculation'], title: 'Decoupling of topological surface states from catalytic activity in the chiral topological semimetal PtGa', authors: 'Jung, J.\u2020, **Jung, J.\u2020**, Kim, H., Lee, Y., Lee, J., Lee, J. H., Chung, D. Y., Han, S., Kim, C., Mun, B. S. & Yoo, S. J.*', venue: 'Submitted', doi: '', authorshipIgnoreIndex: [0] },
    { photoId: 'pub-ovonic-switching', fields: ['First-principles calculation'], title: 'Field-free ovonic threshold switching at the glass transition with transient and inhomogeneous covalent-to-metavalent conversion', authors: 'Kim, D.\u2020*, Miao, N.\u2020, **Jung, J.\u2020**, Jung, T. S.\u2020, Zhou, Y., Lee, S., Sch\u00f6n, C.-F., Yu, Y., Kim, J. H.*, & Han, S.*', venue: 'Submitted', doi: '' },
  ]},
  { year: '2026', items: [
    { photoId: 'pub-diffusion-discovery', fields: ['Generative AI for materials'], title: 'Are diffusion models ready for materials discovery in unexplored chemical space?', authors: 'Kim, S., Jeon, G., Hwang, S., Lee, J., **Jung, J.**, Han, S., & Kang, S.*', venue: 'Patterns 7, 101537', doi: '10.1016/j.patter.2026.101537' },
    { photoId: 'pub-kim-reactive', photoSrc: 'assets/paper_kim_reactive.jpeg', fields: ['Machine learning potential'], title: 'Reactive machine learning interatomic potentials for chemistry and materials science', authors: 'Kim, J., Cho, H., Jeon, H., **Jung, J.***, & Han, S.*', venue: 'Chemical Reviews 126, 4467\u20134510', doi: '10.1021/acs.chemrev.5c00728' },
  ]},
  { year: '2025', items: [
    { photoId: 'pub-kim-nonmelting', photoSrc: 'assets/paper_kim_nonmelting.jpeg', fields: ['First-principles calculation'], title: 'Nonmelting disordering facilitated by electron delocalization', authors: 'Kim, D.\u2020, Kim, S.\u2020, **Jung, J.\u2020**, Kim, J., Choi, S., Sch\u00f6n, C.-F., Lee, C., Lim, H., Jeong, J., Yu, S., Jeong, Y., Lee, H., Kim, S., Nam, D., Eom, I., Jang, D., Kim, K. S., Im, S., Han, S.*, Kim, H.*, & Cho, M.-H.*', venue: 'ACS Nano 19, 9317\u20139326', doi: '10.1021/acsnano.5c00755' },
  ]},
  { year: '2024', items: [
    { photoId: 'pub-jung-modified', photoSrc: 'assets/paper_jung_modified.jpeg', fields: ['Multi-scale simulation'], title: 'Modified activation-relaxation technique (ARTn) method tuned for efficient identification of transition states in surface reactions', authors: '**Jung, J.**, An, H., Lee, J. & Han, S.*', venue: 'J. Chem. Theory Comput. 20, 8024', doi: '10.1021/acs.jctc.4c00767' },
    { photoId: 'pub-li-diffusion', fields: ['Machine learning potential', 'Multi-scale simulation'], title: 'Disorder-dependent Li diffusion in Li6PS5Cl investigated by machine learning potential', authors: 'Lee, J.\u2020, Ju, S.\u2020, Hwang, S., You, J., **Jung, J.**, Kang, Y.* & Han, S.*', venue: 'ACS Appl. Mater. Interface 16, 46442', doi: '10.1021/acsami.4c08865' },
    { photoId: 'pub-melting-temp', fields: ['Generative AI for materials', 'Machine learning potential'], title: 'Predicting melting temperature of inorganic crystals via crystal graph neural network enhanced by transfer learning', authors: 'Kim, J.\u2020, **Jung, J.\u2020**, Kim, S. & Han, S.*', venue: 'Comput. Mater. Sci. 234, 112783', doi: '10.1016/j.commatsci.2024.112783' },
  ]},
  { year: '2023', items: [
    { photoId: 'pub-pt3co-degradation', fields: ['Multi-scale simulation', 'Machine learning potential'], title: 'Electrochemical degradation of Pt3Co nanoparticles investigated by off-lattice kinetic Monte Carlo simulations with machine-learned potentials', authors: '**Jung, J.\u2020**, Ju, S.\u2020, Kim, P.-H., Hong, D., Jeong, W., Lee, J., Han, S.* & Kang, S.*', venue: 'ACS Catal. 13, 16078\u201316087', doi: '10.1021/acscatal.3c04964' },
    { photoId: 'pub-mlp-applications', fields: ['Machine learning potential'], title: 'Applications and training sets of machine learning potentials', authors: 'Hong, C.\u2020, Kim, J.\u2020, Kim, J., **Jung, J.**, Ju, S., Choi, J. M. & Han, S.*', venue: 'Sci. Technol. Adv. Mater.: Methods 3, 2269948', doi: '10.1080/27660400.2023.2269948' },
    { photoId: 'pub-ternary-oxides', fields: ['Machine learning potential', 'First-principles calculation'], title: 'Stability and equilibrium structures of unknown ternary metal oxides explored by machine-learned potentials', authors: 'Hwang, S., **Jung, J.**, Hong, C., Jeong, W., Kang, S.* & Han, S.*', venue: 'J. Am. Chem. Soc. 145, 19378\u201319386 \u2014 Supplementary cover', doi: '10.1021/jacs.3c06210' },
  ]},
  { year: '2022', items: [
    { photoId: 'pub-tin-ald', fields: ['Multi-scale simulation'], title: 'Atomistic kinetic Monte Carlo simulation on atomic layer deposition of TiN thin film', authors: 'Kim, S., An, H., Oh, S., **Jung, J.**, Kim, B., Nam, S. K. & Han, S.*', venue: 'Comput. Mater. Sci. 231, 111620', doi: '10.1016/j.commatsci.2022.111620' },
  ]},
  { year: '2021', items: [
    { photoId: 'pub-metadynamics', fields: ['Machine learning potential'], title: 'Metadynamics sampling in atomic environment space for collecting training data for machine learning potentials', authors: 'Yoo, D.\u2020, **Jung, J.\u2020**, Jeong, W. & Han, S.*', venue: 'npj Comput. Mater. 7, 131', doi: '10.1038/s41524-021-00595-5' },
  ]},
  { year: '2020', items: [
    { photoId: 'pub-disordered-training', fields: ['Machine learning potential'], title: 'Training machine-learning potentials for crystal structure prediction using disordered structures', authors: 'Hong, C.\u2020, Choi, J. M.\u2020, Jeong, W.\u2020, Kang, S.\u2020, Ju, S., Lee, K., **Jung, J.**, Youn, Y. & Han, S.*', venue: 'Phys. Rev. B 102, 224104', doi: '10.1103/PhysRevB.102.224104' },
    { photoId: 'pub-amp2', fields: ['First-principles calculation'], title: 'AMP2: A fully automated program for ab initio calculations of crystalline materials', authors: 'Youn, Y., Lee, M., Hong, C., Kim, D., Kim, S., **Jung, J.**, Kim, Y. & Han, S.*', venue: 'Comput. Phys. Commun. 256, 107450', doi: '10.1016/j.cpc.2020.107450' },
    { photoId: 'pub-uncertainty-nnp', fields: ['Machine learning potential'], title: 'Efficient atomic-resolution uncertainty estimation for neural network potentials using a replica ensemble', authors: 'Jeong, W., Yoo, D., Lee, K., **Jung, J.** & Han, S.*', venue: 'J. Phys. Chem. Lett. 11, 6090\u20136096 \u2014 Supplementary cover', doi: '10.1021/acs.jpclett.0c01614' },
  ]},
];
