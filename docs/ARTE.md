# Arte de Wonder IV

## De dónde sale cada cosa

| Qué | Dónde | Cómo se hizo |
|---|---|---|
| Piezas (7 + 2 especiales) | `img/piezas/` | Ilustraciones generadas con ChatGPT a partir de los prompts de [`PROMPTS_RESTO.md`](PROMPTS_RESTO.md) |
| Bloques de material (5) | `img/bloques/` | Ídem |
| Marco del tablero y columna | `img/marco.png`, `img/columna.png` | Ídem |
| Fondos de las siete obras | `img/fondos/` | Ilustraciones generadas con ChatGPT con prompts propios (plantilla de fondo de nivel) |
| Operarios (4 personajes) | `img/obreros/` | Hojas de 8 fotogramas generadas con los prompts de [`PROMPTS_OBREROS.md`](PROMPTS_OBREROS.md) |
| Edificios del asentamiento (cinco, niveles 1 y 2) | `img/edificios/` | Ilustraciones generadas con ChatGPT a partir de los prompts de [`PROMPTS_ASENTAMIENTO.md`](PROMPTS_ASENTAMIENTO.md) |
| Las siete maravillas | `img/maravillas/` | Ilustraciones generadas con ChatGPT a partir de [`PROMPTS_MARAVILLAS.md`](PROMPTS_MARAVILLAS.md) |
| Mapa del asentamiento | `img/mapa_asentamiento.jpg` | Ídem (prompt 8) |
| Solares vacíos y aldeanos del mapa | `js/asentamiento.js` | SVG dibujado en el código; los aldeanos usan las hojas de operarios |
| Icono y favicons | `icon-512.png`, `apple-touch-icon.png`, `favicon-*.png`, `favicon.ico` | Pieza del sol sobre lapislázuli, con `tools/build-icons.py` |
| Música y sonidos | `js/audio.js` | Sintetizados en el navegador con Web Audio, sin archivos |
| Tipografía Cinzel | `css/fonts/` | SIL OFL 1.1 |

Las hojas y las imágenes sueltas llegaron sobre un fondo verde liso `#00FF00`. `tools/build-sprites.py` y `tools/build-art.py` quitan el verde, recortan, reducen y dejan el PNG con transparencia; así se pueden rehacer si se cambia una imagen.

## Condiciones

Las ilustraciones las ha generado el autor con ChatGPT (OpenAI) y se distribuyen junto al juego bajo la misma licencia que el código, [PolyForm Noncommercial 1.0.0](../LICENSE). Los términos de uso de la herramienta con la que se generaron pueden cambiar con el tiempo y conviene revisarlos antes de cualquier uso comercial.

## Qué falta

El solar vacío (nivel 0 de cada edificio) y el título siguen siendo SVG o texto. Los prompts 11 y 12 de [`PROMPTS_ASENTAMIENTO.md`](PROMPTS_ASENTAMIENTO.md) son el solar y el título.
