"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DEPARTMENTS } from "@/lib/constants";
import CertificateModal from "@/components/certificate-portal/CertificateModal";
import DeleteModal from "@/components/certificate-portal/DeleteModal";
import Sidebar from "@/components/certificate-portal/Sidebar";
import { useTheme } from "next-themes";
import EmployeeProfileCard from "@/components/EmployeeProfileCard";
import UserModal from "@/components/certificate-portal/UserModal";
import { FileUp, Loader2, User2 } from "lucide-react";
import Button from "@/components/flowbite/Button";
export default function AdminEmployeeDashboard() {
  const router = useRouter();
  const { theme } = useTheme();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (deptFilter !== "All") params.append("department", deptFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      if (json.success) {
        setEmployees(json.users || []);
        setFilteredEmployees(json.users || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => fetchUsers(), 500);
  //   return () => clearTimeout(timer);
  // }, [search]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/users?id=${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchUsers();
      } else {
        alert("Failed to delete User");
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
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
      <Sidebar
        theme={theme as "light" | "dark"}
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

          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-indigo-600 text-white p-2 rounded-lg shadow-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
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
              Manage Employees.
            </p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New
          </button>
        </div>

        {/* Filters Bar */}
        <div
          className={`mb-6 p-2 rounded-2xl border ${borderClass} ${cardBg} flex flex-col md:flex-row gap-2 md:gap-4`}
        >
          <div className="relative flex-1">
            <span className="absolute left-4 top-3 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search interns..."
              className={`w-full h-11 pl-12 pr-4 rounded-xl border-none outline-none bg-transparent ${textMain} placeholder-gray-500`}
              onChange={(e) => {
                setFilteredEmployees(
                  employees.filter(
                    (employee) =>
                      (deptFilter === employee.department ||
                        deptFilter === "All") &&
                      employee.name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                  )
                );
              }}
            />
          </div>

          <div
            className={`hidden md:block w-px my-2 ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            }`}
          ></div>

          <select
            className={`h-11 px-4 bg-transparent outline-none cursor-pointer ${textMain} w-full md:w-auto md:min-w-[180px] border-t md:border-t-0 ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              if (e.target.value === "All") {
                setFilteredEmployees(employees);
              } else {
                setFilteredEmployees(
                  employees.filter(
                    (employee) => e.target.value === employee.department
                  )
                );
              }
            }}
          >
            <option
              value="All"
              className={
                isDark ? "bg-[#1e232d] text-white" : "bg-white text-gray-900"
              }
            >
              All Departments
            </option>
            {DEPARTMENTS.map((d) => (
              <option
                key={d}
                value={d}
                className={
                  isDark ? "bg-[#1e232d] text-white" : "bg-white text-gray-900"
                }
              >
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Data Table */}
        <div
          className={`rounded-2xl grid ${
            !loading && filteredEmployees.length > 0 && "md:grid-cols-2"
          } gap-5 p-4 border overflow-hidden ${borderClass} ${cardBg} shadow-xl`}
        >
          {/* <EmployeeProfileCard/> */}
          {loading ? (
            <Loader2 className="animate-spin mx-auto! my-8" />
          ) : (
            filteredEmployees?.map((employee) => {
              return (
                <EmployeeProfileCard
                  setDeleteId={setDeleteId}
                  setDeleteOpen={setIsDeleteOpen}
                  setSelectedUser={setSelectedUser}
                  setIsEditOpen={setIsEditOpen}
                  key={employee.id}
                  employee={employee}
                />
              );
            })
          )}
          {!loading && filteredEmployees.length === 0 && (
            <div className="mx-auto flex flex-col justify-center items-center gap-1 my-3">
              <User2 size={30} />
              <div className="text-gray-700">
                {" "}
                No Employees Added!
              </div>
              <Button onClick={() => setIsAddOpen(true)}>
                Add Employee
              </Button>
            </div>
          )}
        </div>
      </main>

      <UserModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onRefresh={fetchUsers}
        theme={theme}
        mode="create"
      />

      {selectedUser && (
        <UserModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedUser(null);
          }}
          onRefresh={fetchUsers}
          theme={theme}
          mode="edit"
          initialData={selectedUser}
        />
      )}

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        theme={theme as "light" | "dark"}
        title="Delete User?"
        message="Are you sure you want to permanently delete this User? This action cannot be undone."
      />
    </div>
  );
}

// function CopyButton({ text, isDark }: { text: string, isDark: boolean }) {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error('Failed to copy!', err);
//     }
//   };

//   return (
//     <button
//       onClick={handleCopy}
//       className={`ml-2 p-1.5 rounded-md transition-colors ${
//         copied
//           ? 'text-green-500 bg-green-500/10'
//           : isDark
//             ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
//             : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
//       }`}
//       title="Copy to clipboard"
//     >
//       {copied ? (
//         // Checkmark Icon
//         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//         </svg>
//       ) : (
//         // Clipboard Icon
//         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//         </svg>
//       )}
//     </button>
//   );
// }
