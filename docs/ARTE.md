# Arte de Wonder IV

## De dónde sale cada cosa

| Qué | Dónde | Cómo se hizo |
|---|---|---|
| Piezas (7 + 2 especiales) | `img/piezas/` | Ilustraciones generadas con ChatGPT a partir de los prompts de [`PROMPTS_RESTO.md`](PROMPTS_RESTO.md) |
| Bloques de material (5) | `img/bloques/` | Ídem |
| Marco del tablero y columna | `img/marco.png`, `img/columna.png` | Ídem |
| Fondos de las siete obras | `img/fondos/` | Ilustraciones generadas con ChatGPT con prompts propios (plantilla de fondo de nivel) |
| Operarios (4 personajes) | `img/obreros/` | Hojas de 8 fotogramas generadas con los prompts de [`PROMPTS_OBREROS.md`](PROMPTS_OBREROS.md) |
| Mapa del asentamiento, edificios, las siete maravillas | `js/asentamiento.js`, `js/maravillas.js` | SVG dibujado a mano en el código |
| Tipografía Cinzel | `css/fonts/` | SIL OFL 1.1 |

Las hojas y las imágenes sueltas llegaron sobre un fondo verde liso `#00FF00`. `tools/build-sprites.py` y `tools/build-art.py` quitan el verde, recortan, reducen y dejan el PNG con transparencia; así se pueden rehacer si se cambia una imagen.

## Condiciones

Las ilustraciones las ha generado el autor con ChatGPT (OpenAI) y se distribuyen junto al juego bajo la misma licencia que el código, [PolyForm Noncommercial 1.0.0](../LICENSE). Los términos de uso de la herramienta con la que se generaron pueden cambiar con el tiempo y conviene revisarlos antes de cualquier uso comercial.

## Qué falta

El mapa del asentamiento y los edificios siguen siendo SVG propio. Si se generan ilustraciones, los prompts están en [`PROMPTS_ASENTAMIENTO.md`](PROMPTS_ASENTAMIENTO.md); cada edificio tendría dos imágenes (nivel 1 y nivel 2), más un solar vacío.
