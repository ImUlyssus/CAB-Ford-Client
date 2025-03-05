// src/components/Dialog.jsx
import React from "react";
import { useTheme } from "styled-components";
function Dialog({ open, onClose, children }) {
    if (!open) return null;
    const theme = useTheme();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-90">
            <div
                className={`p-6 rounded shadow-lg relative w-11/12 md:w-1/2`}
                style={{ backgroundColor: theme.colors.primary400 }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
}

export default Dialog;
