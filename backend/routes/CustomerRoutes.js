import express from 'express';

import {
    getCustomers,
    getCustomer,
    deleteCustomer,
    deleteCustomers,
    updateCustomer,
    login,
    register,
    confirmAccount,
    profile,
    forgotPassword,
    resetPassword
} from '../controllers/CustomerController.js';

// ************* Middleware *************
import checkAuth from "../middleware/checkAuth.js";
import validateWebsite from '../middleware/validateWebsite.js';
import checkCustomerAuth from '../middleware/checkCustomerAuth.js';

const router = express.Router();

router.route('/delete')
    .post(checkAuth, deleteCustomers);

router.route('/all/:website_id')
    .get(checkAuth, getCustomers);

router.route('/:id')
    .get(checkAuth, getCustomer)
    .delete(checkAuth, deleteCustomer)
    .put(checkAuth, updateCustomer);



// ********************** Routes for websites' customers **********************
router.route('/login')
    .post(validateWebsite, login);

router.route('/register')
    .post(validateWebsite, register);

router.route('/confirm-account')
    .post(validateWebsite, confirmAccount);

router.route('/profile')
    .get(validateWebsite, checkCustomerAuth, profile);

router.route('/forgot-password')
    .post(validateWebsite, forgotPassword);

router.route('/reset-password')
    .post(validateWebsite, resetPassword);

export default router;