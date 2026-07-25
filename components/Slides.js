"use client";

import GraphColoringDemo from "./graph/GraphColoringDemo";
import PhaseFlow from "./graph/PhaseFlow";
import InterferenceBuild from "./graph/InterferenceBuild";
import CoverBackground from "./CoverBackground";
import { EXAMPLE_1, EXAMPLE_2 } from "./graph/graphs";

// ⬇⬇⬇  EDITA AQUÍ LOS NOMBRES DEL EQUIPO  ⬇⬇⬇
export const TEAM = ["Daniela Nava Martínez", "Max Uriel Sánchez Díaz"];
export const COURSE = "Traductores / Compiladores";
export const PROFESSOR = "Prof. Antonio López Jaimes";
// ⬆⬆⬆ --------------------------------------- ⬆⬆⬆

export const SLIDES = [
  // ---------------------------------------------------------------- 1
  {
    key: "portada",
    title: "Portada",
    time: "0:00 – 0:25",
    notes:
      "Hola, somos Daniela Nava Martínez y Max Uriel Sánchez Díaz. En este video vamos a explicar el algoritmo de Chaitin para la asignación de registros mediante coloreo de grafos: qué problema resuelve, cómo funciona, dos ejemplos y nuestras conclusiones.",
    render: () => (
      <div className="slide-inner cover">
        <CoverBackground />
        <div className="cover-content">
          <span className="accent-bar" />
          <div className="eyebrow">Investigación · {COURSE}</div>
          <h1>
            El algoritmo de <span className="hl-teal">Chaitin</span>
          </h1>
          <p className="lead" style={{ marginTop: 16 }}>
            Asignación global de registros mediante <b>coloreo de grafos</b>.
          </p>
          <div className="cover-concepts">
            {["grafo de interferencia", "heurística de Kempe", "coalescing", "derrame"].map(
              (t) => (
                <span className="cpill" key={t}>
                  {t}
                </span>
              )
            )}
          </div>
          <div className="cover-names">
            {TEAM.map((n) => (
              <span className="chip" key={n}>
                {n}
              </span>
            ))}
          </div>
          <div className="cover-foot">{PROFESSOR}</div>
        </div>
        <style jsx>{`
          .cover-content {
            position: relative;
            z-index: 1;
          }
          .cover-concepts {
            display: flex;
            flex-wrap: wrap;
            gap: 9px;
            margin-top: 26px;
          }
          .cpill {
            font-size: 13px;
            font-weight: 600;
            color: var(--ink-soft);
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid var(--line);
            border-radius: 999px;
            padding: 6px 14px;
            backdrop-filter: blur(4px);
          }
          .cover-names {
            display: flex;
            gap: 12px;
            margin-top: 30px;
            flex-wrap: wrap;
          }
          .cover-names :global(.chip) {
            font-size: 16px;
            padding: 10px 20px;
          }
          .cover-foot {
            margin-top: 22px;
            color: var(--muted);
            font-size: 14px;
          }
        `}</style>
      </div>
    ),
  },

  // ---------------------------------------------------------------- 2
  {
    key: "problema",
    title: "El problema",
    time: "0:25 – 1:05",
    notes:
      "El compilador genera código con una cantidad ilimitada de registros virtuales o temporales. Pero el procesador solo tiene un número pequeño de registros físicos, por ejemplo 8, 16 o 32. La asignación de registros decide qué temporales van a registros y cuáles a memoria. La regla clave: dos variables que están vivas al mismo tiempo NO pueden compartir el mismo registro.",
    render: () => (
      <div className="slide-inner">
        <span className="accent-bar" />
        <div className="eyebrow">El problema</div>
        <h2>Tenemos infinitas variables… y pocos registros</h2>
        <div className="grid-2 top" style={{ marginTop: 24 }}>
          <div>
            <ul className="bullets">
              <li>
                El código intermedio usa <b className="hl-ink">registros virtuales</b> ilimitados
                (temporales <code>t1, t2, t3…</code>).
              </li>
              <li>
                La máquina real solo tiene <b className="hl-ink">k registros físicos</b> (p. ej. 8, 16, 32).
              </li>
              <li className="orange">
                Dos variables <b>vivas a la vez</b> no pueden ir al mismo registro.
              </li>
              <li>
                Lo que no cabe se <b className="hl-orange">derrama</b> (spill) a memoria: más lento.
              </li>
            </ul>
          </div>
          <div className="card pad-lg">
            <div className="mini-label">¿Dónde ocurre en el compilador?</div>
            <div className="pipeline">
              <span>Código fuente</span>
              <i>→</i>
              <span>Repr. intermedia</span>
              <i>→</i>
              <span className="on">Asignación de registros</span>
              <i>→</i>
              <span>Código máquina</span>
            </div>
            <p style={{ marginTop: 16 }}>
              Es una de las últimas fases del <b>back-end</b>: traduce temporales a
              registros concretos del CPU.
            </p>
          </div>
        </div>
        <style jsx>{`
          .mini-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--muted);
            font-weight: 700;
            margin-bottom: 14px;
          }
          .pipeline {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            font-size: 14px;
          }
          .pipeline span {
            background: #eef3f4;
            padding: 8px 12px;
            border-radius: 9px;
            font-weight: 600;
            color: var(--ink-soft);
          }
          .pipeline span.on {
            background: var(--teal);
            color: #fff;
          }
          .pipeline i {
            color: var(--muted);
            font-style: normal;
          }
        `}</style>
      </div>
    ),
  },

  // ---------------------------------------------------------------- 3
  {
    key: "idea",
    title: "La idea clave",
    time: "1:05 – 1:40",
    notes:
      "La gran idea —desarrollada por Gregory Chaitin y su equipo en IBM a principios de los 80, a partir de una sugerencia de John Cocke— fue ver la asignación de registros como un problema de coloreo de grafos. Cada variable es un nodo. Si dos variables interfieren, o sea viven al mismo tiempo, dibujamos una arista entre ellas. Los registros son colores. Colorear el grafo con k colores, sin que dos nodos vecinos tengan el mismo color, equivale a asignar k registros sin conflictos.",
    render: () => (
      <div className="slide-inner">
        <span className="accent-bar" />
        <div className="eyebrow">La idea de Chaitin (1981, IBM)</div>
        <h2>Asignar registros = colorear un grafo</h2>
        <div className="map3" style={{ marginTop: 30 }}>
          <div className="map-card">
            <div className="map-icon" style={{ background: "var(--teal-soft)", color: "var(--teal)" }}>●</div>
            <h3>Nodo</h3>
            <p>Un rango de vida de una variable / temporal.</p>
          </div>
          <div className="map-plus">+</div>
          <div className="map-card">
            <div className="map-icon" style={{ background: "var(--orange-soft)", color: "#c1521f" }}>／</div>
            <h3>Arista</h3>
            <p>Dos variables <b>interfieren</b> (viven a la vez): no comparten registro.</p>
          </div>
          <div className="map-plus">+</div>
          <div className="map-card">
            <div className="map-icon" style={{ background: "var(--r3-soft)", color: "var(--r3)" }}>▢</div>
            <h3>Color</h3>
            <p>Un registro físico. Hay <b>k colores</b>.</p>
          </div>
        </div>
        <div className="idea-eq">
          <b>k-coloreo del grafo</b> (vecinos con colores distintos) <span>⇔</span>{" "}
          <b>asignación válida con k registros</b>
        </div>
        <style jsx>{`
          .map3 {
            display: flex;
            align-items: stretch;
            justify-content: center;
            gap: 14px;
            flex-wrap: wrap;
          }
          .map-card {
            flex: 1;
            min-width: 200px;
            background: #fff;
            border: 1px solid var(--line);
            border-radius: var(--radius);
            box-shadow: var(--shadow-sm);
            padding: 22px;
          }
          .map-icon {
            width: 46px;
            height: 46px;
            border-radius: 12px;
            display: grid;
            place-items: center;
            font-size: 22px;
            margin-bottom: 14px;
          }
          .map-plus {
            display: grid;
            place-items: center;
            font-size: 26px;
            color: var(--muted);
            font-weight: 700;
          }
          .idea-eq {
            margin-top: 28px;
            text-align: center;
            font-size: clamp(15px, 1.7vw, 20px);
            color: var(--ink);
            background: var(--teal-soft);
            border-radius: 12px;
            padding: 16px;
          }
          .idea-eq span {
            color: var(--orange);
            font-weight: 800;
            margin: 0 8px;
          }
        `}</style>
      </div>
    ),
  },

  // ---------------------------------------------------------------- 4
  {
    key: "motivacion",
    title: "Motivación",
    time: "1:40 – 2:20",
    notes:
      "¿Qué mejora sobre los métodos anteriores? En clase vimos la asignación local por descriptores de registros: trabaja bloque por bloque, con un método ad-hoc. Es rápida, pero desperdicia registros y mete muchos accesos a memoria. La verdadera aportación de Chaitin no fue simplemente ser global —ya existían esquemas globales, como los basados en prioridad—, sino formular la asignación de registros como un problema de coloreo del grafo de interferencia: un modelo matemático claro y sistemático que además, con el coalescing, elimina copias redundantes. Ojo: colorear es NP-completo, así que Chaitin usa una heurística muy elegante en lugar de buscar la solución óptima.",
    render: () => (
      <div className="slide-inner">
        <span className="accent-bar" />
        <div className="eyebrow">Motivación · ¿Qué mejora?</div>
        <h2>De lo local y ad-hoc… a lo global y sistemático</h2>
        <div className="grid-2 top" style={{ marginTop: 22 }}>
          <div className="card pad-lg before">
            <div className="tag-before">ANTES</div>
            <h3>Asignación local por descriptores</h3>
            <ul className="bullets sm">
              <li>Trabaja <b>bloque por bloque</b> (getReg, estilo Aho).</li>
              <li>Método <b>ad-hoc</b>, sin garantía global.</li>
              <li>Desperdicia registros; muchos accesos a memoria.</li>
            </ul>
          </div>
          <div className="card pad-lg after">
            <div className="tag-after">CHAITIN</div>
            <h3>Coloreo de grafos (global)</h3>
            <ul className="bullets sm">
              <li className="orange">Formula todo como <b>coloreo del grafo de interferencia</b> (la gran abstracción).</li>
              <li className="orange">Trabaja de forma <b>global</b>, sobre toda la función.</li>
              <li className="orange"><b>Coalescing</b>: elimina copias redundantes.</li>
              <li className="orange">Mejor uso de registros → menos derrames.</li>
            </ul>
          </div>
        </div>
        <div className="np-note">
          Ya existían esquemas globales (p. ej. por prioridad): la <b className="hl-orange">novedad</b> fue el
          modelo de <b>coloreo de grafos</b>. Y como colorear con k≥3 es <b>NP-completo</b>, Chaitin usa una{" "}
          <b className="hl-teal">heurística</b> en vez del óptimo.
        </div>
        <style jsx>{`
          .before { border-top: 4px solid var(--muted); }
          .after { border-top: 4px solid var(--orange); }
          .tag-before, .tag-after {
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.14em;
            padding: 3px 10px;
            border-radius: 999px;
            display: inline-block;
            margin-bottom: 10px;
          }
          .tag-before { background: #edf1f2; color: var(--muted); }
          .tag-after { background: var(--orange-soft); color: #c1521f; }
          .bullets.sm li { font-size: 15px; padding-left: 26px; }
          .bullets.sm li::before { top: 0.5em; width: 9px; height: 9px; }
          h3 { margin-bottom: 12px; }
          .np-note {
            margin-top: 22px;
            text-align: center;
            font-size: 16px;
            color: var(--ink-soft);
            background: #f7fafa;
            border: 1px dashed var(--line);
            border-radius: 12px;
            padding: 14px;
          }
        `}</style>
      </div>
    ),
  },

  // ---------------------------------------------------------------- 5
  {
    key: "interferencia",
    title: "Grafo de interferencia",
    time: "2:20 – 2:55",
    notes:
      "Primero necesitamos el grafo de interferencia. Con un análisis de vida (liveness) calculamos, para cada variable, desde dónde hasta dónde está viva. Fíjense en las barras de la izquierda: cuando dos barras se solapan verticalmente, esas variables viven a la vez y por lo tanto interfieren. Cada interferencia se convierte en una arista del grafo de la derecha. Ese grafo es la entrada del algoritmo. Un detalle importante: si dos variables solo coinciden en una instrucción de copia, como b igual a a, no se pone arista entre ellas; esa excepción es la que después permite fusionarlas con el coalescing.",
    render: () => (
      <div className="slide-inner">
        <span className="accent-bar" />
        <div className="eyebrow">Paso previo</div>
        <h2>Construir el grafo de interferencia</h2>
        <p className="lead" style={{ marginTop: 8, marginBottom: 18 }}>
          Análisis de vida → si dos rangos se solapan, interfieren → arista.
        </p>
        <InterferenceBuild />
        <p className="copy-note">
          <b>Detalle:</b> en una copia <code>b := a</code>, aunque a y b vivan a la vez,{" "}
          <b>no</b> se añade arista entre ellos — justo eso es lo que luego permite el{" "}
          <b>coalescing</b> (fusionarlas).
        </p>
        <style jsx>{`
          .copy-note {
            margin-top: 14px;
            font-size: 13.5px;
            color: var(--ink-soft);
            background: #f7fafa;
            border: 1px dashed var(--line);
            border-radius: 10px;
            padding: 10px 14px;
          }
          .copy-note code {
            color: var(--orange);
            font-weight: 700;
            font-family: var(--font-mono);
          }
        `}</style>
      </div>
    ),
  },

  // ---------------------------------------------------------------- 6
  {
    key: "kempe",
    title: "Heurística de Kempe",
    time: "2:55 – 3:30",
    notes:
      "El corazón del algoritmo es una idea de 1879, la heurística de Kempe. Dice lo siguiente: si un nodo tiene menos de k vecinos, siempre lo podremos colorear, porque sus vecinos usan a lo más k-1 colores y siempre sobra al menos uno. Entonces, en la fase Simplify, quitamos repetidamente del grafo cualquier nodo con grado menor que k y lo ponemos en una pila. Al quitar un nodo bajan los grados de sus vecinos, lo que suele permitir quitar más. Después, en la fase Select, vaciamos la pila en orden inverso y a cada nodo le damos un color que no usen sus vecinos: por Kempe, siempre hay uno libre.",
    render: () => (
      <div className="slide-inner">
        <span className="accent-bar" />
        <div className="eyebrow">Heurística de Kempe (1879)</div>
        <h2>Un nodo con grado &lt; k siempre se puede colorear</h2>
        <div className="grid-2 top" style={{ marginTop: 20 }}>
          <div className="card pad-lg">
            <div className="kempe-why">
              Si un nodo tiene <b>menos de k vecinos</b>, esos vecinos usan a lo más
              <b> k−1 colores</b> → <b className="hl-teal">siempre sobra ≥ 1 color</b>.
            </div>
            <p style={{ marginTop: 14 }}>
              Así que podemos quitarlo ahora y colorearlo al final sin problema.
            </p>
          </div>
          <div className="stack-col">
            <div className="phase-row">
              <div className="phase-badge teal">SIMPLIFY</div>
              <p>Quitar nodos con grado &lt; k y <b>apilarlos</b>. Bajan los grados vecinos → se pueden quitar más.</p>
            </div>
            <div className="phase-row">
              <div className="phase-badge orange">SELECT</div>
              <p>Vaciar la pila (orden inverso) y <b>asignar</b> a cada nodo un color libre. Kempe garantiza que lo hay.</p>
            </div>
          </div>
        </div>
        <style jsx>{`
          .kempe-why {
            font-size: 18px;
            line-height: 1.5;
            color: var(--ink);
          }
          .stack-col { display: flex; flex-direction: column; gap: 14px; }
          .phase-row {
            display: flex;
            gap: 14px;
            align-items: flex-start;
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 14px;
            padding: 16px;
            box-shadow: var(--shadow-sm);
          }
          .phase-badge {
            font-family: var(--font-mono);
            font-weight: 800;
            font-size: 12px;
            letter-spacing: 0.1em;
            color: #fff;
            padding: 7px 10px;
            border-radius: 8px;
            white-space: nowrap;
          }
          .phase-badge.teal { background: var(--teal); }
          .phase-badge.orange { background: var(--orange); }
        `}</style>
      </div>
    ),
  },

  // ---------------------------------------------------------------- 7
  {
    key: "fases",
    title: "Fases del algoritmo",
    time: "3:30 – 4:00",
    notes:
      "Poniéndolo todo junto, el algoritmo tiene estas fases: Build construye el grafo; Coalesce fusiona copias que no interfieren para eliminar movimientos innecesarios; se calculan los costos de derrame; Simplify apila los nodos fáciles; y Select asigna los registros. Si al final hubo algún derrame real, se inserta el código de guardar y cargar en memoria, y como eso cambia los rangos de vida, se reconstruye el grafo y se repite todo. Cuando ya no hay derrames, terminamos.",
    render: () => (
      <div className="slide-inner">
        <span className="accent-bar" />
        <div className="eyebrow">El algoritmo completo</div>
        <h2>Fases y el ciclo de reconstrucción</h2>
        <div style={{ marginTop: 26 }}>
          <PhaseFlow />
        </div>
      </div>
    ),
  },

  // ---------------------------------------------------------------- 8
  {
    key: "spilling",
    title: "Derrame (spilling)",
    time: "4:00 – 4:35",
    notes:
      "¿Y si en algún momento todos los nodos tienen grado mayor o igual que k? Nos atoramos: hay que derramar una variable a memoria. ¿Cuál elegir? Chaitin usa la heurística costo entre grado. El costo estima cuántas cargas y almacenamientos costaría derramar esa variable, ponderado por la profundidad de los bucles, porque derramar algo dentro de un bucle es carísimo. El grado es cuántas otras variables estorba. Derramamos el nodo con el menor cociente costo entre grado: barato de derramar y que libera muchas interferencias. Una nota: el Chaitin original derrama de inmediato; Briggs, en 1994, propuso el coloreo optimista, que primero apila el nodo y solo lo derrama si de verdad no encuentra color.",
    render: () => (
      <div className="slide-inner">
        <span className="accent-bar" />
        <div className="eyebrow">Cuando nos atoramos</div>
        <h2>Derrame: elegir la variable a mandar a memoria</h2>
        <div className="grid-2 top" style={{ marginTop: 20 }}>
          <div>
            <p style={{ marginBottom: 14 }}>
              Si <b>ningún nodo</b> tiene grado &lt; k, hay que <b className="hl-orange">derramar</b>.
              Chaitin elige el que minimiza:
            </p>
            <div className="metric">
              <span className="frac">
                <em>costo de derrame</em>
                <span className="bar" />
                <em>grado</em>
              </span>
            </div>
            <ul className="bullets sm" style={{ marginTop: 16 }}>
              <li><b>Costo</b>: nº de usos/defs × 10^(profundidad de bucle).</li>
              <li><b>Grado</b>: cuántas variables estorba.</li>
              <li className="orange">Menor cociente = barato y muy conflictivo → <b>buen candidato</b>.</li>
            </ul>
          </div>
          <div className="card pad-lg opt">
            <div className="chip orange">Mejora posterior</div>
            <h3 style={{ marginTop: 12 }}>Coloreo optimista (Briggs, 1994)</h3>
            <p style={{ marginTop: 8 }}>
              Chaitin original derrama <b>de inmediato</b> al atorarse (pesimista).
            </p>
            <p style={{ marginTop: 10 }}>
              Briggs apila el nodo y <b className="hl-teal">solo lo derrama si en Select
              realmente no hay color</b>. Así colorea más grafos sin derramar.
            </p>
          </div>
        </div>
        <style jsx>{`
          .metric {
            display: flex;
            justify-content: center;
            padding: 6px 0;
          }
          .frac {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            font-style: normal;
            color: var(--spill);
            font-weight: 700;
            font-size: 17px;
          }
          .frac em { font-style: normal; }
          .frac .bar {
            display: block;
            width: 190px;
            height: 3px;
            background: var(--spill);
            margin: 6px 0;
            border-radius: 3px;
          }
          .bullets.sm li { font-size: 15px; padding-left: 26px; }
          .bullets.sm li::before { top: 0.5em; width: 9px; height: 9px; }
          .opt { border-top: 4px solid var(--teal); }
        `}</style>
      </div>
    ),
  },

  // ---------------------------------------------------------------- 9
  {
    key: "ejemplo1",
    title: "Ejemplo 1 — sin derrame",
    time: "4:35 – 5:25",
    notes:
      "Primer ejemplo, con k igual a 3 registros. Miren el grafo: los nodos d y e tienen grado menor que 3, así que Simplify los apila primero. Al quitarlos, a, b y c quedan con grado 2, también menor que 3, y se apilan. Con el grafo vacío empieza Select: sacamos de la pila y a cada nodo le damos el registro más bajo que no usen sus vecinos. Todos reciben color: R1, R2 o R3. Resultado: coloreamos con 3 registros y sin ningún derrame. Pueden darle a reproducir para verlo animado.",
    render: () => (
      <div className="slide-inner wide">
        <span className="accent-bar" />
        <div className="eyebrow">Ejemplo 1 · k = 3 · sin derrame</div>
        <h2 style={{ marginBottom: 6 }}>El grafo es 3-coloreable</h2>
        <div className="ex-grid">
          <GraphColoringDemo graph={EXAMPLE_1} />
          <div className="ex-side">
            <div className="card">
              <div className="mini-label">Qué observar</div>
              <ul className="bullets sm">
                <li><b>d</b> (grado 1) y <b>e</b> (grado 2) entran a la pila primero.</li>
                <li>Al quitarlos, el triángulo <b>a-b-c</b> baja a grado 2 y se apila.</li>
                <li className="orange">En Select, todos hallan color → <b>R1, R2, R3</b>.</li>
                <li>Sin derrames: 3 registros bastan.</li>
              </ul>
            </div>
          </div>
        </div>
        <style jsx>{`
          .ex-grid {
            display: grid;
            grid-template-columns: 1.55fr 1fr;
            gap: 18px;
            align-items: start;
            margin-top: 12px;
          }
          .mini-label {
            font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;
            color: var(--muted); font-weight: 700; margin-bottom: 10px;
          }
          .bullets.sm li { font-size: 14.5px; padding-left: 26px; }
          .bullets.sm li::before { top: 0.5em; width: 9px; height: 9px; }
          @media (max-width: 980px) { .ex-grid { grid-template-columns: 1fr; } }
        `}</style>
      </div>
    ),
  },

  // ---------------------------------------------------------------- 10
  {
    key: "ejemplo2",
    title: "Ejemplo 2 — con derrame",
    time: "5:25 – 6:20",
    notes:
      "Segundo ejemplo, también con 3 registros, pero ahora el grafo es un K4: cuatro variables donde todas interfieren entre sí. Un K4 necesita 4 colores, pero solo tenemos 3. Al inicio todos los nodos tienen grado 3, así que Simplify se atora y hay que derramar. Calculamos costo entre grado: la variable c tiene el menor cociente, 3 entre 3 igual a 1, así que se marca como derrame. Al quitar c, quedan a, b y d formando un triángulo que sí es 3-coloreable. En Select coloreamos a, b y d, pero cuando toca c sus tres vecinos ya usan R1, R2 y R3, así que c no encuentra color y se confirma el derrame: c vive en memoria. Después se inserta el código de derrame y se reconstruye el grafo, que ahora sí es coloreable.",
    render: () => (
      <div className="slide-inner wide">
        <span className="accent-bar" />
        <div className="eyebrow">Ejemplo 2 · k = 3 · requiere derrame</div>
        <h2 style={{ marginBottom: 6 }}>K4: cuatro variables que interfieren entre sí</h2>
        <div className="ex-grid">
          <GraphColoringDemo graph={EXAMPLE_2} />
          <div className="ex-side">
            <div className="card">
              <div className="mini-label">Qué observar</div>
              <ul className="bullets sm">
                <li>K4 necesita <b>4 colores</b>, pero solo hay <b>3 registros</b>.</li>
                <li>Todos empiezan con grado 3 → Simplify se <b>atora</b>.</li>
                <li className="orange">Menor costo/grado: <b>c</b> (3/3 = 1.0) → derrame.</li>
                <li>a, b, d se colorean; <b>c</b> no halla color → a <b>memoria</b>.</li>
                <li>Se inserta código de derrame y se <b>reconstruye</b>.</li>
              </ul>
            </div>
          </div>
        </div>
        <style jsx>{`
          .ex-grid {
            display: grid;
            grid-template-columns: 1.55fr 1fr;
            gap: 18px;
            align-items: start;
            margin-top: 12px;
          }
          .mini-label {
            font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;
            color: var(--muted); font-weight: 700; margin-bottom: 10px;
          }
          .bullets.sm li { font-size: 14.5px; padding-left: 26px; }
          .bullets.sm li::before { top: 0.5em; width: 9px; height: 9px; }
          @media (max-width: 980px) { .ex-grid { grid-template-columns: 1fr; } }
        `}</style>
      </div>
    ),
  },

  // ---------------------------------------------------------------- 11
  {
    key: "comparacion",
    title: "Comparación",
    time: "6:20 – 6:55",
    notes:
      "¿Cómo se compara con otros algoritmos? La asignación local por descriptores es muy rápida pero de baja calidad y solo local. Chaitin es global y de alta calidad, pero lento porque el grafo puede ser cuadrático. Briggs mejora a Chaitin con el coloreo optimista, produciendo menos derrames. Y el Linear Scan, de 1999, es casi lineal y muy rápido, aunque de calidad media: por eso se usa en compiladores JIT, donde el tiempo de compilación importa mucho.",
    render: () => (
      <div className="slide-inner">
        <span className="accent-bar" />
        <div className="eyebrow">Chaitin frente a otros</div>
        <h2>Comparación de algoritmos</h2>
        <div className="table-wrap" style={{ marginTop: 20 }}>
          <table className="cmp">
            <thead>
              <tr>
                <th>Algoritmo</th>
                <th>Alcance</th>
                <th>Calidad</th>
                <th>Velocidad</th>
                <th>Uso típico</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="algo">Local por descriptores <span>(getReg)</span></td>
                <td>Por bloque</td>
                <td><span className="dot low" />Baja</td>
                <td><span className="dot hi" />Muy rápida</td>
                <td>Traductores simples / didácticos</td>
              </tr>
              <tr className="hlrow">
                <td className="algo">Chaitin <span>(coloreo)</span></td>
                <td>Global</td>
                <td><span className="dot hi" />Alta</td>
                <td><span className="dot low" />Lenta</td>
                <td>Compiladores optimizadores (AOT)</td>
              </tr>
              <tr>
                <td className="algo">Briggs <span>(optimista)</span></td>
                <td>Global</td>
                <td><span className="dot hi" />Alta+</td>
                <td><span className="dot low" />Lenta</td>
                <td>Compiladores modernos</td>
              </tr>
              <tr>
                <td className="algo">Linear Scan <span>(1999)</span></td>
                <td>Global (intervalos)</td>
                <td><span className="dot mid" />Media</td>
                <td><span className="dot hi" />Muy rápida</td>
                <td>Compiladores JIT</td>
              </tr>
            </tbody>
          </table>
        </div>
        <style jsx>{`
          .table-wrap { overflow-x: auto; }
          .cmp {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: clamp(13px, 1.35vw, 16px);
            background: #fff;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: var(--shadow-sm);
          }
          .cmp th {
            text-align: left;
            background: var(--ink);
            color: #fff;
            padding: 13px 16px;
            font-weight: 700;
            font-size: 13px;
          }
          .cmp td {
            padding: 13px 16px;
            border-bottom: 1px solid var(--line);
            color: var(--ink-soft);
          }
          .cmp tr:last-child td { border-bottom: none; }
          .cmp .algo { font-weight: 700; color: var(--ink); }
          .cmp .algo span { font-weight: 400; color: var(--muted); font-size: 0.85em; }
          .cmp .hlrow td { background: var(--teal-soft); }
          .cmp .hlrow .algo { color: var(--teal); }
          .dot {
            display: inline-block;
            width: 9px; height: 9px; border-radius: 50%;
            margin-right: 7px; vertical-align: middle;
          }
          .dot.hi { background: #2fae7a; }
          .dot.mid { background: #e8a33a; }
          .dot.low { background: #d1607a; }
        `}</style>
      </div>
    ),
  },

  // ---------------------------------------------------------------- 12
  {
    key: "conclusiones",
    title: "Conclusiones",
    time: "6:55 – 7:30",
    notes:
      "Conclusiones. ¿Cuándo conviene Chaitin? Cuando hay más variables vivas que registros y buscamos código de alta calidad, típico en un compilador optimizador. ¿Es más complejo pero vale la pena? Sí: reduce accesos a memoria y elimina copias, aunque cuesta implementar el análisis de vida y construir el grafo. ¿Hay mejores? Depende del objetivo: Briggs mejora la calidad, George y Appel mejoran el coalescing, y el Linear Scan gana cuando importa la velocidad de compilación. Lo más elegante es que convierte un problema NP-completo en una heurística simple y efectiva.",
    render: () => (
      <div className="slide-inner">
        <span className="accent-bar" />
        <div className="eyebrow">Conclusiones</div>
        <h2>¿Vale la pena Chaitin?</h2>
        <div className="concl" style={{ marginTop: 22 }}>
          <div className="card">
            <h3 className="q">¿Cuándo conviene?</h3>
            <p>Cuando hay más variables vivas que registros y se busca <b>código de calidad</b>: compiladores con optimización (AOT).</p>
          </div>
          <div className="card">
            <h3 className="q">¿Más complejo, pero vale la pena?</h3>
            <p>Sí: menos accesos a memoria y elimina copias. El costo es implementar <b>liveness</b> y construir el grafo.</p>
          </div>
          <div className="card">
            <h3 className="q">¿Hay mejores?</h3>
            <p>Depende del objetivo: <b>Briggs</b> (calidad), <b>George-Appel</b> (coalescing), <b>Linear Scan</b> (velocidad, JIT).</p>
          </div>
          <div className="card hl">
            <h3 className="q">Lo más valioso</h3>
            <p>Convierte un problema <b>NP-completo</b> en una <b className="hl-teal">heurística simple</b> y muy efectiva.</p>
          </div>
        </div>
        <style jsx>{`
          .concl {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .concl .q { color: var(--orange); margin-bottom: 8px; font-size: 18px; }
          .concl .hl { border-top: 4px solid var(--teal); }
          @media (max-width: 820px) { .concl { grid-template-columns: 1fr; } }
        `}</style>
      </div>
    ),
  },

  // ---------------------------------------------------------------- 13
  {
    key: "traductor",
    title: "¿En nuestro traductor?",
    time: "7:30 – 8:00",
    notes:
      "¿Lo usaríamos en nuestro traductor? Nuestro traductor hace asignación local por descriptores, como vimos en clase, y para el alcance del curso eso es suficiente. Usaríamos Chaitin si quisiéramos generar código de máquina real con un número fijo de registros y optimizar de verdad el uso del CPU. El costo sería agregar análisis de vida global y la construcción del grafo. En resumen: no es necesario para nuestro proyecto actual, pero sería el siguiente paso natural si convertimos el traductor en un back-end optimizador.",
    render: () => (
      <div className="slide-inner">
        <span className="accent-bar" />
        <div className="eyebrow">Aplicación a nuestro proyecto</div>
        <h2>¿Lo usaríamos en nuestro traductor?</h2>
        <div className="grid-2 top" style={{ marginTop: 22 }}>
          <div>
            <ul className="bullets">
              <li>Hoy usamos <b>asignación local por descriptores</b> (lo visto en clase); para el alcance del curso, <b>basta</b>.</li>
              <li className="orange">Usaríamos Chaitin si generáramos <b>código máquina real</b> con k registros fijos y quisiéramos optimizar.</li>
              <li>Costo de adoptarlo: agregar <b>liveness global</b> + construcción del grafo de interferencia.</li>
            </ul>
          </div>
          <div className="card pad-lg verdict">
            <div className="chip">Nuestro veredicto</div>
            <p style={{ marginTop: 14, fontSize: 18, color: "var(--ink)" }}>
              No es <b>necesario</b> para el proyecto actual, pero es el
              <b className="hl-teal"> siguiente paso natural</b> si lo convertimos en un
              back-end optimizador.
            </p>
          </div>
        </div>
        <style jsx>{`
          .verdict { border-top: 4px solid var(--teal); }
        `}</style>
      </div>
    ),
  },

  // ---------------------------------------------------------------- 14
  {
    key: "cierre",
    title: "Cierre y referencias",
    time: "8:00 – 8:20",
    notes:
      "En resumen: Chaitin modela la asignación de registros como coloreo de grafos, usa la heurística de Kempe para simplificar, y derrama a memoria lo que no cabe. Es la base de la asignación de registros moderna. Gracias por su atención.",
    render: () => (
      <div className="slide-inner">
        <span className="accent-bar" />
        <div className="eyebrow">En una frase</div>
        <h2>Chaitin = coloreo de grafos + Kempe + derrame</h2>
        <p className="lead" style={{ marginTop: 14 }}>
          Modela la asignación de registros como un k-coloreo, simplifica con la
          heurística de Kempe y derrama a memoria lo que no cabe. Es la base de la
          asignación de registros moderna.
        </p>
        <div className="refs">
          <div className="mini-label">Referencias</div>
          <ul>
            <li>Chaitin et al. (1981). <i>Register Allocation via Coloring</i>. Computer Languages.</li>
            <li>Chaitin, G. (1982). <i>Register Allocation &amp; Spilling via Graph Coloring</i>. SIGPLAN.</li>
            <li>Briggs, Cooper &amp; Torczon (1994). <i>Improvements to Graph Coloring Register Allocation</i>.</li>
            <li>Appel, A. <i>Modern Compiler Implementation</i>, cap. 11.</li>
          </ul>
        </div>
        <div className="thanks">¡Gracias! — {TEAM.join("  ·  ")}</div>
        <style jsx>{`
          .refs { margin-top: 26px; }
          .mini-label {
            font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;
            color: var(--muted); font-weight: 700; margin-bottom: 10px;
          }
          .refs ul { list-style: none; display: flex; flex-direction: column; gap: 7px; }
          .refs li { font-size: 14px; color: var(--ink-soft); padding-left: 16px; position: relative; }
          .refs li::before {
            content: "›"; position: absolute; left: 0; color: var(--teal); font-weight: 700;
          }
          .thanks {
            margin-top: 26px;
            font-size: 18px;
            font-weight: 700;
            color: var(--teal);
          }
        `}</style>
      </div>
    ),
  },
];
