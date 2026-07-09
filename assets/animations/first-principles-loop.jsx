// first-principles-loop.jsx — quantum-accurate ab-initio orbitals, looping SVG animation.
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

function FirstPrinciplesLoop({ size = 800 }) {
  const period = 6;
  const t = useLoopClock(period);
  const phase = (t / period) * TAU;
  const cx = 400, cy = 400;

  const cloudScale = 1 + 0.06 * Math.sin(phase);
  const cloudOpacity = 0.14 + 0.06 * (1 + Math.sin(phase)) / 2;

  const orbits = [
    { rx: 220, ry: 80, rot: 20, speed: 1, color: BLUE_600, r: 9, offset: 0 },
    { rx: 220, ry: 80, rot: 100, speed: -0.8, color: SAGE_600, r: 8, offset: 2.1 },
    { rx: 220, ry: 80, rot: 160, speed: 1.3, color: BLUE_500, r: 7, offset: 4.4 },
  ];

  const orbitPoint = (o) => {
    const a = phase * o.speed + o.offset;
    const x0 = o.rx * Math.cos(a);
    const y0 = o.ry * Math.sin(a);
    const rot = (o.rot * Math.PI) / 180;
    const x = cx + x0 * Math.cos(rot) - y0 * Math.sin(rot);
    const y = cy + x0 * Math.sin(rot) + y0 * Math.cos(rot);
    return [x, y];
  };

  return (
    <svg viewBox="0 0 800 800" width="100%" height="100%" style={{ display: 'block' }}>
      {/* faint computational grid */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={'gh' + i} x1={40} y1={40 + i * 90} x2={760} y2={40 + i * 90} stroke={FOG_200} strokeWidth="1" />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={'gv' + i} x1={40 + i * 90} y1={40} x2={40 + i * 90} y2={760} stroke={FOG_200} strokeWidth="1" />
      ))}

      {/* probability cloud, breathing */}
      <circle cx={cx} cy={cy} r={140 * cloudScale} fill={BLUE_100} opacity={cloudOpacity} />
      <circle cx={cx} cy={cy} r={90 * cloudScale} fill={BLUE_500} opacity={cloudOpacity * 0.6} />

      {/* static wavefunction shells */}
      {[220, 160].map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={FOG_300} strokeWidth="1.5" strokeDasharray="3 7" />
      ))}

      {/* orbit paths */}
      {orbits.map((o, i) => (
        <ellipse
          key={i}
          cx={cx} cy={cy} rx={o.rx} ry={o.ry}
          transform={`rotate(${o.rot} ${cx} ${cy})`}
          fill="none" stroke={o.color} strokeOpacity={0.28} strokeWidth="2"
        />
      ))}

      {/* electrons */}
      {orbits.map((o, i) => {
        const [x, y] = orbitPoint(o);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={o.r + 6} fill={o.color} opacity={0.18} />
            <circle cx={x} cy={y} r={o.r} fill={o.color} />
          </g>
        );
      })}

      {/* nucleus */}
      <circle cx={cx} cy={cy} r={24} fill={GOLD_600} />
      <circle cx={cx} cy={cy} r={24} fill="none" stroke={GOLD_700} strokeWidth="2" />
    </svg>
  );
}

Object.assign(window, { FirstPrinciplesLoop });
