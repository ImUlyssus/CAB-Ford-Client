import React, { useState } from 'react';
import Ford_Logo from '../../assets/ford_logo.png';
import Appendix1_Photo from '../../assets/appendix1.png';
import Appendix2_Photo from '../../assets/appendix2.png';
import { Info } from 'lucide-react';
import { useTheme } from "styled-components";
// import Dialog from '../Sheets/Dialog';
import Button from '../Button';

const Appendix1 = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <div className="w-full h-full bg-white p-8 relative">
            <div className='flex absolute top-2 right-2 items-center'>
                <img src={Ford_Logo} className='h-5 w-15 mr-2' alt="Ford Logo" />
            </div>
            <button
                    onClick={openDialog}
                    className="flex ml-auto mb-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                    aria-label="Show Appendix Information"
                >
                    <Info size={15} />
                </button>
            {/* Table */}
            <div className="w-full max-h-[100%] overflow-y-auto border border-white">
                <img src={Appendix1_Photo} className='h-full w-full' alt="Appendix 1" />
                <img src={Appendix2_Photo} className='h-full w-full' alt="Appendix 2" />
            </div>

            {/* Dialog */}
            
        </div>
    );
};

{/* <Dialog open={isDialogOpen} onClose={closeDialog} /> */}
function AppendixDialog({ open, onClose }) {
    if (!open) return null;
    const theme = useTheme();

    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center backdrop-blur-sm bg-opacity-90">
            <div
                // className="relative w-11/12 md:w-1/2 rounded shadow-lg flex flex-col"
                className="sticky top-0 bg-opacity-90 z-10 p-4 border-b"
                style={{
                    backgroundColor: "#EFEEEA",
                    height: '90%', // Restrict max height
                    width: '90%',
                    overflow: 'hidden', // Prevent entire div from scrolling
                }}
            >
                {/* Close Button (Sticky at the top) */}
                <div className="sticky top-0 bg-opacity-90 z-11 p-2" style={{ backgroundColor: "#EFEEEA" }}>
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 bg-gray-800 p-2 rounded hover:text-gray-100 cursor-pointer"
                    >
                        Close
                    </button>
                </div>
                <h2 className="text-lg font-bold text-black mb-4">Appendix Information</h2>
                {/* Scrollable Content */}
                <div className="p-3 overflow-y-auto" style={{ maxHeight: '80vh', overflowY: 'auto', paddingBottom: '20vh' }}>
                <img src={Appendix1_Photo} className='h-full w-full mb-3' alt="Appendix 1" />
                <img src={Appendix2_Photo} className='h-full w-full' alt="Appendix 2" />
                </div>
            </div>
        </div>
    );
}


export default AppendixDialog;