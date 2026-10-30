# Wonder IV · prompts de imágenes para ChatGPT

Orden recomendado: **primero el apartado 0 y los apartados 1 y 2** (son lo que más cambia el aspecto). Con eso ya puedo montar una pantalla de nivel completa. El resto, cuando quieras.

## Cómo pasármelo
- Una carpeta o un `.zip` con las imágenes **con estos nombres** (te los pongo en cada prompt). Si ChatGPT te da otro tamaño, no pasa nada, yo reescalo.
- PNG para todo lo que lleve fondo transparente, JPG o PNG para los paisajes.
- Si ChatGPT no te da transparencia real, pídele **fondo verde liso `#00FF00`** y yo lo quito. Lo indico en cada prompt.
- Genera cada imagen **en una conversación nueva** pegando primero el prompt de estilo (apartado 0). Si una sale bien, repite el mismo prompt para tener 3 o 4 versiones y me pasas las dos mejores.
- Pon siempre **sin texto, sin letras, sin logos, sin marcas de agua, sin personajes de otros juegos**.

---

## 0 · Prompt de estilo (pégalo antes de cada imagen)

```
Art direction for a casual puzzle game set in the ancient Mediterranean world:
rich hand-painted digital illustration, warm and saturated colors, soft but clear
outlines, gentle volumetric lighting, detailed stone and plaster textures, deep sky
blues, golden sunlight, terracotta, ochre, lapis blue and turquoise accents. Polished
casual-game look, high readability, lots of small narrative details (tools, ropes,
scaffolding, vegetation) but a calm focal area. No text, no letters, no logos, no
watermark, no existing game characters or brands. Original design.
```

---

## 1 · Fondos de nivel (los siete) — `fondo_01_piramide.jpg` … `fondo_07_faro.jpg`

Formato **horizontal 16:9 (1792×1024 o similar)**. La maravilla **no** aparece construida: solo el solar con sus cimientos y andamios (yo la voy levantando por encima con bloques). El centro y la derecha quedan tranquilos porque ahí va el tablero.

Plantilla (cambia lo que va entre corchetes):

```
[PROMPT DE ESTILO]

Wide landscape background illustration, 16:9. A construction site for [WONDER] in the
LEFT THIRD of the image: bare foundations, a few finished courses, wooden scaffolding,
ramps, ropes, stacks of building material ([MATERIAL]), tools. The CENTER and RIGHT of
the image is a calm, softly detailed landscape (low contrast, no strong shapes) because
a game board will be placed on top. Bottom 12% of the image is a flat dirt/stone work
road running left to right, clearly separated, where workers will walk. Ancient setting,
daytime, [CLIMA / LUZ]. No people, no animals in the foreground.
```

| Archivo | `[WONDER]` | `[MATERIAL]` | `[CLIMA / LUZ]` |
|---|---|---|---|
| `fondo_01_piramide` | the Great Pyramid of Giza (limestone casing partly done) | limestone blocks | hot desert, clear blue sky, Nile and palm trees far away |
| `fondo_02_jardines` | the Hanging Gardens of Babylon (stepped brick terraces) | mud-bricks | dry plain with the Euphrates river, soft morning light |
| `fondo_03_zeus` | the Statue of Zeus at Olympia (throne and marble pedestal, sanctuary around) | white marble blocks | green Greek hills, olive trees, afternoon light |
| `fondo_04_artemisa` | the Temple of Artemis at Ephesus (stepped platform, first columns) | cedar beams and marble drums | green coastal hills, sea in the distance |
| `fondo_05_mausoleo` | the Mausoleum at Halicarnassus (podium and first colonnade) | marble blocks | blue bay, white city and hills, warm light |
| `fondo_06_coloso` | the Colossus of Rhodes (large stone pedestal, bronze sheets and molds) | bronze plates and molds | harbour, deep blue sea, strong sunlight |
| `fondo_07_faro` | the Lighthouse of Alexandria (wide square base tiers) | cut stone | large harbour, ships far away, hazy golden light |

---

## 2 · Operarios (muy importante, hay que probar antes de pedir todos)

Los operarios caminan hasta donde cae el bloque y se lo llevan. Hay que **probar con uno** antes de hacer los demás; si el personaje sale distinto en cada fotograma, no sirve y lo dibujo yo en SVG.

### 2a · Un operario, hoja de caminar — `operario_caminar.png`
```
[PROMPT DE ESTILO]

Character sprite sheet of ONE ancient Mediterranean construction worker, realistic
proportions (not chibi, not cartoonish), side view facing right. Short linen tunic, rope
belt, leather sandals, sun-tanned skin, short dark hair with a cloth headband. Walking
cycle: 8 frames in a perfectly aligned grid of 4 columns by 2 rows, same character,
same scale, same colors in every frame, same ground line, nothing overlapping. Plain
solid #00FF00 green background, no shadows on the ground, no text.
```

### 2b · Mismo operario cargando un bloque — `operario_carga.png`
```
Same character as in the reference image, same style and proportions, now carrying a
square stone block on his shoulder with both hands. Walking cycle, 8 frames, grid of
4 columns by 2 rows, side view facing right, same scale in every frame. Plain solid
#00FF00 green background, no shadows on the ground, no text.
```
*(Adjunta la imagen 2a como referencia. Repite cambiando el bloque: `a stone block`, `a mud-brick`, `a white marble block`, `a wooden beam`, `a bronze plate` → `operario_carga_piedra`, `_ladrillo`, `_marmol`, `_madera`, `_bronce`.)*

