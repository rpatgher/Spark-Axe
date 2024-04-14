import express from 'express';

import {
    createOrder,
    getOrders
} from '../controllers/OrderController.js';

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route('/:website_id')
    .get(checkAuth, getOrders)
    .post(checkAuth, createOrder);


export default router;