import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import {compare, genSalt, hash}  from "bcrypt";
import {renameSync, unlinkSync} from "fs"
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

// Create JWT token
const createToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email is already registered");
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await UserModel.create({
      email,
      password: hashedPassword,
    });

    const token = createToken(user.id, email);

    res.cookie("jwt", token, {
      maxAge,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User with given email is not found" });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("jwt", token, {
      maxAge,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });


    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserInfo = async(req,res) => {
  try {
    const userData = await UserModel.findById(req.userId)

    if(!userData){
      return res.status(404).send("User with given id is not found");
    }

    return res.status(200).json({
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
    });
    
  } catch (error) {
    return res.status(500).send("Internal Server Error")
  }
}


export const updateProfile = async(req,res) => {
  try {
    const {userId} = req
    const { firstName, lastName, color } = req.body;

    if(!firstName || !lastName){
      return res.status(400).send("Firstname and lastname is required.")
    }

    const userData = await UserModel.findByIdAndUpdate(userId,{
      firstName, lastName, color, profileSetup:true
    },{new:true, runValidators:true})

    if(!userData){
      return res.status(404).send("user cannot be update!");
    }

    return res.status(200).json({
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
    });
    
  } catch (error) {
    return res.status(500).send("Internal Server Error")
  }
}

export const updateProfileImage = async(req,res) => {
  try {
   if(!req.file){
    return res.status(400).send("file is not uploaded.")
   }

   const date = Date.now()
   let fileName = "uploads/profiles/" + date +req.file.originalname
   renameSync(req.file.path, fileName)

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId,
      {image:fileName},
      {new:true, runValidators:true}
    )

    return res.status(200).json({
        image: updatedUser.image,
    });
    
  } catch (error) {
    return res.status(500).send("Internal Server Error")
  }
}


export const removeProfileImage = async(req,res) => {
  try {
    const {userId} = req
    
    const user = await userModel.findById(userId)

    if(!user){
      return res.status(404).send("User not found.")
    }

    if(user.image){
      unlinkSync(user.image)
    }

    user.image = null;
    await user.save();

    return res.status(200).send("Profile image removed successfully");
    
  } catch (error) {
    return res.status(500).send("Internal Server Error")
  }
}

export const logout = async(req,res) => {
  try {  
    res.cookie("jwt","",{maxAge:1, secure:true, sameSite:"None"})
    return res.status(200).send("Logout successfully!")
  } catch (error) {
    return res.status(500).send("Internal Server Error")
  }
}