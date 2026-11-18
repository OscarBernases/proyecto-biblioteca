import { Libro } from "./libro.js";

export class Biblioteca {

    libros = [];

    agregar(libro) {
        if (libro instanceof Libro) {
            this.libros.push(libro);
            return true;
        } else {
            return false;
        }
    }
    
    cargarDesdeTexto(texto) {
        const lineas = texto.split("\n"); // Dividir el texto en líneas por cada salto de línea

        for (const linea of lineas) {

            const partes = linea.split(";");

            const titulo = partes[0].trim;
            const autor = partes[1].trim;
            const anio = partes[2].trim;
            const paginas = partes[3].trim;
            const disponible = partes[4].trim().toLowerCase() === "si";;
            const genero = partes[5].trim;

            const libro = new Libro(titulo, autor, parseInt(anio), parseInt(paginas), disponible, genero);

            this.agregar(libro);
        }
    }

    buscar(texto) {
        const t = texto.toLowerCase();
        const libros = this.libros.filter((libro) => libro.titulo.toLowerCase().includes(t) || libro.autor.toLowerCase().includes(t));
        return libros;
    }

    // Auxiliar
    mostrarLibros() {
        for (const libro of this.libros) {
            console.log(libro.resumen());
        }
    }

    filtrarPorGenero(genero) {
        const librosPorGenero = this.libros.filter(libro => libro.genero === genero);
        return librosPorGenero;
    }

    filtrarPorDisponibilidad(disponible) {
        const filtrados = this.libros.filter(libro => libro.disponible === disponible);
        return filtrados;
    }

    generos() {
        const generos = new Set();
        for (const libro of this.libros) {
            generos.add(libro.genero);
        }
        return Array.from(generos);
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

catalogo.mostrarLibros()