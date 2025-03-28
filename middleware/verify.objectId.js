import mongoose from 'mongoose';

function verifyObjectId(req, res, next) {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: `Invalid ObjectId: ${req.params.id}` });
    }
    next();
}

export default verifyObjectId;
