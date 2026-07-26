"use client";

// Ilustración animada: código de 3 direcciones → rangos de vida → grafo de interferencia.

const CODE = [
  { n: 1, t: "a = leer()" },
  { n: 2, t: "b = a + 2" },
  { n: 3, t: "c = a + b" },
  { n: 4, t: "d = b + c" },
  { n: 5, t: "b = d + c" },
  { n: 6, t: "imprimir(b, d)" },
];

// Rango de vida [fila inicio, fila fin] (1-indexado sobre las 6 filas)
const RANGES = [
  { id: "a", from: 1, to: 3, color: "var(--r1)" },
  { id: "b", from: 2, to: 6, color: "var(--r2)" },
  { id: "c", from: 3, to: 5, color: "var(--r3)" },
  { id: "d", from: 4, to: 6, color: "var(--r4)" },
];

const NODES = {
  a: { x: 90, y: 60 },
  b: { x: 240, y: 120 },
  c: { x: 90, y: 210 },
  d: { x: 240, y: 270 },
};
const EDGES = [
  ["a", "b"],
  ["a", "c"],
  ["b", "c"],
  ["b", "d"],
  ["c", "d"],
];
const NODE_COLOR = {
  a: "var(--r1)",
  b: "var(--r2)",
  c: "var(--r3)",
  d: "var(--r4)",
};

const ROW_H = 30;
const NODE_ORDER = ["a", "b", "c", "d"];

export default function InterferenceBuild() {
  return (
    <div className="ib">
      {/* Código + rangos de vida */}
      <div className="ib-left card">
        <div className="ib-title">Código + rangos de vida</div>
        <div className="ib-code">
          <div className="ib-scan" />
          <div className="ib-lines">
            {CODE.map((l) => (
              <div className="ib-line" key={l.n} style={{ height: ROW_H }}>
                <span className="ib-ln">{l.n}</span>
                <span className="ib-src">{l.t}</span>
              </div>
            ))}
          </div>
          <div className="ib-bars">
            {RANGES.map((r, idx) => (
              <div
                key={r.id}
                className="ib-bar"
                style={{
                  left: `${idx * 26}px`,
                  top: `${(r.from - 1) * ROW_H + 4}px`,
                  height: `${(r.to - r.from + 1) * ROW_H - 8}px`,
                  background: r.color,
                  animationDelay: `${idx * 0.15}s`,
                }}
              >
                {r.id}
              </div>
            ))}
          </div>
        </div>
        <div className="ib-hint">Barras que se solapan verticalmente → viven a la vez.</div>
      </div>

      <div className="ib-arrow">→</div>

      {/* Grafo de interferencia */}
      <div className="ib-right card">
        <div className="ib-title">Grafo de interferencia</div>
        <svg viewBox="0 0 330 330" className="ib-svg">
          {EDGES.map(([a, b], i) => (
            <line
              key={i}
              className="ib-edge"
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke="#9db4bb"
              strokeWidth="2.4"
              style={{ animationDelay: `${0.7 + i * 0.14}s` }}
            />
          ))}
          {NODE_ORDER.map((id, idx) => {
            const p = NODES[id];
            return (
              <g key={id}>
                <circle
                  className="ib-pulse"
                  cx={p.x}
                  cy={p.y}
                  r="30"
                  fill="none"
                  stroke={NODE_COLOR[id]}
                  strokeWidth="2"
                  style={{ animationDelay: `${idx * 0.5}s`, color: NODE_COLOR[id] }}
                />
                <g className="ib-node" style={{ animationDelay: `${idx * 0.15}s` }}>
                  <circle cx={p.x} cy={p.y} r="25" fill="#fff" stroke={NODE_COLOR[id]} strokeWidth="3.5" />
                  <text
                    x={p.x}
                    y={p.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize="18"
                    fontWeight="700"
                    fill={NODE_COLOR[id]}
                  >
                    {id}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
        <div className="ib-hint">Arista = interfieren = no pueden compartir registro.</div>
      </div>

      <style jsx>{`
        .ib {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
        }
        .ib-title {
          font-weight: 800;
          font-size: 15px;
          color: var(--ink);
          margin-bottom: 12px;
        }
        .ib-code {
          position: relative;
          display: flex;
          overflow: hidden;
        }
        .ib-scan {
          position: absolute;
          left: -8px;
          right: -8px;
          height: 30px;
          top: 0;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(18, 152, 138, 0.12),
            transparent
          );
          border-radius: 6px;
          pointer-events: none;
          animation: ibScan 3.6s ease-in-out infinite;
          z-index: 0;
        }
        @keyframes ibScan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(150px); opacity: 0; }
        }
        .ib-lines {
          flex: 1;
          position: relative;
          z-index: 1;
        }
        .ib-line {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-mono);
          font-size: 14.5px;
        }
        .ib-ln {
          color: var(--muted);
          width: 16px;
          text-align: right;
          font-size: 12px;
        }
        .ib-src {
          color: var(--ink);
        }
        .ib-bars {
          position: relative;
          width: 118px;
          margin-left: 8px;
          z-index: 1;
        }
        .ib-bar {
          position: absolute;
          width: 22px;
          border-radius: 6px;
          color: #fff;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 12px;
          text-align: center;
          padding-top: 3px;
          box-shadow: var(--shadow-sm);
          animation: ibGrow 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
          transform-origin: top;
        }
        @keyframes ibGrow {
          from { transform: scaleY(0); opacity: 0; }
          to { transform: scaleY(1); opacity: 1; }
        }
        .ib-hint {
          margin-top: 12px;
          font-size: 12.5px;
          color: var(--muted);
        }
        .ib-arrow {
          font-size: 30px;
          color: var(--teal);
          font-weight: 700;
          animation: ibArrow 1.8s ease-in-out infinite;
        }
        @keyframes ibArrow {
          0%, 100% { transform: translateX(0); opacity: 0.6; }
          50% { transform: translateX(5px); opacity: 1; }
        }
        .ib-svg {
          width: 100%;
          max-width: 300px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .ib-edge {
          stroke-dasharray: 320;
          stroke-dashoffset: 320;
          animation: ibDraw 0.6s ease forwards;
        }
        @keyframes ibDraw {
          to { stroke-dashoffset: 0; }
        }
        .ib-node {
          transform-box: fill-box;
          transform-origin: center;
          animation: ibPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes ibPop {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .ib-pulse {
          transform-box: fill-box;
          transform-origin: center;
          animation: ibPulse 3s ease-in-out infinite;
          opacity: 0;
        }
        @keyframes ibPulse {
          0%, 100% { transform: scale(0.85); opacity: 0; }
          50% { transform: scale(1.15); opacity: 0.45; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ib-scan, .ib-arrow, .ib-pulse { animation: none; opacity: 0; }
          .ib-edge { animation: none; stroke-dashoffset: 0; }
          .ib-node, .ib-bar { animation: none; opacity: 1; transform: none; }
        }
        @media (max-width: 820px) {
          .ib { grid-template-columns: 1fr; }
          .ib-arrow { transform: rotate(90deg); text-align: center; }
        }
      `}</style>
    </div>
  );
}
