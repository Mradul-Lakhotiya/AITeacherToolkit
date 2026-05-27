"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

export default function TopHeader({ title = "Assignment" }: { title?: string }) {
  const email = useAuthStore((state) => state.email);
  const logout = useAuthStore((state) => state.logout);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <header className="flex items-center justify-between md:bg-white/75 md:backdrop-blur-md px-4 md:px-6 py-0 md:py-3 rounded-2xl mx-2 md:mx-4 mt-3 md:border border-white/40 md:shadow-sm bg-white h-[56px] shadow-sm">
      {/* Mobile Left Section: Logo */}
      <div className="flex md:hidden items-center space-x-2">
        <div className="w-[28px] h-[28px] rounded-[8.4px] bg-gradient-to-b from-[#E56820] to-[#D45E3E] flex items-center justify-center shadow-md relative overflow-hidden">
           <div className="absolute inset-0 bg-black opacity-10"></div>
           <span className="text-white font-bold text-[14px] relative z-10">V</span>
        </div>
        <span className="text-[#303030] font-bold text-[20px] tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>VedaAI</span>
      </div>

      {/* Desktop Left section: Title */}
      <div className="hidden md:flex items-center space-x-4">
        <Link href="/assignments" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition shadow-sm border border-gray-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </Link>
        <div className="flex items-center space-x-2 text-[#A9A9A9] font-semibold text-[15px]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>{title}</span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-2 md:space-x-5">
        {/* Bell Icon */}
        <button className="w-[36px] h-[36px] md:w-10 md:h-10 bg-[#F6F6F6] rounded-full flex items-center justify-center hover:bg-gray-200 transition relative">
          <svg className="w-5 h-5 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <div className="absolute top-2 right-2 w-2 h-2 bg-[#FF5623] rounded-full border-2 border-[#F6F6F6]"></div>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center md:space-x-3 bg-transparent hover:bg-white/50 md:px-3 py-1.5 rounded-xl transition">
            <div className="w-[32px] h-[32px] bg-blue-100 rounded-full overflow-hidden flex items-center justify-center">
               <span className="text-[16px]">👨‍🏫</span>
            </div>
            <span className="hidden md:block text-[#303030] font-semibold text-[15px] truncate max-w-[150px]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              {email || "John Doe"}
            </span>
            <svg className={`hidden md:block transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50">
              <button onClick={() => { setDropdownOpen(false); logout(); }} className="w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 flex items-center space-x-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <button className="md:hidden w-[24px] h-[24px] flex items-center justify-center hover:bg-gray-100 rounded-md transition ml-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#303030" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
    </header>
  );
}
