# WONDER IV

Puzle de combinar tres en el navegador con estética de terminal arqueológica.
Cada nivel es una maravilla que se reconstruye pieza a pieza mientras su arte
ASCII aparece línea a línea.

Nació dentro de [RETROTERM.AI](https://ivanchux.github.io/Retroterm-AI/) y ahora
vive en su propio repositorio para poder crecer.

HTML, CSS y JavaScript sin dependencias ni paso de compilación.

---

## Cómo se juega

- Tablero de 7 × 7 con siete tipos de ficha: DELTA, LAMBDA, ORBIT, HEX, TARGET, NODE y CORE.
- Intercambia dos fichas contiguas para alinear tres o más del mismo tipo.
- Cada combinación hace avanzar la reconstrucción de la maravilla. Al completar
  todas sus etapas antes de quedarte sin movimientos, ganas el nivel.
- **Eras.** Cada maravilla se divide en tres eras. Cada era pide recoger una
  cantidad de un tipo de ficha concreto y multiplica la puntuación (de ×1,5 a ×5).
- **Gemas especiales.**
  - Alinear 4 crea una **gema de línea**: al usarla limpia su fila y su columna.
  - Alinear 5 o más crea una **gema de área**: limpia un cuadrado de 3 × 3.
  - Intercambiar dos gemas entre sí provoca una explosión combinada.
- **Poderes**, de uso limitado por nivel: BOMBA, RAYO, REVOLVER (baraja el tablero) y AURORA.
- **Estrellas.** Se ganan según los movimientos que sobran al terminar:
  tres estrellas con el 40 % o más, dos con el 15 % o más, una en el resto.
- El récord y las estrellas de cada maravilla se guardan en el navegador.

### Las maravillas

| # | Maravilla | Época | Dificultad | Etapas | Movimientos |
|---|---|---|---|---|---|
| 1 | La Pirámide | 2560 a. C. | Fácil | 9 | 48 |
| 2 | El Faro | 1952 | Fácil | 9 | 44 |
| 3 | Los Jardines | 1969 | Media | 12 | 42 |
| 4 | El Coloso | 1983 | Media | 12 | 40 |
| 5 | El Templo | 1990 | Difícil | 12 | 38 |
| 6 | La Estatua | 2001 | Difícil | 14 | 36 |
| 7 | La Tumba | 2012 | Experta | 15 | 32 |
| 8 | El Oráculo | 2045 | Experta | 15 | 28 |

---

## Estructura

```
index.html        Marcado de las pantallas (menú, partida, avisos de era, pantalla final)
css/wonder.css    Todos los estilos
js/data.js        Fichas, gemas en SVG y las maravillas con sus eras  ← los niveles se editan aquí
js/storage.js     Récords y estrellas en localStorage
js/state.js       Estado global de la partida
js/screens.js     Cambio de pantalla y menú de selección
js/fx.js          Partículas, fondo de la escena y arte ASCII
js/engine.js      Tablero, entrada, intercambios, combinaciones, gemas, gravedad y pistas
js/powerups.js    Poderes especiales
js/hud.js         Marcadores, puntuación flotante, pantallas finales y registro
js/main.js        Arranque y botón de modo claro/oscuro
```

Los scripts son clásicos (no módulos) y se cargan en ese orden: comparten el
ámbito global y los botones del HTML llaman a las funciones por su nombre.

## Ejecutar en local

```bash
python -m http.server 8000
# http://localhost:8000
```

Abrir `index.html` con doble clic también funciona.

## Publicar en GitHub Pages

Settings → Pages → Deploy from a branch → `main` / `(root)`.
Si el repositorio se llama `wonder-iv`, el juego queda en
`https://ivanchux.github.io/wonder-iv/`.

Al estar en el mismo dominio que RETROTERM.AI, el récord y las estrellas
guardados desde el hub se conservan.

---

## Autor

**Iván Brihuega Crespo** · [@Ivanchux](https://github.com/Ivanchux)

Licencia propia: ver [LICENSE](LICENSE).
