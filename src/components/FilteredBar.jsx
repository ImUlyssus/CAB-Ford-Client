import React, { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from 'react-router-dom';

export default function FilteredBar() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(); // Default to "All"
    const [week, setWeek] = useState("All"); // Default to "All"

    const startYear = new Date().getFullYear() - 10;
    const years = Array.from({ length: 11 }, (_, i) => startYear + i);
    const [changeRequests, setChangeRequests] = useState([]);
    const [filteredChangeRequests, setFilteredChangeRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const quarters = ["All", 1, 2, 3, 4];

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const quarterMonths = {
        1: ["January", "February", "March"],
        2: ["April", "May", "June"],
        3: ["July", "August", "September"],
        4: ["October", "November", "December"]
    };
    // set quarter
    let currentQuarter = "All"; // Default to "All"
    if (month >= 0 && month <= 2) currentQuarter = 1; // Jan-Mar
    else if (month >= 3 && month <= 5) currentQuarter = 2; // Apr-Jun
    else if (month >= 6 && month <= 8) currentQuarter = 3; // Jul-Sep
    else if (month >= 9 && month <= 11) currentQuarter = 4; // Oct-Dec


    const [quarter, setQuarter] = useState(currentQuarter);
    const availableMonths = quarter === "All"
        ? months
        : [...quarterMonths[quarter], `${quarterMonths[quarter][0].slice(0, 3)} - ${quarterMonths[quarter][2].slice(0, 3)}`];

    const isQuarterRangeSelected = availableMonths.includes(month) && month.includes("-") || quarter == "All";
    useEffect(() => {
        const fetchChangeRequests = async () => {
            try {
                const response = await axiosPrivate.get('/change-requests/two-year-data');
                setChangeRequests(response.data);
            } catch (err) {
                console.error("Error fetching change requests:", err.response ? err.response.data : err.message); // Debugging
                setError(err.response ? err.response.data.message : err.message);
                navigate('/login', { state: { from: location }, replace: true });
            } finally {
                setLoading(false);
            }
        };
        fetchChangeRequests();
    }, [])
    // Filter function that updates changeRequests
    // Function to get weeks in a month
    const getWeeksInMonth = (year, month) => {
        const weeks = [];
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        let startDate = new Date(firstDay);

        // Adjust start date to the previous Saturday if the first day is not Saturday
        if (startDate.getDay() !== 6) {
            startDate.setDate(startDate.getDate() - (startDate.getDay() + 1) % 7);
        }

        while (startDate <= lastDay) {
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 6);

            // Ensure dates are within the month
            const startMonth = startDate.getMonth();
            const endMonth = endDate.getMonth();
            const startYear = startDate.getFullYear();
            const endYear = endDate.getFullYear();

            const startMonthName = months[startMonth];
            const endMonthName = months[endMonth];

            // Only include weeks that overlap the selected month
            if (startMonth === month || endMonth === month) {
                weeks.push({
                    start: startDate.getDate(),
                    startMonth: startMonthName,
                    startYear, // Store start year for cross-year weeks
                    end: endDate.getDate(),
                    endMonth: endMonthName,
                    endYear, // Store end year for cross-year weeks
                });
            }

            // Move to the next week
            startDate.setDate(startDate.getDate() + 7);
        }

        // Remove incorrect last weeks (if needed)
        if (weeks.length > 0) {
            const lastWeek = weeks[weeks.length - 1];
            if (lastWeek.start > lastWeek.end) {
                weeks.pop();
            }
        }

        return weeks;
    };
    useEffect(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // This gives the current month (0-11)

        // Pass current year and current month to getWeeksInMonth function
        getWeeksInMonth(currentDate.getFullYear(), currentMonth);
        setMonth(months[currentMonth]);
    }, []);

    // Selected month processing
    const selectedMonthIndex = months.indexOf(month);
    const weeks = selectedMonthIndex !== -1 ? getWeeksInMonth(year, selectedMonthIndex) : [];
    // Fetch data once for the selected year
    const fetchChangeRequestsForYear = async (selectedYear) => {
        try {
            const response = await axiosPrivate.get(`/change-requests/year/${selectedYear}`);
            setChangeRequests(response.data); // Initially, no filters applied
        } catch (err) {
            console.error("Error fetching change requests:", err.response ? err.response.data : err.message);
            setError(err.response ? err.response.data.message : err.message);
            navigate('/login', { state: { from: location }, replace: true });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        let sortedData = [...changeRequests];
        // ✅ Step 1: Sort the data in ascending order by request_change_date
        sortedData.sort((a, b) => new Date(a.request_change_date) - new Date(b.request_change_date));

        let filteredData = sortedData.filter((req) => {
            const requestDate = new Date(req.request_change_date); // Convert request_change_date to Date object

            // ✅ 1. Filter by Year (Compare year and previous year)
            const previousYear = parseInt(year) - 1;
            if (requestDate.getFullYear() !== parseInt(year) && requestDate.getFullYear() !== previousYear) return false;

            // ✅ 2. Filter by Date Range (Compare Date Only)
            if (week !== "All" && !month.includes("-") && quarter !== "All") {
                const [startStr, endStr] = week.split(" - ");

                // Helper function to convert month name to month number
                const monthNames = {
                    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
                    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
                };

                // Extract start & end month/day
                const [startMonth, startDay] = startStr.split(" ");
                const [endMonth, endDay] = endStr.split(" ");

                const startDayInt = parseInt(startDay, 10);
                const endDayInt = parseInt(endDay, 10);

                // Adjust start year for December → January transitions
                let adjustedStartYear = parseInt(year);
                if (monthNames[startMonth] === 11 && monthNames[endMonth] === 0) {
                    adjustedStartYear = parseInt(year) - 1; // December should belong to last year
                }

                // Construct proper date objects WITHOUT time zone shifts
                const startDate = new Date(adjustedStartYear, monthNames[startMonth], startDayInt);
                const endDate = new Date(parseInt(year), monthNames[endMonth], endDayInt);

                // Ensure endDate includes the full day
                endDate.setHours(23, 59, 59, 999); // Set the end time to the last millisecond of the end date

                // Compare requestDate with startDate and endDate
                if (requestDate < startDate || requestDate > endDate) return false;
            }


            // ✅ 3. Filter by Week when week = "All"
            if (week === "All" && !month.includes("-") && quarter !== "All") {
                if (weeks.length) {
                    // Get the start date from the first week
                    const startDate = new Date(weeks[0].startYear, months.indexOf(weeks[0].startMonth), weeks[0].start);

                    // Get the end date from the fourth or fifth week (if it exists)
                    const endWeekIndex = weeks.length > 4 ? 4 : 3; // Use weeks[4] if it exists, otherwise use weeks[3]
                    const endDate = new Date(weeks[endWeekIndex].endYear, months.indexOf(weeks[endWeekIndex].endMonth), weeks[endWeekIndex].end);

                    // Ensure endDate includes the full day
                    endDate.setHours(23, 59, 59, 999);

                    // Compare requestDate with startDate and endDate
                    if (requestDate < startDate || requestDate > endDate) return false;
                }
            }

            // Extract first and last months of the selected quarter
            if (month.includes("-") && quarter !== "All") {
                const selectedMonths = quarterMonths[quarter];

                const firstMonth = selectedMonths[0]; // First month of the quarter
                const lastMonth = selectedMonths[2];  // Last month of the quarter

                const monthNames = {
                    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
                    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
                };

                // Convert month names to numbers
                const firstMonthIndex = monthNames[firstMonth];
                const lastMonthIndex = monthNames[lastMonth];

                // Determine Start Date
                let startDate = new Date(year, firstMonthIndex, 1);
                if (startDate.getDay() !== 6) { // If not Saturday, find last Saturday of the previous month
                    let prevMonthIndex = firstMonthIndex - 1;
                    let prevMonthYear = year;

                    if (prevMonthIndex < 0) { // If January, move to previous year's December
                        prevMonthIndex = 11;
                        prevMonthYear -= 1;
                    }

                    let lastDayPrevMonth = new Date(prevMonthYear, prevMonthIndex + 1, 0).getDate();
                    let lastSaturdayPrevMonth = new Date(prevMonthYear, prevMonthIndex, lastDayPrevMonth);

                    while (lastSaturdayPrevMonth.getDay() !== 6) {
                        lastSaturdayPrevMonth.setDate(lastSaturdayPrevMonth.getDate() - 1);
                    }

                    startDate = lastSaturdayPrevMonth;
                }

                // Determine End Date
                let lastDayOfLastMonth = new Date(year, lastMonthIndex + 1, 0).getDate();
                let endDate = new Date(year, lastMonthIndex, lastDayOfLastMonth);

                if (endDate.getDay() !== 5) { // If not Friday, find last Friday of this month
                    while (endDate.getDay() !== 5) {
                        endDate.setDate(endDate.getDate() - 1);
                    }
                }

                if (requestDate < startDate || requestDate >= new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1)) return false;

            }
            // ✅ 4. Filter by "All Quarters"
            if (quarter === "All") {

                // Determine Start Date
                let startDate = new Date(year, 0, 1); // January 1st of the selected year
                if (startDate.getDay() !== 6) { // If it's not Saturday, find the last Saturday of the previous year
                    let prevMonthYear = year;
                    let prevMonthIndex = 0; // January

                    // Find the last Saturday of December from the previous year
                    let lastDayPrevMonth = new Date(prevMonthYear - 1, 11, 31).getDate(); // December of previous year
                    let lastSaturdayPrevMonth = new Date(prevMonthYear - 1, 11, lastDayPrevMonth);

                    while (lastSaturdayPrevMonth.getDay() !== 6) {
                        lastSaturdayPrevMonth.setDate(lastSaturdayPrevMonth.getDate() - 1);
                    }

                    startDate = lastSaturdayPrevMonth;
                }

                // Determine End Date
                let endDate = new Date(year, 11, 31); // December 31st of the selected year
                if (endDate.getDay() !== 5) { // If it's not Friday, find the last Friday of December
                    while (endDate.getDay() !== 5) {
                        endDate.setDate(endDate.getDate() - 1);
                    }
                }

                // Ensure endDate includes the full day (up to the last millisecond)
                endDate.setHours(23, 59, 59, 999);

                // Compare requestDate with startDate and endDate
                if (requestDate < startDate || requestDate > endDate) return false;
            }
            return true;
        });

        console.log("Filtered Data Count:", filteredData.length);
        setFilteredChangeRequests(filteredData);
    }, [year, quarter, month, week, changeRequests]);


    // Weeks for the selected month and year
    // const weeks = getWeeksInMonth(year, month);

    if (error) {
        return <div className="text-red-500 text-center py-4">Error: {error}</div>;
    }

    return (
        <div className="p-5">
            <div className="flex space-x-4">
                {/* Year Dropdown */}
                <select
                    value={year}
                    onChange={(e) => {
                        const selectedYear = parseInt(e.target.value);
                        setYear(selectedYear);
                        setQuarter("All");
                        setMonth("All");
                        setWeek("All");
                        fetchChangeRequestsForYear(selectedYear); // Fetch data for selected year
                    }}
                    className="p-2 border rounded"
                >
                    {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>


                {/* Quarter Dropdown */}
                <select
    value={quarter}
    onChange={(e) => {
        const selectedQuarter = e.target.value;
        setQuarter(selectedQuarter);
        setWeek("All");

        if (selectedQuarter !== "All Quarters") {
            // Ensure quarterMonths[selectedQuarter] exists
            if (quarterMonths[selectedQuarter]) {
                setMonth(quarterMonths[selectedQuarter][0]);
            }
        }
    }}
    className="p-2 border rounded"
>
    {quarters.map((q) => (
        <option key={q} value={q}>
            {q === "All" ? "All Quarters" : `Q${q}`}
        </option>
    ))}
</select>

                {/* Month Dropdown */}
                <select
                    value={month}
                    onChange={(e) => {
                        setMonth(e.target.value);
                        setWeek("All");
                    }}
                    className={`p-2 border rounded ${quarter === "All" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
                    disabled={quarter === "All"}
                >
                    {availableMonths.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>

                {/* Week Dropdown */}
                <select
                    value={week}
                    onChange={(e) => setWeek(e.target.value)}
                    className={`p-2 border rounded ${isQuarterRangeSelected ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
                    disabled={isQuarterRangeSelected}
                >
                    <option value="All">All</option>
                    {weeks.map((w, index) => (
                        <option key={index} value={`${w.startMonth} ${w.start} - ${w.endMonth} ${w.end}`}>
                            {`${w.startMonth} ${w.start} - ${w.endMonth} ${w.end}`}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}