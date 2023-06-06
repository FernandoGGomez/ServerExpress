import winston from "winston";
import { config } from "../../utils/configure.js";

const customLevelsOptions={
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5,     
    },
    colors:{
        fatal:"red",
        error:"magenta",
        warning:"yellow",
        info:"blue",
        http:"green",
        debug:"grey"
    }
}

export const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    timestamp: true,
    transports:[
       
    ],
});

if(config.node_env == "devLogger"){
    logger.add(
        new winston.transports.Console({
            format:winston.format.combine(
            winston.format.colorize({colors:customLevelsOptions.colors}),
            winston.format.simple(),
        ),
        level:"debug",
    }),
    )
}
if(config.node_env === "prodLogger"){
    
    logger.add(
    new winston.transports.Console({
                format:winston.format.combine(
                winston.format.colorize({colors:customLevelsOptions.colors}),
                winston.format.simple(),
            ),
            level:"info"
        })
    );

    logger.add(
        new winston.transports.File({
            filename:"./log/errors.log",
            level:"error",
        }),
    )
}