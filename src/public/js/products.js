// async function productView(event){

// console.log("EVENTO: ",JSON.stringify(event))

// const response = await fetch(`/api/products/${event}`, {
//     method: 'GET',
   
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   }).then((res) => {
//     console.log("res",res.url)
//     window.location.replace(res.url);

// })       
  
  
//   console.log(response)
// }


// async function addToCart(pid){

    
//     const response = await fetch(`/api/carts/:cid/product/${pid}`, {
//         method: 'POST',
//         body: JSON.stringify({
//             nombre,
//             apellido,
//             email,
//           }),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }).then((res) => {
//         console.log("res",res.url)
//         window.location.replace(res.url);
    
//     })       
// }

const query = new URLSearchParams(window.location.search)

function prevPage(){

    const previusPage = Number(query.get("page"))  - 1
    query.set("page",previusPage)
    window.location.search = query.toString()

}

function nextPage(){
    const previusPage = Number(query.get("page")) === 0 ?  2 : Number(query.get("page")) + 1
    query.set("page",previusPage)
    window.location.search = query.toString()
}