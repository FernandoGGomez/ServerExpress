

async function setUser(event){
    event.preventDefault();
    
    const registerName = document.querySelector("#register_name")
    const registerLastName = document.querySelector("#register_last_name")
    const registerEmail = document.querySelector("#register_email")
    const registerAge = document.querySelector("#register_age")
    const registerPassword = document.querySelector("#register_password")   

    if(registerName.value != "" && registerLastName.value != "" && registerEmail.value != "" && registerAge.value != "" && registerPassword.value != ""){
      const response = await fetch('/api/auth/register', {
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
      return alert("Error al crear el usuario")
    }
      console.log("RESPONSE: ",response)
    
      window.location.replace(response.url)
    }else{

      return alert("Todos los campos son requeridos ")

    }
    
      
    

}