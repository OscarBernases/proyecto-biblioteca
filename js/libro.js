/**
 * Representa un libro individual dentro del catálogo de la biblioteca.
 */
export class Libro {
  /**
   * Crea una nueva instancia de un libro.
   * @param {string} titulo - Título de la obra.
   * @param {string} autor - Nombre del autor o autora.
   * @param {number} anio - Año de publicación original.
   * @param {number} paginas - Número total de páginas.
   * @param {string} genero - Género literario (novela, teatro, poesía, ensayo...).
   * @param {boolean} [disponible=true] - Indica si el libro está libre para prestar (por defecto true).
   */
  constructor(titulo, autor, anio, paginas, genero, disponible = true) {
    this.titulo = titulo;
    this.autor = autor;
    this.anio = anio;
    this.paginas = paginas;
    this.genero = genero;
    this.disponible = disponible;
    // Ampliacion
    this.fechaDevolucion = null;
    this.vecesPrestado = 0;
  }

  /**
   * Marca el libro como prestado si está disponible, suma 1 al contador de préstamos
   * y calcula la fecha de devolución a 15 días desde que se realiza.
   * @returns {boolean} Devuelve true si se pudo prestar, o false si ya estaba prestado.
   */
  prestar() {
    if (this.disponible) { // Comprobamos que está disponible
      this.disponible = false;
      this.vecesPrestado++;

      // Creamos la fecha de hoy y le sumamos 15 días
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + 15);
      this.fechaDevolucion = fecha;

      return true;
    }

    return false;
  }

  /**
   * Marca un libro prestado como disponible de nuevo y pone en null su fecha de devolución.
   * @returns {boolean} Devuelve true si se devolvió correctamente, o false si ya estaba libre.
   */
  devolver() {
    if (!this.disponible) { // Comprobamos que está prestado
      this.disponible = true;
      this.fechaDevolucion = null;
      return true;
    }
    return false;
  }

  /**
   * Calcula los años que han pasado desde la publicación del libro hasta el año actual.
   * @returns {number} Antigüedad del libro en años.
   */
  antiguedad() {
    const fechaActual = new Date();
    return fechaActual.getFullYear() - this.anio;
  }

  /**
   * Genera una cadena de texto con los datos principales del libro.
   * @returns {string} Texto con el formato «Titulo — Autor (Año)».
   */
  resumen() {
    return `${this.titulo} — ${this.autor} (${this.anio})`;
  }
}