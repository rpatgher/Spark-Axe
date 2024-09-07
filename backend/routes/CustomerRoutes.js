import express from 'express';

import {
    createCustomer,
    getCustomers,
    getCustomer,
    deleteCustomer,
    deleteCustomers,
    updateCustomer
} from '../controllers/CustomerController.js';

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route('/')
    .post(createCustomer);

router.route('/delete')
    .post(checkAuth, deleteCustomers);

router.route('/all/:website_id')
    .get(checkAuth, getCustomers);

router.route('/:id')
    .get(checkAuth, getCustomer)
    .delete(checkAuth, deleteCustomer)
    .put(checkAuth, updateCustomer);

export default router;