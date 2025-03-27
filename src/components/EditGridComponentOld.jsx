import { useTheme } from "styled-components";
import React, { useState } from "react";

export default function GridComponent({ data, activeYear, allSitesMonths }) {
    const monthName = data["month"];
    const year = activeYear;
    const theme = useTheme();
    const [selectedCell, setSelectedCell] = useState(null);
    const [aatArray, setAatArray] = useState(data.aat.split("").map(Number));
    const [ftmArray, setFtmArray] = useState(data.ftm.split("").map(Number));
    const [fsstArray, setFsstArray] = useState(data.fsst.split("").map(Number));
    const [monthData, setMonthData] = useState(data.month ? allSitesMonths : {});

    // Map month names to zero-indexed numerical values
    const monthMap = {
        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
        July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
    };
    const month = monthMap[monthName];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Starting position of the month

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyCells = Array.from({ length: firstDayOfMonth }, () => null);

    // Trim monthData to match the correct number of days
    const trimmedMonthData = { ...monthData };
    Object.keys(monthData).forEach((key) => {
        // If monthData[key] is an object, check and slice the relevant properties (e.g., aat, ftm, etc.)
        if (monthData[key].aat && typeof monthData[key].aat === 'string') {
            trimmedMonthData[key].aat = monthData[key].aat.slice(0, daysInMonth);
        }
        if (monthData[key].ftm && typeof monthData[key].ftm === 'string') {
            trimmedMonthData[key].ftm = monthData[key].ftm.slice(0, daysInMonth);
        }
        if (monthData[key].fsst && typeof monthData[key].fsst === 'string') {
            trimmedMonthData[key].fsst = monthData[key].fsst.slice(0, daysInMonth);
        }
    });

    // Function to get the correct index for each site's data
    const getSiteValue = (siteArray, index) => {
        // Check if the siteArray is valid (not undefined or null) and is an array
        if (!Array.isArray(siteArray)) {
            console.error("Invalid siteArray:", siteArray); // Add a console log to debug
            return null; // Return null if the array is invalid
        }
        console.log(siteArray.length);
        const siteIndex = index - firstDayOfMonth; // Adjust for empty cells
        if (siteIndex >= 0 && siteIndex < siteArray.length) {
            return siteArray[siteIndex];
        } else {
            return null; // Return null if the index is out of bounds
        }
    };
    

    const handleCellClick = (index, site) => {
        const day = index + 1; // Directly use the index in site rows
        setSelectedCell({ day, month: monthName, site });
    };

    const handleSelection = (index, site, value) => {
        const monthIndex = monthMap[monthName]; // Get current month index (0-11)
        console.log(monthIndex, site, value, index);

        const replaceAt = (str, idx, replacement) => {
            const arr = str.split('');
            arr[idx] = replacement;
            return arr.join('');
        };

        if (site === "AAT") {
            setMonthData(prev => {
                const updated = { ...prev };
                updated[monthIndex].aat = replaceAt(updated[monthIndex].aat, index, value);
                console.log(updated);
                return updated;
            });
        } else if (site === "FTM") {
            setMonthData(prev => {
                const updated = { ...prev };
                updated[monthIndex].ftm = replaceAt(updated[monthIndex].ftm, index, value);
                console.log(updated);
                return updated;
            });
        } else {
            setMonthData(prev => {
                const updated = { ...prev };
                updated[monthIndex].fsst = replaceAt(updated[monthIndex].fsst, index, value);
                console.log(updated);
                return updated;
            });
        }
    };

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

            {/* Empty Cells for Alignment */}
            {emptyCells.map((_, index) => (
                <div key={`empty-${index}`} className="flex items-center justify-center border py-2 text-xs bg-gray-200"></div>
            ))}

            {/* Render Days */}
            {daysArray.map((day, index) => (
                <div
                    key={day}
                    className="flex items-center justify-center border py-2 text-xs cursor-pointer"
                    style={{
                        backgroundColor: theme.colors.secondary500,
                        color: "black",
                        borderColor: theme.colors.secondary500,
                    }}
                >
                    {day}
                </div>
            ))}

            {/* Fill Remaining Cells */}
            {Array.from({ length: 37 - (emptyCells.length + daysArray.length) }, (_, index) => (
                <div key={`remaining-${index}`} className="flex items-center justify-center border py-2 text-xs bg-gray-200"></div>
            ))}

            {/* Render Site Rows */}
            {["AAT", "FTM", "FSST"].map((label, siteIndex) => {
                const siteData = trimmedMonthData[month][label.toLowerCase()].split("");
                console.log(trimmedMonthData[month][label.toLowerCase()]);
                return (
                    <React.Fragment key={label}>
                        <div className="flex items-center justify-center border p-2 text-xs bg-transparent font-bold">{label}</div>

                        {/* Empty Cells Before Month Starts */}
                        {emptyCells.map((_, index) => (
                            <div key={`${label}-empty-${index}`} className="flex items-center justify-center border py-2 text-xs bg-gray-200"></div>
                        ))}

                        {/* Site Data */}
                        {daysArray.map((_, index) => {
                            const siteValue = getSiteValue(siteData, index + firstDayOfMonth);
                            let backgroundColor;
                            let textColor;
                            // Determine the background color based on the site value
                            if (siteValue === '1') {
                                backgroundColor = theme.colors.primary200;
                                textColor = theme.colors.secondary500;
                            } else if (siteValue === '0') {
                                backgroundColor = 'gray';
                                textColor = theme.colors.primary200;
                            }else if (siteValue === '2') {
                                backgroundColor = '#f005bd';
                                textColor = theme.colors.primary200;
                            }else if (siteValue === '3') {
                                backgroundColor = 'green';
                                textColor = theme.colors.primary200;
                            }else if (siteValue === '4') {
                                backgroundColor = '#10e7f7';
                                textColor = theme.colors.primary200;
                            }else if (siteValue === '5') {
                                backgroundColor = 'white';
                                textColor = theme.colors.primary200;
                            }

                            return (
                                <div
                                    key={`${label}-${index}`}
                                    className="flex items-center justify-center border py-2 text-xs cursor-pointer"
                                    style={{
                                        backgroundColor,
                                        color: textColor,
                                        borderColor: theme.colors.secondary500,
                                    }}
                                    onClick={() => handleCellClick(index, label, siteData)}
                                >
                                    {siteValue !== null ? siteValue : ""}
                                </div>
                            );
                        })}

                        {/* Fill Remaining Cells */}
                        {Array.from({ length: 37 - (emptyCells.length + daysArray.length) }, (_, index) => (
                            <div key={`${label}-remaining-${index}`} className="flex items-center justify-center border py-2 text-xs bg-gray-200"></div>
                        ))}
                    </React.Fragment>
                );
            })}
            {selectedCell && <SelectionDialog selectedCell={selectedCell} onClose={() => setSelectedCell(null)} onSelect={handleSelection} />}
        </div>
    );
}

