"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface PdfModalProps extends React.PropsWithChildren {
  open: boolean;
  setOpen: any;
  data: any;
  setData: any;
}

export default function PdfModal({
  open,
  setOpen,
  data,
  setData,
  children,
}: PdfModalProps) {

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value === false) {
          setData(null);
        }
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="flex flex-col max-w-5xl h-[90vh] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>{data?.title}</DialogTitle>
        </DialogHeader>

        <div className="w-full h-full flex-1">
          <iframe
            src={`${data?.fileUrl}#toolbar=0&#navpanes=0&scrollbar=0`}
            onContextMenu={(e)=>e.preventDefault()}
            className="w-full h-full"
            title={data?.title}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
