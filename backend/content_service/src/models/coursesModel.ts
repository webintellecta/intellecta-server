import mongoose, { Schema, Document } from "mongoose";


interface ICourse extends Document {
    title: string;
    subject: string;
    description: string;
    gradeLevel: number;
    difficultyLevel: string;
    thumbnail?: string; 
} 


const CourseSchema: Schema = new Schema(
  {
    title:{
        type: String,
        required: true,
    },
    subject: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    gradeLevel: { 
      type: Number, 
      required: true 
    }, 
    difficultyLevel: { 
      type: String, 
      enum: ["beginner", "intermediate", "advanced"], 
      required: true 
    },
    thumbnail: { 
      type: String 
    },
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>("Course", CourseSchema);
export default Course;
