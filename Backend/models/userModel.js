import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, "Email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true, "Password is required"],
    },
    firstName:{
        type:String,
        required:false
    },
    lastName:{
        type:String,
        required:false
    },
    image:{
        type:String,
        required:false
    },
    color:{
        type:Number,
        required:false,
        default:0
    },
    profileSetup:{
        type:Boolean,
        default:false
    }
})

// userSchema.pre("save", async function(next){
//     const salt = await genSalt()
//     this.password = hash(this.password, salt)
//     next();
// })

const userModel = mongoose.model("User",userSchema)

export default userModel;