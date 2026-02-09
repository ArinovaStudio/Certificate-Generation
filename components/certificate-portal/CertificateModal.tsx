"use client";

import { useState } from "react";
import Button from "../CustomButton";
export default function CertificateModal({
  isOpen,
  onClose,
  onRefresh,
  theme,
  users,
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

    // Logic to allow resetting download status
    if (mode === "edit") {
      const resetDownload = formData.get("resetDownload") === "on";
      if (resetDownload) {
        formData.append("isDownloaded", "false");
      }
    }

    try {
      const url =
        mode === "create"
          ? "/api/admin/certificates"
          : `/api/admin/certificates/${initialData.id}`;

      const method = mode === "create" ? "POST" : "PUT";
      console.log(Object.fromEntries(formData));
      const res = await fetch(url, { method, body: formData });
      const json = await res.json();

      if (!res.ok) {
        if (json.details) {
          const detailedError = Object.values(json.details).flat().join(", ");
          throw new Error(detailedError);
        }
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
        className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
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
            {mode === "create"
              ? "Upload New Certificate"
              : "Edit Certificate Details"}
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
            <div className="grid gap-5">
              <div>
                <label className={labelClass}>Certificate Id</label>
                <input
                  type="text"
                  name="certificateId"
                  placeholder="Certificate Id"
                  defaultValue={
                    initialData?.certificateId
                      || ""
                  }
                  onChange={(e)=>{e.target.value=e.target.value.trim()}}
                  disabled={mode==="edit"}
                  required
                  className={`${inputBase} ${inputTheme}`}
                />
              </div>
              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Certificate Title"
                  defaultValue={
                    initialData?.title
                      || ""
                  }
                  required
                  className={`${inputBase} ${inputTheme}`}
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  name="description"
                  rows={5}
                  placeholder="Certificate Description"
                  defaultValue={
                    initialData?.description || ""
                  }
                  required
                  className={`${inputBase} ${inputTheme}`}
                />
              </div>
              <div>
                <label className={labelClass}>Assign To Employee</label>
                <select
                  name="employeeId"
                  required
                  defaultValue={initialData?.employeeId || ""}
                  className={`${inputBase} ${inputTheme}`}
                >
                  <option value="" disabled>
                    Select Employee
                  </option>
                  {
                    users.map((user: any)=>{
                      return <option key={user.employeeId} value={user.employeeId}>{user.name}</option>
                    })
                  }
                </select>
              </div>
            </div>

            {/* File Upload Area */}
            <div
              className={`p-5 rounded-xl border border-dashed transition-colors ${
                isDark
                  ? "border-gray-700 bg-[#0f1219]/50 hover:border-gray-500"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400"
              }`}
            >
              <label className={labelClass}>Certificate PDF</label>
              <div className="mt-2 flex items-center gap-4">
                <input
                  type="file"
                  name="file"
                  accept="application/pdf"
                  required={mode === "create"}
                  className={`block w-full text-sm 
                    file:mr-4 file:py-2.5 file:px-4 file:border-0
                    file:text-xs file:font-semibold
                    file:bg-primary file:text-white
                    hover:file:bg-primary transition-all cursor-pointer`}
                />
              </div>
              {mode === "edit" && (
                <p
                  className={`text-xs mt-2 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Current file:{" "}
                  <span className="font-mono">{initialData.fileName}</span>{" "}
                  (Upload to replace)
                </p>
              )}
            </div>

            {/* Reset Toggle (Edit Only) */}
            {mode === "edit" && (
              <div
                className={`flex items-center gap-3 p-4 rounded-xl border ${
                  isDark
                    ? "bg-indigo-500/10 border-indigo-500/20"
                    : "bg-indigo-50 border-indigo-100"
                }`}
              >
                <input
                  type="checkbox"
                  name="resetDownload"
                  id="resetDownload"
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <label
                    htmlFor="resetDownload"
                    className={`block text-sm font-medium cursor-pointer ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Reset Download Status
                  </label>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Allow the intern to download this file one more time.
                  </p>
                </div>
              </div>
            )}

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
            className="text-sm font-medium shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2"
          >
            {loading && (
              <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
            )}
            {mode === "create" ? "Upload Certificate" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
