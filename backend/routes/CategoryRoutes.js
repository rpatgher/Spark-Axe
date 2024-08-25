import express from 'express';

import {
    createCategory,
    getCategories,
    editSubcategory,
    deleteSubcategory
} from '../controllers/CategoryController.js';

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route('/')
    .post(checkAuth, createCategory)

router.route('/:id')
    .get(checkAuth, getCategories);

router.route('/sub/:id')
    .put(checkAuth, editSubcategory)
    .delete(checkAuth, deleteSubcategory);

export default router;