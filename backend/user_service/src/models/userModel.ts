import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  dob: Date,
  phone: string,
  role: "student" | "parent" | "teacher" | "admin";
  profilePic?: string;
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
        required: true,
        select: false
    },
    dob: {
        type: Date,
        required: true 
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
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
