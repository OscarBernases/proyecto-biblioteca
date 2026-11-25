import { catalogo } from "./biblioteca.js";

const contenedorSecciones = document.querySelector("#secciones");
const contenedorIndice = document.querySelector("#indice");
const contenedorEstadisticas = document.querySelector("#estadisticas");

const TEXTO_BUSQUEDA = "de";

const seccionesPintadas = [];
let contadorSecciones = 0;

function crearTarjetaLibro(libro) {
    const estadoClase = libro.disponible ? "disponible" : "prestado";
    const estadoTexto = libro.disponible ? "Disponible" : "Prestado";

    const articulo = document.createElement("article");
    articulo.className = `tarjeta-libro ${estadoClase}`;

    articulo.innerHTML = `
        <span class="badge ${estadoClase}">${estadoTexto}</span>
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
        </ul>
    `;

    return articulo;
}

export function pintarSeccion(titulo, lista) {
    const id = `seccion-${contadorSecciones++}`;

    const seccion = document.createElement("section");
    seccion.className = "seccion-catalogo";
    seccion.id = id;

    const encabezado = document.createElement("h2");
    encabezado.className = "titulo-seccion";
    encabezado.textContent = titulo;
    seccion.appendChild(encabezado);

    if (!lista || lista.length === 0) {
        const vacio = document.createElement("p");
        vacio.className = "mensaje-vacio";
        vacio.textContent = "No hay libros en esta sección";
        seccion.appendChild(vacio);
    } else {
        const grid = document.createElement("div");
        grid.className = "grid-catalogo";

        for (const libro of lista) {
            grid.appendChild(crearTarjetaLibro(libro));
        }
        seccion.appendChild(grid);
    }

    contenedorSecciones.appendChild(seccion);
    seccionesPintadas.push({ id, titulo });
}

function simularPrestamos() {
    console.log("=== SIMULACIÓN DE PRÉSTAMOS ===");

    const disponiblesIniciales = catalogo.filtrarPorDisponibilidad(true);
    const yaPrestado = catalogo.filtrarPorDisponibilidad(false)[0];

    const p1 = disponiblesIniciales[0];
    const p2 = disponiblesIniciales[1];
    const p3 = disponiblesIniciales[2];

    console.log(`Prestar "${p1.titulo}":`, p1.prestar());
    console.log(`Prestar "${p2.titulo}":`, p2.prestar());
    console.log(`Prestar "${p3.titulo}":`, p3.prestar());
    console.log(`Devolver "${p2.titulo}":`, p2.devolver());
    console.log(`Intentar prestar "${yaPrestado.titulo}" (ya prestado):`, yaPrestado.prestar());
}

function pintarVistas() {
    contenedorSecciones.innerHTML = "";
    seccionesPintadas.length = 0;
    contadorSecciones = 0;

    // 1. Catálogo completo, ordenado por título
    const catalogoOrdenadoTitulo = catalogo.ordenarPor("titulo", true);
    pintarSeccion("Catálogo completo", catalogoOrdenadoTitulo);

    // 2. Libros disponibles y libros prestados
    const librosDisponibles = catalogo.filtrarPorDisponibilidad(true);
    const librosPrestados = catalogo.filtrarPorDisponibilidad(false);

    pintarSeccion("Libros disponibles", librosDisponibles);
    pintarSeccion("Libros prestados", librosPrestados);

    // 3. Una sección por género usando generos()
    for (const genero of catalogo.generos()) {
        const librosPorGenero = catalogo.filtrarPorGenero(genero);
        pintarSeccion(`Género: ${genero}`, librosPorGenero);
    }

    // 4. Los 5 libros más antiguos
    const cincoMasAntiguos = catalogo.ordenarPor("anio", true).slice(0, 5);
    pintarSeccion("Los 5 libros más antiguos", cincoMasAntiguos);

    // 5. Vista combinada: poesías disponibles ordenadas por páginas
    const poesiasDisponiblesPorPaginas = catalogo.ordenarPor("paginas", true)
        .filter((libro) => libro.genero.toLowerCase() === "poesía" && libro.disponible);

    pintarSeccion("Poesías disponibles ordenadas por páginas", poesiasDisponiblesPorPaginas);

    // 6. Resultados de búsqueda con TEXTO_BUSQUEDA
    const resultadosBusqueda = catalogo.buscar(TEXTO_BUSQUEDA);
    pintarSeccion(`Resultados de búsqueda: "${TEXTO_BUSQUEDA}"`, resultadosBusqueda);
}


function pintarIndiceYEstadisticas() {
    let enlaces = "";
    for (const sec of seccionesPintadas) {
        enlaces += `<li><a href="#${sec.id}">${sec.titulo}</a></li>`;
    }
    contenedorIndice.innerHTML = `<ul class="indice-lista">${enlaces}</ul>`;

    const stats = catalogo.estadisticas();
    let items = `
        <li>Total de libros: ${stats.totalLibros}</li>
        <li>Disponibles: ${stats.disponibles}</li>
        <li>Prestados: ${stats.prestados}</li>
        <li>Media de páginas: ${stats.mediaPaginas}</li>
        <li>Libro más antiguo: ${stats.libroMasAntiguo ? stats.libroMasAntiguo.resumen() : "Ninguno"}</li>
    `;
    for (const [genero, cantidad] of stats.porGenero) {
        items += `<li>Libros de ${genero}: ${cantidad}</li>`;
    }
    contenedorEstadisticas.innerHTML = `<ul class="lista-estadisticas">${items}</ul>`;
}

// Comprobación inicial de datos en consola
console.log("=== CATÁLOGO INICIAL ===");
console.table(catalogo.libros);

simularPrestamos();

console.log("=== CATÁLOGO TRAS PRÉSTAMOS ===");
console.table(catalogo.libros);

pintarVistas();
pintarIndiceYEstadisticas();