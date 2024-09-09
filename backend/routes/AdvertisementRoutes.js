import express from 'express';

import {
    getAdvertisements,
    createAdvertisement,
    editAdvertisement,
    getAdvertisement,
    deleteAdvertisement
} from '../controllers/AdvertisementController.js';

import checkAuth from '../middleware/checkAuth.js';
import uploadImage from '../middleware/uploadImage.js';

const router = express.Router();

router.route('/')
.post(checkAuth, uploadImage, createAdvertisement);


router.route('/all/:website_id')
    .get(checkAuth, getAdvertisements);


router.route('/:id')
    .get(checkAuth, getAdvertisement)
    .delete(checkAuth, deleteAdvertisement)
    .put(checkAuth, uploadImage, editAdvertisement);

export default router;