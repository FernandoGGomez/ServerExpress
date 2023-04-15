

async function setUser(event){
    event.preventDefault();
    
    const registerName = document.querySelector("#register_name")
    const registerLastName = document.querySelector("#register_last_name")
    const registerEmail = document.querySelector("#register_email")
    const registerAge = document.querySelector("#register_age")
    const registerPassword = document.querySelector("#register_password")   

    const response = await fetch('/api/users/setUser', {
        method: 'POST',
        body: JSON.stringify({
            name:registerName.value,
            last_name:registerLastName.value,
            email: registerEmail.value,
            age: registerAge.value,
            password: registerPassword.value
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if(response.ok){
        alert("Usuario creado correctamente")
      }else{
        alert("Error al crear el usuario")
    }
console.log("RESPONSE: ",response)
    
     window.location.replace(response.url)
   

}