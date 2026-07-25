"use client";

import { useEffect, useState } from "react";

const PHASES = [
  { key: "build", name: "Build", desc: "Construir el grafo de interferencia" },
  { key: "coalesce", name: "Coalesce", desc: "Fusionar copias (mov) que no interfieren" },
  { key: "cost", name: "Costos", desc: "Estimar costo de derrame por variable" },
  { key: "simplify", name: "Simplify", desc: "Apilar nodos con grado < k" },
  { key: "select", name: "Select", desc: "Sacar de la pila y asignar registro" },
];

export default function PhaseFlow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % PHASES.length), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="pf">
      <div className="pf-row">
        {PHASES.map((p, idx) => (
          <div className="pf-cell" key={p.key}>
            <div className={`pf-card ${active === idx ? "on" : ""}`}>
              <div className="pf-num">{idx + 1}</div>
              <div className="pf-name">{p.name}</div>
              <div className="pf-desc">{p.desc}</div>
            </div>
            {idx < PHASES.length - 1 && <div className="pf-arrow">→</div>}
          </div>
        ))}
      </div>

      <div className="pf-decision">
        <div className="pf-diamond">¿Hubo derrames reales?</div>
        <div className="pf-branches">
          <div className="pf-branch no">
            <span className="pf-tag no">NO</span>
            <span>Fin: registros asignados ✓</span>
          </div>
          <div className="pf-branch yes">
            <span className="pf-tag yes">SÍ</span>
            <span>Insertar código de carga/almacenamiento y <b>reconstruir el grafo</b> ↺</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pf {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .pf-row {
          display: flex;
          align-items: stretch;
          justify-content: center;
          flex-wrap: wrap;
          gap: 4px;
        }
        .pf-cell {
          display: flex;
          align-items: center;
        }
        .pf-card {
          width: 150px;
          min-height: 108px;
          background: #fff;
          border: 2px solid var(--line);
          border-radius: 14px;
          padding: 12px 13px;
          transition: all 0.35s ease;
          box-shadow: var(--shadow-sm);
        }
        .pf-card.on {
          border-color: var(--teal);
          box-shadow: 0 0 0 4px var(--teal-soft), var(--shadow-md);
          transform: translateY(-4px);
        }
        .pf-num {
          width: 24px;
          height: 24px;
          border-radius: 7px;
          background: var(--teal);
          color: #fff;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 13px;
          display: grid;
          place-items: center;
          margin-bottom: 8px;
        }
        .pf-card.on .pf-num {
          background: var(--orange);
        }
        .pf-name {
          font-weight: 800;
          font-size: 17px;
          color: var(--ink);
          margin-bottom: 4px;
        }
        .pf-desc {
          font-size: 12px;
          line-height: 1.35;
          color: var(--ink-soft);
        }
        .pf-arrow {
          color: var(--muted);
          font-size: 22px;
          padding: 0 3px;
        }
        .pf-decision {
          display: flex;
          align-items: center;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .pf-diamond {
          background: var(--ink);
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          padding: 12px 20px;
          border-radius: 12px;
          text-align: center;
        }
        .pf-branches {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pf-branch {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--ink-soft);
        }
        .pf-branch b {
          color: var(--orange);
        }
        .pf-tag {
          font-family: var(--font-mono);
          font-weight: 800;
          font-size: 11px;
          padding: 3px 9px;
          border-radius: 999px;
        }
        .pf-tag.no {
          background: var(--teal-soft);
          color: var(--teal);
        }
        .pf-tag.yes {
          background: var(--orange-soft);
          color: #c1521f;
        }
      `}</style>
    </div>
  );
}
