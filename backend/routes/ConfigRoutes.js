import express from 'express';

import {
    getElementConfig,
    getPoSConfig
} from '../controllers/ConfigController.js';

// ************* Middleware *************
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route('/elements/:website_id')
    .get(checkAuth, getElementConfig);

router.route('/pos/:website_id')
    .get(checkAuth, getPoSConfig);

export default router;