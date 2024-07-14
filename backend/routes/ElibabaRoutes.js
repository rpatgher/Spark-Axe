import express from 'express';

import {
    getElements
} from '../controllers/ElibabaController.js';

import validateWebsite from '../middleware/validateWebsite.js';

const router = express.Router();

router.route('/elements')
    .get(validateWebsite, getElements);


export default router;