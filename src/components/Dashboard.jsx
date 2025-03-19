import React from 'react';
import FirstSheet from './Sheets/FirstSheet';
import SecondSheet from './Sheets/SecondSheet';
import { useTheme } from 'styled-components';
const Dashboard = () => {
    const sheetStyle = "p-6 bg-gray-900 rounded-[15px]"
  return (
    <div className="grid grid-cols-2 grid-rows-[minmax(150px,_4fr)_minmax(100px,_3fr)] gap-4 h-screen">
      <div className={sheetStyle}>
        <FirstSheet />
      </div>
      <div className={sheetStyle}>
        <SecondSheet />
        </div>
      <div className={sheetStyle}>Item 3</div>
      <div className={sheetStyle}>Item 4</div>
    </div>
  );
}

export default Dashboard;
