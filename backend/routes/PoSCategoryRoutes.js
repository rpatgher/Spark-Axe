import express from 'express';

import{
    getCategories
} from '../controllers/PoSCategoryController.js';

import checkAuth from '../middleware/checkAuth.js';


const router = express.Router();

router.route('/:website_id')
    .get(checkAuth, getCategories);

export default router;