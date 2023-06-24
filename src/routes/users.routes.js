import  express  from 'express';
import { Router } from 'express';
import passport from 'passport';
import controller from '../controllers/users.controller.js';

const route = Router();
route.use(express.urlencoded({extended: true}));

route.post("/premium/:uid",controller.premiumUser.bind(controller))

export default route