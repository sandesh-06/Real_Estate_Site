import jwt from "jsonwebtoken";
import { errorHandler } from "./error.mjs";

export const verifyToken = (req, res, next)=>{
    try{
        const token = req.cookies.access_token;

        //if there is no token found, return unauthorized error
        if(!token) return next(errorHandler(401, 'Unauthorized'));

        jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{ //it return err, and user info stored
            if(err) return next(errorHandler(403, 'Token not valid'));

           req.user = user; //sending the user info from token to request
           next(); //calling the next function eg: in userRoute.js - verifyToken, updateUser. Here updateUser is the next() func.
        })
    }
    
    catch(err){
        next(err);
    }

}