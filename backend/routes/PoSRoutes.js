import express from 'express';

import {
    createPoS,
    getPoS,
    getPoSById,
    updatePoS,
    deletePoS,
    deleteManyPoS
} from '../controllers/PoSController.js';

import checkAuth from '../middleware/checkAuth.js';
import uploadImage from '../middleware/uploadImage.js';


const router = express.Router();

router.route('/')
    .post(checkAuth, uploadImage, createPoS);

router.route('/all/:website_id')
    .get(checkAuth, getPoS);

router.route('/:id')
    .get(checkAuth, getPoSById)
    .put(checkAuth, uploadImage, updatePoS)
    .delete(checkAuth, deletePoS);

router.route('/delete')
    .post(checkAuth, deleteManyPoS);


export default router;