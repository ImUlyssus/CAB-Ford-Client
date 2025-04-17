
import React, { useRef } from 'react';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';


import FirstSheet from './Sheets/FirstSheet';
import SecondSheet from './Sheets/SecondSheet';
import ThirdSheet from './Sheets/ThirdSheet';
import FourthSheet from './Sheets/FourthSheet';
import FifthSheet from './Sheets/FifthSheet';
import SixthSheet from './Sheets/SixthSheet';
import SevenSheet from './Sheets/SeventhSheet';
import EightSheet from './Sheets/EightSheet';

const Dashboard = () => {
  const sheetStyle = "p-6 bg-white rounded-[15px]";
  const pdfContainerRef = useRef(null);

  const sheets = [
    FirstSheet,
    SecondSheet,
    FifthSheet,
    SevenSheet,
    SixthSheet,
    EightSheet,
    FourthSheet,
    ThirdSheet,
  ];


  return (
    <div>

      {/* UI - Visible Grid */}
      <div className="grid grid-cols-2 grid-rows-[repeat(4, minmax(150px, 1fr))] gap-4">
    <div className={sheetStyle}>
      <FirstSheet />
    </div>
    <div className={sheetStyle}>
      <SecondSheet />
      </div>
    <div className={sheetStyle}>
      <FifthSheet />
    </div>
    <div className={sheetStyle}>
      <SevenSheet />
    </div>
    <div className={sheetStyle}>
      <SixthSheet />
    </div>
    <div className={sheetStyle}>
      <EightSheet />
    </div>
    <div className={sheetStyle}>
      <FourthSheet />
    </div>
    <div className={sheetStyle}>
      <ThirdSheet />
    </div>
  </div>

      {/* Hidden PDF DOM - One per page */}
<div
  ref={pdfContainerRef}
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    overflow: 'hidden',
    zIndex: -9999,
  }}
>
  {sheets.map((Sheet, idx) => (
    <div
      key={idx}
      className="p-6 bg-white"
      style={{ width: '794px', height: '1123px', marginBottom: '20px' }}
    >
      <Sheet />
    </div>
  ))}
</div>

    </div>
  );
};

export default Dashboard;

// import React from 'react';
// import FirstSheet from './Sheets/FirstSheet';
// import SecondSheet from './Sheets/SecondSheet';
// import { useTheme } from 'styled-components';
// import ThirdSheet from './Sheets/ThirdSheet';
// import FourthSheet from './Sheets/FourthSheet';
// import FifthSheet from './Sheets/FifthSheet';
// import SixthSheet from './Sheets/SixthSheet';
// import SevenSheet from './Sheets/SeventhSheet';
// import EightSheet from './Sheets/EightSheet';
// const Dashboard = () => {
//   const sheetStyle = "p-6 bg-white rounded-[15px]"
// return (
//   <div className="grid grid-cols-2 grid-rows-[repeat(4, minmax(150px, 1fr))] gap-4">
//     <div className={sheetStyle}>
//       <FirstSheet />
//     </div>
//     <div className={sheetStyle}>
//       <SecondSheet />
//       </div>
//     <div className={sheetStyle}>
//       <FifthSheet />
//     </div>
//     <div className={sheetStyle}>
//       <SevenSheet />
//     </div>
//     <div className={sheetStyle}>
//       <SixthSheet />
//     </div>
//     <div className={sheetStyle}>
//       <EightSheet />
//     </div>
//     <div className={sheetStyle}>
//       <FourthSheet />
//     </div>
//     <div className={sheetStyle}>
//       <ThirdSheet />
//     </div>
//   </div>
// );
// }


// export default Dashboard;
