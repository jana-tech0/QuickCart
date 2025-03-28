import express from "express";
const router = express.Router();

import {
    createProduct,
    getProducts,
    createProductReview,
    getProductById,
    updateProduct,
    deleteProduct,
    getTopProducts
} from "../handlers/product.handler.js"

import { verify, admin } from '../middleware/auth.middleware.js';
import verifyObjectId from '../middleware/verify.objectId.js'


router.post('/',verify,admin,createProduct)
router.get('/',getProducts);
router.get('/top',getTopProducts);
router.post('/:id/reviews',verify,verifyObjectId,createProductReview);
router.get('/:id',verifyObjectId,getProductById);
router.delete('/:id',verify, admin,verifyObjectId,deleteProduct);





export default router;