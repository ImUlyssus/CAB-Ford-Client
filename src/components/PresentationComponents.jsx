import React, { useState } from 'react';
import BusinessCalendar from './BusinessCalendar';
import EditInformational from './EditInformational';
import RemarksSummary from './RemarksSummary';
const PresentationComponents = ({calendar, informationalData, setInformationalData, remarksSummary, setRemarksSummary }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

const Tab1Content = () => (
    <BusinessCalendar calendar={calendar} />
);

const Tab2Content = () => (
  <EditInformational informationalData={informationalData} />
);

const Tab3Content = () => (
  <div className="p-4">
    <h2>Tab 3 Content</h2>
    <p>This is the content for Tab 3.</p>
  </div>
);
  return (
    <div className="w-full mt-[40px]">
        <h1 className="m-0 font-bold text-xl text-center mb-4">Presentation Components</h1>
      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          className={`w-1/3 py-2 px-4 font-semibold ${activeTab === 0 ? 'bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-t-lg' : 'text-white'}`}
          onClick={() => handleTabClick(0)}
        >
          Business Calendar
        </button>
        <button
          className={`w-1/3 py-2 px-4 font-semibold ${activeTab === 1 ? 'bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-t-lg' : 'text-white'}`}
          onClick={() => handleTabClick(1)}
        >
          Informational
        </button>
        <button
          className={`w-1/3 py-2 px-4 font-semibold ${activeTab === 2 ? 'bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-t-lg' : 'text-white'}`}
          onClick={() => handleTabClick(2)}
        >
          Summary Remarks
        </button>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {activeTab === 0 && <BusinessCalendar calendar={calendar} />}
        {activeTab === 1 && <EditInformational informationalData={informationalData} setInformationalData={setInformationalData} />}
        {activeTab === 2 && <RemarksSummary remarksSummary={remarksSummary} setRemarksSummary={setRemarksSummary} />}
      </div>
    </div>
  );
};

export default PresentationComponents;
