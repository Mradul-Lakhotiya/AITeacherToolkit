"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AssignmentsPage() {
  const router = useRouter();
  const email = useAuthStore((state) => state.email);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (email) fetchAssignments();
  }, [email]);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/assignments?email=${email}`);
      setAssignments(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/assignments/${id}`);
      fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF5623] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 0 State Screen
  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-10">
        <div className="relative w-[300px] h-[300px] flex items-center justify-center mb-8">
          {/* Abstract background blobs & illustration (simplified with emoji & colors) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#17CB9E]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bg-white rounded-2xl shadow-xl w-[124px] h-[155px] flex flex-col p-3 z-10 border border-gray-100">
            <div className="w-8 h-2 bg-[#011625] rounded-full mb-4"></div>
            <div className="space-y-3">
              <div className="w-full h-2 bg-[#D5D5D5] rounded-full"></div>
              <div className="w-3/4 h-2 bg-[#D5D5D5] rounded-full"></div>
              <div className="w-full h-2 bg-[#D5D5D5] rounded-full"></div>
              <div className="w-5/6 h-2 bg-[#D5D5D5] rounded-full"></div>
            </div>
          </div>
          {/* Magnifying Glass overlay */}
          <div className="absolute right-10 bottom-10 z-20 w-24 h-24 bg-white/40 backdrop-blur-md rounded-full border-4 border-pink-200 flex items-center justify-center shadow-lg">
             <div className="w-10 h-10 bg-[#FF4040] rounded-full flex items-center justify-center text-white font-bold text-xl relative">
                <span className="absolute transform rotate-45 w-1 h-6 bg-white"></span>
                <span className="absolute transform -rotate-45 w-1 h-6 bg-white"></span>
             </div>
             {/* Lens handle */}
             <div className="absolute top-[85%] left-[85%] w-4 h-14 bg-[#E1DCEB] -rotate-45 origin-top-left rounded-full"></div>
          </div>
        </div>

        <h2 className="text-[20px] font-bold text-[#303030] mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>No assignments yet</h2>
        <p className="text-[#5E5E5E] text-center max-w-md text-[16px] leading-relaxed mb-8">
          Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        
        <Link 
          href="/assignments/create"
          className="bg-[#181818] text-white px-6 py-3 rounded-full font-medium flex items-center space-x-2 hover:bg-black transition shadow-md"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          <span>Create Your First Assignment</span>
        </Link>
      </div>
    );
  }

  const filteredAssignments = assignments.filter((a: any) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = a.title?.toLowerCase().includes(query) || false;
    const subjectMatch = a.subjectName?.toLowerCase().includes(query) || false;
    const classMatch = a.className?.toLowerCase().includes(query) || false;
    const matchesSearch = titleMatch || subjectMatch || classMatch;

    let matchesStatus = true;
    if (statusFilter === 'completed') {
       matchesStatus = !a.status || a.status === 'completed';
    } else if (statusFilter === 'failed') {
       matchesStatus = a.status === 'failed';
    } else if (statusFilter === 'in_progress') {
       matchesStatus = a.status === 'pending' || a.status === 'processing';
    }

    return matchesSearch && matchesStatus;
  });

  // Filled State
  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#303030] mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Assignments</h1>
        <p className="text-[#5E5E5E] text-sm">Manage and create assignments for your classes.</p>
      </div>

      <div className="flex items-center space-x-4 mb-8">
        <div className="relative">
          <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-sm font-medium text-[#5E5E5E] hover:bg-gray-50 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            <span className="capitalize">{statusFilter ? statusFilter.replace('_', ' ') : "Filter By Status"}</span>
          </button>
          
          {filterOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
              <button onClick={() => { setStatusFilter(null); setFilterOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium transition ${!statusFilter ? 'bg-[#F0F0F0] text-[#303030]' : 'text-[#5E5E5E] hover:bg-gray-50'}`}>All</button>
              <button onClick={() => { setStatusFilter('completed'); setFilterOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium transition ${statusFilter === 'completed' ? 'bg-[#F0F0F0] text-[#303030]' : 'text-[#5E5E5E] hover:bg-gray-50'}`}>Completed</button>
              <button onClick={() => { setStatusFilter('in_progress'); setFilterOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium transition ${statusFilter === 'in_progress' ? 'bg-[#F0F0F0] text-[#303030]' : 'text-[#5E5E5E] hover:bg-gray-50'}`}>In Progress</button>
              <button onClick={() => { setStatusFilter('failed'); setFilterOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium transition ${statusFilter === 'failed' ? 'bg-[#F0F0F0] text-[#303030]' : 'text-[#5E5E5E] hover:bg-gray-50'}`}>Failed</button>
            </div>
          )}
        </div>
        <div className="flex-1 relative">
          <svg className="w-5 h-5 absolute left-4 top-2.5 text-[#A9A9A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35"/></svg>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Assignment (Title, Subject, or Class)" 
            className="w-full bg-white border border-[#E5E5E5] rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#303030] text-[#303030]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map((assignment: any) => (
          <div 
            key={assignment._id} 
            onClick={() => router.push(`/assignments/${assignment._id}`)}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition relative flex flex-col justify-between h-[200px] cursor-pointer"
          >
            <div>
              <div className="flex items-center mb-2">
                {(!assignment.status || assignment.status === 'completed') && (
                  <span className="flex items-center text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 shadow-sm"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 shadow-sm"></div>Completed</span>
                )}
                {assignment.status === 'failed' && (
                  <span className="flex items-center text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 shadow-sm"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 shadow-sm"></div>Failed</span>
                )}
                {(assignment.status === 'pending' || assignment.status === 'processing') && (
                  <span className="flex items-center text-[11px] font-bold text-[#D45E3E] bg-[#FFF0E8] px-2.5 py-1 rounded-full border border-[#FFD8C9] shadow-sm"><div className="w-1.5 h-1.5 rounded-full bg-[#FF5623] mr-1.5 shadow-sm animate-pulse"></div>In Progress</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-[#303030] pr-8 truncate" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} title={assignment.title}>
                {assignment.title || "Untitled Assignment"}
              </h3>
              <p className="text-[#5E5E5E] text-sm mt-1">{assignment.subjectName || "Subject"} • {assignment.className || "Class"}</p>
            </div>
            
            {/* 3-dot menu dropdown */}
            <div 
              className="absolute top-6 right-6 group"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === assignment._id ? null : assignment._id);
              }}
            >
              <button className="text-[#A9A9A9] hover:text-[#303030] p-1 rounded-full hover:bg-gray-100 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </button>
              {/* Dropdown menu (hover effect on desktop, click on mobile) */}
              <div className={`absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden ${openMenuId === assignment._id ? 'block' : 'hidden md:group-hover:block'}`}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAssignment(assignment._id);
                  }} 
                  className="w-full text-left px-4 py-2.5 text-sm text-[#FF4040] hover:bg-red-50 font-medium transition"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-[13px] font-bold text-[#303030]">
              <div className="flex flex-col">
                <span className="text-[#A9A9A9] font-medium">Assigned on :</span>
                <span>{new Date(assignment.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[#A9A9A9] font-medium">Due :</span>
                <span>21-06-2025</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-24 right-6 md:bottom-8 md:right-auto md:left-1/2 md:transform md:-translate-x-1/2 z-40">
        {/* Desktop Button */}
        <Link href="/assignments/create" className="hidden md:flex bg-[#181818] text-white px-8 py-3.5 rounded-full font-bold shadow-xl hover:bg-black items-center text-[15px] transition-transform hover:scale-105">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          Create Assignment
        </Link>
        {/* Mobile Button (FAB) */}
        <Link href="/assignments/create" className="md:hidden flex bg-white text-[#FF4040] w-14 h-14 rounded-full shadow-xl border border-gray-100 items-center justify-center transition-transform hover:scale-105">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
        </Link>
      </div>
    </div>
  );
}
