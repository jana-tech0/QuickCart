import UserModel from '../schemas/user.schema.js';
import asyncHandler from "express-async-handler";
import generateToken from '../utils/generateToken.js';
import bcrypt from "bcryptjs"; 




const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
        res.status(400);
        throw new Error("User already exists. Please login.");
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
    });
      

    
    console.log("Created User:", user);


    if (!user) {
        res.status(400);
        throw new Error('User creation failed');
    }

    
    const token = generateToken(res, user._id);

    res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
    });
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await UserModel.find({});
    res.json(users);
});


const logoutUser = (req,res) => {

    if (!req.cookies?.jwt) {
        return res.status(400).json({ message: "No active session found" });
    }

    
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
    });

    res.status(200).json({ message: "Logged Out Successfully" });

};

const getUserProfile = asyncHandler(async (req,res) => {

    const user = await UserModel.findById(req.user._id);

    if(user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }else {
        res.status(404);
        throw new Error('user not found')
    }


})

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error("User Not Found");
    }

    if (user.isAdmin) {
        res.status(400);
        throw new Error("Cannot delete admin user");
    }

    await UserModel.deleteOne({ _id: user._id });

    res.json({ message: "User Removed Successfully" });
});

const getUserById = asyncHandler(async(req,res) => {
    const user = await UserModel.findById(req.params.id);

    if(user) {
        res.json(user);
    }else {
        res.status(404);
        throw new Error('User Not Found')
    }
});

const updateUserById = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id);
  
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
  
      const updatedUser = await user.save();
  
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });



export {registerUser, getUsers, logoutUser, getUserProfile, updateUserProfile, deleteUser, getUserById,updateUserById};
