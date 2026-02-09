"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Button from "@/components/flowbite/Button";
import { Download, Trash2, Pencil, FileDown } from "lucide-react";
import { Button as ShadcnButton } from "./ui/button";
import { useState } from "react";
interface CertificateCardProps {
  fetchCertificates: any;
  CopyButton?: any;
  certificate: any;
}

export default function CertificateUserCard({
    fetchCertificates,
    CopyButton,
  certificate
}: CertificateCardProps) {
  const [loading,setLoading] = useState(false);
  const downloadFile = () => {
    const element = document.createElement("a");
    element.id = "download-pdf";
    element.href = certificate.fileUrl.replace("/raw/upload/","/raw/upload/fl_attachment/");
    element.download = certificate?.fileName;
    element.target="_blank";
    element.rel="noopener noreferrer"
    document.body.appendChild(element);
    element.click();
    element.remove();
  };
  const downloadHandler = async () => {
    setLoading(true);
    try{
    const request = await fetch(`/api/user`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({certificateId:certificate.certificateId})})
    const response = await request.json();
    if(response.success){
      downloadFile();
      fetchCertificates();
    }
    }catch(error){

    }
    setLoading(false);
}
  return (
    <Card className="w-full md:max-w-md py-0! overflow-hidden rounded-2xl shadow-lg">
      {/* Image Preview */}
      <div className="relative h-44 w-full">
        <div className="h-full flex items-center justify-center bg-gray-200">
          <FileDown className="text-gray-600" size={50} />
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold capitalize">
          {certificate?.title}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-4">
          {certificate?.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="text-slate-900 flex items-center justify-start gap-2">
          <div>Assigned to:</div>
          <span className="text-blue-400">{certificate?.user?.name}</span>
        </div>
        <div className="text-slate-900 flex items-center justify-start gap-2">
            <div>
          Download Status:
          </div>
          <div>
            {<div className={`p-1 px-2 shadow-lg text-xs rounded-full ${certificate?.isDownloaded ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`}>{certificate?.isDownloaded ? "Downloaded":"Not Downloaded Yet!"}</div>}
          </div>
        </div>
        <div className="flex items-center justify-start gap-2">
            <div className="text-slate-900">
          Certificate Id:
          </div>
          <div className="text-slate-700">
            {certificate?.certificateId} <CopyButton text={certificate?.certificateId}/>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center my-2 mb-4">
        <p className="text-slate-500">
          {new Date(certificate?.createdAt).toLocaleDateString()}
        </p>
        <Button disabled={certificate?.isDownloaded || loading} onClick={downloadHandler}>
          <Download size={20} />
          {certificate?.isDownloaded ? "Downloaded":"Download"}
        </Button>
      </CardFooter>
    </Card>
  );
}
