import express from 'express';
import { updateUser, deleteUser, getUserListing } from '../controllers/userControllers.mjs';
import {verifyToken}  from '../utils/verifyUser.mjs';
const router = express.Router();

router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListing);
export default router;