### 2c · Variantes de personaje — `operario_b.png`, `operario_c.png`, `operario_d.png`
Mismo prompt 2a cambiando: *a woman with a headscarf and long apron*, *an older bearded man with a hat*, *a young man with bare torso and a loincloth*. Así hay cuatro tipos distintos por la pantalla.

### 2d · Poses sueltas (para animar yo el resto) — `operario_poses.png`
```
Same character, 6 separate poses on one sheet, side view, evenly spaced: standing idle,
bending down to lift a block, lifting with effort, setting a block down, wiping sweat
from the forehead, waving. Plain solid #00FF00 green background, no text.
```

---

## 3 · Marco del tablero y escenario — `marco_tablero.png`, `columnas.png`

```
[PROMPT DE ESTILO]

An ornate stone frame for a square puzzle board, front view, perfectly symmetrical,
square outer shape, thick carved sandstone with lapis-blue and gold inlay, simple
Greek-key pattern, subtle damage and age. The inside of the frame is completely empty
and flat dark teal (#1c3a44) so a grid can be placed on top. Plain solid #00FF00
green background around the frame, no text.
```

```
[PROMPT DE ESTILO]

A pair of tall ancient Greek Ionic columns, front view, slightly worn limestone,
vines, one column on each side of the image, with empty space between them. Plain
solid #00FF00 green background, no text.
```

---

## 4 · Material de los bloques (cinco) — `bloque_piedra.png`, `_ladrillo`, `_marmol`, `_madera`, `_bronce`

```
[PROMPT DE ESTILO]

A single square building block as a puzzle-game tile, slightly rounded corners,
three-quarter front view, thick outline, glossy highlight, carved details, [MATERIAL
DESCRIPTION]. It fills almost the whole square image, centered. Plain solid #00FF00
green background, no text.
```
`[MATERIAL DESCRIPTION]`: *rough sandy limestone with chisel marks* · *terracotta mud-brick with straw* · *polished white marble with grey veins* · *dark cedar planks bound with iron bands* · *cast bronze with green patina in the corners*.

Pide también la versión **agrietada** de cada uno (*the same block with a diagonal crack*) → `_grieta`.

---

## 5 · Las siete piezas (opcional; ahora las tengo en SVG) — `piezas.png`

```
[PROMPT DE ESTILO]

Set of 7 puzzle-game gem tiles on one sheet, 4 columns by 2 rows (last cell empty),
each tile the same size, each with a DIFFERENT silhouette and DIFFERENT main color so
they are distinguishable even in grayscale: 1 red-orange round sun disc; 2 golden
rounded-square ankh; 3 turquoise oval scarab beetle; 4 pink hexagonal lotus flower;
5 green rhombus laurel leaf; 6 blue octagonal eye of Horus; 7 violet arched amphora.
Carved gold-cream symbols on glossy faceted stone, thick dark outline. Plain solid
#00FF00 green background, no text.
```

---

## 6 · El asentamiento (menú) — `mapa_asentamiento.jpg` y edificios

### 6a · Mapa — `mapa_asentamiento.jpg` (16:9)
```
[PROMPT DE ESTILO]

Top-down three-quarter view of a small ancient village on green hills with a winding
dirt path, a river, palm and olive trees. Seven EMPTY clearings along the path, each
with a few foundation stones, evenly distributed (for ancient wonders to be added
later), and five small empty building plots near the village center. Bright, friendly,
detailed, daytime. No buildings finished, no people, no text.
```

### 6b · Edificios básicos (cada uno en su imagen, fondo verde) — `edif_casa.png`, `edif_pozo.png`, `edif_horno.png`, `edif_taller_marmol.png`, `edif_fundicion.png`
```
[PROMPT DE ESTILO]

A small ancient [BUILDING] in the same three-quarter view as the village map, a single
isolated building, detailed roof and walls, tiny props around it. Plain solid #00FF00
green background, no text.
```
`[BUILDING]`: *workers' stone-and-timber house with a flat roof* · *stone well with a pulley and bucket* · *brick kiln with smoke* · *marble workshop with carved column drums and tools* · *bronze foundry with a furnace and molds*.

---

## 7 · Título — `logo_wonder_iv.png`
```
[PROMPT DE ESTILO]

Game title lettering "WONDER IV" only, carved into a sandstone slab with gold inlay,
Roman-style capital letters, slight perspective, dramatic light, subtle cracks. Plain
solid #00FF00 green background.
```

---

## Notas
- Mantén la misma luz (sol arriba a la izquierda) en todas las imágenes.
- Los fondos tienen que verse bien **con el tablero encima**: si el centro sale muy cargado, pídele *"much calmer, lower contrast and blurred center"*.
- Si una imagen te gusta pero tiene un detalle que sobra, pídele a ChatGPT que lo cambie en lugar de regenerarla entera.
- Cuando me pases las imágenes, dime también **qué prompt usaste** para cada una (lo anoto en el repositorio, junto con la licencia).
