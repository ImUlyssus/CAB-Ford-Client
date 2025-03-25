import React, {use, useState} from "react";
import { useTheme } from "styled-components";
import Calendar from "./Calendar";
import { useNavigate } from 'react-router-dom';
import DaysOfWeek from "./DaysOfWeek";
import GridComponent from "./GridComponent";
export default function BusinessCalendar({calendar}) {
    const currentYear = new Date().getFullYear();
    const [activeYear, setActiveYear] = React.useState(new Date().getFullYear());
    const theme = useTheme();
    const daysStyle = "py-3 px-1 font-sm";
    const navigate = useNavigate();
    // Function to handle year click
    const handleYearChange = (year) => {
        setActiveYear(year);
    };
    // Filter calendar data based on active year
    const filteredCalendarData = Object.values(calendar).filter(
        (monthData) => parseInt(monthData.year) === activeYear
    );
    const handleEditCalendar = () => {
        // Navigate to the new page and pass the calendar data in the state
        navigate('/edit-calendar', {
            state: { calendar: filteredCalendarData, activeYear }  // Passing the calendar data
        });
    };
    // console.log("From business Calendar page:", filteredCalendarData)
    return (
        <div>
            <div className="flex justify-between items-center mt-10">
                <h1 className="m-0 font-bold text-xl">Business Calender</h1>
                <div className="flex space-x-3">
                    <button onClick={handleEditCalendar} className="px-4 py-2 rounded cursor-pointer" style={{backgroundColor: theme.colors.primaryButton, color: theme.colors.primary500}}>Edit calender</button>
                </div>
            </div>
            <div className="w-340 mx-auto my-2" style={{ borderBottom: "1px solid", borderBlockColor: theme.colors.primary200 }}></div>
            <div className="flex justify-between">
            <div className="flex justify-start mt-4" style={{ color: theme.colors.primary500 }}>
                <h5 onClick={()=>handleYearChange(currentYear-1)} className='py-2 px-5 font-bold cursor-pointer rounded-xl' style={{ background: activeYear == currentYear - 1 ? theme.colors.secondary500 : theme.colors.primary500, color: activeYear == currentYear - 1 ? theme.colors.primary500 : theme.colors.secondary500 }}>{currentYear-1}</h5>
                <h5 onClick={()=>handleYearChange(currentYear)} className='py-2 px-5 font-bold cursor-pointer rounded-xl' style={{ background: activeYear == currentYear ? theme.colors.secondary500 : theme.colors.primary500, color: activeYear == currentYear ? theme.colors.primary500 : theme.colors.secondary500 }}>{currentYear}</h5>
                <h5 onClick={()=>handleYearChange(currentYear+1)} className='py-2 px-5 font-bold cursor-pointer rounded-xl' style={{ background: activeYear == currentYear + 1 ? theme.colors.secondary500 : theme.colors.primary500, color: activeYear == currentYear + 1 ? theme.colors.primary500 : theme.colors.secondary500 }}>{currentYear+1}</h5>
            </div>
            <div className="flex justify-end mt-4" style={{ color: theme.colors.primary500 }}>
                <h5 className='py-2 px-5 font-bold mx-1 rounded-xl' style={{ border: "1px solid #f005bd", color: "#f005bd" }}>Holiday</h5>
                <h5 className='py-2 px-5 font-bold mx-1 rounded-xl' style={{ border: "1px solid green", color: "green" }}>Non-PROD</h5>
                <h5 className='py-2 px-5 font-bold mx-1 rounded-xl' style={{ border: "1px solid #10e7f7", color:"#10e7f7" }}>Overtime</h5>
                <h5 className='py-2 px-5 font-bold mx-1 rounded-xl' style={{ border: "1px solid white", color: "white" }}>Working Day</h5>
            </div>
            </div>
            {/* Days of week section */}
            <div className="mt-3">
            <DaysOfWeek />
            </div>
            <div className="mt-3">
            {/* <Calendar data={filteredCalendarData} /> */}
            <div style={{ height: "450px", overflowY: "auto", paddingBottom: "10px" }}>
                {filteredCalendarData.map((monthData, index) => (
                    <div key={index} style={{ paddingTop: "10px" }}>
                        <GridComponent data={monthData} activeYear={activeYear} />
                    </div>
                ))}
            </div>

            </div>
        </div>
    );
}
