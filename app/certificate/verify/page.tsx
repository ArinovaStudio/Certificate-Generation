"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface CertificateData {
  certificateId: string;
  candidateName: string;
  employeeId: string;
  position: string;
  department: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  isDownloaded: boolean;
}

export default function VerificationPage() {
  const [inputID, setInputID] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<CertificateData | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      if (storedTheme) {
        setTheme(storedTheme);
      }
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputID.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`/api/certificate/verify/${inputID}`);
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Certificate not found");
      }
      setData(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!data || data.isDownloaded) return;

    window.location.href = `/api/certificate/download/${data.certificateId}`;
    
    setData({ ...data, isDownloaded: true });
  };

  const isDark = theme === 'dark';
  
  const bgClass = isDark ? "bg-[#151923]" : "bg-[#f3f4f6]";
  const cardBgClass = isDark ? "bg-[#1e232d]" : "bg-white";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";
  const borderClass = isDark ? "border-gray-800" : "border-gray-200";
  const inputBg = isDark ? "bg-[#151923]" : "bg-gray-50";

  return (
    <main className={`min-h-screen ${bgClass} flex flex-col items-center justify-center p-4 font-sans transition-colors duration-300`}>
      
      <div className="mb-8 text-center animate-fade-in-down">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            A
          </div>
          <h1 className={`text-3xl font-bold ${textMain} tracking-tight`}>
            Arinova Studio
          </h1>
        </div>
        <p className={`${textSub} text-sm`}>Certificate Verification Portal</p>
      </div>

      {/* Main Card */}
      <div className={`w-full max-w-lg ${cardBgClass} rounded-2xl shadow-xl border ${borderClass} overflow-hidden transition-all duration-300`}>
        
        {/* Search Header */}
        <div className={`p-8 border-b ${borderClass}`}>
          <h2 className={`text-xl font-semibold ${textMain} mb-1`}>Verify Authenticity</h2>
          <p className={`${textSub} text-sm mb-6`}>Enter the unique Certificate ID provided to the intern.</p>
          
          <form onSubmit={handleVerify} className="relative">
            <input
              type="text"
              placeholder="e.g. AB12-XY34..."
              className={`w-full ${inputBg} border ${borderClass} ${textMain} rounded-xl py-3 px-4 pr-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
              value={inputID}
              onChange={(e) => setInputID(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loading || !inputID.trim()}
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400/50 text-white font-medium px-5 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : "Check"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}
        </div>

        {/* Certificate Details */}
        {data && (
          <div className="p-8 animate-fade-in-up">
            
            {/* Status Badge */}
            <div className={`mb-6 p-3 rounded-lg border flex items-center gap-3 ${
              data.isDownloaded 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                : 'bg-green-500/10 border-green-500/20 text-green-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${data.isDownloaded ? 'bg-amber-500' : 'bg-green-500'}`}></div>
              <span className="text-sm font-medium">
                {data.isDownloaded ? "Verified (Already Redeemed)" : "Verified & Available"}
              </span>
            </div>

            {/* Grid Data */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
               <DetailItem label="Candidate" value={data.candidateName} isDark={isDark} fullWidth />
               <DetailItem label="Employee ID" value={data.employeeId} isDark={isDark} />
               <DetailItem label="Department" value={data.department} isDark={isDark} />
               <DetailItem label="Position" value={data.position} isDark={isDark} fullWidth />
               
               <div className="col-span-2 grid grid-cols-2 gap-4">
                 <DetailItem label="Start Date" value={format(new Date(data.startDate), 'MMM dd, yyyy')} isDark={isDark} />
                 <DetailItem label="End Date" value={format(new Date(data.endDate), 'MMM dd, yyyy')} isDark={isDark} />
               </div>
            </div>

            {/* Download Button Area */}
            <div className={`pt-6 border-t ${borderClass}`}>
              {data.isDownloaded ? (
                <button disabled className={`w-full py-3 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} ${textSub} rounded-xl font-medium cursor-not-allowed flex justify-center items-center gap-2`}>
                   <span>Download Limit Reached</span>
                </button>
              ) : (
                <button 
                  onClick={handleDownload}
                  className="w-full group py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg shadow-green-900/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <span>Download Certificate</span>
                </button>
              )}
              <p className={`text-center ${textSub} text-xs mt-3`}>
                * This document can only be downloaded once.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function DetailItem({ label, value, isDark, fullWidth }: { label: string, value: string, isDark: boolean, fullWidth?: boolean }) {
  return (
    <div className={`${fullWidth ? 'col-span-2' : ''}`}>
      <p className={`text-xs uppercase tracking-wider font-semibold mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        {label}
      </p>
      <p className={`text-lg font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}