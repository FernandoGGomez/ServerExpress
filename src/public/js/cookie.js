const name = document.querySelector("#name")
const email = document.querySelector("#email")


async function getCookie(){

    const response = await fetch('/getCookie', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

}



async function  setCookie(){

    const response = await fetch('/setCookie', {
        method: 'POST',
        body: JSON.stringify({
            name:name.value,
            email: email.value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });


}