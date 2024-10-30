import express from 'express';

import {
    getElements,
    getOrders,
    getInfo
} from '../controllers/ElibabaController.js';

// ************* Middleware *************
import validateWebsite from '../middleware/validateWebsite.js';
import checkCustomerAuth from '../middleware/checkCustomerAuth.js';

const router = express.Router();

router.route('/elements')
    .get(validateWebsite, getElements);

router.route('/orders')
    .get(validateWebsite, checkCustomerAuth, getOrders);

router.route('/main-info')
    .get(validateWebsite, getInfo);
    


export default router;