"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SLIDES } from "./Slides";

export default function Deck() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [notes, setNotes] = useState(false);
  const [overview, setOverview] = useState(false);

  const total = SLIDES.length;
  const slide = SLIDES[i];

  const goto = useCallback(
    (n) => {
      setI((cur) => {
        const next = Math.max(0, Math.min(total - 1, n));
        setDir(next >= cur ? 1 : -1);
        return next;
      });
    },
    [total]
  );

  const next = useCallback(() => goto(i + 1), [goto, i]);
  const prev = useCallback(() => goto(i - 1), [goto, i]);

  useEffect(() => {
    const onKey = (e) => {
      if (overview && e.key === "Escape") return setOverview(false);
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          goto(0);
          break;
        case "End":
          goto(total - 1);
          break;
        case "n":
        case "N":
          setNotes((v) => !v);
          break;
        case "o":
        case "O":
          setOverview((v) => !v);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "Escape":
          setNotes(false);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goto, total, overview]);

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <div className="deck">
      <div className="progress" style={{ width: `${((i + 1) / total) * 100}%` }} />

      <div className="menu-toggle">
        <button
          className="icon-btn"
          onClick={() => setOverview((v) => !v)}
          title="Índice de diapositivas (O)"
          aria-label="Índice"
        >
          ▦
        </button>
        <button
          className="icon-btn"
          onClick={toggleFullscreen}
          title="Pantalla completa (F)"
          aria-label="Pantalla completa"
        >
          ⛶
        </button>
      </div>

      <div className="stage">
        <AnimatePresence custom={dir} initial={false}>
          <motion.div
            key={slide.key}
            className="slide"
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            {slide.render()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hint">
        <span className="kbd">←</span> <span className="kbd">→</span> navegar ·{" "}
        <span className="kbd">N</span> notas · <span className="kbd">O</span> índice ·{" "}
        <span className="kbd">F</span> pantalla completa
      </div>

      <div className="footer">
        <span className="brand">
          Algoritmo de <span>Chaitin</span>
        </span>
        <span>{slide.title}</span>
      </div>

      <div className="controls">
        <button className="nav-btn" onClick={prev} disabled={i === 0} aria-label="Anterior">
          ‹
        </button>
        <span className="counter">
          {i + 1} / {total}
        </span>
        <button
          className="nav-btn"
          onClick={next}
          disabled={i === total - 1}
          aria-label="Siguiente"
        >
          ›
        </button>
        <button
          className={`icon-btn ${notes ? "active" : ""}`}
          onClick={() => setNotes((v) => !v)}
          title="Guion / notas (N)"
          aria-label="Notas"
        >
          🎙
        </button>
      </div>

      <AnimatePresence>
        {notes && (
          <motion.div
            className="notes"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="notes-head">
              <span>🎙 Guion para el video</span>
              <span style={{ color: "#9fc4bc" }}>· {slide.time}</span>
            </div>
            <div className="script">{slide.notes}</div>
            <div className="timing">
              Diapositiva {i + 1} de {total} · Pulsa <span className="kbd">N</span> para
              ocultar
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {overview && (
          <motion.div
            className="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3>Índice de diapositivas</h3>
            <div className="ov-grid">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.key}
                  className={`ov-card ${idx === i ? "current" : ""}`}
                  onClick={() => {
                    goto(idx);
                    setOverview(false);
                  }}
                >
                  <div className="num">
                    {String(idx + 1).padStart(2, "0")} · {s.time}
                  </div>
                  <div className="ttl">{s.title}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
