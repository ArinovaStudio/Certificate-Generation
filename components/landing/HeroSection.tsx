"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Button from "../CustomButton";
import Input from "../flowbite/Input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [text, setText] = useState("Authority");
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setText((prev) => (prev === "Authority" ? "Certainty" : "Authority"));
    }, 4000);

    return () => clearInterval(interval);
  }, []);
  const loadCertificate = async () => {
    router.push(`/${certificateId}`)
    // try {
    //   setLoading(true);
    //   const request = await fetch(`/api/admin/certificates/${certificateId}`, {
    //     headers: { "Content-Type": "application/json" },
    //   });
    //   const response = await request.json();
    //   if (response.success) {
    //     const certificate = response.certificate;
    //     const element = document.createElement("a");
    //     element.href=certificate.fileUrl+"#toolbar=0&#navpanes=0&#scrollbar=0";
    //     element.target="_blank";
    //     document.body.appendChild(element);
    //     element.click();
    //     element.remove();
    //   } else {
    //     throw Error(response.message);
    //   }
    // } catch (error: any) {
    //   toast.error(error.message);
    // } finally {
    //   setLoading(false);
    // }
  };
  return (
    <section className="max-md:place-items-center max-h-screen h-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start sm:px-20 px-4 py-20">
      <div className="max-md:order-2 py-5 justify-center h-full space-y-6 flex flex-col max-md:items-center">
        <h1 className="text-5xl md:text-7xl font-black leading-tight text-center md:text-left">
         Where Credibility {" "}
          <span className="italic">Becomes</span>{" "}
          <AnimatePresence mode="wait">
            <motion.span
              key={text}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block text-blue-500"
            >
              {text}
            </motion.span>
          </AnimatePresence>
        </h1>

        <p className="text-muted-foreground md:max-w-md text-xl text-center md:text-left">
          The official <span className="font-bold">Arinova Studio</span> system for verifying authentic internship credentials.
        </p>

        <div className="max-w-lg w-full flex items-center gap-3">
          <Input
            style={{borderRadius: 0}}
            value={certificateId}
            onChange={(e: any) => setCertificateId(e.target.value)}
            placeholder="Certificate Id"
            
          />
          <Button className="lowercase" disabled={certificateId.trim()===""} onClick={() => loadCertificate()}>
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Verify"
            )}
          </Button>
        </div>
      </div>

      <div className="max-md:order-1 w-full h-full">
            <img src={"/hero.webp"} className="w-full h-full object-contain" alt={"Text"}/>
      </div>
    </section>
  );
}
