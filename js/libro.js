export class Libro {
  constructor(titulo, autor, anio, paginas, genero, disponible = true) {
    this.titulo = titulo;
    this.autor = autor;
    this.anio = anio;
    this.paginas = paginas;
    this.genero = genero;
    this.disponible = disponible;
  }

  prestar() {
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
    return fechaActual.getFullYear() - this.anio;
  }

  resumen() {
    return `${this.titulo} — ${this.autor} (${this.anio})`;
  }
}