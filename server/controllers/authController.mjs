//MODELS
import User from '../models/User.mjs'

//PACKAGES
import bcryptjs from 'bcryptjs';

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
      next(err);
   }
   
}