import jwt from 'jsonwebtoken';

import asyncHandler from 'express-async-handler';

import UserModel from '../schemas/user.schema.js';

const JWT_SECRET = "JANA@119"

const verify = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token,JWT_SECRET);
        req.user = await UserModel.findById(decoded.userId);

        if (!req.user) {
            res.status(401);
            throw new Error('User not found');
        }

        next(); 
    } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});


const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401);
      throw new Error('Not authorized as an admin');
    }
};
  
export { verify, admin };