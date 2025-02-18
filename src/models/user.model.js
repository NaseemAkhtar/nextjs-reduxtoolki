 import mongoose from "mongoose";
// 
 const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    avatar: {
        type: Object,
        default: {}  
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    designation: {
        type: String,
        default: ""
    },
    age: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    about: {
        type: String,
        default: "",
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordTokenExpiry: {
        type: Date
    },
    verifyToken: {
        type: String
    },
    verifyTokenExpiry: {
        type: Date
    }
 })

 export const User = mongoose.models?.User || mongoose.model("User",userSchema)

