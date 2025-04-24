import React, { useState } from 'react';

// Dummy Components for each Tab
const Tab1Content = () => (
  <div className="p-4">
    <h2>Tab 1 Content</h2>
    <p>This is the content for Tab 1.</p>
  </div>
);

const Tab2Content = () => (
  <div className="p-4">
    <h2>Tab 2 Content</h2>
    <p>This is the content for Tab 2.</p>
  </div>
);

const Tab3Content = () => (
  <div className="p-4">
    <h2>Tab 3 Content</h2>
    <p>This is the content for Tab 3.</p>
  </div>
);

const PresentationComponents = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          className={`w-1/3 py-2 px-4 font-semibold ${activeTab === 0 ? 'bg-blue-500 text-white border-b-2 border-blue-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          onClick={() => handleTabClick(0)}
        >
          Tab 1
        </button>
        <button
          className={`w-1/3 py-2 px-4 font-semibold ${activeTab === 1 ? 'bg-blue-500 text-white border-b-2 border-blue-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          onClick={() => handleTabClick(1)}
        >
          Tab 2
        </button>
        <button
          className={`w-1/3 py-2 px-4 font-semibold ${activeTab === 2 ? 'bg-blue-500 text-white border-b-2 border-blue-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          onClick={() => handleTabClick(2)}
        >
          Tab 3
        </button>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {activeTab === 0 && <Tab1Content />}
        {activeTab === 1 && <Tab2Content />}
        {activeTab === 2 && <Tab3Content />}
      </div>
    </div>
  );
};

export default PresentationComponents;
