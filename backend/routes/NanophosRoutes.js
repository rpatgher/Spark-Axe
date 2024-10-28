import express from 'express';

import {
    getOrders,
    getInfo
} from '../controllers/NanophosController.js';

// ************* Middleware *************
import validateWebsite from '../middleware/validateWebsite.js';
import checkCustomerAuth from '../middleware/checkCustomerAuth.js';

const router = express.Router();

router.route('/main-info')
    .get(validateWebsite, getInfo);

router.route('/orders')
    .get(validateWebsite, checkCustomerAuth, getOrders);


export default router;