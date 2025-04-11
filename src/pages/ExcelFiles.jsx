import React, { useState } from 'react';
import { useTheme } from 'styled-components';

export default function FilterBar() {
    const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 10 + i);
    const [activeQuarter, setActiveQuarter] = useState(1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const theme = useTheme();

    const quarterMonths = {
        1: ["January", "February", "March"],
        2: ["April", "May", "June"],
        3: ["July", "August", "September"],
        4: ["October", "November", "December"]
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const formatDate = (date, isEnd = false) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const time = isEnd ? '23:59:59' : '00:00:00';
        return `${year}-${month}-${day} ${time}`;
    };

    const logDates = (startDate, endDate) => {
        console.log(`Start date: ${formatDate(startDate)}, End date: ${formatDate(endDate, true)}`);
    };

    const getWeeksInMonth = (year, monthIndex) => {
        const weeks = [];
        const firstDay = new Date(year, monthIndex, 1);
        const lastDay = new Date(year, monthIndex + 1, 0);
        let startDate = new Date(firstDay);

        if (startDate.getDay() !== 6) {
            startDate.setDate(startDate.getDate() - (startDate.getDay() + 1) % 7);
        }

        while (startDate <= lastDay) {
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 6);

            const startMonth = startDate.getMonth();
            const endMonth = endDate.getMonth();

            weeks.push({
                start: startDate.getDate(),
                startMonth: startMonth,
                end: endDate.getDate(),
                endMonth: endMonth,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            });

            startDate.setDate(startDate.getDate() + 7);
        }

        if (weeks.length > 0 && weeks[weeks.length - 1].start > weeks[weeks.length - 1].end) {
            weeks.pop();
        }

        return weeks;
    };

    const getQuarterDates = (year, quarter) => {
        const monthsInQuarter = quarterMonths[quarter].map(month => months.indexOf(month));
        const weeks = monthsInQuarter.flatMap(monthIndex => getWeeksInMonth(year, monthIndex));
        return {
            start: weeks[0].startDate,
            end: weeks[weeks.length - 1].endDate
        };
    };

    const getYearDates = (year) => {
        const weeks = Array.from({ length: 12 }, (_, i) => getWeeksInMonth(year, i)).flat();
        return {
            start: weeks[0].startDate,
            end: weeks[weeks.length - 1].endDate
        };
    };

    return (
        <div>
            <div style={{
                position: "fixed",
                top: "100px",
                left: '20px',
                right: 0,
                zIndex: 1000,
                backgroundColor: theme.colors.primary500,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "10px",
                borderBottom: "1px solid white"
            }}>
                <div className="flex space-x-4">
                    <select
                        className="p-2 border rounded bg-black text-white"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    {Array.from({ length: 4 }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveQuarter(i + 1)}
                            className={`p-2 border rounded ${activeQuarter === i + 1 ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-700'}`}
                        >
                            Quarter {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {activeQuarter && (
                <div className="mt-[70px]">
                    {quarterMonths[activeQuarter].map((month, index) => {
                        const weeks = getWeeksInMonth(selectedYear, months.indexOf(month));
                        const firstWeek = weeks[0];
                        const lastWeek = weeks[weeks.length - 1];
                        const firstDayOfMonth = firstWeek.startDate;
                        const lastDayOfMonth = lastWeek.endDate;

                        return (
                            <div key={month} className="mb-4">
                                <h3 className="text-lg font-bold">{month}</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        className="col-span-2 inline-block px-2 py-1 border rounded bg-blue-200 text-black"
                                        onClick={() => logDates(firstDayOfMonth, lastDayOfMonth)}
                                    >
                                        Download {month} ({formatDate(firstDayOfMonth)} TO {formatDate(lastDayOfMonth, true)})
                                    </button>
                                    {weeks.map((week, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-block px-2 py-1 border rounded bg-gray-200 text-black text-center"
                                            onClick={() => logDates(week.startDate, week.endDate)}
                                        >
                                            {week.startMonth !== week.endMonth
                                                ? `${months[week.startMonth]} ${week.start} - ${months[week.endMonth]} ${week.end}`
                                                : `${months[week.startMonth]} ${week.start} - ${week.end}`}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Download Quarters and Year Data */}
            <div className="mt-8">
                <h3 className="text-lg font-bold">Download Quarters and Year Data</h3>
                {/* Year Download */}
                <div className="mb-4">
                    <button
                        className="w-full inline-block px-2 py-1 border rounded bg-yellow-200 text-black"
                        onClick={() => {
                            const { start, end } = getYearDates(selectedYear);
                            logDates(start, end);
                        }}
                    >
                        Download {selectedYear} ({formatDate(getYearDates(selectedYear).start)} TO {formatDate(getYearDates(selectedYear).end, true)})
                    </button>
                </div>

                {/* Quarter 1 and 2 Download */}
                <div className="mb-4 grid grid-cols-2 gap-2">
                    {Array.from({ length: 2 }, (_, i) => {
                        const quarter = i + 1;
                        const { start, end } = getQuarterDates(selectedYear, quarter);
                        return (
                            <button
                                key={quarter}
                                className="inline-block px-2 py-1 border rounded bg-green-200 text-black"
                                onClick={() => logDates(start, end)}
                            >
                                Download {selectedYear} Quarter {quarter} ({formatDate(start)} TO {formatDate(end, true)})
                            </button>
                        );
                    })}
                </div>

                {/* Quarter 3 and 4 Download */}
                <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 2 }, (_, i) => {
                        const quarter = i + 3;
                        const { start, end } = getQuarterDates(selectedYear, quarter);
                        return (
                            <button
                                key={quarter}
                                className="inline-block px-2 py-1 border rounded bg-green-200 text-black"
                                onClick={() => logDates(start, end)}
                            >
                                Download {selectedYear} Quarter {quarter} ({formatDate(start)} TO {formatDate(end, true)})
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}


// import React, { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import useAxiosPrivate from "../hooks/useAxiosPrivate";
// import API_BASE_URL from "../config/apiConfig";
// import { useLocation, useNavigate } from "react-router-dom";

// function ExcelFiles() {
//   const [data, setData] = useState([]);
//   const axiosPrivate = useAxiosPrivate();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Fetch MySQL data from API using axiosPrivate
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axiosPrivate.get(`${API_BASE_URL}/change-requests`);
//         setData(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         navigate('/login', { state: { from: location }, replace: true });
//       }
//     };

//     fetchData();
//   }, [axiosPrivate]);

//   // Function to generate and download Excel file
//   const generateExcel = () => {
//     if (data.length === 0) {
//       alert("No data available to export.");
//       return;
//     }

//     // Convert JSON to worksheet
//     const ws = XLSX.utils.json_to_sheet(data);

//     // Create a new workbook
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Change Requests");

//     // Convert to binary and create a Blob
//     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });

//     // Save the file
//     saveAs(fileData, "ChangeRequestData.xlsx");
//   };

//   return (
//     <div>
//       <h1>Download Excel Report</h1>
//       <button
//         onClick={generateExcel}
//         style={{
//           backgroundColor: "#28a745",
//           color: "white",
//           padding: "10px 15px",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//       >
//         Download Excel
//       </button>
//     </div>
//   );
// }

// export default ExcelFiles;
