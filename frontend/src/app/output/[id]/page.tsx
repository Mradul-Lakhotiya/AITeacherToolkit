"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function OutputPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:4000/api/assignments/${id}`)
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Loading your question paper...</p>
      </div>
    );
  }

  if (!data || !data.generatedPaper) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500 font-bold">Failed to load assignment.</p>
      </div>
    );
  }

  const paper = data.generatedPaper;

  return (
    <div className="min-h-screen bg-[#eaedf2] py-10 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-16 border border-gray-200 print:shadow-none print:border-none print:p-0">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Delhi Public School, Sector-4, Bokaro</h1>
          <h2 className="text-xl font-semibold mb-1">Subject: English</h2>
          <h3 className="text-lg font-medium">Class: 5th</h3>
        </div>

        <div className="flex justify-between font-bold mb-6 text-sm">
          <p>Time Allowed: 45 minutes</p>
          <p>Maximum Marks: {data.totalMarks}</p>
        </div>

        <p className="font-bold mb-6 text-sm">All questions are compulsory unless stated otherwise.</p>

        {/* Student Info */}
        <div className="space-y-3 font-bold mb-10 text-sm">
          <div>Name: ______________________</div>
          <div>Roll Number: ______________________</div>
          <div>Class: 5th Section: ______________________</div>
        </div>

        {/* Sections */}
        {paper.sections?.map((section: any, sIdx: number) => (
          <div key={sIdx} className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">{section.title || `Section ${String.fromCharCode(65 + sIdx)}`}</h2>
            
            <h3 className="text-[15px] font-bold mb-1">{section.instruction?.split('(')[0]?.trim() || "Short Answer Questions"}</h3>
            <p className="italic text-sm text-gray-600 mb-6">
              {section.instruction?.match(/\((.*)\)/)?.[1] ? section.instruction : "Attempt all questions. Each question carries marks."}
            </p>

            <ol className="list-decimal list-outside pl-5 space-y-6">
              {section.questions?.map((q: any, qIdx: number) => (
                <li key={qIdx} className="pl-2">
                  <div className="flex text-[15px] leading-relaxed">
                    <span className="flex-1">
                      <span className="font-medium text-gray-600">[{q.difficulty}]</span> {q.questionText}
                    </span>
                    <span className="font-bold whitespace-nowrap ml-4 text-gray-700">[{q.marks} Marks]</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}

        <p className="font-bold text-sm mb-12">End of Question Paper</p>

        {/* Answer Key */}
        {paper.answerKey && (
          <div className="pt-10 border-t-2 border-gray-100 print:break-before-page">
            <h2 className="text-xl font-bold mb-6">Answer Key:</h2>
            <ol className="list-decimal list-outside pl-5 space-y-4">
              {paper.answerKey.map((ans: any, idx: number) => (
                <li key={idx} className="pl-2 text-[15px] text-gray-700 leading-relaxed">
                  {ans.answer}
                </li>
              ))}
            </ol>
          </div>
        )}

      </div>
      
      {/* Print Button (Hidden while printing) */}
      <div className="fixed bottom-8 right-8 print:hidden">
        <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        </button>
      </div>
    </div>
  );
}
