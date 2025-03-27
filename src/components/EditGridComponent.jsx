import { useTheme } from "styled-components";
import React, { useEffect, useState } from "react";
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
export default function EditGridComponent({ calendar, activeYear }) {
    const theme = useTheme();
    const [calendarData, setCalendarData] = useState(calendar);
    const [selectedCell, setSelectedCell] = useState(null);
    // const getSundayDistances = (year) => {
    //     return Array.from({ length: 12 }, (_, month) => new Date(year, month, 1).getDay());
    // };
    // useEffect(() => {
    //     const updateData = () => {
    //         if (!Array.isArray(calendarData) || calendar.length === 0) return;

    //         // Get all 12 months' distances from Sunday
    //         let year = calendarData[0]?.year; // Extract year from calendar
    //         let sundayDistances = getSundayDistances(year);
    //         setCalendarData((prev) =>
    //             prev.map((item) => {
    //                 let monthIndex = monthMap[item.month]; // Convert month name to index
    //                 let prependString = "9".repeat(sundayDistances[monthIndex]); // Use precalculated distance

    //                 return {
    //                     ...item,
    //                     aat: prependString + item.aat,
    //                     ftm: prependString + item.ftm,
    //                     fsst: prependString + item.fsst,
    //                 };
    //             })
    //         );
    //     };
    //     console.log("Updated calendar:", calendarData);
    //     updateData();
    // }, []);
    // console.log("allSitesMonths:", calendarData);
    const getSundayDistances = (year) => {
        let distances = [];
    
        for (let month = 0; month < 12; month++) {
            let firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sunday) to 6 (Saturday)
            distances.push(firstDayOfMonth); // The distance from Sunday is just the firstDayOfMonth itself
        }
    
        return distances;
    };
    
    // Example Usage:
    console.log(getSundayDistances(2025));
    
    return(
        <>
        <div style={{ height: "450px", overflowY: "auto", paddingBottom: "10px" }}>
                {calendar.map((monthData, index) => (
                    <div key={index} style={{ paddingTop: "10px" }}>
                    <GridComponent data={monthData} activeYear={activeYear} allSitesMonths={calendar} />
                </div>
                ))}
            </div>
        </>
    );
}
function GridComponent({ data, activeYear, allSitesMonths }) {
        const monthName = data["month"];
        const year = activeYear;
        const theme = useTheme();
        const [calendar, setCalendar] = useState(allSitesMonths);
        
        const month = monthMap[monthName];
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
    
        const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const emptyCells = Array.from({ length: firstDayOfMonth }, () => null);
    
        // Extract weekend data from the provided strings
        const weekendInfo = data.aat.slice(0, daysInMonth); // Replace `aat` if another field holds the correct data
    
        // Function to determine if a day is a weekend based on the `1`s in the string
        const isWeekend = (index) => weekendInfo[index] === "1";
        return (
            <div
                className="grid grid-rows-4 border"
                style={{ gridTemplateColumns: "90px 60px repeat(37, 1fr)" }}
            >
                <div className="row-span-4 flex items-center text-center justify-center border p-2 text-xs bg-transparent font-bold">
                    {activeYear || "Loading..."} <br />
                    {monthName || "Loading..."}
                </div>
    
                <div className="flex items-center justify-center border p-2 text-xs bg-transparent font-bold">
                    Site
                </div>
    
                {emptyCells.map((_, index) => (
                    <div
                        key={`empty-${index}`}
                        className="flex items-center justify-center border py-2 text-xs bg-gray-200"
                    ></div>
                ))}
    
                {daysArray.map((day, index) => (
                    <div
                        key={day}
                        className="flex items-center justify-center border py-2 text-xs"
                        style={{
                            backgroundColor: isWeekend(index)
                                ? theme.colors.secondary500 // Weekend color
                                : "#003478", // Weekday color
                            color: isWeekend(index) ? "black" : theme.colors.secondary500,
                            borderColor: theme.colors.secondary500,
                        }}
                    >
                        {day}
                    </div>
                ))}
    
                {Array.from({ length: 37 - (emptyCells.length + daysArray.length) }, (_, index) => (
                    <div
                        key={`remaining-${index}`}
                        className="flex items-center justify-center border py-2 text-xs bg-gray-200"
                    ></div>
                ))}
    
                <div className="flex items-center justify-center border p-2 text-xs bg-transparent font-bold">
                    AAT
                </div>
    
                {Array.from({ length: 1 * 37 }, (_, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center border py-2 text-xs bg-gray-200"
                    >{allSitesMonths[0].aat.charAt(index)}</div>
                ))}
    
                <div className="flex items-center justify-center border p-2 text-xs bg-transparent font-bold">
                    FTM
                </div>
    
                {Array.from({ length: 1 * 37 }, (_, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center border py-2 text-xs bg-gray-200"
                    ></div>
                ))}
    
                <div className="flex items-center justify-center border p-2 text-xs bg-transparent font-bold">
                    FSST
                </div>
    
                {Array.from({ length: 1 * 37 }, (_, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center border py-2 text-xs bg-gray-200"
                    ></div>
                ))}
            </div>
        );
    }
// export default function GridComponent({ data, activeYear, allSitesMonths }) {
//     const monthName = data["month"];
//     const year = activeYear;
//     const theme = useTheme();
//     const [calendar, setCalendar] = useState(allSitesMonths);
//     // Map month names to zero-indexed numerical values
//     const monthMap = {
//         January: 0,
//         February: 1,
//         March: 2,
//         April: 3,
//         May: 4,
//         June: 5,
//         July: 6,
//         August: 7,
//         September: 8,
//         October: 9,
//         November: 10,
//         December: 11,
//     };

