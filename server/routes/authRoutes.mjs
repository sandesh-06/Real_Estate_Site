//PACKAGES
import express from "express";
import { body, validationResult } from "express-validator";

//CONTROLLERS
import { signup, signin } from "../controllers/authController.mjs";


const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

export default router;
