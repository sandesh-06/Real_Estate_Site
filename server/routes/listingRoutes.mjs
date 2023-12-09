import express from 'express'
import { createListing } from '../controllers/listingController.mjs';
import { verifyToken } from '../utils/verifyUser.mjs';

const router = express.Router();


router.post('/create', verifyToken,createListing)

export default router;