//     const month = monthMap[monthName];
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const firstDayOfMonth = new Date(year, month, 1).getDay();

//     const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
//     const emptyCells = Array.from({ length: firstDayOfMonth }, () => null);

//     // Extract weekend data from the provided strings
//     const weekendInfo = data.aat.slice(0, daysInMonth); // Replace `aat` if another field holds the correct data

//     // Function to determine if a day is a weekend based on the `1`s in the string
//     const isWeekend = (index) => weekendInfo[index] === "1";
//     const getSundayDistances = (year) => {
//         return Array.from({ length: 12 }, (_, month) => new Date(year, month, 1).getDay());
//     };
    
//     useEffect(() => {
//         const updateData = () => {
//             if (!Array.isArray(calendar) || calendar.length === 0) return;
    
//             // Get all 12 months' distances from Sunday
//             let year = calendar[0]?.year; // Extract year from calendar
//             let sundayDistances = getSundayDistances(year);
    
//             setCalendar((prev) =>
//                 prev.map((item) => {
//                     let monthIndex = monthMap[item.month]; // Convert month name to index
//                     let prependString = "9".repeat(sundayDistances[monthIndex]); // Use precalculated distance
    
//                     return {
//                         ...item,
//                         aat: prependString + item.aat,
//                         ftm: prependString + item.ftm,
//                         fsst: prependString + item.fsst,
//                     };
//                 })
//             );
//         };
    
//         console.log("Updated calendar:", calendar);
//         updateData();
//     }, [allSitesMonths]);
//     console.log("allSitesMonths:", calendar);
//     return (
//         <div
//             className="grid grid-rows-4 border"
//             style={{ gridTemplateColumns: "90px 60px repeat(37, 1fr)" }}
//         >
//             <div className="row-span-4 flex items-center text-center justify-center border p-2 text-xs bg-transparent font-bold">
//                 {activeYear || "Loading..."} <br />
//                 {monthName || "Loading..."}
//             </div>

//             <div className="flex items-center justify-center border p-2 text-xs bg-transparent font-bold">
//                 Site
//             </div>

//             {emptyCells.map((_, index) => (
//                 <div
//                     key={`empty-${index}`}
//                     className="flex items-center justify-center border py-2 text-xs bg-gray-200"
//                 ></div>
//             ))}

//             {daysArray.map((day, index) => (
//                 <div
//                     key={day}
//                     className="flex items-center justify-center border py-2 text-xs"
//                     style={{
//                         backgroundColor: isWeekend(index)
//                             ? theme.colors.secondary500 // Weekend color
//                             : "#003478", // Weekday color
//                         color: isWeekend(index) ? "black" : theme.colors.secondary500,
//                         borderColor: theme.colors.secondary500,
//                     }}
//                 >
//                     {day}
//                 </div>
//             ))}

//             {Array.from({ length: 37 - (emptyCells.length + daysArray.length) }, (_, index) => (
//                 <div
//                     key={`remaining-${index}`}
//                     className="flex items-center justify-center border py-2 text-xs bg-gray-200"
//                 ></div>
//             ))}

//             <div className="flex items-center justify-center border p-2 text-xs bg-transparent font-bold">
//                 AAT
//             </div>

//             {Array.from({ length: 1 * 37 }, (_, index) => (
//                 <div
//                     key={index}
//                     className="flex items-center justify-center border py-2 text-xs bg-gray-200"
//                 >{allSitesMonths[0].aat.charAt(index)}</div>
//             ))}

//             <div className="flex items-center justify-center border p-2 text-xs bg-transparent font-bold">
//                 FTM
//             </div>

//             {Array.from({ length: 1 * 37 }, (_, index) => (
//                 <div
//                     key={index}
//                     className="flex items-center justify-center border py-2 text-xs bg-gray-200"
//                 ></div>
//             ))}

//             <div className="flex items-center justify-center border p-2 text-xs bg-transparent font-bold">
//                 FSST
//             </div>

//             {Array.from({ length: 1 * 37 }, (_, index) => (
//                 <div
//                     key={index}
//                     className="flex items-center justify-center border py-2 text-xs bg-gray-200"
//                 ></div>
//             ))}
//         </div>
//     );
// }

// function SelectionDialog({ selectedCell, onClose, onSelect }) {
//         const theme = useTheme();
    
//         const handleSelection = (value) => {
//             onSelect(selectedCell.day - 1, selectedCell.site, value);
//             onClose();
//         };
    
//         return (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                 <div className="p-6 rounded-md" style={{ backgroundColor: theme.colors.primary400 }}>
//                     <h2 className="text-lg font-bold">Select Category</h2>
//                     <p>Day: {selectedCell.day}, Month: {selectedCell.month}, Site: {selectedCell.site}</p>
//                     <div className="flex gap-2 mt-4">
//                         <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid #f005bd", color: "#f005bd" }} onClick={() => handleSelection(2)}>Holiday</button>
//                         <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid green", color: "green" }} onClick={() => handleSelection(3)}>Non-PROD</button>
//                         <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid #10e7f7", color: "#10e7f7" }} onClick={() => handleSelection(4)}>Overtime</button>
//                         <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid white", color: "white" }} onClick={() => handleSelection(5)}>Working Day</button>
//                         <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid orange", color: "orange" }} onClick={() => handleSelection(0)}>Weekday</button>
//                         <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid red", color: "red" }} onClick={() => handleSelection(1)}>Weekend</button>
//                     </div>
//                     <div className="flex justify-end mt-4">
//                         <button className="mt-2 px-4 py-2 bg-gray-600 rounded" onClick={onClose}>Cancel</button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }