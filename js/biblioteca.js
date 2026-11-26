import { Libro } from "./libro.js";

/**
 * Gestiona la colección de libros de la biblioteca y ofrece métodos
 * para buscar, filtrar, ordenar y calcular estadísticas.
 */
export class Biblioteca {
  // Array privado por convención donde se almacenan los objetos Libro
  #libros = [];

  /**
   * Añade un libro al catálogo comprobando antes que sea un objeto de tipo Libro.
   * @param {Libro} libro - Instancia de la clase Libro a añadir.
   * @returns {boolean} True si se añadió correctamente, false si el dato no era un Libro.
   */
  agregar(libro) {
    if (libro instanceof Libro) {
      this.#libros.push(libro);
      return true;
    }
    return false;
  }

  /**
   * Importa múltiples libros a partir de un bloque de texto estructurado.
   * Cada línea representa un libro con sus datos separados por punto y coma (;).
   * @param {string} texto - Texto multilínea con formato: titulo;autor;anio;paginas;genero;si/no
   * @returns {void}
   */
  cargarDesdeTexto(texto) {
    // Dividimos el texto por saltos de línea y descartamos las líneas que estén en blanco con filter
    const lineas = texto.split("\n").filter((linea) => linea.trim() !== "");

    for (const linea of lineas) {
      // Separamos cada dato de la línea usando el punto y coma
      const partes = linea.split(";");

      // Limpiamos espacios sobrantes (.trim()) y convertimos cada dato a su tipo real
      const titulo = partes[0].trim();
      const autor = partes[1].trim();
      const anio = parseInt(partes[2].trim(), 10);
      const paginas = parseInt(partes[3].trim(), 10);
      const genero = partes[4].trim();
      const disponible = partes[5].trim().toLowerCase() === "si";

      const libro = new Libro(titulo, autor, anio, paginas, genero, disponible);
      this.agregar(libro);
    }
  }

