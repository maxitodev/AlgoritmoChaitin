"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { runChaitin } from "./chaitinEngine";
import { REGISTERS } from "./graphs";

const PHASE_LABEL = {
  simplify: "SIMPLIFY",
  spill: "SPILL",
  select: "SELECT",
  done: "FIN",
};
const PHASE_COLOR = {
  simplify: "var(--teal)",
  spill: "var(--spill)",
  select: "var(--orange)",
  done: "var(--ink)",
};

export default function GraphColoringDemo({ graph, autoStart = false }) {
  const { nodes, edges, k, viewBox } = graph;
  const [vw, vh] = viewBox;

  const { steps } = useMemo(() => runChaitin(nodes, edges, k), [nodes, edges, k]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(autoStart);
  const timer = useRef(null);

  const step = steps[i];
  const isLast = i >= steps.length - 1;

  useEffect(() => {
    if (!playing) return;
    if (isLast) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => setI((x) => Math.min(x + 1, steps.length - 1)), 1350);
    return () => clearTimeout(timer.current);
  }, [playing, i, isLast, steps.length]);

  const go = (n) => {
    setPlaying(false);
    setI((x) => Math.max(0, Math.min(steps.length - 1, x + n)));
  };
  const reset = () => {
    setPlaying(false);
    setI(0);
  };

  // Estado visual de cada nodo en el paso actual
  const stackIds = new Set((step.stack || []).map((s) => s.id));
  const colors = step.colors || {};

  const nodeState = (id) => {
    if (colors[id] === "SPILL") return "spill";
    if (colors[id] != null) return "colored";
    if (stackIds.has(id)) return "stacked";
    return "active";
  };

  const nodeFill = (id) => {
    const st = nodeState(id);
    if (st === "colored") return REGISTERS[colors[id]].color;
    if (st === "spill") return "var(--spill)";
    if (st === "stacked") return "#eef2f3";
    return "#ffffff";
  };
  const nodeStroke = (id) => {
    const st = nodeState(id);
    if (st === "colored") return REGISTERS[colors[id]].color;
    if (st === "spill") return "var(--spill)";
    if (st === "stacked") return "#c3ced3";
    return "var(--teal)";
  };
  const nodeTextColor = (id) => {
    const st = nodeState(id);
    if (st === "colored" || st === "spill") return "#fff";
    if (st === "stacked") return "#9aa9b0";
    return "var(--ink)";
  };

  const nodePos = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const isCurrent = (id) => step.node === id;

  const edgeFaded = (a, b) =>
    stackIds.has(a) || stackIds.has(b) || colors[a] === "SPILL" || colors[b] === "SPILL";

  const stackForDisplay = [...(step.stack || [])].reverse(); // tope arriba

  return (
    <div className="gcd">
      <div className="gcd-main">
        {/* ---- Grafo ---- */}
        <div className="gcd-graph">
          <svg viewBox={`0 0 ${vw} ${vh}`} className="gcd-svg" role="img">
            {edges.map(([a, b], idx) => {
              const pa = nodePos[a];
              const pb = nodePos[b];
              return (
                <line
                  key={idx}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke={edgeFaded(a, b) ? "#dbe3e6" : "#9db4bb"}
                  strokeWidth={edgeFaded(a, b) ? 1.5 : 2.4}
                  strokeDasharray={edgeFaded(a, b) ? "4 5" : "0"}
                  style={{ transition: "all 0.4s ease" }}
                />
              );
            })}
            {nodes.map((n) => {
              const st = nodeState(n.id);
              const current = isCurrent(n.id);
              return (
                <g key={n.id} style={{ transition: "all 0.4s ease" }}>
                  {current && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={34}
                      fill="none"
                      stroke={PHASE_COLOR[step.phase] || "var(--teal)"}
                      strokeWidth={2.5}
                      opacity={0.55}
                      className="gcd-pulse"
                    />
                  )}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={26}
                    fill={nodeFill(n.id)}
                    stroke={nodeStroke(n.id)}
                    strokeWidth={3}
                    strokeDasharray={st === "stacked" ? "5 4" : "0"}
                    opacity={st === "stacked" ? 0.75 : 1}
                    style={{ transition: "all 0.4s ease" }}
                  />
                  <text
                    x={n.x}
                    y={n.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize="19"
                    fontWeight="700"
                    fill={nodeTextColor(n.id)}
                    style={{ transition: "fill 0.4s ease" }}
                  >
                    {n.id}
                  </text>
                  {st === "colored" && (
                    <text
                      x={n.x}
                      y={n.y + 44}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize="13"
                      fontWeight="700"
                      fill={REGISTERS[colors[n.id]].color}
                    >
                      {REGISTERS[colors[n.id]].name}
                    </text>
                  )}
                  {st === "spill" && (
                    <text
                      x={n.x}
                      y={n.y + 44}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize="12"
                      fontWeight="700"
                      fill="var(--spill)"
                    >
                      memoria
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="gcd-legend">
            <span className="gcd-k">k = {k} registros</span>
            {REGISTERS.slice(0, k).map((r) => (
              <span key={r.name} className="gcd-reg">
                <i style={{ background: r.color }} />
                {r.name}
              </span>
            ))}
          </div>
        </div>

        {/* ---- Panel lateral: pila + estado ---- */}
        <div className="gcd-side">
          <div className="gcd-phase" style={{ background: PHASE_COLOR[step.phase] }}>
            {PHASE_LABEL[step.phase]}
          </div>

          <div className="gcd-stack-wrap">
            <div className="gcd-stack-label">Pila {stackForDisplay.length > 0 && "(tope arriba)"}</div>
            <div className="gcd-stack">
              {stackForDisplay.length === 0 && <div className="gcd-stack-empty">vacía</div>}
              {stackForDisplay.map((s) => (
                <div key={s.id} className={`gcd-stack-item ${s.spill ? "spill" : ""}`}>
                  <span>{s.id}</span>
                  {s.spill && <em>derrame?</em>}
                </div>
              ))}
            </div>
          </div>

          {step.ratios && (
            <div className="gcd-ratios">
              <div className="gcd-stack-label">costo / grado</div>
              {step.ratios.map((r) => (
                <div key={r.id} className={`gcd-ratio ${r.id === step.node ? "pick" : ""}`}>
                  <span>{r.id}</span>
                  <span className="mono">
                    {r.cost}/{r.deg} = {r.ratio.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---- Mensaje de estado ---- */}
      <div className="gcd-message" style={{ borderColor: PHASE_COLOR[step.phase] }}>
        {step.message}
      </div>

      {/* ---- Controles ---- */}
      <div className="gcd-controls">
        <button className="gcd-btn ghost" onClick={reset} title="Reiniciar" aria-label="Reiniciar">
          ⟲
        </button>
        <button className="gcd-btn" onClick={() => go(-1)} disabled={i === 0} aria-label="Anterior">
          ‹
        </button>
        <button
          className="gcd-btn play"
          onClick={() => (isLast ? reset() : setPlaying((p) => !p))}
          aria-label={playing ? "Pausar" : "Reproducir"}
        >
          {isLast ? "⟲" : playing ? "❙❙" : "▶"}
        </button>
        <button
          className="gcd-btn"
          onClick={() => go(1)}
          disabled={isLast}
          aria-label="Siguiente"
        >
          ›
        </button>
        <div className="gcd-step">
          Paso {i + 1} / {steps.length}
        </div>
      </div>

      <style jsx>{`
        .gcd {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .gcd-main {
          display: grid;
          grid-template-columns: 1fr 168px;
          gap: 14px;
        }
        .gcd-graph {
          position: relative;
          background: linear-gradient(160deg, #fbfdfd, #f2f7f7);
          border-radius: 14px;
          border: 1px solid var(--line);
          padding: 8px;
        }
        .gcd-svg {
          width: 100%;
          height: auto;
          display: block;
        }
        .gcd-pulse {
          animation: gcdpulse 1.3s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes gcdpulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.7; }
        }
        .gcd-legend {
          position: absolute;
          bottom: 10px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          font-weight: 700;
          color: var(--ink-soft);
        }
        .gcd-k {
          background: var(--ink);
          color: #fff;
          padding: 3px 9px;
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 11.5px;
        }
        .gcd-reg {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
        }
        .gcd-reg i {
          width: 12px;
          height: 12px;
          border-radius: 3px;
          display: inline-block;
        }
        .gcd-side {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .gcd-phase {
          color: #fff;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-align: center;
          padding: 8px;
          border-radius: 10px;
          font-family: var(--font-mono);
        }
        .gcd-stack-wrap {
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 10px;
          flex: 1;
          min-height: 150px;
          background: #fbfdfd;
        }
        .gcd-stack-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted);
          font-weight: 700;
          margin-bottom: 8px;
        }
        .gcd-stack {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .gcd-stack-empty {
          color: var(--muted);
          font-size: 13px;
          font-style: italic;
          padding: 6px 0;
        }
        .gcd-stack-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--teal-soft);
          color: var(--teal);
          border-radius: 8px;
          padding: 7px 11px;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 15px;
          animation: pop 0.28s ease;
        }
        .gcd-stack-item.spill {
          background: var(--spill-soft);
          color: var(--spill);
        }
        .gcd-stack-item em {
          font-style: normal;
          font-size: 10px;
          opacity: 0.8;
        }
        @keyframes pop {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .gcd-ratios {
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 10px;
          background: #fff;
        }
        .gcd-ratio {
          display: flex;
          justify-content: space-between;
          font-size: 12.5px;
          padding: 3px 4px;
          border-radius: 6px;
          color: var(--ink-soft);
        }
        .gcd-ratio.pick {
          background: var(--spill-soft);
          color: var(--spill);
          font-weight: 700;
        }
        .gcd-ratio span:first-child {
          font-family: var(--font-mono);
          font-weight: 700;
        }
        .gcd-message {
          font-size: 14.5px;
          line-height: 1.45;
          color: var(--ink);
          background: #f7fafa;
          border-left: 4px solid var(--teal);
          border-radius: 8px;
          padding: 11px 14px;
          min-height: 44px;
        }
        .gcd-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .gcd-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid var(--line);
          background: #fff;
          color: var(--ink);
          font-size: 16px;
          display: grid;
          place-items: center;
          transition: all 0.15s ease;
        }
        .gcd-btn:hover:not(:disabled) {
          border-color: var(--teal);
          color: var(--teal);
        }
        .gcd-btn:disabled {
          opacity: 0.35;
          cursor: default;
        }
        .gcd-btn.play {
          background: var(--ink);
          color: #fff;
          border-color: var(--ink);
          width: 46px;
          font-size: 15px;
        }
        .gcd-btn.play:hover {
          background: var(--teal);
          border-color: var(--teal);
          color: #fff;
        }
        .gcd-btn.ghost {
          font-size: 18px;
        }
        .gcd-step {
          margin-left: auto;
          font-size: 13px;
          font-weight: 700;
          color: var(--ink-soft);
          font-variant-numeric: tabular-nums;
        }
        @media (max-width: 900px) {
          .gcd-main {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
