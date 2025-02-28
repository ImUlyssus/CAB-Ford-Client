import React, {use, useState} from "react";
import { useTheme } from "styled-components";
import Calendar from "./Calendar";
export default function BusinessCalendar({calendar}) {
    const currentYear = new Date().getFullYear();
    const [activeYear, setActiveYear] = React.useState(new Date().getFullYear());
    const theme = useTheme();
    const daysStyle = "py-3 px-1 font-sm";
    // Function to handle year click
    const handleYearChange = (year) => {
        setActiveYear(year);
    };
    // Filter calendar data based on active year
    const filteredCalendarData = Object.values(calendar).filter(
        (monthData) => parseInt(monthData.year) === activeYear
    );
    // console.log("From business Calendar page:", filteredCalendarData)
    return (
        <div>
            <div className="flex justify-between">
            <div className="flex justify-start mt-4" style={{ color: theme.colors.primary500 }}>
                <h5 onClick={()=>handleYearChange(currentYear-1)} className='py-2 px-5 font-bold cursor-pointer rounded-xl' style={{ background: activeYear == currentYear - 1 ? theme.colors.secondary500 : theme.colors.primary500, color: activeYear == currentYear - 1 ? theme.colors.primary500 : theme.colors.secondary500 }}>2024</h5>
                <h5 onClick={()=>handleYearChange(currentYear)} className='py-2 px-5 font-bold cursor-pointer rounded-xl' style={{ background: activeYear == currentYear ? theme.colors.secondary500 : theme.colors.primary500, color: activeYear == currentYear ? theme.colors.primary500 : theme.colors.secondary500 }}>2025</h5>
                <h5 onClick={()=>handleYearChange(currentYear+1)} className='py-2 px-5 font-bold cursor-pointer rounded-xl' style={{ background: activeYear == currentYear + 1 ? theme.colors.secondary500 : theme.colors.primary500, color: activeYear == currentYear + 1 ? theme.colors.primary500 : theme.colors.secondary500 }}>2026</h5>
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

function DaysOfWeek() {
    const theme = useTheme();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const repetitions = 5; // 5 repetitions of the week

    return (
        <div 
            className="grid" 
            style={{ gridTemplateColumns: "50px 100px repeat(37, 1fr)" }}
        >
            {/* Empty cells for alignment with GridComponent */}
            <div className="bg-transparent"></div>
            <div className="bg-transparent"></div>

            {/* Days of the week repeated 5 times */}
            {Array.from({ length: repetitions }, () =>
                days.map((day, idx) => (
                    <div
                        key={`${day}-${idx}`}
                        className="flex items-center justify-center border text-xs"
                        style={{
                            paddingTop: "6px", paddingBottom: "6px",
                            background: idx === 0 || idx === 6 ? theme.colors.secondary500 : "#003478",
                            color: idx === 0 || idx === 6 ? "black" : theme.colors.secondary500,
                            textAlign: "center",
                        }}
                    >
                        {day}
                    </div>
                ))
            )}

            {/* Add Sunday and Monday after the 5 repetitions */}
            {days.slice(0, 2).map((day, idx) => (
                <div
                    key={`extra-${day}-${idx}`}
                    className="flex items-center justify-center border text-xs"
                    style={{
                        paddingTop: "6px", paddingBottom: "6px",
                        background: idx === 0 ? theme.colors.secondary500 : "#003478", // Sunday is idx 0
                        color: idx === 0 ? "black" : theme.colors.secondary500,
                        textAlign: "center",
                    }}
                >
                    {day}
                </div>
            ))}
        </div>
    );
}
function GridComponent({ data, activeYear }) {
    const monthName = data['month']; // e.g., "March"
    const year = activeYear;
    const theme = useTheme();

    // Map month names to zero-indexed numerical values
    const monthMap = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11,
    };

    // Get the zero-indexed month value
    const month = monthMap[monthName];

    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Create an array of days in the month
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Create an array for empty cells before the first day of the month
    const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => null);
    return (
        <div
            className="grid grid-rows-4 border"
            style={{ gridTemplateColumns: "90px 60px repeat(37, 1fr)" }}
        >
            {/* First column merged across all rows */}
            <div className="row-span-4 flex items-center text-center justify-center border p-2 text-xs bg-transparent font-bold">
                {activeYear || "Loading..."} <br />
                {monthName || "Loading..."}
            </div>

            {/* Second column merged across all rows */}
            <div className="flex items-center justify-center border p-2 text-xs bg-transparent font-bold">
                Site
            </div>

            {/* Render empty cells for days before the first day of the month */}
            {emptyCells.map((_, index) => (
                <div
                    key={`empty-${index}`}
                    className="flex items-center justify-center border py-2 text-xs bg-gray-200"
                ></div>
            ))}

            {/* Render days of the month */}
            {daysArray.map((day) => (
                <div
                    key={day}
                    className="flex items-center justify-center border py-2 text-xs bg-gray-200"
                    style={{color: theme.colors.primary500, borderColor: theme.colors.secondary500}}
                >
                    {day}
                </div>
            ))}

            {/* Render remaining cells for the rest of the grid */}
            {Array.from({ length: 37 - (emptyCells.length + daysArray.length) }, (_, index) => (
                <div
                    key={`remaining-${index}`}
                    className="flex items-center justify-center border py-2 text-xs bg-gray-200"
                ></div>
            ))}

            {/* Repeat for other sections (AAT, FTM, FSST) */}
            <div className="flex items-center justify-center border p-2 text-xs bg-transparent font-bold">
                AAT
            </div>

            {/* Remaining 36 columns * 4 rows = 144 cells */}
            {Array.from({ length: 1 * 37 }, (_, index) => (
                <div
                    key={index}
                    className="flex items-center justify-center border py-2 text-xs bg-gray-200"
                >
                </div>
            ))}
            <div className="flex items-center justify-center border p-2 text-xs bg-transparent font-bold">
                FTM
            </div>

            {/* Remaining 36 columns * 4 rows = 144 cells */}
            {Array.from({ length: 1 * 37 }, (_, index) => (
                <div
                    key={index}
                    className="flex items-center justify-center border py-2 text-xs bg-gray-200"
                >
                </div>
            ))}
            <div className="flex items-center justify-center border p-2 text-xs bg-transparent font-bold">
                FSST
            </div>

            {/* Remaining 36 columns * 4 rows = 144 cells */}
            {Array.from({ length: 1 * 37 }, (_, index) => (
                <div
                    key={index}
                    className="flex items-center justify-center border py-2 text-xs bg-gray-200"
                >
                </div>
            ))}
        </div>
    );
}
