//MODELS
import User from "../models/User.mjs";

//PACKAGES
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import { errorHandler } from "../utils/error.mjs";

//1. SIGN UP CONTROLLER
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    //hasing the password and adding salt before storing
    const hashedPass = bcryptjs.hashSync(password, 10); //password, salt no.
    const newUser = new User({ username, email, password: hashedPass });
    await newUser.save();
    res.status(201).json("User created successfully");
    // res.json(newUser);
  } catch (err) {
    next(err); //this uses the error middleware defined in the index.mjs file
  }
};

//2. SIGN IN CONTROLLER
export const signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const validUser = await User.findOne({ username });
    if (!validUser) return next(errorHandler(404, "Invalid userid/password")); //if the user is not valid return the error and stop execution
    console.log(validUser);
    //if the user valid decrypt and check the password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid userid/password"));

    //if the user entered correct credentials, then authorize them by giving a token
    const token = jwt.sign(
      {
        id: validUser._id, //it is always better to have the mongo id in the token, than any other info
      },
      process.env.JWT_SECRET
    ); //sign the token using a secret key of your own

    //destructure the password for safety purpose, and send only the rest of the data
    const { password: pass, ...rest_data } = validUser._doc; //SO THAT YOU DON'T NEED A SEPARATE API TO GET THE USER

    //once the token is created, save it in a cookie
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest_data); //NOTE: YOU CAN ADD 'EXPIRES' IF YOU WANT THE TOKEN TO EXPIRE AFTER SOME TIME
  } catch (err) {
    next(err); //defined in index.mjs file
  }
};

//3. GOOGLE AUTH CONTROLLER
export const google = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;

    //check if user exista
    const user = await User.findOne({ email });

    //if user exists use sign in logic
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest_data } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest_data);
    }
    //if user doesn't exist then use sign up logic
    else {
      //since if you sign up using google, you don't have to manually enter password. But the User model won't accept the user without password. So we need to generate a random password for user signing up with google auth

      // This code generates a random alphanumeric string of length 8 using JavaScript.
      // Math.random(): Generates a random floating point number between 0 (inclusive) and 1 (exclusive).
      // toString(36): Converts the random number to its string representation in base 36 (using characters 0-9 and a-z).
      // slice(-8): Retrieves the last 8 characters from the generated string.
      // we're doing it twice to generate a 16character passcode which is more secure.
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPass = bcryptjs.hashSync(generatedPassword, 10);

      //if we have a user name like : "Sandesh S" this is not valid we need to change it to something like "sandeshs1829faj";
      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPass,
        avatar: photo,
      });
      await newUser.save()
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest_data } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest_data);

    }
  } catch (err) {}
};
