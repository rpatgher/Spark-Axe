import express from 'express';

import{
    getSections
} from '../controllers/SectionController.js';

import checkAuth from '../middleware/checkAuth.js';


const router = express.Router();

router.route('/:website_id')
    .get(checkAuth, getSections);

export default router;