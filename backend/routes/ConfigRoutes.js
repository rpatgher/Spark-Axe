import express from 'express';

import {
    getElementConfig
} from '../controllers/ConfigController.js';

// ************* Middleware *************
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route('/elements/:website_id')
    .get(checkAuth, getElementConfig);

export default router;