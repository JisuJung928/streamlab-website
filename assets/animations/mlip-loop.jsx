// mlip-loop.jsx — machine learning interatomic potentials, looping SVG animation.
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

function MLIPLoop({ size = 800 }) {
  const period = 5;
  const t = useLoopClock(period);
  const phase = (t / period) * TAU;
  const qx = 210, qy = 380; // quantum-calculation icon center

  // compact ab-initio icon: nucleus + two orbiting electrons
  const cloudScale = 1 + 0.05 * Math.sin(phase);
  const orbits = [
    { rx: 130, ry: 52, rot: 15, speed: 1, color: BLUE_600, r: 7, offset: 0 },
    { rx: 130, ry: 52, rot: 120, speed: -1.1, color: SAGE_600, r: 6, offset: 2.6 },
  ];
  const orbitPoint = (o) => {
    const a = phase * o.speed + o.offset;
    const x0 = o.rx * Math.cos(a);
    const y0 = o.ry * Math.sin(a);
    const rot = (o.rot * Math.PI) / 180;
    return [qx + x0 * Math.cos(rot) - y0 * Math.sin(rot), qy + x0 * Math.sin(rot) + y0 * Math.cos(rot)];
  };

  // 3-layer network, right side
  const layerX = [500, 610, 720];
  const layers = [
    [320, 400, 480],
    [280, 360, 440, 520],
    [400],
  ];

  const nParticles = 5;
  const bezier = (p, p0, p1, p2) => {
    const x = (1 - p) * (1 - p) * p0[0] + 2 * (1 - p) * p * p1[0] + p * p * p2[0];
    const y = (1 - p) * (1 - p) * p0[1] + 2 * (1 - p) * p * p1[1] + p * p * p2[1];
    return [x, y];
  };
  const start = [qx + 70, qy - 10];
  const ctrl = [400, 240];
  const end = [layerX[0], layers[0][1]];

  const outputPulse = 0.85 + 0.15 * Math.sin((t / period) * TAU * 2);

  // small orbiting data tags (E / F / ρ — DFT-computed quantities)
  const tags = ['E', 'F', 'S'];

  return (
    <svg viewBox="0 0 800 800" width="100%" height="100%" style={{ display: 'block' }}>
      {/* probability cloud behind the quantum icon */}
      <circle cx={qx} cy={qy} r={95 * cloudScale} fill={BLUE_100} opacity={0.5} />
      <circle cx={qx} cy={qy} r={150} fill="none" stroke={FOG_300} strokeWidth="1.5" strokeDasharray="3 7" />

      {orbits.map((o, i) => (
        <ellipse key={i} cx={qx} cy={qy} rx={o.rx} ry={o.ry} transform={`rotate(${o.rot} ${qx} ${qy})`} fill="none" stroke={o.color} strokeOpacity={0.3} strokeWidth="2" />
      ))}
      {orbits.map((o, i) => {
        const [x, y] = orbitPoint(o);
        return <circle key={i} cx={x} cy={y} r={o.r} fill={o.color} />;
      })}
      {/* nucleus */}
      <circle cx={qx} cy={qy} r={20} fill={GOLD_600} />
      <circle cx={qx} cy={qy} r={20} fill="none" stroke={GOLD_700} strokeWidth="2" />

      {/* computed-quantity tags orbiting further out, feeding the stream */}
      {tags.map((label, i) => {
        const a = phase * 0.5 + (i / tags.length) * TAU;
        const x = qx + 175 * Math.cos(a);
        const y = qy + 175 * Math.sin(a) * 0.55 - 40;
        return (
          <g key={label}>
            <circle cx={x} cy={y} r={16} fill={BLUE_600} opacity={0.85} />
            <text x={x} y={y + 6} fontFamily={MONO_FONT} fontSize="16" fill="#fff" textAnchor="middle">{label}</text>
          </g>
        );
      })}

      {/* network edges */}
      {layers.slice(0, -1).map((layer, li) =>
        layer.map((y1, i1) =>
          layers[li + 1].map((y2, i2) => (
            <line key={`${li}-${i1}-${i2}`} x1={layerX[li]} y1={y1} x2={layerX[li + 1]} y2={y2} stroke={FOG_300} strokeWidth="1.5" />
          ))
        )
      )}
      {/* network nodes */}
      {layers.map((layer, li) =>
        layer.map((y, i) => {
          const isOutput = li === layers.length - 1;
          return (
            <circle
              key={`${li}-${i}`}
              cx={layerX[li]} cy={y}
              r={isOutput ? 16 * outputPulse : 10}
              fill={isOutput ? GOLD_600 : BLUE_600}
            />
          );
        })
      )}

      {/* flowing particles: quantum results -> network */}
      {Array.from({ length: nParticles }).map((_, i) => {
        const p = ((t / period) + i / nParticles) % 1;
        const [x, y] = bezier(p, start, ctrl, end);
        const op = Math.sin(p * Math.PI);
        return <circle key={i} cx={x} cy={y} r={7} fill={BLUE_500} opacity={op} />;
      })}

      {/* dashed arc guide */}
      <path d={`M ${start[0]} ${start[1]} Q ${ctrl[0]} ${ctrl[1]} ${end[0]} ${end[1]}`} fill="none" stroke={FOG_400} strokeWidth="1.5" strokeDasharray="2 6" />

      <text x={210} y={575} fontFamily={MONO_FONT} fontSize="18" fill={FOG_600} textAnchor="middle">ab-initio</text>
      <text x={610} y={575} fontFamily={MONO_FONT} fontSize="18" fill={FOG_600} textAnchor="middle">MLIP</text>
    </svg>
  );
}

Object.assign(window, { MLIPLoop });
