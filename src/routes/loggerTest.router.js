import  express  from 'express';
import { Router } from 'express';
import { logger } from '../logger/winston-logger.js';

const route = Router();
route.use(express.urlencoded({extended: true}));

route.get("/",(req,res,)=>{

    logger.fatal("Fatal Error");
    logger.error("Error");
    logger.warning("Warning message");
    logger.info("Info message");
    logger.http("Logger http");
    logger.debug("Debug message");

    res.status(200).send({ok:true})

})
export default route