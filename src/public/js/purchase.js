async function purchase(cid){
    const response = await fetch(`/api/carts/${cid}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }); 

      if(response.ok){
        
        alert("La compra se realizo con éxito")
      }else{
      return alert("Error al completar la compra")
    }    
       window.location.reload()
}