"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ name: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      if (storedTheme) setTheme(storedTheme);
    }
  }, []);

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

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push('/admin/certificate-portal');
      
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
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            A
          </div>
          <h1 className={`text-2xl font-bold ${textMain}`}>Admin Portal</h1>
          <p className={`${textSub} text-sm mt-1`}>Sign in to manage certificates</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Username Input */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${textSub}`}>
              Username
            </label>
            <input
              type="text"
              required
              className={`w-full ${inputBg} border ${borderClass} ${textMain} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
              placeholder="admin"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              className={`w-full ${inputBg} border ${borderClass} ${textMain} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.98] flex justify-center items-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className={`mt-8 text-center text-xs ${textSub} opacity-50`}>
          Protected System • Arinova Studio
        </div>
      </div>
    </main>
  );
}