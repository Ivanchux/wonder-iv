# Registro de cambios

## 1.3 · El asentamiento
- **El menú es tu pueblo.** Las siete maravillas se levantan en el mapa según las completas, con estrellas, candado y una flecha en la siguiente. Los materiales que entregan los obreros van al almacén (`wonder_stock`).
- **Cinco edificios** (casa de obreros, pozo, horno de ladrillos, taller de mármol y fundición), cada uno con dos niveles: se mejoran con su material y dan una ventaja al empezar cada obra (+2 movimientos, +1 Revolver, +1 Bomba, +1 Rayo, +1 Aurora por nivel). Se guardan en `wonder_build`.
- Si pierdes una obra te quedas con la mitad de lo que habías entregado.
- El mapa, los edificios y las maravillas se dibujan en SVG (`js/asentamiento.js`); el mapa se desliza hacia los lados en el móvil.

## 1.2 · Fase 2: el nivel se rehace
- **Bloques de material dentro de la cuadrícula** (piedra, ladrillo, mármol, madera y bronce): no se mueven ni se combinan. Caen a medida que se despeja lo que tienen debajo y, al llegar a las dos filas de abajo, salen del tablero. Algunos valen dos bloques.
- **Operarios** ilustrados que salen al camino, andan hasta donde cayó el bloque, lo levantan en brazos y lo llevan a la obra. Cuatro personajes y hojas de 8 fotogramas (`img/obreros/`).
- **Un fondo propio para cada maravilla** (`img/fondos/`) y un montón de bloques entregados al pie de la obra.
- **Arte propio** para las siete piezas, las dos especiales, los cinco bloques, el marco del tablero y la columna (`img/`), con las herramientas `tools/build-art.py` y `tools/build-sprites.py`.
- **Siete maravillas** clásicas (Gran Pirámide, Jardines Colgantes, Estatua de Zeus, Templo de Artemisa, Mausoleo de Halicarnaso, Coloso de Rodas y Faro de Alejandría). Desaparecen las eras, los objetivos por tipo de pieza, el arte ASCII y las partículas.
- **Pantalla de nivel nueva:** fondo a pantalla completa, tablero entre dos columnas, marcador vertical de movimientos y poderes a la derecha; en el móvil se apila (el panel de movimientos y poderes ya no queda fuera de pantalla).
- La pista sugiere la jugada que despeja más suelo bajo un bloque.
- Una gema especial suelta ya no da el tablero por «sin movimientos» y el «revolver» no deja combinaciones hechas.
- Las tareas pendientes de una obra anterior se descartan al cambiar de nivel o reiniciar.
- Equilibrio inicial: de 40 a 60 movimientos por nivel, a falta de probar con personas.
- Se sustituye el bot de pruebas del motor antiguo por `tools/prueba/jugar.mjs`.

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
