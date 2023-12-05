import express from 'express';
import { updateUser } from '../controllers/userControllers.mjs';
import {verifyToken}  from '../utils/verifyUser.mjs';
const router = express.Router();

router.post('/update/:id', verifyToken, updateUser)

export default router;