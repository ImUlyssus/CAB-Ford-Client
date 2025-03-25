
import { useTheme } from "styled-components";
export default function GridComponent({ data, activeYear }) {
    const monthName = data["month"];
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
                ></div>
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