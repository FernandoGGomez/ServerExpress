import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { config } from "../../utils/configure.js";
import { createHash, isValidPassword } from "../../utils/crypto.js";
import { usersModel } from "../dao/models/user.model.js";

const localStrategy = local.Strategy;
const githubStrategy = github.Strategy;
const {github_client_Id,github_client_secret,github_callback_url} = config;

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

    passport.serializeUser((user,done)=> done(null,user._id));

    passport.deserializeUser(async (id,done)=>{
        const user= await usersModel.findOne({_id:id});
        done(null,user);
    });

}