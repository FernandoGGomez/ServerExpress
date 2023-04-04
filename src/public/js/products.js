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