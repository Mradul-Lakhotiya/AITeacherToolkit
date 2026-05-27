"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function OutputPage() {
  const router = useRouter();
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
        <div className="w-12 h-12 border-4 border-[#FF5623] border-t-transparent rounded-full animate-spin mb-4"></div>
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
    <div className="min-h-screen bg-[#CECECE] pb-10 pt-20 font-sans">
      
      {/* Wrapper matching Frame 1618872221 */}
      <div className="bg-white rounded-[40px] p-[9px] w-full max-w-4xl mx-auto flex flex-col gap-2.5 shadow-xl relative z-10 print:p-0 print:bg-white print:rounded-none">
        
        {/* Banner */}
        <div className="bg-[#303030] text-[#F0F0F0] rounded-[32px] p-6 flex flex-col gap-4 shadow-[0px_16px_48px_rgba(0,0,0,0.12),0px_32px_48px_rgba(0,0,0,0.2)] print:hidden relative z-20">
          <p className="font-bold text-[14px] leading-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.04em" }}>
            Certainly! Here is the customized Question Paper based on your assignment:
          </p>
          <button onClick={() => window.print()} className="w-[36px] h-[36px] rounded-full bg-[#F6F6F6]/10 flex items-center justify-center hover:bg-[#F6F6F6]/20 transition">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          </button>
        </div>

        {/* Paper Content matching Frame 1984077318 */}
        <div className="bg-[#F6F6F6] rounded-[32px] p-6 print:bg-white print:p-0 flex flex-col items-center">
          
          {/* Header Section */}
          <div className="text-center mb-6 flex flex-col gap-[10px] w-full">
            <h1 className="text-[20px] font-bold text-[#303030] leading-[130%] tracking-tight text-center">{data.schoolName || "Delhi Public School, Sector-4, Bokaro"}</h1>
            <h2 className="text-[16px] font-semibold text-[#303030] leading-tight text-center">Subject: {data.subjectName || "English"}</h2>
            <h3 className="text-[16px] font-medium text-[#303030] leading-tight text-center">Class: {data.className || "5th"}</h3>
          </div>

          <div className="w-full flex flex-col gap-2.5 mb-2 font-semibold text-[14px] text-[#303030]">
            <p className="w-full text-left leading-[160%]">Time Allowed: 45 minutes</p>
            <p className="w-full text-left leading-[160%]">Maximum Marks: {data.totalMarks}</p>
          </div>

          <div className="w-full font-semibold text-[14px] text-[#303030] mb-6 flex justify-between items-center">
            <p className="w-full text-left leading-[160%] tracking-[-0.04em]">All questions are compulsory unless stated otherwise.</p>
          </div>

          {/* Student Info */}
          <div className="w-full flex flex-col font-semibold text-[14px] text-[#303030] gap-2 mb-8">
            <div className="flex items-end">Name: <div className="border-b border-[#303030] ml-2 flex-1 pb-1"></div></div>
            <div className="flex items-end">Roll Number: <div className="border-b border-[#303030] ml-2 flex-1 pb-1"></div></div>
            <div className="flex items-end">Section: <div className="border-b border-[#303030] ml-2 flex-1 pb-1"></div></div>
          </div>

          {/* Sections */}
          <div className="w-full text-[#303030]">
            {paper.sections?.map((section: any, sIdx: number) => (
              <div key={sIdx} className="mb-10 w-full">
                <h2 className="text-[16px] font-bold text-center mb-6 text-[#303030] leading-[160%]">{section.title || `Section ${String.fromCharCode(65 + sIdx)}`}</h2>
                
                <h3 className="text-[14px] font-semibold mb-1 text-[#303030] leading-[160%] tracking-[-0.04em]">{section.instruction?.split('(')[0]?.trim() || "Short Answer Questions"}</h3>
                <p className="text-[14px] font-semibold text-[#303030] mb-6 leading-[160%] tracking-[-0.04em]">
                  {section.instruction?.match(/\((.*)\)/)?.[1] ? section.instruction : "Attempt all questions. Each question carries marks."}
                </p>

                <ol className="w-full space-y-6 text-[#303030] list-none p-0 m-0">
                  {section.questions?.map((q: any, qIdx: number) => (
                    <li key={qIdx} className="w-full">
                      <div className="flex flex-col text-[16px] leading-[150%] tracking-[-0.04em] w-full">
                        <span className="flex-1 w-full">
                          <span className="font-semibold text-[#5E5E5E] mr-1">[{q.difficulty}]</span> 
                          {q.questionText}
                        </span>
                        <span className="font-semibold whitespace-nowrap mt-1 text-[#303030]">[{q.marks} Marks]</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <p className="w-full text-left font-bold text-[16px] mb-12 text-[#303030] tracking-[-0.04em]">End of Question Paper</p>

          {/* Answer Key */}
          {paper.answerKey && (
            <div className="w-full pt-10 border-t-2 border-[#E5E5E5] print:break-before-page text-[#303030]">
              <h2 className="text-[16px] font-bold mb-6 text-[#303030] tracking-[-0.04em]">Answer Key:</h2>
              <ol className="list-decimal list-outside pl-5 space-y-4">
                {paper.answerKey.map((ans: any, idx: number) => (
                  <li key={idx} className="pl-2 text-[16px] text-[#303030] leading-[150%] tracking-[-0.04em]">
                    <span className="font-bold text-[#303030] mr-2">Q{ans.questionNumber}.</span> 
                    {ans.answer}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
