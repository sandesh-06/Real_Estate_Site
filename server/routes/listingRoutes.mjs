import express from 'express'
import { createListing, deleteListing } from '../controllers/listingController.mjs';
import { verifyToken } from '../utils/verifyUser.mjs';

const router = express.Router();


router.post('/create', verifyToken, createListing)
router.delete('/delete/:id', verifyToken, deleteListing)

export default router;