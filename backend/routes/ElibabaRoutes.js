import express from 'express';

import {
    getElements,
    getOrders,
    getInfo,
    register,
    login,
    confirmAccount,
    profile,
    forgotPassword,
    resetPassword,
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

router.route('/register')
    .post(validateWebsite, register);

router.route('/login')
    .post(validateWebsite, login);

router.route('/confirm-account')
    .post(validateWebsite, confirmAccount);

router.route('/profile')
    .get(validateWebsite, checkCustomerAuth, profile);

router.route('/forgot-password')
    .post(validateWebsite, forgotPassword);

router.route('/reset-password')
    .post(validateWebsite, resetPassword);


router.route('/create-order')
    .post(validateWebsite, checkCustomerAuth, createOrder);
    


export default router;