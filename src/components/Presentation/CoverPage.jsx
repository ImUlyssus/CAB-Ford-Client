import React from 'react'
import Ford_Logo from '../../assets/ford_font.png'
// CoverPage.jsx
export default function CoverPage({ theme }) {
    return (
        <div className="w-full h-full bg-white flex flex-col p-8 relative">
        {/* Centered content container */}
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center text-[#003478]">
          {/* Main heading with underline */}
          <h1 className="text-2xl font-bold border-b-2 border-gray-300">
            Thailand Site IT Change Advisory Board (TH-CAB)
          </h1>
          
          {/* Date section */}
          <div className="my-2">
            <p className="text-md">
              Friday, 23rd, August 2024
            </p>
          </div>
        </div>
      
        {/* Ford text in bottom right corner */}
        <div className="absolute bottom-8 right-8 text-[#003478]">
            <img src={Ford_Logo} alt="Ford Logo" className="h-40 w-80 inline-block" />
        </div>
      </div>
    );
  }
