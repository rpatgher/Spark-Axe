import express from 'express';

import {
    createContact,
    getContacts,
    deleteContacts,
    updateCompleted
} from '../controllers/ContactController.js';

import validateWebsite from '../middleware/validateWebsite.js';
import checkCustomerAuth from '../middleware/checkCustomerAuth.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/')
    .post(validateWebsite, createContact);

router.route('/delete')
    .post(checkAuth, deleteContacts);

router.route('/:website_id')
    .get(checkAuth, getContacts);

router.route('/:website_id/:contact_id')
    .put(checkAuth, updateCompleted);


export default router;