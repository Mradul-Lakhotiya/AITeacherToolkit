import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import * as fs from 'fs';
import Assignment from '../models/Assignment';
import { generateQuestionPaper } from './ai.service';
import { getIo } from '../websocket';
import dotenv from 'dotenv';
dotenv.config();

const connection = new IORedis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: null,
});

export const paperQueue = new Queue('paper-generation', { connection: connection as any });

export const worker = new Worker(
  'paper-generation',
  async (job: Job) => {
    const { assignmentId, questionTypes, additionalInstructions, fileData } = job.data;
    
    try {
      console.log(`Processing job for assignment ${assignmentId}`);
      
      await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });
      
      const generatedPaper = await generateQuestionPaper(
        questionTypes,
        additionalInstructions,
        fileData 
      );

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: 'completed',
        generatedPaper
      });

      // Cleanup temp files
      if (fileData && fileData.length > 0) {
        fileData.forEach((f: any) => {
          if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
        });
      }

      // Notify Frontend
      const io = getIo();
      if (io) {
        io.to(assignmentId).emit('generation_complete', { assignmentId });
      }
      
      console.log(`Job completed for assignment ${assignmentId}`);
    } catch (error: any) {
      console.error(`Job failed for assignment ${assignmentId}:`, error);
      
      let errorMessage = "An error occurred during generation.";
      if (error?.message?.includes("503") || error?.message?.includes("high demand") || error?.message?.includes("UNAVAILABLE")) {
         errorMessage = "Google AI is currently experiencing high demand. Please try again in a few moments.";
      } else if (error?.message) {
         errorMessage = error.message;
      }

      await Assignment.findByIdAndUpdate(assignmentId, { 
        status: 'failed',
        error: errorMessage
      });
      
      const io = getIo();
      if (io) {
        io.to(assignmentId).emit('generation_failed', { assignmentId, error: errorMessage });
      }
      throw error;
    }
  },
  { connection: connection as any }
);
