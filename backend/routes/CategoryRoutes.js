import express from 'express';

import {
    createCategories,
    getCategories,
    editSubcategory,
    deleteSubcategory,
    editCategory,
    deleteCategory,
    createOneCategory,
    createOneSubcategory,
    changeCategoryIndex,
    changeSubcategoryIndex
} from '../controllers/CategoryController.js';

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route('/')
    .post(checkAuth, createCategories);

router.route('/one')
    .post(checkAuth, createOneCategory);

router.route('/index')
    .put(checkAuth, changeCategoryIndex);

router.route('/index/sub')
    .put(checkAuth, changeSubcategoryIndex);

router.route('/sub/one')
    .post(checkAuth, createOneSubcategory);

router.route('/:id')
    .get(checkAuth, getCategories)
    .put(checkAuth, editCategory)
    .delete(checkAuth, deleteCategory);

router.route('/sub/:id')
    .put(checkAuth, editSubcategory)
    .delete(checkAuth, deleteSubcategory);

export default router;