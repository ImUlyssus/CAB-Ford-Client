import React from 'react';
import Ford_Logo from '../assets/ford_logo.png';
import StyleText from './StyleText';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Bangkok'
    });

    return formatter.format(date);
};
const EditInformational = ({informationalData, setInformationalData}) => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const navigateToForm = () => {
        navigate('/informational-form'); // Navigate to the form page
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this informational item?");
    
        if (confirmDelete) {
            try {
                const response = await axiosPrivate.delete(`/informational/${id}`); // Send delete request to backend
    
                if (response.status === 200) { // Check if the request was successful (status code 200)
                    // Update state to remove the deleted item
                    setInformationalData(prevData => prevData.filter(item => item.id !== id));
                    alert("Informational item deleted successfully!");
                } else {
                    // Handle the error if the backend reports a failure
                    console.error("Error deleting informational item:", response.data.message);
                    alert("Failed to delete informational item. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting informational item:", error);
                alert("Failed to delete informational item. Please try again.");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mt-3">
                <h1 className="m-0 font-bold text-xl">Informational for this week</h1>
                <div className="flex space-x-3">
                    <Button onClick={navigateToForm} className="px-4 py-2 rounded cursor-pointer" style={{ backgroundColor: '#beef00', color: 'black' }}>Add New Information</Button>
                </div>
            </div>
            <div className="w-full h-full bg-white p-8 relative mt-3">
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
                                <th className="border border-gray-300 px-4 py-2">Action</th>
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
                                    <td className="border border-gray-300 px-4 py-2">
                                        <div className="flex justify-center">
                                            <Button onClick={() => handleDelete(item.id)} className="px-2 py-1 rounded cursor-pointer ml-2" style={{ backgroundColor: 'red', color: 'white' }}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EditInformational;
