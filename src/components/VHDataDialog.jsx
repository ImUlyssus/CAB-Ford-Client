import React from "react";
import { useTheme } from "styled-components";

function Dialog({ open, onClose, children }) {
    if (!open) return null;
    const theme = useTheme();

    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center backdrop-blur-sm bg-opacity-90">
            <div
                // className="relative w-11/12 md:w-1/2 rounded shadow-lg flex flex-col"
                className="sticky top-0 bg-opacity-90 z-10 p-4 border-b"
                style={{
                    backgroundColor: theme.colors.primary400,
                    maxHeight: '50vh', // Restrict max height
                    width: '80%',
                    overflow: 'hidden', // Prevent entire div from scrolling
                }}
            >
                {/* Close Button (Sticky at the top) */}
                <div className="sticky top-0 bg-opacity-90 z-11 p-2" style={{ backgroundColor: theme.colors.primary400 }}>
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 bg-gray-800 p-2 rounded hover:text-gray-100 cursor-pointer"
                    >
                        Close
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6" style={{ maxHeight: '55vh' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Dialog;
