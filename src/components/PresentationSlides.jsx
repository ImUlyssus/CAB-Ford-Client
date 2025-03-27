import React, { useState, useEffect } from "react";
import { useTheme } from 'styled-components';
import CoverPage from "./Presentation/CoverPage";
import BusinessCalendarSlide from "./Presentation/BusinessCalendarSlide";
import ApprovedCRC from "./Presentation/ApprovedCRC";
import ApprovedCRO from "./Presentation/ApprovedCRO";
import ApprovedCRR from "./Presentation/ApprovedCRR";
import ForApprovalCommon from "./Presentation/ForApprovalCommon";
const slides = [
  CoverPage,
  BusinessCalendarSlide,
  ApprovedCRC,
  ApprovedCRO,
  ApprovedCRR,
  ForApprovalCommon
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const theme = useTheme();

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Fullscreen presentation view
  // In your fullscreen presentation view (replace the existing code)
if (isFullscreen) {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50"> {/* Changed bg-black to bg-white */}
      <div className="w-full h-[80%] relative">
      {slides.map((SlideComponent, index) => (
  <div
    key={index}
    className={`w-[90%] absolute inset-y-0 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ease-in-out ${
      index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    {React.createElement(SlideComponent, { theme })}
  </div>
))}

        
        {/* Fullscreen controls (keep existing) */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-black/30 p-4 rounded-full text-white hover:bg-black/50 transition text-3xl"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-black/30 p-4 rounded-full text-white hover:bg-black/50 transition text-3xl"
        >
          ❯
        </button>
        
      </div>
      <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 bg-black/30 p-3 rounded-full text-white hover:bg-black/50 transition"
        >
          Exit
        </button>
    </div>
  );
}

  // Normal view
  return (
    <>
      <div className="flex justify-between items-center mt-2">
        <h1 className="m-0 font-bold text-xl">This week presentation</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 rounded cursor-pointer" style={{backgroundColor: theme.colors.secondary500, color: theme.colors.primary500}}>
            Edit
          </button>
          <button 
            onClick={toggleFullscreen}
            className="px-4 py-2 rounded cursor-pointer" 
            style={{backgroundColor: theme.colors.primaryButton, color: theme.colors.primary500}}
          >
            Present now
          </button>
        </div>
      </div>

      <div className="w-340 mx-auto my-2" style={{ borderBottom: "1px solid", borderBlockColor: theme.colors.primary200 }}></div>

      <div className="relative w-250 mx-auto">
        {/* Carousel Wrapper */}
        <div className="relative w-full h-0 pb-[56.25%] overflow-hidden bg-gray-100 rounded-lg shadow-lg">
          {slides.map((SlideComponent, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              {React.createElement(SlideComponent, { theme })}
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-4 h-4 rounded-full bg-gray-400 transition-all ${
                currentIndex === index ? "bg-blue-600 scale-110" : "opacity-50"
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <button onClick={prevSlide} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 p-3 rounded-full text-white hover:bg-black/50 transition">
          ❮
        </button>
        <button onClick={nextSlide} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 p-3 rounded-full text-white hover:bg-black/50 transition">
          ❯
        </button>
      </div>
    </>
  );
}