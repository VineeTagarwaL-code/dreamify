"use client";
import { useState, useRef, useEffect } from "react";
import { TheDream } from "@/components/the-dream";
import {
  exportComponentAsJPEG,
  exportComponentAsPDF,
  exportComponentAsPNG,
} from "react-component-export-image";
import { Button } from "@/components/ui/button";

export default function Home() {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isShareIconHovering, setIsShareIconHovering] = useState(false);
  const videoRef = useRef(null);

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


    setIsShareIconHovering(false);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (componentRef.current === null) return;
    await exportComponentAsPNG(componentRef);
    setIsExporting(false);
  };

  return (
    <div
      className="relative min-h-screen text-white flex justify-center items-center bg-cover bg-center"
      ref={componentRef}
    >

     <video
      ref={videoRef}
      autoPlay={!isExporting}
      loop
      muted
      className="absolute top-0 left-0 w-full h-full object-cover"
    >
        <source src="https://videos.pexels.com/video-files/3175515/3175515-uhd_3840_2160_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 p-4">
        <TheDream />
        {!isExporting && (
          <Button
            variant="outline"
            className={`w-full mt-4 bg-transparent hover:bg-cyan-700 border-none text-transparent hover:text-white transition-all duration-300 ${
              isShareIconHovering ? 'bg-cyan-700 text-white' : ''
            }`}
            onClick={handleExport}
          >
            <ShareIcon className="mr-2 h-4 w-4" />
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
