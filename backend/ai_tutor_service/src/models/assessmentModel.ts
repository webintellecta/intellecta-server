import mongoose, { Schema, Document } from "mongoose";

interface IPersonalizedRecommendation {
  subject: string;
  actions: string[];
  resources: string[];
}

interface IAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  strengths: string[]; 
  weaknesses: string[]; 
  learningPath: string[];
  personalizedRecommendations: IPersonalizedRecommendation[];
}

const AssessmentSchema: Schema = new Schema(
  {
    userId : { 
      type: Schema.Types.ObjectId, 
      ref: "User", required: true 
    },
    totalQuestions: { 
      type: Number, 
      required: true 
    },
    correctCount: { 
      type: Number, 
      required: true 
    },
    scorePercentage: { 
      type: Number, 
      required: true 
    },
    strengths: { 
      type: [String], 
      default: [] 
    },
    weaknesses: { 
      type: [String], 
      default: [] 
    },
    learningPath: {
      type: [String],
      default: []
    },
    personalizedRecommendations: {
      type: [{
        subject: String,
        action: [String],
        resources: [String]
      }],
      default: []
    }
  },
  { timestamps: true }
);

const Assessment = mongoose.model<IAssessment>("AssessmentResult", AssessmentSchema);
export default Assessment;
