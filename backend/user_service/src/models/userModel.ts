import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  age: Number,
  phone?: string,
  role: "student" | "parent" | "teacher" | "admin";
  profilePic?: string | null;
  // refreshToken: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { 
        type: String,
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    password: { 
        type: String, 
        select: false
    },
    age: {
        type: Number,
        min:5,
        max:18
    },
    phone: {
        type: String
    },
    role: {
      type: String,
      enum: ["student", "parent", "teacher", "admin"],
      default: "student",
    },
    profilePic: { 
        type: String,
        default: null
    },
    // refreshToken:{
    //   type:String
    // },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;