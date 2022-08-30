//clase producto
class Producto {
    constructor(id, nombre, precio, autor,cantidad, editorial,genero, imagen) {
        this.id = parseInt(id);
        this.nombre = nombre;
        this.precio = parseFloat(precio);
        this.autor = autor;
        this.cantidad = parseInt(cantidad);
        this.editorial = editorial;
        this.genero = genero;
        this.imagen = imagen;
    }

    agregarCantidad(valor) {
        this.cantidad += valor;
    }

    subtotal() {
        return this.cantidad * this.precio;
    }
}