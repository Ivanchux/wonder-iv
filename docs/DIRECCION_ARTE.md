# Wonder IV · propuesta de dirección de arte

Esto es una **propuesta**, no cambia el juego. Las imágenes de `docs/direccion-arte/` son maquetas generadas por código para ver el rumbo: `mock-partida.png` (pantalla de partida) y `mock-piezas.png` (las siete piezas y una pieza infectada). El código de las piezas está en `gemas-propuesta.js`.

## Hacia dónde
Pasar de «terminal arqueológica» (ASCII ámbar sobre negro) a una ambientación de **las siete maravillas del mundo antiguo con una invasión alienígena**: piedra tallada, lapislázuli, oro, turquesa y terracota, noche de desierto, marcos dorados en forma de cartucho.

## Maravillas (7 niveles)
Ahora hay 8 niveles con maravillas «digitales». La lista clásica antigua tiene siete:

1. Gran Pirámide de Guiza
2. Jardines Colgantes de Babilonia
3. Estatua de Zeus en Olimpia
4. Templo de Artemisa en Éfeso
5. Mausoleo de Halicarnaso
6. Coloso de Rodas
7. Faro de Alejandría

Habría que quitar «El Oráculo» y repartir los 8 niveles actuales en 7. Las eras, los objetivos y los movimientos de `js/data.js` se pueden conservar.

## Piezas (siguen siendo 7 tipos)
Escarabajo, anj, ojo de Horus, loto, disco solar, ánfora y columna. Cada una es una piedra tallada con incrustación de color y símbolo dorado, dibujada en SVG, sin imágenes externas.

## La maravilla se construye con bloques
Sustituye al arte ASCII: cada etapa coloca una hilera de bloques sobre la silueta punteada de la maravilla. Para la pirámide ya hay maqueta; las otras seis serían escenas SVG propias.

## Capa alienígena (por decidir)
La maqueta enseña una idea, no una decisión:
- **Pieza infectada:** una nave marca piezas con glifos; se limpian combinando una pieza junto a ellas.
- **Bloques robados:** el rayo de la nave se lleva bloques ya colocados y se recuperan combinando.

Las dos añaden jugabilidad y habría que equilibrarlas. La trama, los nombres y los textos son tuyos: aquí no se escribe nada narrativo.

## Técnica
- Sin librerías ni motores. Todo en HTML, CSS y SVG, como ahora.
- Tipografía: Cinzel (licencia OFL) incluida en el repositorio. Quita la única petición a Google Fonts.
- Sonido: hoy no hay. Propongo música y efectos sintetizados con Web Audio, como en los otros juegos.
- Arte original: la ambientación es histórica y no copia el arte, los nombres ni los diseños de ningún juego.

## Fases
(La fase 1 está hecha: piezas, marco, marcadores, paisaje y operarios. Los textos y el arte ASCII de las maravillas siguen siendo los de antes.)
1. **Piezas, marco y HUD** (CSS y `js/data.js`).
2. **Las siete maravillas** como escenas de bloques.
3. **Capa alienígena**, si la quieres.
4. **Sonido, teclado, pausa y paquete para itch.io.**
