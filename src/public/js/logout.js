async function logout(){

    const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      if(response.ok){
        alert("Sesion Cerrada")
        window.location.replace(response.url)
      }

}