const socket = io()

function sendMessage(event) {
    event.preventDefault();
    const message = document.getElementById('message').value;
    const email = document.getElementById('email').value;

    const userMessage = {user:email,message:message}

    socket.emit("sendMessage",userMessage)



}


socket.on("mensajeEnviado", userMessage =>{

    const contenedorChat = document.querySelector("#contenedor-chat")

    const nuevoMensaje = document.createElement('div');
    nuevoMensaje.classList.add("text-center","col-8" )

    nuevoMensaje.innerHTML=`
                        <div class="border">
                            <h2>${userMessage.user}</h2>

                            <h3>${userMessage.message}</h3> 
                        </div>
    
    `
    contenedorChat.appendChild(nuevoMensaje)

})
