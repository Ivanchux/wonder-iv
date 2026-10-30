# Registro de cambios

## 1.2 · Fase 2: el nivel se rehace
- **Bloques de material dentro de la cuadrícula** (piedra, ladrillo, mármol, madera y bronce): no se mueven ni se combinan. Caen a medida que se despeja lo que tienen debajo y, al llegar a las dos filas de abajo, salen del tablero. Algunos valen dos bloques.
- **Operarios** que aparecen en el camino, andan hasta donde cayó el bloque, lo levantan y lo llevan hasta la maravilla, que está de fondo y crece con cada bloque entregado. No hay pantalla aparte.
- La pista sugiere la jugada que despeja más celdas bajo un bloque.
- **Siete maravillas** clásicas (Gran Pirámide, Jardines Colgantes, Estatua de Zeus, Templo de Artemisa, Mausoleo de Halicarnaso, Coloso de Rodas y Faro de Alejandría), dibujadas en SVG por bloques en `js/maravillas.js`. Desaparecen las eras, los objetivos por tipo de pieza y el arte ASCII.
- **Pantalla de nivel nueva:** maravilla de fondo a la izquierda, tablero entre dos columnas, marcador vertical de movimientos, marcadores de pergamino, poderes a la derecha y camino de operarios abajo. En el móvil se apila.
- Los materiales recogidos se guardan en el navegador (`wonder_stock`) para el asentamiento.
- Se corrige que una gema de línea o de área sola diera el tablero por «sin movimientos», y el «revolver» ya no deja combinaciones hechas.

## 1.1 · Fase 1 visual: maravillas antiguas
- Siete piezas nuevas de piedra tallada, con color, silueta y símbolo distintos: sol, anj, escarabajo, loto, laurel, ojo y ánfora. Las gemas de línea y de área también se rediseñan (sello alado y sol radiante).
- Tablero en una losa con marco de lapislázuli y oro, marcadores y botones de cartucho dorado, paneles de pergamino y tablilla tallada para la maravilla.
- Paisaje de fondo (cielo, colinas, templo y columnas) y operarios que pasean por un camino en la parte baja, en SVG propio. Los operarios se quedan quietos con `prefers-reduced-motion`.
- Cinzel incluida en el repositorio (OFL): se elimina la importación de Google Fonts y con ella la única petición a un tercero.
- La jugabilidad, los niveles y el motor no cambian.

## Presentación
- Banner propio de cada juego, hecho con su arte (no una captura con panel).
- README con banner, capturas de PC y móvil, GIFs, tabla de maravillas y detalles técnicos.
- Icono propio de la página (una pirámide) en lugar del de RETROTERM.AI, más icono de 512 px y de pantalla de inicio.
- Metaetiquetas para compartir el enlace.

## 1.0 · Separado de RETROTERM.AI
- Wonder IV pasa a ser un repositorio independiente.
- 8 maravillas con 3 eras cada una, gemas de línea y de área, 4 poderes especiales y estrellas según los movimientos sobrantes.
- Récord y estrellas guardados en el navegador.
