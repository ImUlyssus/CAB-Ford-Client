import React from 'react';

const VHDrawer = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay to close the drawer when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Version History Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 bg-gray-900 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Version History</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✕ {/* Close button */}
          </button>
        </div>

        {/* Version history content */}
        <div className="p-4">
          <ul className="space-y-3">
            <li className="border p-3 rounded-md">Version 1.0 - Initial Release</li>
            <li className="border p-3 rounded-md">Version 1.1 - Bug Fixes</li>
            <li className="border p-3 rounded-md">Version 1.2 - UI Improvements</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default VHDrawer;
