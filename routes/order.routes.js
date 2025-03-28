import express from 'express';
const router = express.Router();

import { addOrderItems,getMyOrders,getOrderById, getOrders} from '../handlers/order.handler.js';
import { verify, admin } from '../middleware/auth.middleware.js';

router.post('/',verify,addOrderItems);
router.get('/mine',verify, getMyOrders);
router.get('/',verify, admin,getMyOrders);
router.get('/:id',verify,getOrderById);


export default router;