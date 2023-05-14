const socket = io()

 function addProduct(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre_producto').value;
    const descripcion = document.getElementById('descripcion_producto').value;
    const precio = document.getElementById('precio_producto').value;
    const thumbnail = document.getElementById('thumbnail_producto').value;
    const codigo = document.getElementById('codigo_producto').value;
    let status = document.getElementById('status_producto').value;
    const stock = document.getElementById('stock_producto').value;
    const category =  document.getElementById('categoria_producto').value;
  
    status === "false"? status = false : status
    
    const newProduct = {title:nombre,description:descripcion,price:precio,thumbnail:thumbnail,code:codigo,status:status,stock:stock,category:category}
    socket.emit("add_product",newProduct)

  }


socket.on("producto_agregado",(producto)=>{

    if(producto){
        
        const contenedorProductos = document.getElementById('contenedor_productos');
        const nuevoProducto = document.createElement('div');
        nuevoProducto.classList.add("d-flex","flex-column","col-4","border","mx-4","my-4")
        if(producto.status){
            nuevoProducto.innerHTML=`
            <p class="h5">${producto._id}</p>
            <p class="h3">${producto.title}</p>
            <p class="description">${producto.description}</p>
            <p class="stock text-align-left h4">Stock: ${producto.stock}</p>
            <p class="precio text-ends h3 ">$ ${producto.price}</p>
            <p class="text-ends h3" style="color: green;">Disponible</p>
        `
        }else{
            nuevoProducto.innerHTML=`
            <p class="h5">${producto.id}</p>
            <p class="h3">${producto.title}</p>
            <p class="description">${producto.description}</p>
            <p class="stock text-align-left h4">Stock: ${producto.stock}</p>
            <p class="precio text-ends h3 ">$ ${producto.price}</p>
            <p class="text-ends h3" style="color: red;">No disponible</p>
        `
        }
      
        
        contenedorProductos.appendChild(nuevoProducto)
        console.log("Producto: ",producto)
    }else{
        console.log("Producto inválido")
        alert("Producto inválido")
    }

})


function deleteProduct(event){
    event.preventDefault();
    const product_id = document.getElementById('id_producto').value;
    socket.emit("delete_product", product_id);
  
}       

socket.on("deleted",deleted=>{

    if(deleted){

        location. reload()
        alert("Producto Eliminado Correctamente")
    }else{

        alert("No existe un producto con ese Id")

    }

})
