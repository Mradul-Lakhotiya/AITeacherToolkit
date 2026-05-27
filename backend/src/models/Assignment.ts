import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  questionText: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  marks: number;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IAnswer {
  questionNumber: number;
  answer: string;
}

export interface IAssignment extends Document {
  dueDate: Date;
  questionTypes: any[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generatedPaper: {
    sections: ISection[];
    answerKey: IAnswer[];
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    schoolName: { type: String, required: true },
    subjectName: { type: String, required: true },
    className: { type: String, required: true },
    userId: { type: String, required: true },
    dueDate: { type: Date },
    questionTypes: { type: Array, default: [] },
    totalQuestions: { type: Number },
    totalMarks: { type: Number },
    additionalInstructions: { type: String },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    generatedPaper: { type: Object, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
