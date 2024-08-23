import express from 'express';
import { 
    register,
    login,
    forgotPassword,
    resetPassword,
    profile,
    confirmUser
} from '../controllers/UserController.js';

import checkAuth from "../middleware/checkAuth.js";


const router = express.Router();


router.post('/', register);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);
router.post('/confirmation', confirmUser);
router.get('/profile', checkAuth, profile);


export default router;