import express from 'express';
import {register,login,getProfile,updateProfile,changePassword} from '../users/user.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);


router.get('/', authMiddleware, getProfile);
router.put('/:id', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);



export default router;