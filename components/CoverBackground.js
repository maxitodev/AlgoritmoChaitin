"use client";

// Fondo decorativo de la portada: blobs de color + un grafo flotante
// (motivo de "grafo de interferencia" coloreado con la paleta de registros).

const NODES = [
  { x: 565, y: 120, r: 16, c: "var(--r1)", d: 0 },
  { x: 700, y: 195, r: 12, c: "var(--r2)", d: 0.6 },
  { x: 615, y: 305, r: 18, c: "var(--r3)", d: 1.1 },
  { x: 740, y: 375, r: 11, c: "var(--r4)", d: 1.8 },
  { x: 520, y: 250, r: 13, c: "var(--r1)", d: 0.3 },
  { x: 672, y: 470, r: 15, c: "var(--r2)", d: 1.4 },
  { x: 475, y: 405, r: 10, c: "var(--r3)", d: 2.1 },
  { x: 305, y: 175, r: 9, c: "var(--r4)", d: 0.9 },
  { x: 185, y: 480, r: 12, c: "var(--r1)", d: 1.6 },
  { x: 365, y: 530, r: 10, c: "var(--r3)", d: 2.4 },
];

const EDGES = [
  [0, 1], [0, 4], [0, 2], [1, 2], [4, 2], [2, 3],
  [2, 5], [4, 6], [5, 3], [6, 5], [7, 0], [8, 6], [9, 8], [9, 6],
];

export default function CoverBackground() {
  return (
    <div className="cover-bg" aria-hidden="true">
      <span className="blob b1" />
      <span className="blob b2" />
      <span className="blob b3" />

      <svg className="cover-graph" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <g className="drift">
          {EDGES.map(([a, b], i) => (
            <line
              key={i}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke="#7f9aa2"
              strokeOpacity="0.32"
              strokeWidth="1.6"
            />
          ))}
          {NODES.map((n, i) => (
            <circle
              key={i}
              className="cn"
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={n.c}
              fillOpacity="0.16"
              stroke={n.c}
              strokeOpacity="0.75"
              strokeWidth="2.4"
              style={{ animationDelay: `${n.d}s` }}
            />
          ))}
        </g>
      </svg>

      <style jsx>{`
        .cover-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.55;
        }
        .b1 {
          width: 520px;
          height: 520px;
          top: -160px;
          left: -120px;
          background: radial-gradient(circle, var(--teal-bright), transparent 68%);
          animation: drift1 18s ease-in-out infinite;
        }
        .b2 {
          width: 560px;
          height: 560px;
          right: -160px;
          bottom: -200px;
          background: radial-gradient(circle, var(--orange), transparent 66%);
          opacity: 0.4;
          animation: drift2 22s ease-in-out infinite;
        }
        .b3 {
          width: 420px;
          height: 420px;
          right: 18%;
          top: 8%;
          background: radial-gradient(circle, var(--r3), transparent 70%);
          opacity: 0.28;
          animation: drift3 26s ease-in-out infinite;
        }
        .cover-graph {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .cn {
          animation: pulse 4.5s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        .drift {
          animation: floaty 16s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        @keyframes floaty {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-14px, 12px, 0); }
        }
        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, 30px) scale(1.08); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-46px, -26px) scale(1.1); }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(0.92); }
        }
        @media (prefers-reduced-motion: reduce) {
          .blob, .cn, .drift { animation: none; }
        }
      `}</style>
    </div>
  );
}
