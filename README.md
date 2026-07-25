# Algoritmo de Chaitin — Presentación interactiva

Web tipo diapositivas (Next.js) para explicar en video el **algoritmo de Chaitin**
de asignación de registros mediante coloreo de grafos.

## Cómo ejecutarla

```bash
npm install
npm run dev
```

Abre <http://localhost:3000> en el navegador.

## Controles

| Tecla | Acción |
|-------|--------|
| `←` `→` / `Espacio` | Anterior / Siguiente diapositiva |
| `N` | Mostrar/ocultar el **guion** (narración para el video) |
| `O` | Índice de diapositivas |
| `F` | Pantalla completa (ideal para grabar) |
| `Home` / `End` | Primera / última |

En los ejemplos interactivos (diapositivas 9 y 10) usa los botones
**▶ / ‹ / ›** para reproducir o avanzar el algoritmo paso a paso.

## ⚠️ Antes de grabar

1. **Pon los nombres del equipo**: edita `TEAM` al inicio de
   `components/Slides.js`:
   ```js
   export const TEAM = ["Tu Nombre", "Nombre de tu compañero/a"];
   ```
2. Pulsa `F` para pantalla completa y `N` cuando quieras leer el guion.
3. Cada diapositiva trae abajo su guion con el minutaje sugerido
   (total ≈ 6–7 min, dentro del rango pedido de 5–7 min).

## Contenido (14 diapositivas)

1. Portada (nombres del equipo)
2. El problema de la asignación de registros
3. La idea clave: coloreo de grafos
4. Motivación: qué mejora sobre métodos locales
5. Construcción del grafo de interferencia
6. Heurística de Kempe (Simplify)
7. Fases del algoritmo + ciclo de reconstrucción
8. Derrame (spilling) y coloreo optimista
9. **Ejemplo 1** interactivo (3-coloreable, sin derrame)
10. **Ejemplo 2** interactivo (K4, requiere derrame)
11. Comparación con otros algoritmos
12. Conclusiones
13. ¿Usarlo en nuestro traductor?
14. Cierre y referencias

## Estructura

```
app/            layout, página y estilos globales
components/
  Deck.js       controlador (navegación, notas, índice)
  Slides.js     las 14 diapositivas + guion
  graph/
    chaitinEngine.js      motor del algoritmo (genera los pasos)
    GraphColoringDemo.js  reproductor interactivo del coloreo
    PhaseFlow.js          diagrama de fases
    InterferenceBuild.js  código → rangos de vida → grafo
    graphs.js             datos de los ejemplos
```
