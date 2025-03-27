import express from 'express';
const router = express.Router();

import { 
    registerUser,
    getUsers, 
    logoutUser,
    getUserProfile,
    updateUserProfile,
    deleteUser,
    getUserById,
    updateUserById
} from '../handlers/user.handler.js';

import { verify, admin } from '../middleware/auth.middleware.js';


router.post('/',registerUser);
router.get('/',verify, admin ,getUsers);
router.post('/logout',logoutUser);
router.get('/profile',verify, getUserProfile);
router.put('/profile',verify,updateUserProfile);
router.delete('/:id',verify,admin,deleteUser);
router.get('/:id',verify,admin,getUserById);
router.put('/:id',verify,admin,updateUserById);




export default router;