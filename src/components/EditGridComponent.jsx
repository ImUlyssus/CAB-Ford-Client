import { useTheme } from "styled-components";
import React, { useState, useCallback, useEffect } from "react";

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

export default function EditGridComponent({ calendar, activeYear, setCalendarData }) {
    // const [calendarData, setCalendarData] = useState(calendar);

    // Function to update calendar data
    const updateCalendarData = useCallback((monthIndex, site, index, newValue) => {
        setCalendarData((prev) => {
            const updatedCalendar = prev.map((month, i) => {
                if (i === monthIndex) {
                    const updatedSiteData = { ...month };
                    updatedSiteData[site] =
                        updatedSiteData[site].substring(0, index) +
                        newValue +
                        updatedSiteData[site].substring(index + 1);
                    return updatedSiteData;
                }
                return month;
            });
            return updatedCalendar;
        });
    }, [setCalendarData]);

    return (
        <>
            <div style={{ height: "450px", overflowY: "auto", paddingBottom: "10px" }}>
                {calendar.map((monthData, index) => (
                    <div key={index} style={{ paddingTop: "10px" }}>
                        <GridComponent
                            data={monthData}
                            activeYear={activeYear}
                            monthIndex={index}
                            updateCalendarData={updateCalendarData}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

function GridComponent({ data, activeYear, monthIndex, updateCalendarData }) {
    const monthName = data["month"];
    const year = activeYear;
    const theme = useTheme();
    const [selectedCell, setSelectedCell] = useState(null);

    const month = monthMap[monthName];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Starting position of the month

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyCells = Array.from({ length: firstDayOfMonth }, () => null);

    // Function to get the correct index for each site's data
    const handleCellClick = (index, site) => {
        const day = index + 1; // Directly use the index in site rows
        setSelectedCell({ day, month: monthName, site, index }); // index is required here
    };

    // Handle the selection event
    const handleSelection = (value) => {
        if (selectedCell) {
            const { site, index } = selectedCell;
            const lowercaseSite = site.toLowerCase();

            updateCalendarData(monthIndex, lowercaseSite, index, value); // Update the calendar data
            setSelectedCell(null);
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
                const lowercaseSite = label.toLowerCase(); // Convert label to lowercase
                const siteData = data[lowercaseSite]; // Access the correct site data using lowercase label
                console.log(siteData);
                return (
                    <React.Fragment key={label}>
                        <div className="flex items-center justify-center border p-2 text-xs bg-transparent font-bold">{label}</div>

                        {/* Empty Cells Before Month Starts */}
                        {emptyCells.map((_, index) => (
                            <div key={`${label}-empty-${index}`} className="flex items-center justify-center border py-2 text-xs bg-gray-200"></div>
                        ))}

                        {/* Site Data */}
                        {daysArray.map((_, index) => {
                            const siteValue = siteData[index];
                            let backgroundColor;
                            let textColor;
                            if (siteValue === '1') {
                                backgroundColor = '#EAE2C6';
                                textColor = theme.colors.secondary500;
                            } else if (siteValue === '0') {
                                backgroundColor = '#EFEEEA';
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
                                    onClick={() => handleCellClick(index, label)}
                                >
                                    {/* {siteValue !== null ? siteValue : ""} */}
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
        onSelect(value);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="p-6 rounded-md" style={{ backgroundColor: theme.colors.primary400 }}>
                <h2 className="text-lg font-bold">Select Category</h2>
                <p>Day: {selectedCell.day}, Month: {selectedCell.month}, Site: {selectedCell.site}</p>
                <div className="flex gap-2 mt-4">
                    <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid #f005bd", color: "#f005bd" }} onClick={() => handleSelection("2")}>Holiday</button>
                    <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid green", color: "green" }} onClick={() => handleSelection("3")}>Non-PROD</button>
                    <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid #10e7f7", color: "#10e7f7" }} onClick={() => handleSelection("4")}>Overtime</button>
                    <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid white", color: "white" }} onClick={() => handleSelection("5")}>Working Day</button>
                    <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid orange", color: "#EFEEEA" }} onClick={() => handleSelection("0")}>Weekday</button>
                    <button className="py-2 px-4 font-bold rounded-xl" style={{ border: "1px solid #EAE2C6", color: "#EAE2C6" }} onClick={() => handleSelection("1")}>Weekend</button>
                </div>
                <div className="flex justify-end mt-4">
                    <button className="mt-2 px-4 py-2 bg-gray-600 rounded" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
