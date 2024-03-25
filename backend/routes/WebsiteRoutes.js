import express from 'express';

import {
    createWebsite,
    getWebsite
} from '../controllers/WebsiteController.js';

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post('/', checkAuth, createWebsite);

router.route('/:id')
    .get(checkAuth, getWebsite);

export default router;