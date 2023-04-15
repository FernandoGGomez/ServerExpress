

async function login(event){
    event.preventDefault();
    const loginEmail = document.querySelector("#login_email")
    const loginPassword = document.querySelector("#login_password") 
    console.log("email",loginEmail.value)
  
    console.log("Password",loginPassword.value)
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email: loginEmail.value,
            password: loginPassword.value
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if(response.ok){

        alert("Sesión iniciada correctamente")
        console.log("RESPONSE: ",response)
        window.location.replace(response.url)

      }else{
        alert("Usuario o contraseña incorrectos")
    }

   

}