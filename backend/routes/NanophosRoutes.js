import express from 'express';

import {
    
} from '../controllers/NanophosController.js';

import {
    register,
    login,
    confirmAccount,
    profile,
    forgotPassword,
    resetPassword
} from '../controllers/CustomerController.js';

// ************* Middleware *************
import validateWebsite from '../middleware/validateWebsite.js';
import checkCustomerAuth from '../middleware/checkCustomerAuth.js';

const router = express.Router();





export default router;