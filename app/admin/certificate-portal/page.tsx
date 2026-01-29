"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DEPARTMENTS } from '@/lib/constants';
import CertificateModal from '@/components/certificate-portal/CertificateModal';
import DeleteModal from '@/components/certificate-portal/DeleteModal'; 
import Sidebar from '@/components/certificate-portal/Sidebar';

export default function AdminDashboard() {
  const router = useRouter();
  
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as 'light' | 'dark';
      if (stored) setTheme(stored);
    }
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (deptFilter !== 'All') params.append('department', deptFilter);

      const res = await fetch(`/api/admin/certificates?${params.toString()}`);
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const json = await res.json();
      setCertificates(json.certificates || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchCertificates(), 500);
    return () => clearTimeout(timer);
  }, [search, deptFilter]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/certificates/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCertificates();
      } else {
        alert("Failed to delete certificate");
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const isDark = theme === 'dark';
  const pageBg = isDark ? "bg-[#151923]" : "bg-gray-100";
  const cardBg = isDark ? "bg-[#1e232d]" : "bg-white";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const borderClass = isDark ? "border-gray-800" : "border-gray-200";

  return (
    <div className={`min-h-screen ${pageBg} font-sans transition-colors duration-300`}>
      
      <Sidebar 
        theme={theme} 
        onLogout={handleLogout} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="md:ml-64 p-4 md:p-8 transition-all duration-300">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
             <button 
               onClick={() => setSidebarOpen(true)}
               className={`p-2 rounded-lg ${isDark ? 'bg-[#1e232d] text-white' : 'bg-white text-gray-800'} shadow-sm`}
             >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
             </button>
             <span className={`font-bold ${textMain}`}>Arinova Studio</span>
           </div>
           
           <button
             onClick={() => setIsAddOpen(true)}
             className="bg-indigo-600 text-white p-2 rounded-lg shadow-lg"
           >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
           </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-end mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${textMain} tracking-tight`}>Dashboard</h1>
            <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage certificates and intern records.
            </p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add New
          </button>
        </div>

        {/* Filters Bar */}
        <div className={`mb-6 p-2 rounded-2xl border ${borderClass} ${cardBg} flex flex-col md:flex-row gap-2 md:gap-4`}>
           <div className="relative flex-1">
             <span className="absolute left-4 top-3 text-gray-400">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </span>
             <input 
               type="text" 
               placeholder="Search interns..." 
               className={`w-full h-11 pl-12 pr-4 rounded-xl border-none outline-none bg-transparent ${textMain} placeholder-gray-500`}
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
           
           <div className={`hidden md:block w-px my-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

           <select 
             className={`h-11 px-4 bg-transparent outline-none cursor-pointer ${textMain} w-full md:w-auto md:min-w-[180px] border-t md:border-t-0 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
             value={deptFilter}
             onChange={(e) => setDeptFilter(e.target.value)}
           >
             <option value="All" className={isDark ? "bg-[#1e232d] text-white" : "bg-white text-gray-900"}>
               All Departments
             </option>
             {DEPARTMENTS.map(d => (
               <option key={d} value={d} className={isDark ? "bg-[#1e232d] text-white" : "bg-white text-gray-900"}>
                 {d}
               </option>
             ))}
           </select>
        </div>

        {/* Data Table */}
        <div className={`rounded-2xl border overflow-hidden ${borderClass} ${cardBg} shadow-xl`}>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className={`text-xs uppercase tracking-wider border-b ${borderClass} ${isDark ? 'bg-[#1a1f2b] text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                  <th className="px-6 py-4 font-semibold">Candidate Info</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Certificate ID</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`text-sm divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
                {loading ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-500">Loading...</td></tr>
                ) : certificates.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-500">No records found.</td></tr>
                ) : (
                  certificates.map((cert) => (
                    <tr key={cert.id} className={`group transition-colors ${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}`}>
                      {/* Candidate */}
                      <td className="px-6 py-4">
                        <div className={`font-semibold ${textMain}`}>{cert.candidateName}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{cert.employeeId}</div>
                      </td>
                      
                      {/* Department */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                          {cert.department}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {cert.isDownloaded ? (
                          <div className="flex items-center gap-1.5 text-amber-500">
                            <span className="relative flex h-2 w-2">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            <span className="text-xs font-medium">Downloaded</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-green-500">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            <span className="text-xs font-medium">Active</span>
                          </div>
                        )}
                      </td>

                      {/* Cert ID */}
                      <td className="px-6 py-4">
                        <div className={`font-mono text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{cert.certificateId}</div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => { setSelectedCert(cert); setIsEditOpen(true); }}
                              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500'}`}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(cert.id)}
                              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                            >
                              Delete
                            </button>
                          </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <CertificateModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onRefresh={fetchCertificates}
        theme={theme}
        mode="create" 
      />
      
      {selectedCert && (
        <CertificateModal 
          isOpen={isEditOpen} 
          onClose={() => { setIsEditOpen(false); setSelectedCert(null); }} 
          onRefresh={fetchCertificates}
          theme={theme}
          mode="edit"
          initialData={selectedCert}
        />
      )}

      <DeleteModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        theme={theme}
        title="Delete Certificate?"
        message="Are you sure you want to permanently delete this certificate? This action cannot be undone."
      />

    </div>
  );
}