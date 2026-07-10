// generative-ai-loop.jsx — generative AI materials design, looping SVG animation.
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

function GenerativeAILoop({ size = 800 }) {
  const period = 6;
  const t = useLoopClock(period);
  const p = t / period;
  const order = Math.sin(p * Math.PI) ** 2; // 0..1..0 seamless

  const cols = 9, rows = 9;
  const spacing = 70;
  const originX = 400 - ((cols - 1) * spacing) / 2;
  const originY = 400 - ((rows - 1) * spacing) / 2;

  // stable per-point random noise offsets (seeded once)
  const noise = React.useMemo(() => {
    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const arr = [];
    for (let i = 0; i < cols * rows; i++) {
      arr.push([(rand() - 0.5) * 480, (rand() - 0.5) * 480]);
    }
    return arr;
  }, []);

  const points = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const idx = i * rows + j;
      const gx = originX + i * spacing;
      const gy = originY + j * spacing;
      const [nx, ny] = noise[idx];
      const x = (nx + 400) * (1 - order) + gx * order;
      const y = (ny + 400) * (1 - order) + gy * order;
      points.push([x, y]);
    }
  }

  const color = (t2) => {
    // interpolate fog-gray -> blue -> gold highlight for a few points
    return t2;
  };

  return (
    <svg viewBox="0 0 800 800" width="100%" height="100%" style={{ display: 'block' }}>
      {/* bonds appear only once mostly ordered */}
      {order > 0.6 &&
        points.map(([x, y], i) => {
          const col = Math.floor(i / rows), row = i % rows;
          const opacity = (order - 0.6) / 0.4;
          const lines = [];
          if (row < rows - 1) lines.push(['r' + i, x, y, points[i + 1][0], points[i + 1][1]]);
          if (col < cols - 1) lines.push(['c' + i, x, y, points[i + rows][0], points[i + rows][1]]);
          return lines.map(([key, x1, y1, x2, y2]) => (
            <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={BLUE_500} strokeOpacity={opacity * 0.35} strokeWidth="1.5" />
          ));
        })}

      {points.map(([x, y], i) => {
        const isAccent = i % 17 === 0;
        return (
          <circle
            key={i}
            cx={x} cy={y}
            r={isAccent ? 9 : 6}
            fill={isAccent ? GOLD_600 : FOG_400}
            style={{ fill: isAccent ? GOLD_600 : `color-mix(in srgb, ${FOG_400} ${100 - order * 60}%, ${BLUE_600} ${order * 60}%)` }}
          />
        );
      })}
    </svg>
  );
}

Object.assign(window, { GenerativeAILoop });
