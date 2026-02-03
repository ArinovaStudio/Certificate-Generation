"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Button from "../flowbite/Button";
import Input from "../flowbite/Input";
import CertificateModal from "@/components/CertificateModal";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
export default function HeroSection() {
  const [text, setText] = useState("achievements");
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setText((prev) => (prev === "achievements" ? "awards" : "achievements"));
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const loadCertificate = async () => {
    try {
      setLoading(true);
      const request = await fetch(`/api/admin/certificates/${certificateId}`, {
        headers: { "Content-Type": "application/json" },
      });
      const response = await request.json();
      if (response.success) {
        const certificate = response.certificate;
        const element = document.createElement("a");
        element.href=certificate.fileUrl+"#toolbar=0&#navpanes=0&#scrollbar=0";
        element.target="_blank";
        document.body.appendChild(element);
        element.click();
        element.remove();
      } else {
        throw Error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="max-md:place-items-center grid grid-cols-1 lg:grid-cols-2 gap-12 items-center md:max-w-7xl mx-auto! px-6 py-20">
      <div className="max-md:order-2 space-y-6 flex flex-col max-md:items-center">
        <h1 className="text-2xl md:text-5xl font-bold leading-tight text-center md:text-left">
          The industry standard for <br />
          <span className="italic">verified</span>{" "}
          <AnimatePresence mode="wait">
            <motion.span
              key={text}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-blue-700 inline-block"
            >
              {text}
            </motion.span>
          </AnimatePresence>
        </h1>

        <p className="text-muted-foreground md:max-w-md text-center md:text-left">
          <span className="font-bold">Is it real?</span> In the age of AI,
          companies use Lunix to guarantee authenticity of the things that
          matter most.
        </p>

        <div className="max-w-lg w-full flex items-center gap-3">
          <Input
            value={certificateId}
            onChange={(e: any) => setCertificateId(e.target.value)}
            placeholder="Certificate Id"
          />
          <Button onClick={() => loadCertificate()}>
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Verify"
            )}
          </Button>
        </div>
      </div>

      <div className="max-md:order-1 relative flex justify-center md:justify-end">
        <div className="w-72 h-72 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="w-32 h-20 rounded-xl bg-white shadow flex items-center justify-center">
            <span className="text-sm font-medium">Verified</span>
          </div>
        </div>
      </div>
    </section>
  );
}
