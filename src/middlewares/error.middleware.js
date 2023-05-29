export default (error,req,res,next) => {
    console.log(error.name)
    switch(error.code){
        case 2:
            res.userErrorResponse({error:error.name,message:error.message})
            break;

        case 404:
            res.errorNotFound({error:error.name,message:error.message})    
            break;

        default:
            res.serverErrorResponse("UnhandlerError");
    }
}