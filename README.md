# Proyecto Biblioteca de Óscar Bernases de la Torre (DEC + DIW)

## Estructura

```
proyecto-biblioteca/
├── index.html
├── README.md
├── css/estilos.css
├── img/
│   ├── aplicacion.png
│   ├── consola.png
│   └── w3.png
└── js/
    ├── libro.js
    ├── biblioteca.js
    └── app.js
```

## Capturas

* Captura de la aplicación: `![Aplicación](img/aplicacion.png)`
* Captura de la consola: `![Consola](img/02_consola.png)`
* Captura del validador del W3C sin errores: `![Validador W3C](img/03_W3.png)`

## Arquitectura

Todo el código de esta aplicación se ejecuta en el navegador. Los datos del catálogo y los préstamos viven en memoria, así que al recargar la página se pierden. Para que los préstamos se guardaran haría falta un servidor con una base de datos y una API a la que el navegador enviara cada movimiento.

Se usa JavaScript porque es el lenguaje que ejecutan de forma nativa todos los navegadores para manipular el DOM. Como tecnologías de cliente existen también HTML y CSS (estructura y presentación), TypeScript (que se compila a JavaScript) y WebAssembly.

Al cargar los scripts como módulos (`type="module"`), cada archivo tiene su propio ámbito, sus variables no son globales y se comparten con `export` e `import`. Se cargan de forma diferida y el navegador los pide por HTTP, por eso no funcionan abriendo el HTML con doble clic (`file://`) y hace falta un servidor local como Live Server.

Un lenguaje interpretado en el navegador no necesita compilar ni instalar nada y funciona en cualquier sistema, pero suele ser menos rápido que un programa compilado y los errores aparecen al ejecutar.

Herramientas usadas: Visual Studio Code para programar, Live Server para probar, las herramientas de desarrollo del navegador (consola y depurador) para depurar, Git y GitHub para el control de versiones y el validador del W3C para comprobar el HTML.

## Decisiones

**Cómo combino los filtros.** Los métodos de `Biblioteca` devuelven arrays de libros, así que se pueden encadenar. Para «poesías disponibles ordenadas por páginas» primero llamo a `ordenarPor("paginas", true)` para obtener una copia ordenada y sobre ese resultado aplico `.filter()` comprobando que el género sea `"poesía"` y `disponible` sea `true`. Como cada paso trabaja sobre un nuevo array, el catálogo original `#libros` no se altera.

**Cómo ordeno sin modificar el array original.** El método `sort()` modifica el array sobre el que se llama, así que `ordenarPor` primero hace una copia con `[...this.#libros]` y ordena esa copia. Para título y autor comparo con `localeCompare` (que respeta tildes y eñes) y para año y páginas resto los valores, invirtiendo el signo de la comparación si el orden es descendente (`ascendente = false`). Además, al ser `#libros` privado, expongo `mostrarTabla()` para poder inspeccionarlo por consola con `console.table()`.

**Cómo convierto los campos de texto en `cargarDesdeTexto()`.** Separo el texto en líneas con `split("\n")` descartando las vacías, y cada línea en campos con `split(";")`, quitando espacios sobrantes con `trim()`. Como todos los campos llegan como texto, convierto año y páginas a entero con `parseInt(..., 10)` y el último campo con `disponible.toLowerCase() === "si"`, que devuelve directamente `true` o `false`.