import express from 'express';

import {
    createOrder,
    getOrders,
    updateOrderStatus
} from '../controllers/OrderController.js';

import checkAuth from "../middleware/checkAuth.js";
import validateWebsite from '../middleware/validateWebsite.js';
import checkCustomerAuth from '../middleware/checkCustomerAuth.js';

const router = express.Router();

router.route('/:website_id')
    .get(checkAuth, getOrders)
    // .post(createOrder);

router.route('/status/:website_id/:order_id')
    .put(checkAuth, updateOrderStatus);

router.route('/create-order')
    .post(validateWebsite, checkCustomerAuth, createOrder);

export default router;