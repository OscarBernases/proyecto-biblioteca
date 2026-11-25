import { Libro } from "./libro.js";

export class Biblioteca {
    libros = [];

    agregar(libro) {
        if (libro instanceof Libro) {
            this.libros.push(libro);
            return true;
        }
        return false;
    }

    cargarDesdeTexto(texto) {
        const lineas = texto.split("\n").filter((linea) => linea.trim() !== "");

        for (const linea of lineas) {
            const partes = linea.split(";");

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

    buscar(texto) {
        const t = texto.toLowerCase();
        return this.libros.filter(
            (libro) => libro.titulo.toLowerCase().includes(t) || libro.autor.toLowerCase().includes(t)
        );
    }

    filtrarPorGenero(genero) {
        return this.libros.filter((libro) => libro.genero === genero);
    }

    filtrarPorDisponibilidad(disponible) {
        return this.libros.filter((libro) => libro.disponible === disponible);
    }

    ordenarPor(campo, ascendente = true) {
        const copia = [...this.libros];
        copia.sort((a, b) => {let comparacion = 0;
            if (typeof a[campo] === "string") {
                comparacion = a[campo].localeCompare(b[campo], "es", { sensitivity: "base" });
            } else {
                comparacion = a[campo] - b[campo];
            }
            return ascendente ? comparacion : -comparacion;});
        return copia;
    }

    generos() {
        const generos = new Set();
        for (const libro of this.libros) {
            generos.add(libro.genero);
        }
        return Array.from(generos);
    }

    estadisticas() {
        const totalLibros = this.libros.length;
        const disponibles = this.filtrarPorDisponibilidad(true).length;
        const prestados = this.filtrarPorDisponibilidad(false).length;

        const mapaGeneros = new Map();
        for (const genero of this.generos()) {
            mapaGeneros.set(genero, this.filtrarPorGenero(genero).length);
        }

        const sumaPaginas = this.libros.reduce((acc, libro) => acc + libro.paginas, 0);
        const mediaPaginas = totalLibros > 0 ? Math.round(sumaPaginas / totalLibros) : 0;

        const libroMasAntiguo = this.libros.reduce(
            (masAntiguo, libro) => (!masAntiguo || libro.anio < masAntiguo.anio ? libro : masAntiguo),
            null
        );

        return {
            totalLibros,
            disponibles,
            prestados,
            mediaPaginas,
            libroMasAntiguo,
            porGenero: mapaGeneros
        };
    }
}

export const catalogo = new Biblioteca();

catalogo.agregar(new Libro("El Quijote", "Miguel de Cervantes", 1605, 1250, "novela"));
catalogo.agregar(new Libro("La casa de Bernarda Alba", "Federico García Lorca", 1945, 120, "teatro", false));
catalogo.agregar(new Libro("Niebla", "Miguel de Unamuno", 1914, 280, "novela"));
catalogo.agregar(new Libro("Rimas y leyendas", "Gustavo Adolfo Bécquer", 1871, 210, "poesía"));
catalogo.agregar(new Libro("Bodas de sangre", "Federico García Lorca", 1933, 110, "teatro", false));
catalogo.agregar(new Libro("En torno al casticismo", "Miguel de Unamuno", 1902, 240, "ensayo"));
catalogo.agregar(new Libro("La Regenta", "Leopoldo Alas «Clarín»", 1885, 890, "novela"));
catalogo.cargarDesdeTexto(`Luces de bohemia;Ramón del Valle-Inclán;1924;160;teatro;si
Campos de Castilla;Antonio Machado;1912;180;poesía;si
La colmena;Camilo José Cela;1951;340;novela;no
Meditaciones del Quijote;José Ortega y Gasset;1914;190;ensayo;si
Platero y yo;Juan Ramón Jiménez;1914;150;poesía;si`);