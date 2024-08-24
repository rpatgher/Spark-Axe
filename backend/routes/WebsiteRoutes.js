import express from 'express';

import {
    createWebsite,
    getWebsite,
    getWebsiteMainInfo
} from '../controllers/WebsiteController.js';

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post('/', checkAuth, createWebsite);

router.route('/:id')
    .get(checkAuth, getWebsite);

router.route('/:id/main-info')
    .get(checkAuth, getWebsiteMainInfo);

export default router;