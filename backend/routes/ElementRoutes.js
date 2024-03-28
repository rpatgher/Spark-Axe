import express from 'express';
import multer from "multer";

import {
    createElement,
    getElements,
    getElement
} from '../controllers/ElementController.js';

import checkAuth from "../middleware/checkAuth.js";
import uploadImage from "../middleware/uploadImage.js";
import uploadImages from "../middleware/uploadImages.js";

const router = express.Router();

router.post('/', checkAuth, uploadImages, createElement);

router.route('/:id')
    .get(checkAuth, getElements);

export default router;