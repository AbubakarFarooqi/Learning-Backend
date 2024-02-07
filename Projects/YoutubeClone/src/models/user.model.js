import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "json-web-token"
const userSchema = new Schema({
    watchbHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    username:{
        type:String,
        required:true,
        lowercase: true,
        unique: true,
        index:true,
        trim:true // autmoatically remove leaing and trailing whitespaces
    },
    email:{
        type:String,
        required:true,
        lowercase: true,
        unique: true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,// cloudinary url
        required:true,
    },
    coverImage:{
        type:String,// cloudinary url
    },
    password:{
        type:String,
        required:[true,"Please give password"],
        trim:true // autmoatically remove leaing and trailing whitespaces
    },
    refreshToken:{
        type:String
    }


},{timestamps:true})


// middle ware
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()

})

// mehtods

userSchema.methods.isCorrectPassword =  async function(password){
    return await bcrypt.compare(password,this.password) // return true or false
}




export const User = mongoose.model("User",userSchema)