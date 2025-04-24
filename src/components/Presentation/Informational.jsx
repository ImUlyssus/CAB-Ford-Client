import React, { useState, useEffect } from 'react';
import Ford_Logo from '../../assets/ford_logo.png';
import StyleText from '../StyleText';
import Dialog from '../../components/Dialog'; // Assuming you have a Dialog component
import Button from '../../components/Button'; // Assuming you have a Button component
import { HelpCircle } from "lucide-react";
import { useTheme } from "styled-components";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
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
const Informational = ({ changeRequests }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [informationalData, setInformationalData] = useState([]);

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    useEffect(() => {
        // Function to fetch initial data from the backend
        const fetchInitialData = async () => {
            try {
                const response = await fetch('/informational'); // Replace with your actual API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Parse change_sites string to JSON object
                const parsedData = data.map(item => ({
                    ...item,
                }));
                setInformationalData(parsedData);
            } catch (error) {
                console.error("Failed to fetch informational data:", error);
            }
        };

        fetchInitialData();
    }, []); // Empty dependency array ensures this runs only once after the initial render

    if (!changeRequests || !changeRequests.approved) {
        return <div className="w-full h-full bg-white p-8">No approved change requests available.</div>;
    }
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
            <div className="w-full max-h-[70%] overflow-y-auto border border-gray-300">
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
                        {informationalData.map((item, index) => {
                            const siteMapping = {
                                aat: 'AAT',
                                ftm: 'FTM',
                                fsst: 'FSST',
                            };


                            return (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-2 py-2">{StyleText(item.information_name)}</td>
                                    <td className="border border-gray-300 px-4 py-2">{item.change_sites}</td>
                                    <td className="border border-gray-300 px-2 py-2">
    {item.startDateTime ? formatDate(item.startDateTime) : 'N/A'} -
    {item.endDateTime ? formatDate(item.endDateTime) : 'N/A'}
</td>

                                    <td className="border border-gray-300 px-7 py-2">{StyleText(item.description)}</td>
                                    <td className="border border-gray-300 px-4 py-2">{StyleText(item.contact)}</td>
                                    <td className="border border-gray-300 px-4 py-2">{StyleText(item.reference)}</td>
                                    <td className="border border-gray-300 px-4 py-2">{StyleText(item.remarks)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Add Button */}
            <div className="mt-4 flex justify-end">
                <Button onClick={openDialog}>Add New</Button>
            </div>

            {/* Legend */}
            <div className="flex justify-center text-black gap-4 absolute bottom-2 justify-center w-full">
                <p className="font-semibold mb-2"><span className='px-2 py-1 bg-blue-700 text-white mr-2'>C</span>Completed</p>
                <p className="font-semibold mb-2"><span className='px-2 py-1 bg-blue-400 text-white mr-2'>O</span>Approved & ongoing implementation</p>
                <p className="font-semibold mb-2"><span className='px-2 py-1 bg-red-700 text-white mr-2'>R</span>Postponed / Cancelled</p>
            </div>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <InformationalForm
                    onClose={closeDialog}
                    setInformationalData={setInformationalData}
                    informationalData={informationalData}
                />
            </Dialog>
        </div>
    );
};

const InformationalForm = ({ onClose, setInformationalData, informationalData }) => { // Added props
    const theme = useTheme();
    const axiosPrivate = useAxiosPrivate();
    const [openDialog, setOpenDialog] = useState(null);
    const [formData, setFormData] = useState({
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
    });

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
            // Create a new object with only the selected sites
            let selectedSites = Object.entries(formData.change_sites)
                .filter(([site, value]) => value)
                .map(([site]) => site.toUpperCase()); // Or just site if you want lowercase
            
            selectedSites = selectedSites.join(', ');
            // Create the data to send to the backend
            const dataToSend = {
                ...formData,
                change_sites: selectedSites
            };
            // console.log("Data to send:", dataToSend);
            // Send data to backend using axios
            const response = await axiosPrivate.post('/informational', dataToSend);
            const newInformationalItem = response.data;

            // Update the informationalData state in the parent component
            setInformationalData([...informationalData, newInformationalItem]);

            onClose();
            alert("Informational data submitted successfully!");
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
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 text-center text-[#beef70]">Add New Information</h2>

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
                        onChange={() => handleCheckboxChange('aat')}
                        className="mr-2"
                    />
                    AAT
                </label>
                <label className="inline-flex items-center mr-4">
                    <input
                        type="checkbox"
                        name="ftm"
                        checked={formData.change_sites.ftm}
                        onChange={() => handleCheckboxChange('ftm')}
                        className="mr-2"
                    />
                    FTM
                </label>
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        name="fsst"
                        checked={formData.change_sites.fsst}
                        onChange={() => handleCheckboxChange('fsst')}
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
                    className="flex items-center absolute top-3 left-5 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                    style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
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
                <Button type="button" onClick={onClose}>Cancel</Button>
            </div>
        </form>
    );
};

export default Informational;
