import mongoose, { Schema, Document } from "mongoose";

interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  completedLessons: mongoose.Types.ObjectId[];
  currentLesson?: mongoose.Types.ObjectId; 
  progressPercent: number;
  lastUpdated: Date;
}

const UserProgressSchema: Schema = new Schema(
  {
    userId: { 
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: true 
    },
    courseId: { 
        type: Schema.Types.ObjectId,
        ref: "Course", 
        required: true 
    },
    completedLessons: [{ 
        type: Schema.Types.ObjectId, 
        ref: "Lesson" 
    }],
    currentLesson: { 
        type: Schema.Types.ObjectId, 
        ref: "Lesson" 
    },
    progressPercent: { 
        type: Number, 
        default: 0 
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    }
  },
  { timestamps: true }
);

const UserProgress = mongoose.model<IUserProgress>("UserProgress", UserProgressSchema);
export default UserProgress;
