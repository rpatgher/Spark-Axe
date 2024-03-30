import express from 'express';

import {
    createCategory,
    getCategories
} from '../controllers/CategoryController.js';

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route('/')
    .post(checkAuth, createCategory)

router.route('/:id')
    .get(checkAuth, getCategories);

export default router;