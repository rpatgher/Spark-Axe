import express from 'express';
import multer from "multer";

import {
    createElement,
    getElement
} from '../controllers/ElementController.js';

import checkAuth from "../middleware/checkAuth.js";
import uploadImage from "../middleware/uploadImage.js";

const router = express.Router();

router.post('/', checkAuth, uploadImage, createElement);

router.route('/:id')
    .get(checkAuth, getElement);

export default router;