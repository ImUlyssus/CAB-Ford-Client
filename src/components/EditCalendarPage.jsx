import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DaysOfWeek from './DaysOfWeek';
import EditGridComponent from './EditGridComponent';
import { useTheme } from "styled-components";
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export default function EditCalendarPage() {
    const location = useLocation();
    const { calendar: initialCalendar, activeYear } = location.state || {};  // Access passed calendar data
    const theme = useTheme();
    const axiosPrivate = useAxiosPrivate();
    const [calendarData, setCalendarData] = useState(initialCalendar); // Initialize state with passed data
    const navigate = useNavigate();

    const handleSave = async () => {
        try {
            const response = await axiosPrivate.post('/business-calendar/update', {
                year: activeYear,
                calendarData: calendarData,
            });
            navigate(-1);
            // Optionally show a success message to the user
        } catch (error) {
            console.error('Error saving calendar data:', error);
            // Optionally show an error message to the user
        }
    };

    return (
        <div>
            <div className="flex justify-center">
                <h1 className="text-2xl font-bold text-center mb-3">Edit Calendar</h1>
            </div>
            <div className="flex justify-end mt-4" style={{ color: theme.colors.primary500 }}>
                <h5 className='py-2 px-5 font-bold mx-1 rounded-xl' style={{ border: "1px solid #f005bd", color: "#f005bd" }}>Holiday</h5>
                <h5 className='py-2 px-5 font-bold mx-1 rounded-xl' style={{ border: "1px solid green", color: "green" }}>Non-PROD</h5>
                <h5 className='py-2 px-5 font-bold mx-1 rounded-xl' style={{ border: "1px solid #10e7f7", color: "#10e7f7" }}>Overtime</h5>
                <h5 className='py-2 px-5 font-bold mx-1 rounded-xl' style={{ border: "1px solid white", color: "white" }}>Working Day</h5>
            </div>
            {/* Days of week section */}
            <div className="mt-3">
                <DaysOfWeek />
            </div>
            <div className="mt-3">
                <EditGridComponent calendar={calendarData} activeYear={activeYear} setCalendarData={setCalendarData} />
            </div>
            <div className="flex justify-center mt-4">
            <button onClick={()=>navigate(-1)} className="bg-gray-300 hover:bg-gray-700 text-black font-bold py-2 px-8 rounded mr-4 cursor-pointer">
                    Cancel
                </button>
                <button onClick={handleSave} className="bg-[#beef00] hover:bg-gray-700 text-black font-bold py-2 px-8 rounded cursor-pointer">
                    Save
                </button>
            </div>
        </div>
    );
}
