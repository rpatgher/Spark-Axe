import express from 'express';

import {
    createContact,
    getContacts
} from '../controllers/ContactController.js';

import validateWebsite from '../middleware/validateWebsite.js';
import checkCustomerAuth from '../middleware/checkCustomerAuth.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/')
    .get(checkAuth, getContacts)
    .post(validateWebsite, checkCustomerAuth, createContact);

export default router;