"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  theme: 'light' | 'dark';
  onLogout: () => void;
  isOpen: boolean;  
  onClose: () => void;   
}

export default function Sidebar({ theme, onLogout, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const isDark = theme === 'dark';

  const asideClass = isDark ? "bg-[#0f1219] border-gray-800" : "bg-white border-gray-200";
  const textMain = isDark ? "text-gray-100" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";
  
  const mobileTransform = isOpen ? "translate-x-0" : "-translate-x-full";

  const navItems = [
    { label: "Certificates", href: "/admin/certificate-portal", icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )},
  ];

  return (
    <>
      <aside className={`w-64 h-screen fixed left-0 top-0 border-r ${asideClass} flex flex-col transition-transform duration-300 z-50 ${mobileTransform} md:translate-x-0`}>
        
        {/* Header with Close Button (Mobile Only) */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
            <span className={`text-lg font-bold ${textMain} tracking-tight`}>
              Arinova Studio
            </span>
          </div>
          {/* Close X for Mobile */}
          <button onClick={onClose} className="md:hidden text-gray-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className={`text-xs font-semibold uppercase tracking-wider mb-4 px-2 ${textSub}`}>
            Menu
          </div>
          
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={onClose} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                    : `${textSub} hover:bg-gray-800/50 hover:text-white`
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800/50">
          <button 
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-red-400 hover:bg-red-500/10`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay*/}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
    </>
  );
}