import { catalogo } from "./biblioteca.js";

// Contenedores
const contenedorSecciones = document.querySelector("#secciones");
const contenedorIndice = document.querySelector("#indice");
const contenedorEstadisticas = document.querySelector("#estadisticas");

const TEXTO_BUSQUEDA = "de";

// Variables para menú navegación
const seccionesPintadas = [];
let contadorSecciones = 0;

/**
 * Construye el elemento article que representa la tarjeta visual de un libro.
 * @param {import("./libro.js").Libro} libro - Objeto libro con los datos a mostrar.
 * @returns {HTMLElement} Elemento <article> listo para insertar en el DOM.
 */
function crearTarjetaLibro(libro) {

  // Determinamos la clase CSS y el texto según si el libro está libre o prestado
  const estadoClase = libro.disponible ? "disponible" : "prestado";
  const estadoTexto = libro.disponible ? "Disponible" : "Prestado";

  // Si el libro tiene fecha de devolución asignada, añadimos una fila con la fecha
  const filaDevolucion = libro.fechaDevolucion ? `<li>Devolución<span>${libro.fechaDevolucion.toLocaleDateString("es-ES")}</span></li>` : "";

  const articulo = document.createElement("article");
  articulo.className = `tarjeta-libro ${estadoClase}`;

  // Rellenamos la estructura interna de la tarjeta
  articulo.innerHTML = `
    <span class="etiqueta ${estadoClase}">${estadoTexto}</span>
    <div class="cabecera-libro">
      <div>
        <h3>${libro.titulo}</h3>
        <p class="autor">${libro.autor}</p>
      </div>
    </div>

    <ul class="lista-detalles">
      <li>Género<span>${libro.genero}</span></li>
      <li>Año<span>${libro.anio}</span></li>
      <li>Páginas<span>${libro.paginas}</span></li>
      ${filaDevolucion}
    </ul>
  `;

  return articulo;
}

/**
 * Crea una sección completa con su título y todas las tarjetas de los libros recibidos,
 * y la añade al contenedor de la página.
 * @param {string} titulo - Encabezado que mostrará la sección.
 * @param {import("./libro.js").Libro[]} lista - Array de libros a pintar en esta sección.
 * @returns {void}
 */
export function pintarSeccion(titulo, lista) {
  // Generamos un ID único para enlazarla desde el índice superior
  const id = `${contadorSecciones++}`;

  const seccion = document.createElement("section");
  seccion.className = "seccion-catalogo";
  seccion.id = id;

  const encabezado = document.createElement("h2");
  encabezado.className = "titulo-seccion";
  encabezado.textContent = titulo;
  seccion.appendChild(encabezado);

  // Si la lista no tiene libros, mostramos un mensaje informativo
  if (!lista || lista.length === 0) {
    const vacio = document.createElement("p");
    vacio.className = "mensaje-vacio";
    vacio.textContent = "No hay libros en esta sección";
    seccion.appendChild(vacio);
  } else {
    // Si hay libros, creamos el contenedor y añadimos cada tarjeta
    const grid = document.createElement("div");
    grid.className = "grid-catalogo";

    for (const libro of lista) {
      grid.appendChild(crearTarjetaLibro(libro));
    }
    seccion.appendChild(grid);
  }

  contenedorSecciones.appendChild(seccion);
  // Guardamos el ID y el título para generar el menú de navegación más adelante
  seccionesPintadas.push({ id, titulo });
}

/**
 * Simula varias operaciones de préstamo y devolución antes de dibujar la interfaz,
 * mostrando el resultado booleano de cada intento por la consola del navegador.
 * @returns {void}
 */
function simularPrestamos() {
  console.log("=== SIMULACIÓN DE PRÉSTAMOS ===");

  const disponiblesIniciales = catalogo.filtrarPorDisponibilidad(true);
  const yaPrestado = catalogo.filtrarPorDisponibilidad(false)[0];

  const p1 = disponiblesIniciales[0];
  const p2 = disponiblesIniciales[1];
  const p3 = disponiblesIniciales[2];

  // 1. Prestamos 3 libros disponibles (devolverán true)
  console.log(`Prestar "${p1.titulo}":`, p1.prestar());
  console.log(`Prestar "${p2.titulo}":`, p2.prestar());
  console.log(`Prestar "${p3.titulo}":`, p3.prestar());

  // 2. Devolvemos 1 de ellos (devolverá true)
  console.log(`Devolver "${p2.titulo}":`, p2.devolver());

  // 3. Intentamos prestar un libro que ya estaba prestado (devolverá false)
  console.log(`Intentar prestar "${yaPrestado.titulo}" (ya prestado):`, yaPrestado.prestar());
}

