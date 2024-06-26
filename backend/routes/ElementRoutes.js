import express from 'express';
import multer from "multer";

import {
    createElement,
    getElements,
    getElement,
    deleteElements,
    updateElement,
    deleteElement,
    publishProduct,
    updateStock
} from '../controllers/ElementController.js';

import checkAuth from "../middleware/checkAuth.js";
import uploadImage from "../middleware/uploadImage.js";
import uploadImages from "../middleware/uploadImages.js";

const router = express.Router();

router.post('/', checkAuth, uploadImages, createElement);

router.route('/:id')
    .get(checkAuth, getElements)
    .put(checkAuth, uploadImages, updateElement)
    .delete(checkAuth, deleteElement);
    
router.route('/stock/:id')
    .put(checkAuth, updateStock);

router.route('/one/:id')
    .get(checkAuth, getElement);

router.route('/delete-all')
    .post(checkAuth, deleteElements);

router.post('/publish/:id', checkAuth, publishProduct);

export default router;