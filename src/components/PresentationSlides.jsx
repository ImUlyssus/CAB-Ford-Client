import React, { useState, useEffect } from "react";
import { useTheme } from 'styled-components';
import { useNavigate } from "react-router-dom";
import CoverPage from "./Presentation/CoverPage";
import BusinessCalendarSlide from "./Presentation/BusinessCalendarSlide";
import ApprovedCRC from "./Presentation/ApprovedCRC";
import ApprovedCRO from "./Presentation/ApprovedCRO";
import ApprovedCRR from "./Presentation/ApprovedCRR";
import ForApprovalCommon from "./Presentation/ForApprovalCommon";
import ForApprovalAAT from "./Presentation/ForApprovalAAT";
import ForApprovalFTM from "./Presentation/ForApprovalFTM";
import ForApprovalFSST from "./Presentation/ForApprovalFSST";
import Summary from "./Presentation/Summary";
import CustomDateDialog from './CustomDateDialog';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const slides = [
  CoverPage,
  BusinessCalendarSlide,
  ApprovedCRC,
  ApprovedCRO,
  ApprovedCRR,
  ForApprovalCommon,
  ForApprovalAAT,
  ForApprovalFTM,
  ForApprovalFSST,
  Summary
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const theme = useTheme();
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [customDate, setCustomDate] = useState(false);
  const [changeRequests, setChangeRequests] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
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

  useEffect(()=>{
      const getThisWeekData = async () => {
        try {
            const response = await axiosPrivate.get('/change-requests/get-this-week-data');
            console.log(response.data)
            setChangeRequests(response.data);
        } catch (err) {
            console.error("Error fetching this week data:", err.response ? err.response.data : err.message); // Debugging
            // setError(err.response ? err.response.data.message : err.message);
            navigate('/login', { state: { from: location }, replace: true });
        }
    };
    getThisWeekData();
    },[])

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
    {React.createElement(SlideComponent, { theme, changeRequests })}
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
const handleSave = async (start, end) => {
  setIsCustomDateOpen(false); // Close the dialog
  setCustomDate(true);

  // Format start and end dates to include time
  const formattedStartDate = `${start} 00:00:00`;
  const formattedEndDate = `${end} 23:59:59`;
  console.log("Selected Dates:", formattedStartDate, formattedEndDate);
  try {
      const response = await axiosPrivate.get("/change-requests/custom-date", {
          params: {
              start: formattedStartDate,
              end: formattedEndDate,
          },
      });

      console.log("📥 Custom Date Data:", response.data);
      setChangeRequests(response.data); // Update state with filtered data
  } catch (err) {
      console.error("❌ Error fetching custom date data:", err.response ? err.response.data : err.message);
  }
};
  // Normal view
  return (
    <>
      <div className="flex justify-between items-center mt-2">
        <h1 className="m-0 font-bold text-xl">This week presentation</h1>
        <div className="flex space-x-3">
        {customDate ? 
            <button
                className="bg-gray-500 hover:bg-[#beef70] text-black font-bold py-2 px-4 rounded"
                onClick={() => {
                    setCustomDate(false);
                }}
            >
                Clear Custom Date
            </button>
            : <button
                className="border-1 border-[#beef00] hover:bg-[#beef70] hover:text-black text-[#beef70] font-bold py-2 px-4 rounded"
                onClick={() => {
                    setIsCustomDateOpen(true);
                    setCustomDate(true);
                }
                }
            >
                Custom Date
            </button>}

            {/* Dialog for selecting dates */}
            <CustomDateDialog open={isCustomDateOpen} onClose={() => {
                setCustomDate(false);
                setIsCustomDateOpen(false);
                }} onSave={handleSave}
                 />
          <button 
            onClick={toggleFullscreen}
            className="px-4 py-2 rounded cursor-pointer font-bold" 
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