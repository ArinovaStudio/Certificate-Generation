"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Button from "@/components/CustomButton";
import { Download, Trash2, Pencil, FileDown } from "lucide-react";
interface CertificateCardProps {
  CopyButton?: any;
  certificate: any;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CertificateCard({
  CopyButton,
  certificate,
  onEdit,
  onDelete,
}: CertificateCardProps) {
  const downloadFile = () => {
    const element = document.createElement("a");
    element.id = "download-pdf";
    element.href = certificate.fileUrl.replace(
      "/raw/upload/",
      "/raw/upload/fl_attachment/"
    );
    element.download = certificate?.fileName;
    element.target = "_blank";
    element.rel = "noopener noreferrer";
    document.body.appendChild(element);
    element.click();
    element.remove();
  };
  return (
    <Card className="w-full md:max-w-md py-0! overflow-hidden rounded-2xl shadow-lg">
      {/* Image Preview */}
      <div className="relative h-44 w-full">
        <div className="h-full flex items-center justify-center bg-gray-200">
          <FileDown className="text-gray-600" size={50} />
        </div>

        {/* Action Buttons */}
        <div className="absolute right-3 top-3 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full!"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="h-9 w-9 rounded-full!"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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
          <div>Download Status:</div>
          <div>
            {
              <div
                className={`p-1 px-2 shadow-lg text-xs rounded-full ${
                  certificate?.isDownloaded
                    ? "bg-green-500"
                    : "bg-yellow-500 animate-pulse"
                }`}
              >
                {certificate?.isDownloaded ? "Downloaded" : "Not Downloaded!"}
              </div>
            }
          </div>
        </div>
        <div className="flex items-center justify-start gap-2">
          <div className="text-slate-900">Certificate Id:</div>
          <div className="text-slate-700">
            {certificate?.certificateId}{" "}
            <CopyButton text={certificate?.certificateId} />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center my-2 mb-4">
        <p className="text-slate-500">
          {new Date(certificate?.createdAt).toLocaleDateString()}
        </p>
        <Button onClick={downloadFile}>
          <Download size={20} />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
