import express from 'express';

import {
    getElements,
    getOrders,
    getInfo,
    createOrder
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

router.route('/create-order')
    .post(validateWebsite, checkCustomerAuth, createOrder);
    


export default router;