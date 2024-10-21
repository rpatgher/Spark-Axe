import express from 'express';

import {
    getElements,
    getInfo,
    register,
    login,
    confirmAccount,
    profile
} from '../controllers/ElibabaController.js';

// ************* Middleware *************
import validateWebsite from '../middleware/validateWebsite.js';
import checkCustomerAuth from '../middleware/checkCustomerAuth.js';

const router = express.Router();

router.route('/elements')
    .get(validateWebsite, getElements);

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


export default router;