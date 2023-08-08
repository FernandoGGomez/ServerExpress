async function addToCart(cid,pid){
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }); 

      if(response.ok){
        
        alert("Producto agregado al carrito")
      }else{
      return alert("Error en agragar el producto al carrito")
    }
    
      window.location.replace(`http://localhost:8080/carts/${cid}`)
}