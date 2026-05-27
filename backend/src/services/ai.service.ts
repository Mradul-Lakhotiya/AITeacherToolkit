import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateQuestionPaper(
  questionTypes: any[],
  additionalInstructions: string,
  fileData?: { path: string, mimeType: string }[]
) {
  let prompt = `
    You are an expert teacher and curriculum designer. 
    You need to generate a structured Question Paper based on the following requirements:
    
    Question Types & Distribution:
    ${JSON.stringify(questionTypes, null, 2)}
    
    Additional Instructions:
    ${additionalInstructions}
    
    Your output MUST be strictly valid JSON that matches the following structure:
    {
      "sections": [
        {
          "title": "Section A",
          "instruction": "Short Answer Questions (Attempt all)",
          "questions": [
            {
              "questionText": "What is the capital of France?",
              "difficulty": "Easy", // Must be one of: Easy, Moderate, Challenging
              "marks": 2
            }
          ]
        }
      ],
      "answerKey": [
        {
          "questionNumber": 1,
          "answer": "Paris is the capital of France."
        }
      ]
    }

    Do not include any markdown formatting in your response. Ensure the question counts and marks match the requested distribution.
  `;

  const contents: any[] = [{ text: prompt }];

  // If there are files uploaded, attach them
  if (fileData && fileData.length > 0) {
    for (const file of fileData) {
      if (fs.existsSync(file.path)) {
        const data = fs.readFileSync(file.path);
        
        contents.push({
          inlineData: {
            data: data.toString('base64'),
            mimeType: file.mimeType
          }
        });
      }
    }
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: {
      temperature: 0.7,
      responseMimeType: "application/json",
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI returned empty response");
  
  return JSON.parse(text);
}
