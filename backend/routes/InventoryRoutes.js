import express from 'express';

import {
    updateInventory,
    getInventory
} from '../controllers/InventoryController.js';

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route('/:website_id')
    .get(checkAuth, getInventory)
    .put(checkAuth, updateInventory);

export default router;