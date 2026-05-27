"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const email = useAuthStore((state) => state.email);
  const loginTimestamp = useAuthStore((state) => state.loginTimestamp);
  const logout = useAuthStore((state) => state.logout);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    if (!email) {
      router.push("/login");
      return;
    }
    
    // Check if session has expired (2 hours)
    if (loginTimestamp) {
      const TWO_HOURS = 2 * 60 * 60 * 1000;
      if (Date.now() - loginTimestamp > TWO_HOURS) {
        logout();
        router.push("/login");
      }
    }
  }, [email, loginTimestamp, router, logout, isClient]);

  if (!isClient) return null; // Wait for zustand to hydrate from localStorage
  if (!email) return null; // Prevent rendering before redirect

  return (
    <div className="flex h-screen overflow-hidden bg-white print:h-auto print:block">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden print:h-auto print:block">
        <div className="print:hidden">
          <TopHeader />
        </div>
        <main className="flex-1 overflow-y-auto p-4 pb-28 md:pb-4 relative print:overflow-visible print:p-0">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
