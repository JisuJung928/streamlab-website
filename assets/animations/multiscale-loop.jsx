// multiscale-loop.jsx — multi-scale simulation, looping SVG animation.
// Self-contained (per the Animated Video skill): raw React component, mounted via <x-import>.

// Palette pulled from the STREAM Lab design system tokens (tokens/colors.css):
const NAVY_800 = '#00205b';
const NAVY_900 = '#00173d';
const BLUE_600 = '#0085ca';
const BLUE_500 = '#2f9ed9';
const BLUE_100 = '#e3f2fa';
const GOLD_600 = '#a9812e';
const GOLD_700 = '#8a6a24';
const SAGE_600 = '#6d8c68';
const FOG_200 = '#dde3e8';
const FOG_300 = '#c3ccd3';
const FOG_400 = '#9aa6b0';
const FOG_600 = '#56626c';
const MONO_FONT = "'IBM Plex Mono', ui-monospace, monospace";

// Drives a seamless 0..period looping clock via requestAnimationFrame.
function useLoopClock(period) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf;
    let start = null;
    const step = (ts) => {
      if (start == null) start = ts;
      setT(((ts - start) / 1000) % period);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [period]);
  return t;
}

const TAU = Math.PI * 2;

function smoothstep01(x) {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

function MultiscaleLoop({ size = 800 }) {
  const period = 12;
  const t = useLoopClock(period);
  const p = t / period; // 0..1

  // an irregular landscape: shallow local minima, one deep global minimum
  const wells = [
    { pos: -500, depth: 1.0, width: 110 },
    { pos: -160, depth: 1.3, width: 120 }, // home
    { pos: 200, depth: 0.9, width: 100 },
    { pos: 560, depth: 1.7, width: 140 },
    { pos: 900, depth: 2.6, width: 170 }, // global minimum — deepest
  ];
  const HOME = 1;
  const sequence = [1, 2, 3, 4, 3, 2, 1]; // several dramatic hops, ends home
  const sceneCenter = (wells[HOME].pos + wells[4].pos) / 2;

  const SCALE_IN = 6.2, SCALE_OUT = 0.55;
  const phaseStart = 0.18, phaseEnd = 0.82;
  const nTrans = sequence.length - 1;
  const perStep = (phaseEnd - phaseStart) / nTrans;
  const holdFrac = 0.55;

  const scale = (() => {
    if (p < 0.08) return SCALE_IN;
    if (p < phaseStart) return SCALE_IN + (SCALE_OUT - SCALE_IN) * smoothstep01((p - 0.08) / (phaseStart - 0.08));
    if (p < phaseEnd) return SCALE_OUT;
    if (p < 0.92) return SCALE_OUT + (SCALE_IN - SCALE_OUT) * smoothstep01((p - phaseEnd) / (0.92 - phaseEnd));
    return SCALE_IN;
  })();

  const camera = (() => {
    if (p < 0.08) return wells[HOME].pos;
    if (p < phaseStart) return wells[HOME].pos + (sceneCenter - wells[HOME].pos) * smoothstep01((p - 0.08) / (phaseStart - 0.08));
    if (p < phaseEnd) return sceneCenter;
    if (p < 0.92) return sceneCenter + (wells[HOME].pos - sceneCenter) * smoothstep01((p - phaseEnd) / (0.92 - phaseEnd));
    return wells[HOME].pos;
  })();

  const wellPos = (() => {
    if (p < phaseStart) return wells[HOME].pos;
    if (p >= phaseEnd) return wells[HOME].pos;
    const local = p - phaseStart;
    const i = Math.min(nTrans - 1, Math.floor(local / perStep));
    const stepStart = i * perStep, holdEnd = stepStart + perStep * holdFrac, stepEnd = stepStart + perStep;
    const lp = local - stepStart;
    const fromPos = wells[sequence[i]].pos, toPos = wells[sequence[i + 1]].pos;
    if (lp < perStep * holdFrac) return fromPos;
    const t2 = (lp - perStep * holdFrac) / (stepEnd - holdEnd);
    return fromPos + (toPos - fromPos) * smoothstep01(t2);
  })();

  // gentle constant-frequency local jiggle, fine relative to well width —
  // reads as visible vibration only when zoomed in, negligible when zoomed out
  const jiggle = 16 * Math.sin(p * 12 * TAU);
  const particleWorldX = wellPos + jiggle;

  const cx = 400;
  const potential = (wx) => {
    let u = 0;
    for (const w of wells) u -= w.depth * Math.exp(-((wx - w.pos) ** 2) / (2 * w.width * w.width));
    return u;
  };

  // isotropic-in-spirit zoom, but the vertical axis auto-fits to whatever
  // potential range is actually visible at the current camera/scale — so
  // curvature always reads as prominent AND the landscape never clips off
  // the top or bottom of the frame, at any zoom level
  const screenX = (wx) => cx + (wx - camera) * scale;

  const vizHalfWidth = 420 / scale;
  const N = 220;
  const sampleWX = [];
  for (let i = 0; i <= N; i++) {
    sampleWX.push(camera + (i / N - 0.5) * 2 * vizHalfWidth * 1.15);
  }
  const sampleU = sampleWX.map(potential);
  let minU = Math.min(...sampleU, potential(particleWorldX));
  let maxU = Math.max(...sampleU, potential(particleWorldX));
  if (maxU - minU < 0.2) { const mid = (maxU + minU) / 2; minU = mid - 0.1; maxU = mid + 0.1; }
  const pad = (maxU - minU) * 0.12;
  minU -= pad; maxU += pad;

  const bandTop = 130, bandBottom = 610;
  const screenY = (wx) => {
    const u = potential(wx);
    const frac = (u - minU) / (maxU - minU); // 0 deepest .. 1 shallowest
    return bandBottom - frac * (bandBottom - bandTop);
  };

  const samples = sampleWX.map((wx) => [screenX(wx), screenY(wx)]);
  const pathD = samples.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

  const px = screenX(particleWorldX);
  const py = screenY(particleWorldX);

  const zoomedOutAmt = Math.max(0, Math.min(1, (SCALE_IN - scale) / (SCALE_IN - SCALE_OUT)));
  const vibLabelOp = 1 - zoomedOutAmt;
  const hopLabelOp = zoomedOutAmt;
  const zeroFrac = (0 - minU) / (maxU - minU);
  const zeroLineY = bandBottom - zeroFrac * (bandBottom - bandTop);

  return (
    <svg viewBox="0 0 800 800" width="100%" height="100%" style={{ display: 'block' }}>
      <line x1={30} y1={zeroLineY} x2={770} y2={zeroLineY} stroke={FOG_300} strokeWidth="1.5" strokeDasharray="4 6" opacity={0.7} />
      <path d={pathD} fill="none" stroke={NAVY_800} strokeOpacity={0.55} strokeWidth="3" />

      {/* well markers — the global minimum reads as the deepest, gold-ringed */}
      {wells.map((w, i) => {
        const sx = screenX(w.pos);
        if (sx < -20 || sx > 820) return null;
        const isGlobalMin = i === 4;
        return (
          <g key={i}>
            <circle cx={sx} cy={screenY(w.pos)} r={isGlobalMin ? 8 : 5} fill={isGlobalMin ? GOLD_600 : FOG_400} opacity={0.85} />
            {isGlobalMin && <circle cx={sx} cy={screenY(w.pos)} r={14} fill="none" stroke={GOLD_600} strokeWidth="1.5" opacity={0.5} />}
          </g>
        );
      })}

      {/* the hopping particle */}
      <circle cx={px} cy={py} r={13} fill={BLUE_600} opacity={0.22} />
      <circle cx={px} cy={py} r={10} fill={BLUE_600} />

      <text x={400} y={670} fontFamily={MONO_FONT} fontSize="40" fontWeight="600" fill={FOG_600} textAnchor="middle" opacity={vibLabelOp}>
        local vibration — fs–ps
      </text>
      <text x={400} y={670} fontFamily={MONO_FONT} fontSize="40" fontWeight="600" fill={FOG_600} textAnchor="middle" opacity={hopLabelOp}>
        well-to-well hopping — ns–μs
      </text>
    </svg>
  );
}

Object.assign(window, { MultiscaleLoop });