/**
 * Genera todas las vistas requeridas del catálogo en el orden establecido en el enunciado.
 * @returns {void}
 */
function pintarVistas() {
  // Limpiamos el contenedor y reiniciamos los contadores antes de pintar
  contenedorSecciones.innerHTML = "";
  seccionesPintadas.length = 0;
  contadorSecciones = 0;

  // 1. Catálogo completo, ordenado alfabéticamente por título
  const catalogoOrdenadoTitulo = catalogo.ordenarPor("titulo", true);
  pintarSeccion("Catálogo completo", catalogoOrdenadoTitulo);

  // 2. Libros disponibles y libros prestados
  const librosDisponibles = catalogo.filtrarPorDisponibilidad(true);
  const librosPrestados = catalogo.filtrarPorDisponibilidad(false);
  pintarSeccion("Libros disponibles", librosDisponibles);
  pintarSeccion("Libros prestados", librosPrestados);

  // 3. Secciones por cada género existente en el catálogo
  for (const genero of catalogo.generos()) {
    const librosPorGenero = catalogo.filtrarPorGenero(genero);
    pintarSeccion(`Género: ${genero}`, librosPorGenero);
  }

  // 4. Los 5 libros más antiguos
  const cincoMasAntiguos = catalogo.ordenarPor("anio", true).slice(0, 5);
  pintarSeccion("Los 5 libros más antiguos", cincoMasAntiguos);

  // 5. Vista combinada: poesías disponibles ordenadas de menor a mayor número de páginas
  const poesiasDisponiblesPorPaginas = 
    catalogo.ordenarPor("paginas", true)
    .filter((libro) => libro.genero.toLowerCase() === "poesía" && libro.disponible);
    
  pintarSeccion("Poesías disponibles ordenadas por páginas", poesiasDisponiblesPorPaginas);

  // 6. Resultados de búsqueda usando la constante TEXTO_BUSQUEDA
  const resultadosBusqueda = catalogo.buscar(TEXTO_BUSQUEDA);
  pintarSeccion(`Resultados de búsqueda: "${TEXTO_BUSQUEDA}"`, resultadosBusqueda);
}

/**
 * Genera los enlaces de navegación en la cabecera y rellena el panel de estadísticas.
 * @returns {void}
 */
function pintarIndiceYEstadisticas() {
  // Construimos la lista de enlaces internos (#seccion-0, #seccion-1...)
  let enlaces = "";
  for (const sec of seccionesPintadas) {
    enlaces += `<li><a href="#${sec.id}">${sec.titulo}</a></li>`;
  }
  contenedorIndice.innerHTML = `<ul class="indice-lista">${enlaces}</ul>`;

  // Obtenemos los cálculos estadísticos y los pintamos en una lista
  const estadisticas = catalogo.estadisticas();
  let items = `
    <li>Total de libros: ${estadisticas.totalLibros}</li>
    <li>Disponibles: ${estadisticas.disponibles}</li>
    <li>Prestados: ${estadisticas.prestados}</li>
    <li>Media de páginas: ${estadisticas.mediaPaginas}</li>
    <li>Libro más antiguo: ${estadisticas.libroMasAntiguo ? estadisticas.libroMasAntiguo.resumen() : "Ninguno"}</li>
    <li>Libro más prestado: ${estadisticas.libroMasPrestado ? estadisticas.libroMasPrestado.resumen() : "Ninguno"}</li>
  `;

  // Recorremos el Map de géneros para añadir el conteo de cada uno
  for (const [genero, cantidad] of estadisticas.porGenero) {
    items += `<li>Libros de ${genero}: ${cantidad}</li>`;
  }
  contenedorEstadisticas.innerHTML = `<ul class="lista-estadisticas">${items}</ul>`;
}


// 1. Mostramos en consola el estado inicial del catálogo
console.log("=== CATÁLOGO INICIAL ===");
catalogo.mostrarTabla();

// 2. Ejecutamos la simulación de préstamos y devoluciones
simularPrestamos();

// 3. Mostramos en consola cómo ha quedado el catálogo tras los movimientos
console.log("=== CATÁLOGO TRAS PRÉSTAMOS ===");
catalogo.mostrarTabla();

// 4. Pintamos todas las secciones, el menú superior y las estadísticas en la web
pintarVistas();
pintarIndiceYEstadisticas();