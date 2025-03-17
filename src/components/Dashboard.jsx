import React from 'react';
import FirstSheet from './Sheets/FirstSheet';
import { useTheme } from 'styled-components';
const Dashboard = () => {
    const sheetStyle = "p-6 bg-gray-900 rounded-[15px]"
  return (
    <div className="grid grid-cols-2 grid-rows-[3fr_2fr] gap-4 h-screen">
      <div className={sheetStyle}>
        <FirstSheet />
      </div>
      <div className={sheetStyle}>Item 2</div>
      <div className={sheetStyle}>Item 3</div>
      <div className={sheetStyle}>Item 4</div>
    </div>
  );
}

export default Dashboard;
