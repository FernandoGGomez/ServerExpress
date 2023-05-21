import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import jwt from "passport-jwt";
import  Jwt  from "jsonwebtoken";
import { config } from "../../utils/configure.js";
import { createHash, isValidPassword } from "../../utils/crypto.js";
import { usersModel } from "../dao/models/user.model.js";

const localStrategy = local.Strategy;
const githubStrategy = github.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const {github_client_Id,github_client_secret,github_callback_url,cookie_secret} = config;

export function configurePassport(){

    passport.use("register",new localStrategy({
        passReqToCallback:true,
        usernameField:"email"
    },async (req,username,password,done)=>{

        try{
            const {name,last_name,age,rol} = req.body;
            const userExist = await usersModel.findOne({email:username});
        
            if(userExist){
                return done(null,false)
            }
        
            const newUser = await usersModel.create({
                name,
                last_name,
                email:username,
                age,
                password:createHash(password),
                rol
            })
            
            done(null,newUser)
        }catch(error){
            done(error)
        }
    

    }));

    passport.use("login",new localStrategy({
        usernameField:"email"
    },async(username,password,done)=>{

        console.log("USERNAME:",username)

        if(username == "adminCoder@coder.com" & password == "adminCod3r123"){
            const user = {
                _id:"1",
                email: "adminCoder@coder.com",
                name: "Admin",
                last_name: "CoderHouse",
                age: "-",
                password: "adminCod3r123",
                rol: "Admin"
            }
            return done(null,user)
        }
            try{
                const user = await usersModel.findOne({email:username});
                if(!user){
                   return done(null,false);
                }
    
                if(!isValidPassword(password,user.password )){
                    return done(null,false);
                }
    
                return done(null,user);
    
            }catch(error){
                done(error)
            }
        
        
    }))


    passport.use("github",new githubStrategy({
        clientID:github_client_Id,
        clientSecret:github_client_secret,
        callbackURL:github_callback_url
    },async (accesToken,refreshToken,profile,done)=>{
      try{
        console.log("PROFILE;",profile)
        const email = profile._json.email
        console.log("EMAIL:",email,"type:",typeof email)
        const user = await usersModel.findOne({email})

        if(!user){
           const newUser = await usersModel.create({
                name:profile._json.name ?? "-",
                last_name: profile._json.last_name ?? "-",
                email:email ?? "-",
                age:profile._json.last_name ?? "-",
                password:"-",
            })

            return done(null,newUser)
        }

        return done(null,user)
      }catch(error){

         done(error,false)

      }
        
    }))


    passport.use("current",new JWTStrategy({
        jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey:cookie_secret,
        },async (jwt_payload,done)=>{
                try{    
                    
                    const user = await  usersModel.findOne({email:jwt_payload.user.email})
                    console.log("userJWTStrategy:",user)
                    return done(null,user)
                }catch(error){
                    console.log("Error:",error)
                    return done(error)
                }
}))



    passport.serializeUser((user,done)=>{ 
        console.log(user)
        done(null,user._id)
    });

    passport.deserializeUser(async (id,done)=>{
        if(id == "1"){
            const user = {
                _id:"1",
                email: "adminCoder@coder.com",
                name: "Admin",
                last_name: "CoderHouse",
                age: "-",
                password: "adminCod3r123",
                rol: "Admin"
            }
            return done(null,user)
        }
        const user= await usersModel.findOne({_id:id});
        done(null,user);
    });

}


function cookieExtractor(req){

    return req?.cookies?.["AUTH"];

}

export function generateToken(user){
    console.log("user GenerateToken",user)
    const token = Jwt.sign({user},cookie_secret,{expiresIn:"24h"});
    return token
}