import React from 'react';
import { useLocation } from 'react-router-dom';
import DaysOfWeek from './DaysOfWeek';
import EditGridComponent from './EditGridComponent';
import { useTheme } from "styled-components";
export default function EditCalendarPage() {
    const location = useLocation();
    const { calendar, activeYear } = location.state || {};  // Access passed calendar data
    const theme = useTheme();
    console.log(activeYear);
    console.log(calendar);
    return (
        <div>
            <div className="flex justify-center">
                    <h1 className="text-2xl font-bold text-center mb-3">Edit Calendar</h1>
                </div>
            {/* Render the calendar data or use it for further editing */}
            <div className="flex justify-end mt-4" style={{ color: theme.colors.primary500 }}>
                <h5 className='py-2 px-5 font-bold mx-1 rounded-xl' style={{ border: "1px solid #f005bd", color: "#f005bd" }}>Holiday</h5>
                <h5 className='py-2 px-5 font-bold mx-1 rounded-xl' style={{ border: "1px solid green", color: "green" }}>Non-PROD</h5>
                <h5 className='py-2 px-5 font-bold mx-1 rounded-xl' style={{ border: "1px solid #10e7f7", color:"#10e7f7" }}>Overtime</h5>
                <h5 className='py-2 px-5 font-bold mx-1 rounded-xl' style={{ border: "1px solid white", color: "white" }}>Working Day</h5>
            </div>
            {/* Days of week section */}
            <div className="mt-3">
            <DaysOfWeek />
            </div>
            <div className="mt-3">
            {/* <Calendar data={filteredCalendarData} /> */}
            <EditGridComponent calendar={calendar} activeYear={activeYear} />
            {/* <div style={{ height: "450px", overflowY: "auto", paddingBottom: "10px" }}> */}
                {/* {calendar.map((monthData, index) => ( */}
                    {/* <div key={index} style={{ paddingTop: "10px" }}> */}
                    {/* <EditGridComponent activeYear={activeYear} allSitesMonths={calendar} /> */}
                {/* </div> */}
                {/* ))} */}
            {/* </div> */}
            </div>
        </div>
    );
}
