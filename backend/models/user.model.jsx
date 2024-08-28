import mongoose from "mongoose";
import { password } from "pg/lib/defaults";

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        require: true
    },
    userName:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female"]
    },
    profilePic: {
        type:String,
        default:"",
    },
});

const User = mongoose.model("User", userSchema);

export default User;

