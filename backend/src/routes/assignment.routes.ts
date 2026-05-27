import { Router } from 'express';
import multer from 'multer';
import Assignment from '../models/Assignment';
import { paperQueue } from '../services/queue.service';

const router = Router();
// Use multer with a temporary destination for uploaded files
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.array('files'), async (req, res) => {
  try {
    const { 
      dueDate, 
      questionTypes, 
      additionalInstructions,
      title,
      schoolName,
      subjectName,
      className,
      userId
    } = req.body;
    
    const parsedQuestionTypes = typeof questionTypes === 'string' ? JSON.parse(questionTypes) : questionTypes;

    let totalQuestions = 0;
    let totalMarks = 0;
    parsedQuestionTypes.forEach((qt: any) => {
      totalQuestions += qt.count;
      totalMarks += qt.count * qt.marks;
    });

    const assignment = new Assignment({
      title,
      schoolName,
      subjectName,
      className,
      userId,
      dueDate,
      questionTypes: parsedQuestionTypes,
      totalQuestions,
      totalMarks,
      additionalInstructions,
      status: 'pending',
    });
    
    await assignment.save();

    const files = req.files as Express.Multer.File[];
    const fileData = files ? files.map(f => ({ path: f.path, mimeType: f.mimetype })) : [];

    // Queue the AI job and pass the temp file paths to it
    await paperQueue.add('generate', {
      assignmentId: assignment._id,
      questionTypes: parsedQuestionTypes,
      additionalInstructions,
      fileData
    });

    res.status(201).json({ assignmentId: assignment._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Not found' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

router.get('/', async (req, res) => {
  try {
    const email = req.query.email;
    let query = {};
    if (email) {
      query = { userId: email };
    }
    const assignments = await Assignment.find(query).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

export default router;
