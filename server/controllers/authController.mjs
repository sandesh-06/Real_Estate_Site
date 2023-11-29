//MODELS
import User from '../models/User.mjs'

//PACKAGES
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { errorHandler } from '../utils/error.mjs';


//1. SIGN UP CONTROLLER
export const signup = async(req, res, next)=>{
   try{
      const {username, email, password} = req.body;
      //hasing the password and adding salt before storing
      const hashedPass = bcryptjs.hashSync(password, 10) //password, salt no.
      const newUser = new User({username, email, password: hashedPass});
      await newUser.save();
      res.status(201).json("User created successfully");
      // res.json(newUser);
   }
   catch(err){
      next(err); //this uses the error middleware defined in the index.mjs file
   }
}


//2. SIGN IN CONTROLLER
export const signin = async(req, res, next)=>{
   try{
      const {username, password} = req.body
      const validUser = await User.findOne({username});
      if(!validUser) return next(errorHandler(404, "User not found!")); //if the user is not valid return the error and stop execution
      console.log(validUser);
      //if the user valid decrypt and check the password
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if(!validPassword) return next(errorHandler(401, "Invalid Credentials!"));

      //if the user entered correct credentials, then authorize them by giving a token
      const token = jwt.sign({
         id: validUser._id, //it is always better to have the mongo id in the token, than any other info
      },  process.env.JWT_SECRET) //sign the token using a secret key of your own

      //destructure the password for safety purpose, and send only the rest of the data
      const {password: pass, ...rest_data} = validUser._doc; //SO THAT YOU DON'T NEED A SEPARATE API TO FETCH THE USER
   
      //once the token is created, save it in a cookie
      res.cookie('access_token', token, {httpOnly:true,}).status(200).json(rest_data) //NOTE: YOU CAN ADD EXPIRES IF YOU WANT THE TOKEN TO EXPIRE AFTER SOME TIME
   }
   catch(err){
      next(err); //defined in index.mjs file
   }
   
}
