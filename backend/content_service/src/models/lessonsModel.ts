import mongoose, { Schema, Document } from "mongoose";

interface ILesson extends Document {
    course: mongoose.Types.ObjectId;
    title: string;
    difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
    type: "video" | "quiz" | "exercise" | "article";
    tags: string[];
    url: string;
}

const LessonSchema: Schema = new Schema(
  {
    course:{
        type: Schema.Types.ObjectId,
        ref: "Courses",
        required: true,
    },
    title:{
        type: String,
        required: true, 
    },
    difficultyLevel: { 
        type: String, 
        required: true, 
        enum: ["beginner", "intermediate", "advanced"] 
    },
    type: {
        type: String, 
        required: true 
    },
    tags: { 
        type: [String], 
        required: true 
    },
    url: { 
        type: String, 
        required: true 
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model<ILesson>("Lesson", LessonSchema);
export default Lesson;





