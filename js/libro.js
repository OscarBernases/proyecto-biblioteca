export class Libro {
  constructor(titulo, autor, anio, paginas, genero, disponible = true) {
    this.titulo = titulo;
    this.autor = autor;
    this.anio = anio;
    this.paginas = paginas;
    this.genero = genero; // Añadido el atributo genero
    this.disponible = disponible;
  }

  prestar() {
    // TODO: Contar prestamos y añadir fecha devolución.
    if (this.disponible) {
      this.disponible = false;
      return true;
    }
    return false;
  }

  devolver() {
    if (!this.disponible) {
      this.disponible = true;
      return true;
    }
    return false;
  }

  antiguedad() {
    const fechaActual = new Date();
    const antiguedad = fechaActual.getFullYear() - this.anio;
    return antiguedad;
    
  }

  resumen() {
    return `${this.titulo} — ${this.autor} (${this.anio})`;
  }
}
