// ---------------------------------------------------------------------------
// Motor del algoritmo de Chaitin (coloreo de grafos).
// Genera una lista ordenada de "pasos" que la interfaz reproduce como animación.
//
// Fases modeladas:
//   SIMPLIFY : quitar nodos con grado < k y apilarlos (heurística de Kempe).
//   SPILL    : si ningún nodo tiene grado < k, marcar como derrame potencial el
//              nodo que minimiza costo/grado, quitarlo y continuar.
//   SELECT   : sacar de la pila y asignar el registro más bajo disponible.
//              Si un nodo marcado no encuentra color, es un DERRAME REAL.
// ---------------------------------------------------------------------------

function buildAdjacency(nodes, edges) {
  const adj = {};
  nodes.forEach((n) => (adj[n.id] = new Set()));
  edges.forEach(([a, b]) => {
    adj[a].add(b);
    adj[b].add(a);
  });
  return adj;
}

export function runChaitin(nodes, edges, k) {
  const adj = buildAdjacency(nodes, edges);
  const costOf = {};
  nodes.forEach((n) => (costOf[n.id] = n.cost ?? 1));

  const removed = new Set();
  const stack = []; // [{ id, spill }]
  const steps = [];

  const activeIds = () => nodes.map((n) => n.id).filter((id) => !removed.has(id));
  const degree = (id) => [...adj[id]].filter((n) => !removed.has(n)).length;
  const snapshotStack = () => stack.map((s) => ({ ...s }));

  // Grados iniciales para mostrar en la intro
  const initialDegrees = {};
  nodes.forEach((n) => (initialDegrees[n.id] = degree(n.id)));

  steps.push({
    phase: "simplify",
    action: "start",
    active: activeIds(),
    removed: new Set(),
    stack: [],
    colors: {},
    degrees: { ...initialDegrees },
    message: `SIMPLIFY — quitamos nodos con grado menor que k = ${k} y los apilamos.`,
  });

  // ---- Simplify + Spill loop ----
  while (activeIds().length > 0) {
    const active = activeIds();
    const degrees = {};
    active.forEach((id) => (degrees[id] = degree(id)));

    // ¿hay algún nodo de grado < k?
    const simple = active.find((id) => degrees[id] < k);

    if (simple != null) {
      removed.add(simple);
      stack.push({ id: simple, spill: false });
      steps.push({
        phase: "simplify",
        action: "remove",
        node: simple,
        active: activeIds(),
        removed: new Set(removed),
        stack: snapshotStack(),
        colors: {},
        degrees,
        message: `grado(${simple}) = ${degrees[simple]} < ${k} → ${simple} a la pila.`,
      });
    } else {
      // Atorados: elegir derrame potencial por menor costo/grado
      const ratios = active.map((id) => ({
        id,
        cost: costOf[id],
        deg: degrees[id],
        ratio: costOf[id] / degrees[id],
      }));
      ratios.sort((a, b) => a.ratio - b.ratio);
      const pick = ratios[0].id;
      removed.add(pick);
      stack.push({ id: pick, spill: true });
      steps.push({
        phase: "spill",
        action: "mark",
        node: pick,
        active: activeIds(),
        removed: new Set(removed),
        stack: snapshotStack(),
        colors: {},
        degrees,
        ratios,
        message: `Ningún grado < ${k}. Menor costo/grado = ${pick} (${ratios[0].cost}/${ratios[0].deg} = ${ratios[0].ratio.toFixed(2)}) → derrame potencial.`,
      });
    }
  }

  // ---- Select ----
  steps.push({
    phase: "select",
    action: "start",
    active: [],
    removed: new Set(removed),
    stack: snapshotStack(),
    colors: {},
    degrees: {},
    message: "SELECT — sacamos de la pila y asignamos el registro más bajo libre.",
  });

  const colors = {};
  const realSpills = [];
  const workStack = snapshotStack();

  while (workStack.length > 0) {
    const { id, spill } = workStack.pop();
    const usedColors = new Set(
      [...adj[id]].map((n) => colors[n]).filter((c) => c != null && c !== "SPILL")
    );
    let chosen = null;
    for (let c = 0; c < k; c++) {
      if (!usedColors.has(c)) {
        chosen = c;
        break;
      }
    }

    if (chosen == null) {
      colors[id] = "SPILL";
      realSpills.push(id);
      steps.push({
        phase: "select",
        action: "spill-real",
        node: id,
        colors: { ...colors },
        stack: workStack.map((s) => ({ ...s })),
        removed: new Set(),
        active: [],
        degrees: {},
        used: [...usedColors],
        message: `${id}: sus vecinos usan los ${k} registros → DERRAME REAL (va a memoria).`,
      });
    } else {
      colors[id] = chosen;
      steps.push({
        phase: "select",
        action: "color",
        node: id,
        color: chosen,
        wasSpillCandidate: spill,
        colors: { ...colors },
        stack: workStack.map((s) => ({ ...s })),
        removed: new Set(),
        active: [],
        degrees: {},
        used: [...usedColors],
        message: `${id} → R${chosen + 1}${spill ? " (¡el candidato a derrame sí se pudo colorear!)" : ""}.`,
      });
    }
  }

  steps.push({
    phase: "done",
    action: "done",
    colors: { ...colors },
    stack: [],
    removed: new Set(),
    active: [],
    degrees: {},
    spills: realSpills,
    message:
      realSpills.length > 0
        ? `Hubo derrame(s): ${realSpills.join(", ")}. Se inserta código de carga/almacenamiento y se RECONSTRUYE el grafo.`
        : `¡Grafo coloreado con ${k} registros y sin derrames! Fin.`,
  });

  return { steps, finalColors: colors, spills: realSpills, initialDegrees };
}