  /**
   * Busca libros cuyo título o autor contengan el texto indicado (sin importar mayúsculas/minúsculas).
   * @param {string} texto - Cadena de búsqueda.
   * @returns {Libro[]} Nuevo array con los libros que coinciden con la búsqueda.
   */
  buscar(texto) {
    const termino = texto.toLowerCase();
    return this.#libros.filter(
      (libro) =>
        libro.titulo.toLowerCase().includes(termino) || libro.autor.toLowerCase().includes(termino));
  }

  /**
   * Filtra el catálogo devolviendo únicamente los libros de un género concreto.
   * @param {string} genero - Nombre del género a filtrar.
   * @returns {Libro[]} Nuevo array con los libros de ese género.
   */
  filtrarPorGenero(genero) {
    return this.#libros.filter((libro) => libro.genero === genero);
  }

  /**
   * Filtra el catálogo según si los libros están disponibles o prestados.
   * @param {boolean} disponible - True para obtener disponibles, false para prestados.
   * @returns {Libro[]} Nuevo array con los libros que cumplen ese estado.
   */
  filtrarPorDisponibilidad(disponible) {
    return this.#libros.filter((libro) => libro.disponible === disponible);
  }

  /**
   * Devuelve una copia ordenada del catálogo sin alterar el orden del array original.
   * @param {string} campo - Propiedad por la que ordenar ('titulo', 'autor', 'anio', 'paginas').
   * @param {boolean} [ascendente=true] - True para orden ascendente (A-Z / menor a mayor), false para descendente.
   * @returns {Libro[]} Nuevo array ordenado.
   */
  ordenarPor(campo, ascendente = true) {
    // Usamos el operador [...] para clonar el array y no mutar this.libros
    const copia = [...this.#libros];

    copia.sort((a, b) => {
      let comparacion = 0;
      if (typeof a[campo] === "string") {
        // localeCompare ordena alfabéticamente respetando tildes y eñes del español
        comparacion = a[campo].localeCompare(b[campo], "es", { sensitivity: "base" });
      } else {
        // Resta simple para ordenar valores numéricos (año o páginas)
        comparacion = a[campo] - b[campo];
      }
      // Si ascendente es false, invertimos el signo del resultado
      return ascendente ? comparacion : -comparacion;
    });

    return copia;
  }

  /**
   * Obtiene la lista de todos los géneros literarios presentes en el catálogo sin duplicados.
   * @returns {string[]} Array con los nombres de los géneros únicos.
   */
  generos() {
    // Un Set es una estructura de JavaScript que automáticamente ignora valores repetidos
    const conjuntoGeneros = new Set();
    for (const libro of this.#libros) {
      conjuntoGeneros.add(libro.genero);
    }
    // Convertimos el Set de vuelta a un Array normal
    return Array.from(conjuntoGeneros);
  }

  /**
   * Calcula un resumen estadístico completo del estado actual de la biblioteca.
   * @returns {Object} Objeto con totales, media de páginas, libro más antiguo, más prestado y conteo por género.
   */
  estadisticas() {
    const totalLibros = this.#libros.length;
    const disponibles = this.filtrarPorDisponibilidad(true).length;
    const prestados = this.filtrarPorDisponibilidad(false).length;

    // Usamos un Map para asociar cada género (clave) con su cantidad de libros (valor)
    const mapaGeneros = new Map();
    for (const genero of this.generos()) {
      mapaGeneros.set(genero, this.filtrarPorGenero(genero).length);
    }

    // reduce() recorre todo el array acumulando la suma de páginas en "acc"
    const sumaPaginas = this.#libros.reduce((acc, libro) => acc + libro.paginas, 0);
    const mediaPaginas = totalLibros > 0 ? Math.round(sumaPaginas / totalLibros) : 0;

    // reduce() compara cada libro con el más antiguo encontrado hasta ese momento
    const libroMasAntiguo = this.#libros.reduce(
      (masAntiguo, libro) => (!masAntiguo || libro.anio < masAntiguo.anio ? libro : masAntiguo),
      null
    );

    // reduce() busca el libro con mayor número de veces prestado
    const libroMasPrestado = this.#libros.reduce(
      (max, libro) => (!max || libro.vecesPrestado > max.vecesPrestado ? libro : max),
      null
    );

    return {
      totalLibros,
      disponibles,
      prestados,
      mediaPaginas,
      libroMasAntiguo,
      libroMasPrestado,
      porGenero: mapaGeneros
    };
  }

  mostrarTabla() {
    console.table(this.#libros);
  }
  
}


// Instancia principal del catálogo que se exportará hacia app.js
export const catalogo = new Biblioteca();

// Carga manual de los primeros 7 libros
catalogo.agregar(new Libro("El Quijote", "Miguel de Cervantes", 1605, 1250, "novela"));
catalogo.agregar(new Libro("La casa de Bernarda Alba", "Federico García Lorca", 1945, 120, "teatro", false));
catalogo.agregar(new Libro("Niebla", "Miguel de Unamuno", 1914, 280, "novela"));
catalogo.agregar(new Libro("Rimas y leyendas", "Gustavo Adolfo Bécquer", 1871, 210, "poesía"));
catalogo.agregar(new Libro("Bodas de sangre", "Federico García Lorca", 1933, 110, "teatro", false));
catalogo.agregar(new Libro("En torno al casticismo", "Miguel de Unamuno", 1902, 240, "ensayo"));
catalogo.agregar(new Libro("La Regenta", "Leopoldo Alas «Clarín»", 1885, 890, "novela"));

// Carga masiva de 5 libros desde texto plano separado por punto y coma
catalogo.cargarDesdeTexto(`Luces de bohemia;Ramón del Valle-Inclán;1924;160;teatro;si
Campos de Castilla;Antonio Machado;1912;180;poesía;si
La colmena;Camilo José Cela;1951;340;novela;no
Meditaciones del Quijote;José Ortega y Gasset;1914;190;ensayo;si
Platero y yo;Juan Ramón Jiménez;1914;150;poesía;si`);