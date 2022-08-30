//FUNCION QUE SE EJECUTA CUANDO SE CARGA EL DOM
$(document).ready(function () {
    if("CARRITO" in localStorage){
        const arrayLiterales = JSON.parse(localStorage.getItem("CARRITO"));
        if(arrayLiterales.length > 0){
            for (const literal of arrayLiterales) {
                carrito.push(new Producto(literal.id, literal.nombre, literal.precio, literal.autor,literal.cantidad, literal.editorial, literal.genero, literal.imagen));
            }
            //console.log(carrito);
            carritoUI(carrito);
        }
    }
    $(".dropdown-menu").click(function (e) { 
        e.stopPropagation();
    });
    $.get('data/producto.json',function(datos, estado){
        console.log(datos);
        console.log(estado);
        if(estado == 'success'){
            for (const literal of datos) {
                productos.push(new Producto(literal.id, literal.nombre, literal.precio, literal.autor,literal.cantidad, literal.editorial, literal.genero, literal.imagen));
            }
        }
        console.log(productos);
        productosUI(productos, '#productosContenedor');
    });
});
window.addEventListener('load',()=>{
    $('#indicadorCarga').remove();
    $('#productosContenedor').fadeIn("slow");
})
//GENERAR OPCIONES PARA FILTRAR POR CATEGORIA
selectUI(categorias,"#filtroCategorias");
//DEFINIR EVENTOS SOBRE EL SELECT GENERADO
$('#filtroCategorias').change(function (e) { 
    //OBTENEMOS EL NUEVO VALOR DEL SELECT
    const value = this.value;
    //SOLUCION CON ANIMACIONES
    $('#productosContenedor').fadeOut(600,function(){
        //EL FILTRO SE REALIZA UNA VEZ OCULTO EL CONTENEDOR
        if(value == 'TODOS'){
            productosUI(productos, '#productosContenedor');
        }else{
            const filtrados = productos.filter(producto => producto.autor == value);
            productosUI(filtrados, '#productosContenedor');
        }
        $('#productosContenedor').fadeIn();
    });
});
$("#busquedaProducto").keyup(function (e) { 
    const criterio = this.value.toUpperCase();
    console.log(criterio);
    if(criterio != ""){
        const encontrados = productos.filter(p =>      p.nombre.includes(criterio.toUpperCase()) 
                                                    || p.autor.includes(criterio.toUpperCase()));
        productosUI(encontrados, '#productosContenedor');
    }
});
$(".inputPrecio").change(function (e) { 
    const min = $("#minProducto").val();
    const max = $("#maxProducto").val();
    if((min > 0) && (max > 0)){
        const encontrados = productos.filter(p => p.precio >= min && p.precio <= max);
        productosUI(encontrados, '#productosContenedor');
    }
});