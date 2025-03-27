import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true,default: false},

})


const UserModel = mongoose.model('User', userSchema);
export default UserModel;