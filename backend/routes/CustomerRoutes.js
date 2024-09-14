import express from 'express';

import {
    createCustomer,
    getCustomers,
    getCustomer,
    deleteCustomer,
    deleteCustomers,
    updateCustomer,
    login
} from '../controllers/CustomerController.js';

import checkAuth from "../middleware/checkAuth.js";
import validateWebsite from '../middleware/validateWebsite.js';

const router = express.Router();

router.route('/login')
    .post(validateWebsite, login);

router.route('/')
    .post(validateWebsite, createCustomer);

router.route('/delete')
    .post(checkAuth, deleteCustomers);

router.route('/all/:website_id')
    .get(checkAuth, getCustomers);

router.route('/:id')
    .get(checkAuth, getCustomer)
    .delete(checkAuth, deleteCustomer)
    .put(checkAuth, updateCustomer);

export default router;