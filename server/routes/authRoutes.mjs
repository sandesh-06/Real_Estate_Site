//PACKAGES
import express from "express";

//CONTROLLERS
import { signup, signin, google, signout } from "../controllers/authController.mjs";


const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signout);

export default router;
