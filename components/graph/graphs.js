// Definiciones de los grafos de interferencia usados en los ejemplos interactivos.

export const REGISTERS = [
  { name: "R1", color: "var(--r1)", soft: "var(--r1-soft)" },
  { name: "R2", color: "var(--r2)", soft: "var(--r2-soft)" },
  { name: "R3", color: "var(--r3)", soft: "var(--r3-soft)" },
  { name: "R4", color: "var(--r4)", soft: "var(--r4-soft)" },
];

// Ejemplo 1 — 3-coloreable, sin derrames.
export const EXAMPLE_1 = {
  k: 3,
  viewBox: [460, 380],
  nodes: [
    { id: "a", x: 230, y: 60 },
    { id: "b", x: 385, y: 175 },
    { id: "c", x: 300, y: 320 },
    { id: "d", x: 95, y: 300 },
    { id: "e", x: 70, y: 150 },
  ],
  edges: [
    ["a", "b"],
    ["a", "c"],
    ["b", "c"],
    ["a", "d"],
    ["e", "b"],
    ["e", "c"],
  ],
};

// Ejemplo 2 — K4 con k = 3: requiere derrame (spilling).
export const EXAMPLE_2 = {
  k: 3,
  viewBox: [460, 380],
  nodes: [
    { id: "a", x: 130, y: 70, cost: 10 },
    { id: "b", x: 340, y: 70, cost: 8 },
    { id: "c", x: 340, y: 300, cost: 3 },
    { id: "d", x: 130, y: 300, cost: 9 },
  ],
  edges: [
    ["a", "b"],
    ["a", "c"],
    ["a", "d"],
    ["b", "c"],
    ["b", "d"],
    ["c", "d"],
  ],
};
