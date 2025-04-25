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

const RemarksSummaryFormPage = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [openDialog, setOpenDialog] = useState(null);
    const [formData, setFormData] = useState(() => ({
        common_remark: '',
        aat_remark: '',
        ftm_remark: '',
        fsst_remark: '',
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = {
                ...formData,
                date: getUpcomingFriday() // Add the date here
            };
            await axiosPrivate.post('/summary-remarks', dataToSend);

            navigate(-1); // Navigate back to the previous page
            alert("✅ Summary remarks submitted successfully!");
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
            <h2 className="text-lg font-bold mb-4 text-center text-[#beef70]">Add Remarks</h2>
            <form onSubmit={handleSubmit}>
                {/* Form Elements (same as before) */}

                <div className="mb-4">
                    <label htmlFor="common_remark" className="block text-sm font-medium">Common Remark:</label>
                    <textarea
                        id="common_remark"
                        name="common_remark"
                        value={formData.description}
                        placeholder='Enter common remark (300 characters max)'
                        onChange={handleChange}
                        maxLength="300"
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="aat_remark" className="block text-sm font-medium">AAT Remark:</label>
                    <textarea
                        id="aat_remark"
                        name="aat_remark"
                        value={formData.description}
                        placeholder='Enter AAT remark (300 characters max)'
                        onChange={handleChange}
                        maxLength="300"
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="ftm_remark" className="block text-sm font-medium">FTM Remark:</label>
                    <textarea
                        id="ftm_remark"
                        name="ftm_remark"
                        value={formData.description}
                        placeholder='Enter FTM remark (300 characters max)'
                        onChange={handleChange}
                        maxLength="300"
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="fsst_remark" className="block text-sm font-medium">FSST Remark:</label>
                    <textarea
                        id="fsst_remark"
                        name="fsst_remark"
                        value={formData.description}
                        placeholder='Enter FSST remark (300 characters max)'
                        onChange={handleChange}
                        maxLength="300"
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>

                <div className="mb-4">
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

                <div className="flex justify-end mt-4">
                    <Button type="submit" className="mr-2">Save</Button>
                    <Button type="button" onClick={() => navigate(-1)}>Cancel</Button>
                </div>
            </form>
        </div>
    );
};

export default RemarksSummaryFormPage;
