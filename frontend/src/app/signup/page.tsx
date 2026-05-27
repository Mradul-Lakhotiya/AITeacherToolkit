"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const setEmail = useAuthStore((state) => state.setEmail);
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/api/auth/signup", {
        email: emailInput,
        password,
      });
      setEmail(res.data.email);
      router.push("/assignments");
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#E56820] to-[#D45E3E] flex items-center justify-center shadow-lg relative overflow-hidden">
             <div className="absolute inset-0 bg-black opacity-10"></div>
             <span className="text-white font-bold text-2xl relative z-10">V</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-[#303030] mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Create an Account</h1>
        <p className="text-center text-[#5E5E5E] text-sm mb-8">Join VedaAI to generate beautiful question papers.</p>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm mb-6 text-center font-medium">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#303030] mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full border border-[#E5E5E5] rounded-xl px-4 py-3 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-black text-[14px] text-[#303030]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#303030] mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#E5E5E5] rounded-xl px-4 py-3 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-black text-[14px] text-[#303030]"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-[#FF5623] text-white py-3 rounded-full font-bold shadow-md hover:bg-[#e04c1e] transition flex justify-center disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-[#5E5E5E] mt-8 font-medium">
          Already have an account? <Link href="/login" className="text-[#303030] hover:underline font-bold">Sign in</Link>
        </p>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-center text-[#A9A9A9] leading-relaxed font-medium">
            Disclaimer: There is no strict authentication system. Information is stored solely mapped to your email ID for your convenience.
          </p>
        </div>
      </div>
    </div>
  );
}
