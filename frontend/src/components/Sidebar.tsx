import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-[304px] h-[calc(100vh-24px)] m-3 bg-white rounded-2xl shadow-[0px_16px_48px_rgba(0,0,0,0.12),0px_32px_48px_rgba(0,0,0,0.2)] flex-col justify-between p-6 relative">
      <div>
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#E56820] to-[#D45E3E] flex items-center justify-center shadow-lg relative overflow-hidden">
             <div className="absolute inset-0 bg-black opacity-10"></div>
             <span className="text-white font-bold text-xl relative z-10">V</span>
          </div>
          <span className="text-[#303030] font-bold text-2xl tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>VedaAI</span>
        </div>

        {/* Create Button */}
        <Link href="/assignments/create" className="flex items-center justify-center space-x-2 w-full bg-[#272727] text-white py-3 px-6 rounded-full shadow-[0px_16px_48px_rgba(255,255,255,0.12),inset_0px_-1px_3.5px_rgba(177,177,177,0.6)] mb-10 hover:bg-black transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          <span className="font-medium text-[15px]">Create Assignment</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
          <NavItem icon={<HomeIcon />} label="Home" disabled />
          <NavItem icon={<GroupsIcon />} label="My Groups" disabled />
          <NavItem icon={<AssignmentsIcon />} label="Assignments" active />
          <NavItem icon={<ToolkitIcon />} label="AI Teacher's Toolkit" disabled />
          <NavItem icon={<LibraryIcon />} label="My Library" badge="32" disabled />
        </nav>
      </div>

      {/* Footer Profile */}
      <div className="space-y-4">
        <NavItem icon={<SettingsIcon />} label="Settings" disabled />
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false, badge, disabled = false }: { icon: React.ReactNode, label: string, active?: boolean, badge?: string, disabled?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-gray-50'} ${active ? 'bg-[#F0F0F0]' : ''}`}>
      <div className="flex items-center space-x-3">
        <div className={`${active ? 'text-[#303030]' : 'text-gray-500'}`}>
          {icon}
        </div>
        <span className={`font-medium text-[15px] ${active ? 'text-[#303030]' : 'text-[#5E5E5E]'}`} style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          {label}
        </span>
      </div>
      {badge && (
        <span className="bg-[#FF5623] text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
          {badge}
        </span>
      )}
    </div>
  );
}

// Inline SVGs for the Sidebar
const HomeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const GroupsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const AssignmentsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const ToolkitIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const LibraryIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const SettingsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
