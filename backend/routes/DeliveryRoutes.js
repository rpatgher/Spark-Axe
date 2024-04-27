import express from 'express';

import {
    getDelivery,
    editDelivery
} from '../controllers/DeliveryController.js';

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route('/:website_id')
    .get(checkAuth, getDelivery)
    .put(checkAuth, editDelivery);


export default router;