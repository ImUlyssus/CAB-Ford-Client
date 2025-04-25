import React, { useState } from 'react';
import Ford_Logo from '../../assets/ford_logo.png';
import StyleText from '../StyleText';
const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-US', { // Or your desired locale
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Bangkok' // Set the timezone
    });

    return formatter.format(date);
};
const Informational = ({ informationalData }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };
    console.log("Informational data", informationalData);
    return (
        <div className="w-full h-full bg-white p-8 relative">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6 text-[#003478] border-b-2 border-gray-300 pb-2">
                Informational
            </h1>
            <div className='flex absolute top-2 right-2'>
                <img src={Ford_Logo} className='h-5 w-15' alt="Ford Logo" />
            </div>
            {/* Table */}
            <div className="w-full max-h-[80%] overflow-y-auto border border-gray-300 mb-[10px]">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-[#003478] text-center text-xs sticky top-0 z-10">
                            <tr>
                                <th className="border border-gray-300 px-2 py-2">Change name</th>
                                <th className="border border-gray-300 px-4 py-2">Site</th>
                                <th className="border border-gray-300 px-4 py-2">Schedule (Thailand GMT+7)</th>
                                <th className="border border-gray-300 px-7 py-2">Description</th>
                                <th className="border border-gray-300 px-4 py-2">Contact</th>
                                <th className="border border-gray-300 px-4 py-2">Reference #</th>
                                <th className="border border-gray-300 px-4 py-2">Comment</th>
                            </tr>
                        </thead>
                        <tbody className="text-black text-xs">
                            {informationalData.map((item, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-2 py-2">{StyleText(item.information_name)}</td>
                                    <td className="border border-gray-300 px-4 py-2">{item.change_sites}</td>
                                    <td className="border border-gray-300 px-2 py-2">
                                        {item.startDateTime ? formatDate(item.startDateTime) : 'N/A'} -
                                        {item.endDateTime ? " " + formatDate(item.endDateTime) : 'N/A'}
                                    </td>
                                    <td className="border border-gray-300 px-7 py-2">{StyleText(item.description)}</td>
                                    <td className="border border-gray-300 px-4 py-2">{StyleText(item.contact)}</td>
                                    <td className="border border-gray-300 px-4 py-2">{StyleText(item.reference)}</td>
                                    <td className="border border-gray-300 px-4 py-2">{StyleText(item.remarks)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
    );
};


export default Informational;