function SelectionDialog({ selectedCell, onClose, onSelect }) {
        const theme = useTheme();
    
        const handleSelection = (value) => {
            onSelect(selectedCell.day - 1, selectedCell.site, value);
            onClose();
        };
    
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="p-6 rounded-md" style={{ backgroundColor: theme.colors.primary400 }}>
                    <h2 className="text-lg font-bold">Select Category</h2>
                    <p>Day: {selectedCell.day}, Month: {selectedCell.month}, Site: {selectedCell.site}</p>
                    <div className="flex gap-2 mt-4">
                        <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid #f005bd", color: "#f005bd" }} onClick={() => handleSelection(2)}>Holiday</button>
                        <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid green", color: "green" }} onClick={() => handleSelection(3)}>Non-PROD</button>
                        <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid #10e7f7", color: "#10e7f7" }} onClick={() => handleSelection(4)}>Overtime</button>
                        <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid white", color: "white" }} onClick={() => handleSelection(5)}>Working Day</button>
                        <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid orange", color: "orange" }} onClick={() => handleSelection(0)}>Weekday</button>
                        <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid red", color: "red" }} onClick={() => handleSelection(1)}>Weekend</button>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="mt-2 px-4 py-2 bg-gray-600 rounded" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
// import { useTheme } from "styled-components";
// import React, { useState } from "react";

// export default function GridComponent({ data, activeYear, allSitesMonths }) {
//     const monthName = data["month"];
//     const year = activeYear;
//     const theme = useTheme();
//     const [selectedCell, setSelectedCell] = useState(null);
//     const [aatArray, setAatArray] = useState(data.aat.split("").map(Number));
//     const [ftmArray, setFtmArray] = useState(data.ftm.split("").map(Number));
//     const [fsstArray, setFsstArray] = useState(data.fsst.split("").map(Number));
//     const [monthData, setMonthData] = useState(data.month ? allSitesMonths:{});

//     // Map month names to zero-indexed numerical values
//     const monthMap = {
//         January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
//         July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
//     };
//     const month = monthMap[monthName];
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const firstDayOfMonth = new Date(year, month, 1).getDay(); // Starting position of the month

//     const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
//     const emptyCells = Array.from({ length: firstDayOfMonth }, () => null);
//     console.log(daysArray)
//     // Function to get the correct index for each site's data
//     const getSiteValue = (siteArray, index) => {
//         const siteIndex = index - firstDayOfMonth; // Adjust for empty cells
//         return siteIndex >= 0 && siteIndex < daysInMonth ? siteArray[siteIndex] : null;
//     };

//     const handleCellClick = (index, site) => {
//         const day = index + 1; // Directly use the index in site rows
//         setSelectedCell({ day, month: monthName, site });
//     };
//     const handleSelection = (index, site, value) => {
//         const monthIndex = monthMap[monthName]; // Get current month index (0-11)
//         console.log(monthIndex, site, value, index);
    
//         const replaceAt = (str, idx, replacement) => {
//             const arr = str.split('');
//             arr[idx] = replacement;
//             return arr.join('');
//         };
    
//         if (site === "AAT") {
//             setMonthData(prev => {
//                 const updated = { ...prev };
//                 updated[monthIndex].aat = replaceAt(updated[monthIndex].aat, index, value);
//                 console.log(updated);
//                 return updated;
//             });
//         } else if (site === "FTM") {
//             setMonthData(prev => {
//                 const updated = { ...prev };
//                 updated[monthIndex].ftm = replaceAt(updated[monthIndex].ftm, index, value);
//                 console.log(updated);
//                 return updated;
//             });
//         } else {
//             setMonthData(prev => {
//                 const updated = { ...prev };
//                 updated[monthIndex].fsst = replaceAt(updated[monthIndex].fsst, index, value);
//                 console.log(updated);
//                 return updated;
//             });
//         }
//     };
//     console.log(monthData);

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

//             {/* Empty Cells for Alignment */}
//             {emptyCells.map((_, index) => (
//                 <div key={`empty-${index}`} className="flex items-center justify-center border py-2 text-xs bg-gray-200"></div>
//             ))}

//             {/* Render Days */}
//             {daysArray.map((day, index) => (
//                 <div
//                     key={day}
//                     className="flex items-center justify-center border py-2 text-xs cursor-pointer"
//                     style={{
//                         backgroundColor: theme.colors.secondary500,
//                         color: "black",
//                         borderColor: theme.colors.secondary500,
//                     }}
//                 // onClick={() => handleCellClick(index + firstDayOfMonth)}
//                 >
//                     {day}
//                 </div>
//             ))}

//             {/* Fill Remaining Cells */}
//             {Array.from({ length: 37 - (emptyCells.length + daysArray.length) }, (_, index) => (
//                 <div key={`remaining-${index}`} className="flex items-center justify-center border py-2 text-xs bg-gray-200"></div>
//             ))}

//             {/* Render Site Rows */}
//             {["AAT", "FTM", "FSST"].map((label, siteIndex) => {
//                 const siteData = [aatArray, ftmArray, fsstArray][siteIndex];

//                 return (
//                     <React.Fragment key={label}>
//                         <div className="flex items-center justify-center border p-2 text-xs bg-transparent font-bold">{label}</div>

//                         {/* Empty Cells Before Month Starts */}
//                         {emptyCells.map((_, index) => (
//                             <div key={`${label}-empty-${index}`} className="flex items-center justify-center border py-2 text-xs bg-gray-200"></div>
//                         ))}

//                         {/* Site Data */}
//                         {daysArray.map((_, index) => (
//                             <div
//                                 key={`${label}-${index}`}
//                                 className="flex items-center justify-center border py-2 text-xs cursor-pointer"
//                                 style={{
//                                     backgroundColor: getSiteValue(siteData, index + firstDayOfMonth) === '1' ? theme.colors.primary200 : getSiteValue(siteData, index + firstDayOfMonth) === '0' ? 'gray' : "none",
//                                     color: getSiteValue(siteData, index + firstDayOfMonth) ? theme.colors.secondary500 : theme.colors.primary200,
//                                     borderColor: theme.colors.secondary500,
//                                 }}
//                                 onClick={() => handleCellClick(index, label, siteData)}
//                             >
//                                 {getSiteValue(siteData, index + firstDayOfMonth)}
//                             </div>
//                         ))}

//                         {/* Fill Remaining Cells */}
//                         {Array.from({ length: 37 - (emptyCells.length + daysArray.length) }, (_, index) => (
//                             <div key={`${label}-remaining-${index}`} className="flex items-center justify-center border py-2 text-xs bg-gray-200"></div>
//                         ))}
//                     </React.Fragment>
//                 );
//             })}
//             {selectedCell && <SelectionDialog selectedCell={selectedCell} onClose={() => setSelectedCell(null)} onSelect={handleSelection} />}

//         </div>
//     );
// }
// function SelectionDialog({ selectedCell, onClose, onSelect }) {
//     const theme = useTheme();

//     const handleSelection = (value) => {
//         onSelect(selectedCell.day - 1, selectedCell.site, value);
//         onClose();
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//             <div className="p-6 rounded-md" style={{ backgroundColor: theme.colors.primary400 }}>
//                 <h2 className="text-lg font-bold">Select Category</h2>
//                 <p>Day: {selectedCell.day}, Month: {selectedCell.month}, Site: {selectedCell.site}</p>
//                 <div className="flex gap-2 mt-4">
//                     <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid #f005bd", color: "#f005bd" }} onClick={() => handleSelection(2)}>Holiday</button>
//                     <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid green", color: "green" }} onClick={() => handleSelection(3)}>Non-PROD</button>
//                     <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid #10e7f7", color: "#10e7f7" }} onClick={() => handleSelection(4)}>Overtime</button>
//                     <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid white", color: "white" }} onClick={() => handleSelection(5)}>Working Day</button>
//                     <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid orange", color: "orange" }} onClick={() => handleSelection(0)}>Weekday</button>
//                     <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid red", color: "red" }} onClick={() => handleSelection(1)}>Weekend</button>
//                 </div>
//                 <div className="flex justify-end mt-4">
//                     <button className="mt-2 px-4 py-2 bg-gray-600 rounded" onClick={onClose}>Cancel</button>
//                 </div>
//             </div>
//         </div>
//     );
// }
