import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Button from './Button';
import { HelpCircle } from "lucide-react";
import StyleText from './StyleText';

const getUpcomingFriday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    let daysUntilFriday = 5 - dayOfWeek; // Calculate days until Friday

    // If today is Friday, set daysUntilFriday to 0
    if (dayOfWeek === 5) {
        daysUntilFriday = 0;
    } else if (daysUntilFriday < 0) {
        // If today is Saturday or Sunday, add 7 to get the next Friday
        daysUntilFriday += 7;
    }

    const upcomingFriday = new Date(today);
    upcomingFriday.setDate(today.getDate() + daysUntilFriday);

    // Format the date as YYYY-MM-DD
    const year = upcomingFriday.getFullYear();
    const month = String(upcomingFriday.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(upcomingFriday.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const InformationalFormPage = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [openDialog, setOpenDialog] = useState(null);
    const [formData, setFormData] = useState(() => ({
        information_name: '',
        change_sites: {
            aat: false,
            ftm: false,
            fsst: false,
        },
        description: '',
        contact: '',
        reference: '',
        remarks: '',
        startDateTime: '',
        endDateTime: '',
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCheckboxChange = (siteName) => {
        setFormData(prevState => ({
            ...prevState,
            change_sites: {
                ...prevState.change_sites,
                [siteName]: !prevState.change_sites[siteName]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let selectedSites = Object.entries(formData.change_sites)
                .filter(([site, value]) => value)
                .map(([site]) => site.toUpperCase());

            selectedSites = selectedSites.join(', ');

            const dataToSend = {
                ...formData,
                change_sites: selectedSites,
                date: getUpcomingFriday() // Add the date here
            };
            await axiosPrivate.post('/informational', dataToSend);

            navigate(-1); // Navigate back to the previous page
            alert("✅ Informational data submitted successfully!");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to submit the form. Please try again.");
        }
    };

    const SyntaxInfoBox = ({ isVisible, onClose }) => (
        isVisible && (
            <div className="absolute top-10 left-5 mt-2 w-64 p-3 bg-gray-800 text-white rounded-lg shadow-lg text-sm z-10">
                <h3 className="font-bold mb-2">Text Styling Syntax:</h3>
                <ul className="list-disc list-inside">
                    <li><strong>New Line:</strong> <code>[br]</code></li>
                    <li><strong>Bold:</strong> <code>[b]text[/b]</code></li>
                    <li><strong>Center:</strong> <code>[c]text[/c]</code></li>
                </ul>
                <button
                    onClick={onClose}
                    className="flex mt-2 text-sm text-red-400 hover:text-red-300 ml-auto"
                >
                    Close
                </button>
            </div>
        )
    );

    return (
        <div className="w-full h-full p-8">
            <h2 className="text-lg font-bold mb-4 text-center text-[#beef70]">Add New Information</h2>
            <form onSubmit={handleSubmit}>
                {/* Form Elements (same as before) */}
                <div className="mb-4">
                    <label htmlFor="information_name" className="block text-sm font-medium">Change Name:</label>
                    <input
                        type="text"
                        id="information_name"
                        name="information_name"
                        value={formData.information_name}
                        onChange={handleChange}
                        placeholder="Enter change name (300 characters max)"
                        maxLength="300"
                        className="mt-1 p-2 border rounded-md w-full"
                        required
                    />
                </div>

                <div className="mb-4">
                    <p className="block text-sm font-medium mb-3">Change Sites:</p>
                    <label className="inline-flex items-center mr-4">
                        <input
                            type="checkbox"
                            name="aat"
                            checked={formData.change_sites.aat}
                            onChange={()=>handleCheckboxChange('aat')}
                            className="mr-2"
                        />
                        AAT
                    </label>
                    <label className="inline-flex items-center mr-4">
                        <input
                            type="checkbox"
                            name="ftm"
                            checked={formData.change_sites.ftm}
                            onChange={()=>handleCheckboxChange('ftm')}
                            className="mr-2"
                        />
                        FTM
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="fsst"
                            checked={formData.change_sites.fsst}
                            onChange={()=>handleCheckboxChange('fsst')}
                            className="mr-2"
                        />
                        FSST
                    </label>
                </div>

                <div className="mb-4">
                    <label htmlFor="startDateTime" className="block text-sm font-medium">Start Datetime:</label>
                    <input
                        type="datetime-local"
                        id="startDateTime"
                        name="startDateTime"
                        value={formData.startDateTime}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="endDateTime" className="block text-sm font-medium">End Datetime:</label>
                    <input
                        type="datetime-local"
                        id="endDateTime"
                        name="endDateTime"
                        value={formData.endDateTime}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        placeholder='Enter description (500 characters max)'
                        onChange={handleChange}
                        maxLength="500"
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="contact" className="block text-sm font-medium">Contact:</label>
                    <input
                        type="text"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        placeholder='Enter contact (200 characters max)'
                        onChange={handleChange}
                        maxLength="200"
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                    <button
                        type='button'
                        onClick={() => setOpenDialog(true)}
                        className="flex items-center absolute top-15 left-18 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                        style={{ backgroundColor: "#fff18d", color: 'black' }}
                    >
                        Style your text
                        <HelpCircle className="w-4 h-4 ml-1" />
                    </button>

                    {/* Syntax Info Box */}
                    <SyntaxInfoBox
                        isVisible={openDialog}
                        onClose={() => setOpenDialog(null)}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="reference" className="block text-sm font-medium">Reference #:</label>
                    <input
                        type="text"
                        id="reference"
                        name="reference"
                        value={formData.reference}
                        placeholder='Enter reference # (200 characters max)'
                        onChange={handleChange}
                        maxLength="200"
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="remarks" className="block text-sm font-medium">Comment:</label>
                    <textarea
                        id="remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        placeholder='Enter comment (300 characters max)'
                        maxLength="300"
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>

                <div className="flex justify-end mt-4">
                    <Button type="submit" className="mr-2">Save</Button>
                    <Button type="button" onClick={() => navigate(-1)}>Cancel</Button>
                </div>
            </form>
        </div>
    );
};

export default InformationalFormPage;
