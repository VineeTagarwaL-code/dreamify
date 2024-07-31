"use client";
import { useState, useRef, useEffect } from "react";
import { TheDream } from "@/components/the-dream";
import { Button } from "@/components/ui/button";
import html2canvas from 'html2canvas';
import {
  exportComponentAsJPEG,
  exportComponentAsPDF,
  exportComponentAsPNG,
} from "react-component-export-image";


export default function Home() {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isShareIconHovering, setIsShareIconHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isExporting) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isExporting]);

  useEffect(() => {
    let hoverInterval: NodeJS.Timeout;
    let hoverTimeout: NodeJS.Timeout;

    const startHoverInterval = () => {
      hoverInterval = setInterval(() => {
        setIsShareIconHovering(true);
        hoverTimeout = setTimeout(() => {
          setIsShareIconHovering(false);
        }, 3000);
      }, 8000);
    };

    startHoverInterval();

    return () => {
      clearInterval(hoverInterval);
      clearTimeout(hoverTimeout);
    };
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Set the html2CanvasOptions to scale the component
    const html2CanvasOptions = {
      scale: 4, // Adjust the scale for zoom effect
      useCORS: true,
    };
    if (componentRef.current === null) return;
    await exportComponentAsPNG(componentRef, { html2CanvasOptions });

    setIsExporting(false);
  };

  return (
    <div
      className="relative min-h-screen text-white flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/4256852/pexels-photo-4256852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')" }}
      ref={componentRef}
    >

      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 p-4">
        <TheDream />
        {!isExporting && (
          <Button
            variant="outline"
            className={`w-full mt-4 bg-transparent hover:bg-neutral-900 border-none text-transparent hover:text-white transition-all duration-300 ${
              isShareIconHovering ? 'bg-neutral-900 text-white' : ''
            }`}
            onClick={handleExport}
          >
            <ShareIcon className="mr-2 h-4 w-4 font-MyFont" />
            Export
          </Button>
        )}
      </div>
    </div>
  );
}

function ShareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}
