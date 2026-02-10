"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import image from "@/public/side_image.png"

export default function CertificateVerificationPage() {
  const { certificateId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter()
  useEffect(() => {
    if (!certificateId) return;

    const fetchCertificate = async () => {
      try {
        const res = await fetch(
          `/api/certificate/verify/${certificateId}`
        );

        if (!res.ok) {
          throw new Error("Certificate not found");
        }

        const result = await res.json();
        console.log(result);
        
        setData(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Verifying certificate...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          ❌ Certificate not found or invalid
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-[#F4F6F8] px-4 py-14">
  <div className="mx-auto max-w-6xl">

    {/* Back Button */}
    <button
      onClick={() => router.back()}
      className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-black"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to verification
    </button>

    {/* HERO */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-14 bg-white border border-slate-200 px-10 py-12">

      {/* LEFT */}
      <div>
        <span className="inline-block border border-black px-3 py-1 text-xs font-semibold tracking-widest uppercase">
          Verified Credential
        </span>

        <h1 className="mt-5 text-4xl font-bold text-slate-900 leading-tight">
          {data.title}
        </h1>

        <p className="mt-4 text-slate-600 text-sm leading-relaxed">
          {data.description}
        </p>

        {/* Certificate ID */}
        <div className="mt-8 border-t border-slate-200 pt-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Certificate ID
          </p>
          <p className="mt-1 font-mono text-slate-900 text-sm">
            {data.certificateId}
          </p>
        </div>

        {/* Verified CTA */}
        <div className="mt-8 inline-flex items-center gap-3 bg-black px-6 py-3 text-white text-sm font-semibold tracking-wide">
          ✓ VERIFIED & AUTHENTIC
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center">
        <img
          src={image.src}
          alt="Certificate verification illustration"
          className="max-h-85 w-auto"
        />
      </div>
    </div>

    {/* INFORMATION GRID */}
    <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10">

      {/* USER DETAILS */}
      <div className="bg-white border border-slate-200 p-8">
        <h3 className="text-sm font-bold tracking-widest uppercase text-slate-700 mb-6">
          Recipient Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10 text-sm">
          <Info label="Full Name" value={data.user.name} />
          <Info label="Email" value={data.user.email} />
          <Info label="Department" value={data.user.department || "—"} />
          <Info label="Employee Type" value={data.user.employeeType} />
          <Info label="Start Date" value={new Date(data.user.startDate).toDateString()} />
          <Info label="End Date" value={new Date(data.user.endDate).toDateString()} />
        </div>
      </div>

      {/* CERTIFICATE META */}
      <div className="bg-white border border-slate-200 p-8">
        <h3 className="text-sm font-bold tracking-widest uppercase text-slate-700 mb-6">
          Certificate Metadata
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10 text-sm">
          <Info
            label="Issued On"
            value={new Date(data.createdAt).toDateString()}
          />
          <Info
            label="Employee ID"
            value={data.user.employeeId}
          />
          <Info
            label="Credential Type"
            value="Employment Certificate"
          />
          <Info
            label="Verification Mode"
            value="Digital Verification"
          />
        </div>
      </div>
    </div>

    {/* FOOTER LEGAL */}
    <div className="mt-16 border-t border-slate-300 pt-6">
      <p className="text-center text-xs text-slate-500 leading-relaxed max-w-3xl mx-auto">
        This page serves as official proof that the above certificate has been
        issued to the named individual and verified through an internal digital
        verification system. Any unauthorized modification, reproduction, or
        misuse of this credential renders it invalid.
      </p>
    </div>

  </div>
</div>


  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-medium text-slate-900">
        {value}
      </p>
    </div>
  );
}
