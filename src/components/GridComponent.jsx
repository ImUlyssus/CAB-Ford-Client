import { useTheme } from "styled-components";
import React from "react";

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

export default function GridComponent({ data, activeYear, isForPresentation }) {
    const monthName = data["month"];
    const year = activeYear;
    const theme = useTheme();

    const month = monthMap[monthName];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyCells = Array.from({ length: firstDayOfMonth }, () => null);

    // Function to determine if a day is a weekend based on the date
    const isWeekend = (index) => {
        const dayOfMonth = index + 1; // Day of the month
        const date = new Date(year, month, dayOfMonth);
        const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
        return dayOfWeek === 0 || dayOfWeek === 6; // Weekend is Sunday or Saturday
    };

    return (
        <div
            className="grid grid-rows-4 border"
            style={{ gridTemplateColumns: "90px 60px repeat(37, 1fr)",color: isForPresentation ? 'black' : theme.colors.secondary500 }}
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
                            ? '#BFBBA9' // Weekend color
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

            {/* Render Site Rows */}
            {["AAT", "FTM", "FSST"].map((label, siteIndex) => {
                const lowercaseSite = label.toLowerCase(); // Convert label to lowercase
                const siteData = data[lowercaseSite]; // Access the correct site data using lowercase label

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
                                backgroundColor = '#BFBBA9';
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
                                    className="flex items-center justify-center border py-2 text-xs"
                                    style={{
                                        backgroundColor,
                                        color: textColor,
                                        borderColor: isForPresentation ? 'black' : theme.colors.secondary500
                                    }}
                                >
                                    {/* {siteValue !== null ? siteValue : ""} */}
                                </div>
                            );
                        })}

                        {/* Fill Remaining Cells */}
                        {Array.from({ length: 37 - (emptyCells.length + daysArray.length) }, (_, index) => (
                            <div key={`${label}-remaining-${index}`} className="flex items-center justify-center border py-2 text-xs bg-gray-200" style={{ color: isForPresentation ? 'black' : theme.colors.secondary500  }}></div>
                        ))}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
