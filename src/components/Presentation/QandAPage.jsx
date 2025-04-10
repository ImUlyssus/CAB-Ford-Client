import React from 'react'
import Ford_Logo from '../../assets/ford_logo_no_bg.png'
// CoverPage.jsx
export default function QandAPage({ theme }) {
    return (
        <div className="w-full h-full bg-[#052460] flex flex-col p-8 relative">
        {/* Centered content container */}
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center">
          {/* Main heading with underline */}
          <h1 className="text-8xl text-center">
            Q&A
          </h1>
        </div>
        {/* Ford text in bottom right corner */}
        <div className="absolute bottom-8 right-8 text-[#003478]">
            <img src={Ford_Logo} alt="Ford Logo" className="h-30 w-80 inline-block" />
        </div>
      </div>
    );
  }
