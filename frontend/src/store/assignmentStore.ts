import { create } from 'zustand';

export interface QuestionType {
  id: string;
  type: string;
  count: number;
  marks: number;
}

interface AssignmentState {
  file: File | null;
  dueDate: string;
  questionTypes: QuestionType[];
  instructions: string;
  title: string;
  schoolName: string;
  subjectName: string;
  className: string;
  setFile: (file: File | null) => void;
  setDueDate: (date: string) => void;
  addQuestionType: () => void;
  updateQuestionType: (id: string, field: keyof QuestionType, value: any) => void;
  removeQuestionType: (id: string) => void;
  setInstructions: (inst: string) => void;
  setTitle: (title: string) => void;
  setSchoolName: (name: string) => void;
  setSubjectName: (name: string) => void;
  setClassName: (name: string) => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  file: null,
  dueDate: '',
  questionTypes: [
    { id: '1', type: 'Multiple Choice Questions', count: 4, marks: 1 },
    { id: '2', type: 'Short Questions', count: 3, marks: 2 },
    { id: '3', type: 'Diagram/Graph-Based Questions', count: 5, marks: 5 },
    { id: '4', type: 'Numerical Problems', count: 5, marks: 5 },
  ],
  instructions: '',
  title: '',
  schoolName: '',
  subjectName: '',
  className: '',
  setFile: (file) => set({ file }),
  setDueDate: (dueDate) => set({ dueDate }),
  addQuestionType: () => set((state) => ({
    questionTypes: [...state.questionTypes, { id: Date.now().toString(), type: 'Multiple Choice Questions', count: 1, marks: 1 }]
  })),
  updateQuestionType: (id, field, value) => set((state) => ({
    questionTypes: state.questionTypes.map(q => q.id === id ? { ...q, [field]: value } : q)
  })),
  removeQuestionType: (id) => set((state) => ({
    questionTypes: state.questionTypes.filter(q => q.id !== id)
  })),
  setInstructions: (instructions) => set({ instructions }),
  setTitle: (title) => set({ title }),
  setSchoolName: (schoolName) => set({ schoolName }),
  setSubjectName: (subjectName) => set({ subjectName }),
  setClassName: (className) => set({ className })
}));
