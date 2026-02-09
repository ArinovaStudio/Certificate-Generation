"use client";

import { useState } from "react";
import { format } from "date-fns";
import { DEPARTMENTS, EMPLOYEE_TYPE, POSITIONS } from "@/lib/constants";
import Button from "../CustomButton";
export default function UserModal({
  isOpen,
  onClose,
  onRefresh,
  theme,
  mode,
  initialData,
}: any) {
  const isDark = theme === "dark";

  const inputBase = `w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all duration-200`;
  const inputTheme = isDark
    ? "bg-[#0f1219] border-gray-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
    : "bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

  const labelClass = `block text-xs font-semibold uppercase tracking-wide mb-1.5 ${
    isDark ? "text-gray-400" : "text-gray-500"
  }`;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const url = "/api/admin/users";

      const method = mode === "create" ? "POST" : "PUT";
      const fData = Object.fromEntries(formData);
      const finalData =
        method === "PUT" ? { id: initialData.id, ...fData } : { ...fData };
      const res = await fetch(url, { method, body: JSON.stringify(finalData) });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Operation failed");
      }

      onRefresh();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div
        className={`relative! w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isDark ? "bg-[#1e232d] border border-gray-700" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-5 border-b flex justify-between items-center ${
            isDark ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <h2
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {mode === "create" ? "Add New Employee" : "Edit Employee Details"}
          </h2>
          <Button
            onClick={onClose}
            size={"icon"}
          >
            ✕
          </Button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="certForm" onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1 */}
            <div className="grid lg:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Employee ID</label>
                <input
                  name="employeeId"
                  defaultValue={initialData?.employeeId}
                  required
                  disabled={mode === "edit"}
                  className={`${inputBase} ${inputTheme}`}
                  placeholder="e.g. emp-013"
                />
              </div>
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  name="name"
                  defaultValue={initialData?.name}
                  required
                  className={`${inputBase} ${inputTheme}`}
                  placeholder="Full Name"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div
              className={`grid grid-cols-${
                mode === "create" ? "2" : "1"
              } gap-5`}
            >
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={initialData?.email}
                  required
                  className={`${inputBase} ${inputTheme}`}
                  placeholder="email@example.com"
                />
              </div>
              {mode === "create" && (
                <div>
                  <label className={labelClass}>Password</label>
                  <input
                    name="password"
                    required
                    type="password"
                    className={`${inputBase} ${inputTheme}`}
                    placeholder="********"
                  />
                </div>
              )}
            </div>

            {/* Row 3 */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Role / Designation</label>
                <select
                  name="designation"
                  required
                  defaultValue={initialData?.employeeType || ""}
                  className={`uppercase ${inputBase} ${inputTheme}`}
                >
                  <option value="" disabled>
                    Select Employee Position
                  </option>
                  {POSITIONS.map((position) => (
                    <option className="uppercase" key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Department</label>
                <select
                  name="department"
                  required
                  defaultValue={initialData?.department || ""}
                  className={`uppercase ${inputBase} ${inputTheme}`}
                >
                  <option value="" disabled>
                    Select Department
                  </option>
                  {DEPARTMENTS.map((dept) => (
                    <option className="uppercase" key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Date of Joining</label>
                <input
                  type="date"
                  name="startDate"
                  defaultValue={
                    initialData?.startDate
                      ? format(new Date(initialData.startDate), "yyyy-MM-dd")
                      : ""
                  }
                  className={`${inputBase} ${inputTheme}`}
                />
              </div>
              <div>
                <label className={labelClass}>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  defaultValue={
                    initialData?.endDate
                      ? format(new Date(initialData.endDate), "yyyy-MM-dd")
                      : ""
                  }
                  className={`${inputBase} ${inputTheme}`}
                />
              </div>
            </div>

            <div className="grid gap-5">
              <div>
                <label className={labelClass}>Employee Type</label>
                <select
                  name="employeeType"
                  required
                  defaultValue={initialData?.employeeType || ""}
                  className={`${inputBase} ${inputTheme}`}
                >
                  <option value="" disabled>
                    Select Employee Type
                  </option>
                  {EMPLOYEE_TYPE.map(([empKey, empType]) => (
                    <option key={empKey} value={empKey}>
                      {empType}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 text-red-500 text-sm rounded-xl border border-red-500/20 flex items-center gap-2">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t flex justify-end gap-3 ${
            isDark
              ? "border-gray-700 bg-[#151923]"
              : "border-gray-100 bg-gray-50"
          }`}
        >
          <Button
            onClick={onClose}
            variant={"outline"}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="certForm"
            disabled={loading}
            className="text-sm font-medium transition-all flex items-center gap-2"
          >
            {loading && (
              <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
            )}
            {mode === "create" ? "Add Employee" : "Update Employee"}
          </Button>
        </div>
      </div>
    </div>
  );
}
