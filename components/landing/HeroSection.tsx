"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Button from "../CustomButton";
import Input from "../flowbite/Input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
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
    <section className="max-md:place-items-center max-h-[600px] h-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start md:max-w-7xl mx-auto! px-6 py-20">
      <div className="max-md:order-2 py-5 justify-between space-y-6 flex flex-col max-md:items-center">
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
              className="inline-block"
            >
              {text}
            </motion.span>
          </AnimatePresence>
        </h1>

        <p className="text-muted-foreground md:max-w-md text-xl text-center md:text-left">
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
          <Button disabled={certificateId.trim()===""} onClick={() => loadCertificate()}>
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Verify"
            )}
          </Button>
        </div>
      </div>

      <div className="max-md:order-1 max-md:max-w-100 max-md:min-h-100 w-full relative h-full flex justify-end items-end md:justify-end">
            <Image src={"/hero.webp"} fill priority className="justify-self-end" alt={"Text"}/>
      </div>
    </section>
  );
}
