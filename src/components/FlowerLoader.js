const OUTER = [0, 60, 120, 180, 240, 300];
const INNER = [30, 90, 150, 210, 270, 330];

function Petal({ turn, delay, inner }) {
  return (
    <g transform={`rotate(${turn} 60 74)`}>
      <path
        className={inner ? "petal petal-inner" : "petal"}
        style={{ animationDelay: delay }}
        d={inner
          ? "M60 74C55 64 52 52 60 44C68 52 65 64 60 74Z"
          : "M60 74C50 60 46 40 60 26C74 40 70 60 60 74Z"}
      />
    </g>
  );
}

export default function FlowerLoader({ label = "Loading", compact = false }) {
  return (
    <div className={compact ? "flower-loader compact" : "flower-loader"} role="status" aria-label={label}>
      <svg viewBox="0 0 120 168" width="92" height="129" aria-hidden="true">
        <path className="flower-stem" d="M60 86v58" />
        <path className="flower-leaf leaf-left" d="M60 118C46 110 32 116 36 130C48 126 56 122 60 118Z" />
        <path className="flower-leaf leaf-right" d="M60 128C76 120 92 128 86 142C74 136 66 132 60 128Z" />
        {OUTER.map((turn, index) => (
          <Petal key={turn} turn={turn} delay={`${index * 0.12}s`} />
        ))}
        {INNER.map((turn, index) => (
          <Petal key={turn} turn={turn} delay={`${0.25 + index * 0.12}s`} inner />
        ))}
        <circle className="flower-heart" cx="60" cy="74" r="7" />
      </svg>
    </div>
  );
}
