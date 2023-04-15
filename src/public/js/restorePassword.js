async function restorePassword(event){

    event.preventDefault();

    const email = document.querySelector("#reset_password_email");
    const newPassword = document.querySelector("#new_password");

    if(email.value != "" && newPassword.value != ""){

        const response = await fetch('/api/auth/restorepassword', {
            method: 'POST',
            body: JSON.stringify({
                email: email.value,
                newPassword: newPassword.value
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if(response.ok){

            alert("Contraseña cambiada")

          }else{
            return alert("No existe un usuario creado con ese email")
          }

          window.location.replace(response.url)

    }else{

        return alert("Todos los campos son requeridos")

    }



}