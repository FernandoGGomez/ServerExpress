import passport from "passport";
import local from "passport-local"
import { createHash, isValidPassword } from "../../utils/crypto.js";
import { usersModel } from "../dao/models/user.model.js";

const localStrategy = local.Strategy;

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

    passport.serializeUser((user,done)=> done(null,user._id));

    passport.deserializeUser(async (id,done)=>{
        const user= await usersModel.findOne({_id:id});
        done(null,user);
    });

}