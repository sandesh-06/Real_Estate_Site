import User from "../models/User.mjs";
import Listing from "../models/Listing.mjs";

import { errorHandler } from "../utils/error.mjs";
import bcryptjs from "bcryptjs";

//1. TO UPDATE USER DETAILS
export const updateUser = async (req, res, next) => {
  //if the user id from token != user id from params
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!!"));

  try {
    //if the request contains password, first hash it.
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        //since user may update only some specific info, like only username or only avatar and password. So we need to update only that in db. So we can use $set method for that (Note: don't use $set:req.body directly).
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    ); //without new: true, the updatedUser will have the old values.

    const { password, ...rest_data } = updatedUser._doc;

    res.status(200).json(rest_data);
  } catch (err) {
    next(err);
  }
};

//TO DELETE USER ACCOUNT
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your account"));
  try {
    await User.findByIdAndDelete(req.params.id);
    // res.status(200).json(deletedUser);
    res.clearCookie("access_token"); //delete the cookie
    res.status(200).json("Deleted Successfully");
  } catch (err) {
    next(err);
  }
};

//TO DISPLAY THE LISTINGS OF THE USER
export const getUserListing = async (req, res) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });

      res.status(200).json(listings)
    } catch (err) {
      next(err);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};
