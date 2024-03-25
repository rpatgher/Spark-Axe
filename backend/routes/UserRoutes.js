import express from 'express';
import { 
    register,
    login,
    profile
} from '../controllers/UserController.js';

import checkAuth from "../middleware/checkAuth.js";


const router = express.Router();


router.post('/', register);
router.post('/login', login);
router.get('/profile', checkAuth, profile);


export default router;