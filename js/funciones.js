//FUNCION PARA GENERAR LA INTERFAZ DE PRODUCTOS CON JQUERY
function productosUI(productos, id){
    $(id).empty();
    for (const producto of productos) {
       $(id).append(`<div class="card" style="width: 18rem;">
                      <img src="${producto.imagen}" class="card-img-top" alt="...">
                      <div class="card-body">
                        <h6 class="card-title">${producto.nombre}</h6>
                        <p class="card-text">${producto.precio}$</p>
                        <p class="card-text">${producto.editorial}</p>
                        <p class="card-text">${producto.genero}</p>
                        <span class="badge badge-info">${producto.autor}</span>
                        <a href="#" id='${producto.id}' class="btn btn-primary btn-compra">COMPRAR</a>
                      </div>
                    </div>`);
    }
    $('.btn-compra').on("click", comprarProducto);
  }
  //MANEJADOR DE COMPRA DE PRODUCTOS
  function comprarProducto(e){
    //PREVENIR REFRESCO AL PRESIONAR ENLACES
    e.preventDefault();
    //PREVENIR LA PROPAGACION DEL EVENTO
    e.stopPropagation();
    //OBTENER ID DEL BOTON PRESIONADO
    const idProducto   = e.target.id;
    //BUSCAR PRIMERO EL OBJETO EN EL CARRITO (SI FUE SELECCIONADO);
    const seleccionado = carrito.find(p => p.id == idProducto);
    //SI NO SE ENCONTRO BUSCAR EN ARRAY DE PRODUCTOS
    if(seleccionado == undefined){
      carrito.push(productos.find(p => p.id == idProducto));
    }else{
      //SI SE ENCONTRO AGREGAR UN CANTIDAD
      seleccionado.agregarCantidad(1);
    }
   
    //GUARDAR EN STORAGE
    localStorage.setItem("CARRITO",JSON.stringify(carrito));
    //GENERAR SALID PRODUCTO
    carritoUI(carrito);
  }
  //FUNCION PARA RENDERIZAR LA INTERFAZ DEL CARRITO
  function carritoUI(productos){
    //CAMBIAR INTERIOR DEL INDICADOR DE CANTIDAD DE PRODUCTOS;
    $('#carritoCantidad').html(productos.length);
    //VACIAR EL INTERIOR DEL CUERPO DEL CARRITO;
    $('#carritoProductos').empty();
    for (const producto of productos) {
      $('#carritoProductos').append(registroCarrito(producto));
    }
    //AGREGAR TOTAL
    $('#carritoProductos').append(`<p id="totalCarrito"> TOTAL ${totalCarrito(productos)}</p>`);
    //AGREGAR BOTON CONFIRMAR
    $('#carritoProductos').append('<div id="divConfirmar" class="text-center"><button id="btnConfimar" class="btn btn-success">CONFIRMAR</button></div>')
    //ASOCIAMOS LOS EVENTOS A LA INTERFAZ GENERADA
    $('.btn-delete').on('click', eliminarCarrito);
    $('.btn-add').click(addCantidad);
    $('.btn-sub').click(subCantidad);
    $('#btnConfimar').click(confirmarCompra);
  }
  //FUNCION PARA GENERAR LA ESTRUCTURA DEL REGISTO HTML
  function registroCarrito(producto){
    return `<p class="ml-1"> ${producto.nombre} 
            <span class="badge badge-warning">$ ${producto.precio}</span>
            <span class="badge badge-dark">${producto.cantidad}</span>
            <span class="badge badge-success"> $ ${producto.subtotal()}</span>
            <a id="${producto.id}" class="btn btn-info    btn-add">+</a>
            <a id="${producto.id}" class="btn btn-warning btn-sub">-</a>
            <a id="${producto.id}" class="btn btn-danger  btn-delete">x</a>
            </p>`
  }
  
  function eliminarCarrito(e){
    console.log(e.target.id);
    //PRIMER FORMA DE ELIMINAR (SI CARRITO NO ES CONSTANTE) -> FILTER
    //carrito = carrito.filter(producto => producto.id != e.target.id);
    //SEGUNDA FORMA DE ELIMINAR  -> RECORTANDO EL ARRAY CON SPLICE
    let posicion = carrito.findIndex(p => p.id == e.target.id);
    carrito.splice(posicion, 1);
    //GENERAR NUEVAMENTE INTERFAZ
    carritoUI(carrito);
    //GUARDAR EN STORAGE EL NUEVO CARRITO
    localStorage.setItem("CARRITO",JSON.stringify(carrito));
  }
  //MANEJADOR PARA AGREGAR CANTIDAD CANTIDAD
  function addCantidad(){
    let producto = carrito.find(p => p.id == this.id);
    producto.agregarCantidad(1);
    $(this).parent().children()[1].innerHTML = producto.cantidad;
    $(this).parent().children()[2].innerHTML = producto.subtotal();
    //MODIFICAR TOTAL
    $("#totalCarrito").html(`TOTAL ${totalCarrito(carrito)}`);
    //GUARDAR EN STORAGE
    localStorage.setItem("CARRITO",JSON.stringify(carrito));
  }
  //MANEJADOR PARA RESTAR CANTIDAD
  function subCantidad(){
    let producto = carrito.find(p => p.id == this.id);
    if(producto.cantidad > 1){
      producto.agregarCantidad(-1);
      //$(this).parent().children()[1].innerHTML = producto.cantidad;
      let registroUI = $(this).parent().children();
      registroUI[1].innerHTML = producto.cantidad;
      registroUI[2].innerHTML = producto.subtotal();
      //MODIFICAR TOTAL
      $("#totalCarrito").html(`TOTAL ${totalCarrito(carrito)}`);
      //GUARDAR EN STORAGE
      localStorage.setItem("CARRITO",JSON.stringify(carrito));
    }
  }
  //FUNCION PARA GENERAR OPCIONES DE UN SELECT
  function selectUI(lista, selector){
    //VACIAR OPCIONES EXISTENTES
    $(selector).empty();
    //RECORRER LISTA Y AÑADIR UNA OPCION POR CADA ELEMENTO
    lista.forEach(element => {
        $(selector).append(`<option value='${element}'>${element}</option>`);
    });
    $(selector).prepend(`<option value='TODOS' selected>TODOS</option>`);
  }
  //FUNCION PARA OBTENER EL PRECIO TOTAL DEL CARRITO
  function totalCarrito(carrito){
    console.log(carrito);
    let total = 0;
    carrito.forEach(p => total += p.subtotal());
    return total.toFixed(2);
  }
  //FUNCION PARA ENVIAR AL BACKEND LA ORDEN DE PROCESAMIENTO DE COMPRA
  function confirmarCompra(){
    //OCULTAR EL BOTON
    $('#btnConfimar').hide();
    //AÑADIR SPINNER
    $('#divConfirmar').append(`<div class="spinner-border text-success" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>`);
    console.log("ENVIAR AL BACKEND");
    //REALIZAMOS LA PETICION POST
    //const URLPOST = '/compra.php';
    const URLPOST = 'https://jsonplaceholder.typicode.com/posts';
    //INFORMACION A ENVIAR
    const DATA   = {productos: JSON.stringify(carrito), total: totalCarrito(carrito)}
    //PETICION POST CON AJAX
    $.post(URLPOST, DATA,function(respuesta,estado){
        //console.log(respuesta);
        //console.log(estado);
        if(estado == 'success'){
          //MOSTRAMOS NOTIFICACION DE CONFIRMACIÓN (CON ANIMACIONES)
          $("#notificaciones").html(`<div class="alert alert-sucess alert-dismissible fade show" role="alert">
                      <strong>COMPRA CONFIRMADA!</strong> Comprobante Nº ${respuesta.id}.
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      </div>`).fadeIn().delay(2000).fadeOut('');
          //Vaciar carrito;
          carrito.splice(0, carrito.length);
          //SOBREESCRIBIR ALMACENADO EN STORAGE
          localStorage.setItem("CARRITO",'[]');
          //Vaciar contenido
          $('#carritoProductos').empty();
          //Volver a 0
          $('#carritoCantidad').html(0);
        }
    });
  }