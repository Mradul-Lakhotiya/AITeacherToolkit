"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useAuthStore } from "@/store/authStore";

const socket = io("http://localhost:4000");

export default function CreateAssignment() {
  const router = useRouter();
  const email = useAuthStore((state) => state.email);
  const store = useAssignmentStore();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);

  const totalQuestions = store.questionTypes.reduce((acc, q) => acc + q.count, 0);
  const totalMarks = store.questionTypes.reduce((acc, q) => acc + (q.count * q.marks), 0);

  useEffect(() => {
    socket.on("generation_complete", (data) => {
      setProgress(100);
      setLoadingText("Paper generated successfully! Redirecting...");
      setTimeout(() => {
        router.push(`/assignments/${data.assignmentId}`);
      }, 1000);
    });

    socket.on("generation_failed", (data) => {
      setFailed(true);
      if (data?.error?.includes("Google AI is currently experiencing high demand")) {
         setLoadingText(data.error);
      } else {
         setLoadingText(data?.error || "Failed to generate paper. Please try again.");
      }
    });

    return () => {
      socket.off("generation_complete");
      socket.off("generation_failed");
    };
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading && !failed && progress < 95) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 95) {
             clearInterval(interval);
             return 95;
          }
          // Slow down the progress as it gets higher
          const increment = p > 80 ? 1 : p > 50 ? 2 : 5;
          return p + increment;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [loading, failed, progress]);

  const handleSubmit = async () => {
    setLoading(true);
    setFailed(false);
    setProgress(0);
    setLoadingText("Uploading and processing...");
    
    const formData = new FormData();
    if (store.file) formData.append("files", store.file);
    formData.append("dueDate", store.dueDate);
    formData.append("additionalInstructions", store.instructions);
    formData.append("questionTypes", JSON.stringify(store.questionTypes));
    formData.append("title", store.title);
    formData.append("schoolName", store.schoolName);
    formData.append("subjectName", store.subjectName);
    formData.append("className", store.className);
    formData.append("userId", email || "anonymous");

    try {
      const res = await axios.post("http://localhost:4000/api/assignments", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const id = res.data.assignmentId;
      socket.emit("join_assignment", id);
      setLoadingText("AI is generating your question paper... (This usually takes 15-30s)");
    } catch (error) {
      console.error(error);
      setFailed(true);
      setLoadingText("Error submitting form. Please check your connection.");
    }
  };

  return (
    <div className="flex justify-center pb-32 md:pb-20 font-sans text-gray-900 mt-0 md:mt-6">
      <div className="w-full max-w-3xl bg-[#FAFAFA] md:bg-white rounded-none md:rounded-[32px] shadow-none md:shadow-sm md:border border-gray-100 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-10">
            {!failed && <div className="w-12 h-12 border-4 border-[#FF5623] border-t-transparent rounded-full animate-spin mb-6"></div>}
            {failed && (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
            )}
            
            <p className={`text-xl font-bold text-center mb-6 ${failed ? 'text-red-500' : 'text-[#303030]'}`} style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
               {loadingText}
            </p>
            
            {!failed && progress > 0 && (
              <div className="w-full max-w-sm mt-2 flex flex-col items-center">
                 <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2 shadow-inner">
                    <div className="h-full bg-gradient-to-r from-[#FF5623] to-[#D45E3E] transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                 </div>
                 <p className="text-sm font-bold text-[#5E5E5E]">{progress}% Completed</p>
              </div>
            )}

            {failed && (
              <button 
                onClick={() => setLoading(false)} 
                className="mt-6 bg-[#181818] text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-black transition"
              >
                Close and try again
              </button>
            )}
          </div>
        )}

        <div className="p-4 md:p-10 bg-[#FAFAFA] md:bg-white">
          <h1 className="text-[20px] font-bold mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Assignment Details</h1>
          <p className="text-[14px] text-gray-500 mb-6 md:mb-8">Basic information about your assignment</p>

          <div className="bg-white md:bg-transparent rounded-[24px] md:rounded-none p-6 md:p-0 border border-gray-200 border-dashed md:border-solid md:border-transparent mb-6 md:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <div>
              <label className="block text-[14px] font-bold mb-2 text-[#303030]">Name of Assignment</label>
              <input type="text" value={store.title} onChange={e => store.setTitle(e.target.value)} required placeholder="e.g. Midterm Physics Test" className="w-full border border-gray-200 rounded-[12px] px-4 py-3 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-black text-[14px]"/>
            </div>
            <div>
              <label className="block text-[14px] font-bold mb-2 text-[#303030]">School / Institute Name</label>
              <input type="text" value={store.schoolName} onChange={e => store.setSchoolName(e.target.value)} required placeholder="e.g. Delhi Public School" className="w-full border border-gray-200 rounded-[12px] px-4 py-3 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-black text-[14px]"/>
            </div>
            <div>
              <label className="block text-[14px] font-bold mb-2 text-[#303030]">Subject Name</label>
              <input type="text" value={store.subjectName} onChange={e => store.setSubjectName(e.target.value)} required placeholder="e.g. Physics" className="w-full border border-gray-200 rounded-[12px] px-4 py-3 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-black text-[14px]"/>
            </div>
            <div>
              <label className="block text-[14px] font-bold mb-2 text-[#303030]">Class / Subheading</label>
              <input type="text" value={store.className} onChange={e => store.setClassName(e.target.value)} required placeholder="e.g. Class 11th" className="w-full border border-gray-200 rounded-[12px] px-4 py-3 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-black text-[14px]"/>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6 border-2 border-dashed border-[#E5E5E5] rounded-[24px] p-10 flex flex-col items-center justify-center bg-[#FAFAFA] hover:bg-gray-50 transition">
            <svg className="w-8 h-8 text-[#5E5E5E] mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
            <p className="font-bold text-[15px] text-[#303030]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Choose a file or drag & drop it here</p>
            <p className="text-[12px] text-[#A9A9A9] mb-5 mt-1">JPEG, PNG, PDF up to 10MB</p>
            <label className="border border-[#E5E5E5] bg-white text-[#303030] px-6 py-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-gray-50 transition shadow-sm">
              Browse Files
              <input type="file" className="hidden" onChange={(e) => store.setFile(e.target.files?.[0] || null)} />
            </label>
            {store.file && <p className="mt-4 text-[13px] text-green-600 font-bold">Selected: {store.file.name}</p>}
          </div>

          <p className="text-center text-[13px] text-[#5E5E5E] mb-10">Upload images of your preferred document/image</p>

          {/* Due Date */}
          <div className="mb-8">
            <label className="block text-[14px] font-bold mb-2 text-[#303030]">Due Date</label>
            <div className="relative">
              <input 
                type="date" 
                value={store.dueDate}
                onChange={(e) => store.setDueDate(e.target.value)}
                className="w-full border border-gray-200 rounded-[12px] px-4 py-3 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-black text-[14px]"
              />
            </div>
          </div>
          </div>

          {/* Question Types */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4 px-1">
              <label className="text-[16px] font-bold text-[#303030]">Question Type</label>
              <div className="hidden md:flex space-x-12 text-[14px] font-bold pr-4 text-[#303030]">
                <span>No. of Questions</span>
                <span>Marks</span>
              </div>
            </div>

            <div className="space-y-4">
              {store.questionTypes.map((q) => (
                <div key={q.id} className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4 bg-white md:bg-transparent rounded-[24px] md:rounded-none p-3 md:p-0 shadow-sm md:shadow-none border border-gray-100 md:border-none">
                  <div className="flex justify-between items-center flex-1 bg-white md:border border-gray-200 rounded-full px-2 md:px-5 py-2 md:py-2.5 md:shadow-sm">
                    <select 
                      value={q.type}
                      onChange={(e) => store.updateQuestionType(q.id, 'type', e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-[14px] font-medium text-[#303030] appearance-none"
                    >
                      <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                      <option value="Short Questions">Short Questions</option>
                      <option value="Diagram/Graph-Based Questions">Diagram/Graph-Based Questions</option>
                      <option value="Numerical Problems">Numerical Problems</option>
                      <option value="Long Essay Questions">Long Essay Questions</option>
                    </select>
                    <svg className="hidden md:block w-4 h-4 text-[#5E5E5E] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    
                    <button onClick={() => store.removeQuestionType(q.id)} className="md:hidden text-[#303030] p-1 flex items-center justify-center">
                      <svg className="w-5 h-5 border-[1.5px] border-[#303030] rounded-sm p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>

                  <button onClick={() => store.removeQuestionType(q.id)} className="hidden md:block text-[#A9A9A9] hover:text-red-500 transition px-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>

                  <div className="bg-[#F0F0F0] md:bg-transparent rounded-[24px] md:rounded-none p-2 md:p-0 flex space-x-3 md:space-x-4">
                    <div className="flex flex-col md:flex-row md:items-center items-center flex-1 space-y-2 md:space-y-0">
                      <span className="md:hidden text-[14px] font-medium text-[#303030]">No. of Questions</span>
                      <div className="flex items-center justify-between md:justify-start w-full bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm space-x-4">
                        <button onClick={() => store.updateQuestionType(q.id, 'count', Math.max(1, q.count - 1))} className="text-[#5E5E5E] hover:text-[#303030] border-[1.5px] border-[#5E5E5E] rounded-full p-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>
                        <span className="text-[16px] font-medium w-4 text-center text-[#303030]">{q.count}</span>
                        <button onClick={() => store.updateQuestionType(q.id, 'count', q.count + 1)} className="text-[#5E5E5E] hover:text-[#303030] border-[1.5px] border-[#5E5E5E] rounded-full p-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg></button>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center items-center flex-1 space-y-2 md:space-y-0">
                      <span className="md:hidden text-[14px] font-medium text-[#303030]">Marks</span>
                      <div className="flex items-center justify-between md:justify-start w-full bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm space-x-4">
                        <button onClick={() => store.updateQuestionType(q.id, 'marks', Math.max(1, q.marks - 1))} className="text-[#5E5E5E] hover:text-[#303030] border-[1.5px] border-[#5E5E5E] rounded-full p-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>
                        <span className="text-[16px] font-medium w-4 text-center text-[#303030]">{q.marks}</span>
                        <button onClick={() => store.updateQuestionType(q.id, 'marks', q.marks + 1)} className="text-[#5E5E5E] hover:text-[#303030] border-[1.5px] border-[#5E5E5E] rounded-full p-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={store.addQuestionType} className="mt-5 flex items-center text-[14px] font-bold text-[#303030] hover:text-[#181818] transition">
              <div className="w-[36px] h-[36px] bg-[#2B2B2B] text-white rounded-full flex items-center justify-center mr-2 text-xl hover:bg-black font-light">+</div>
              Add Question Type
            </button>
            
            <div className="mt-10 flex flex-col items-end text-[13px] font-medium text-[#5E5E5E] space-y-1">
              <p>Total Questions : <span className="font-bold ml-1 text-[#303030]">{totalQuestions}</span></p>
              <p>Total Marks : <span className="font-bold ml-1 text-[#303030]">{totalMarks}</span></p>
            </div>
          </div>

          {/* Additional Instructions */}
          <div className="mb-10">
            <label className="block text-[14px] font-bold mb-2 text-[#303030]">Additional Information (For better output)</label>
            <div className="relative">
              <textarea 
                value={store.instructions}
                onChange={(e) => store.setInstructions(e.target.value)}
                className="w-full border border-[#E5E5E5] rounded-[16px] p-4 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#303030] min-h-[120px] text-[14px]"
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
              />
              <div className="absolute bottom-4 right-4 text-[#A9A9A9]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-2a5 5 0 01-10 0H3a7.001 7.001 0 006 6.93V17H6v2h8v-2h-3v-2.07z" clipRule="evenodd"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Action Button for form submission */}
      <div className="fixed bottom-0 left-0 right-0 w-full h-[158px] md:h-auto md:w-auto md:bottom-8 md:left-1/2 md:-translate-x-1/2 bg-white/50 backdrop-blur-md md:bg-transparent md:backdrop-blur-none border-t border-gray-200 md:border-none flex justify-between md:justify-center items-center px-6 md:px-0 z-50 md:space-x-4 pb-12 md:pb-0">
        <button onClick={() => router.push('/assignments')} className="bg-white border border-gray-200 text-[#303030] px-6 py-3.5 rounded-full font-bold shadow-sm hover:bg-gray-50 flex items-center text-[16px]">
          <svg className="w-5 h-5 md:mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span className="hidden md:inline">Previous</span>
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={!store.title || !store.schoolName || !store.subjectName || !store.className || !store.file || !store.dueDate || loading}
          className="bg-[#181818] text-white px-8 py-3.5 rounded-full font-bold shadow-xl hover:bg-black flex items-center text-[16px] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Processing..." : "Continue"}
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    </div>
  );
}
