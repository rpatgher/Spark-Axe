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

// **************** Middleware ****************
import checkAuth from "../middleware/checkAuth.js";
import uploadImage from "../middleware/uploadImage.js";

const router = express.Router();

router.route('/')
    .post(checkAuth, createCategories);

router.route('/one')
    .post(checkAuth, uploadImage, createOneCategory);

router.route('/index')
    .put(checkAuth, changeCategoryIndex);

router.route('/index/sub')
    .put(checkAuth, changeSubcategoryIndex);

router.route('/sub/one')
    .post(checkAuth, uploadImage, createOneSubcategory);

router.route('/:id')
    .get(checkAuth, getCategories)
    .put(checkAuth, uploadImage, editCategory)
    .delete(checkAuth, deleteCategory);

router.route('/sub/:id')
    .put(checkAuth, uploadImage, editSubcategory)
    .delete(checkAuth, deleteSubcategory);

export default router;