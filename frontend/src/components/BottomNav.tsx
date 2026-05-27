"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard", // or wherever Home goes
      label: "Home",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    },
    {
      href: "/assignments",
      label: "Assignments",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      href: "/library",
      label: "Library",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    },
    {
      href: "/toolkit",
      label: "AI Toolkit",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
      )
    }
  ];

  if (pathname === '/assignments/create') {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[373px] px-[10px]">
      <div className="bg-[#181818] rounded-[24px] px-6 py-2 h-[72px] flex justify-between items-center shadow-[0px_16px_48px_rgba(0,0,0,0.12),0px_32px_48px_rgba(0,0,0,0.2)]">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && item.href !== "/";
          const isDisabled = item.href !== "/assignments";
          return (
            <Link 
              key={item.label}
              href={isDisabled ? "#" : item.href} 
              onClick={(e) => isDisabled && e.preventDefault()}
              className={`flex flex-col items-center justify-center space-y-1 ${isActive ? 'text-white' : 'text-white/40 hover:text-white/70'} ${isDisabled ? 'cursor-not-allowed opacity-50' : ''} transition-colors`}
            >
              <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform`}>
                {item.icon}
              </div>
              <span className="text-[12px] font-semibold whitespace-nowrap" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
