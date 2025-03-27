import mongoose, { Schema, Document } from "mongoose";

interface ICourse extends Document {
    title: string;
    description: string;
    lessons: string[];
}

const CourseSchema: Schema = new Schema(
  {
    title:{
        type: String,
        required: true, 
    },
    description: {
        type: String,
        required: true, 
    },
    modules: [{
        type: Schema.Types.ObjectId,
        ref: "Lesson",
        required: true,
    }],
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>("Courses", CourseSchema);
export default Course;





