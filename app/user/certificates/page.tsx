"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserSidebar from "@/components/certificate-portal/UserSidebar";
import { useTheme } from "next-themes";
import { FileUp, Loader2 } from "lucide-react";
import CertificateUserCard from "@/components/CertificateUserCard";
export default function AdminDashboard() {
  const router = useRouter();
  const { theme } = useTheme();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/`);
      if (res.status === 401) {
        router.push("/login");
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
    fetchCertificates();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const isDark = theme === "dark";
  const pageBg = isDark ? "bg-[#151923]" : "bg-gray-100";
  const cardBg = isDark ? "bg-[#1e232d]" : "bg-white";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const borderClass = isDark ? "border-gray-800" : "border-gray-200";

  return (
    <div
      className={`min-h-screen ${pageBg} font-sans transition-colors duration-300`}
    >
      <UserSidebar
        theme={theme as "dark" | "light"}
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
              className={`p-2 rounded-lg ${
                isDark ? "bg-[#1e232d] text-white" : "bg-white text-gray-800"
              } shadow-sm`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <span className={`font-bold ${textMain}`}>Arinova Studio</span>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-end mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${textMain} tracking-tight`}>
              Dashboard
            </h1>
            <p
              className={`mt-1 text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              My certificates.
            </p>
          </div>
        </div>

        <div
          className={`rounded-2xl border overflow-hidden ${borderClass} ${cardBg} shadow-xl`}
        >
          <div className="overflow-x-auto custom-scrollbar">
            {loading === false ? (
              certificates.length > 0 ? (
                <div className="p-4 py-8 grid lg:grid-cols-3 gap-5">
                  {certificates.map((certificate) => {
                    return (
                      <CertificateUserCard
                        fetchCertificates={fetchCertificates}
                        CopyButton={CopyButton}
                        certificate={certificate}
                        key={certificate.id}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="mx-auto my-6 flex flex-col justify-center items-center gap-3">
                  <FileUp size={30} />
                  <div className="text-gray-700">
                    {" "}
                    No Certificates Uploaded Yet!
                  </div>
                </div>
              )
            ) : (
              <Loader2 className="animate-spin my-6 mx-auto" />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function CopyButton({ text, isDark }: { text: string; isDark: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`ml-2 p-1.5 rounded-md transition-colors ${
        copied
          ? "text-green-500 bg-green-500/10"
          : isDark
          ? "text-gray-500 hover:text-gray-300 hover:bg-gray-700"
          : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
      }`}
      title="Copy to clipboard"
    >
      {copied ? (
        // Checkmark Icon
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        // Clipboard Icon
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
      )}
    </button>
  );
}
