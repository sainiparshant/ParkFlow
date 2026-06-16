import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/AuthMiddleware.js';
import { addParking, vendorProfile } from '../controllers/VendorController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/profile',
    isAuthenticated, authorizeRoles('VENDOR'),
    upload.single('document'),
    vendorProfile
);

router.post('/parking',
    isAuthenticated, authorizeRoles('VENDOR'),
    upload.array('images', 5),
    addParking
);

export default router;