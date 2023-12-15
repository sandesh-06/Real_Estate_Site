import Listing from "../models/Listing.mjs";
import { errorHandler } from "../utils/error.mjs";


export const createListing = async(req, res, next)=>{

    try{
        const listing = await Listing.create(req.body);
        return res.status(200).json(listing);
    }
    catch(err){
        next(err);
    }
}

export const deleteListing = async(req, res, next)=>{
    const listing = await Listing.findById(req.params.id);
    //check if listing exists
    if(!listing){
        return next(errorHandler(404, "listing not found"));
    }

    //check if the listing belongs to the user
    if(req.user.id != listing.userRef){
        return next(errorHandler(401, "You can only delete your own listing!"));
    }
    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).send("Listing deleted successfully!!")

    } catch (error) {
        next(error)
    }
}