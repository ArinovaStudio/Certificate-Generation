"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Button from '@/components/CustomButton';
import Image from 'next/image';
export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {theme} = useTheme();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || "Login failed");
      }

      if (data.role === 'ADMIN') {
        router.push('/admin/certificate-portal');
      } else {
        router.push('/user/certificates'); 
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';
  const bgClass = isDark ? "bg-[#151923]" : "bg-[#f3f4f6]";
  const cardBg = isDark ? "bg-[#1e232d]" : "bg-white";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";
  const inputBg = isDark ? "bg-[#151923]" : "bg-gray-50";
  const borderClass = isDark ? "border-gray-800" : "border-gray-200";

  return (
    <main className={`min-h-screen ${bgClass} flex items-center justify-center p-4 font-sans transition-colors duration-300`}>
      
      <div className={`w-full max-w-md ${cardBg} rounded-2xl shadow-xl border ${borderClass} overflow-hidden p-8`}>
        
        {/* Header / Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 relative overflow-hidden mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            <Image src={"/logo.jpg"} fill className='object-fit' alt={"logo"}/>
          </div>
          <h1 className={`text-2xl font-bold ${textMain}`}>Arinova Portal</h1>
          <p className={`${textSub} text-sm mt-1`}>Sign in to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Identifier Input */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${textSub}`}>
              Email or Employee ID
            </label>
            <input
              type="text"
              required
              className={`w-full ${inputBg} border ${borderClass} ${textMain} px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all`}
              placeholder="e.g. admin@arinova.studio or EMP-101"
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${textSub}`}>
              Password
            </label>
            <input
              type="password"
              required
              className={`w-full ${inputBg} border ${borderClass} ${textMain} px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all`}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className='w-full!'
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : "Sign In"}
          </Button>
        </form>

        {/* Footer */}
        <div className={`mt-8 text-center text-xs ${textSub} opacity-50`}>
          Protected System • Arinova Studio
        </div>
      </div>
    </main>
  );
}