async function premium(uid){
    const btn = document.getElementById(uid)
    btn.classList.add("btn-secondary")
    const response = await fetch(`/api/users/premium/${uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if(response.ok){

        alert("Se cambió el rol del usuario")
        window.location.reload()

      }else{
        alert("No tienes los permisos necesarios para cambiar el rol de este usuario")
    }
}

async function deleteUser(uid){
    const response = await fetch(`/api/users/${uid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if(response.ok){

        alert("El usuario fue eliminado")
        window.location.reload()

      }else{
        alert("No tienes los permisos necesarios para eliminar a este usuario")
    }
}

async function deleteInactiveUsers(){
    const response = await fetch(`/api/users/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if(response.ok){

        alert("Los usuarios fueron eliminados correctamente")
        window.location.reload()

      }else{
        alert("No hay usuarios para eliminar")
    }
}