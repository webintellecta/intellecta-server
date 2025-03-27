import mongoose, { Schema, Document } from "mongoose";

interface ICourse extends Document {
    title: string;
    subject: string;
    description: string;
    lessons: string[];
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
        type: String,
        required: true, 
    },
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>("Courses", CourseSchema);
export default Course;





