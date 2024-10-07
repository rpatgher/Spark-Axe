import express from 'express';

import {
    getElements,
    getInfo
} from '../controllers/ElibabaController.js';

import validateWebsite from '../middleware/validateWebsite.js';

const router = express.Router();

router.route('/elements')
    .get(validateWebsite, getElements);

router.route('/main-info')
    .get(validateWebsite, getInfo);


export default router;