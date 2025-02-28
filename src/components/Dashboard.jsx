import React, { useState } from 'react';
import { useTheme } from 'styled-components';

export default function Dashboard() {
    // State for dropdown values
    const [year, setYear] = useState(new Date().getFullYear());
    const [quarter, setQuarter] = useState(1);
    const [month, setMonth] = useState(0); // 0 = January, 1 = February, etc.
    const [week, setWeek] = useState('');

    // Generate years (e.g., from 2020 to 2030)
    const startYear = new Date().getFullYear() - 10
    const years = Array.from({ length: 11 }, (_, i) => startYear + i);

    // Quarters (1 to 4)
    const quarters = [1, 2, 3, 4];

    // Months (January to December)
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

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
    
            // Correctly format the month names
            const startMonth = startDate.getMonth();
            const endMonth = endDate.getMonth();
            const startMonthName = months[startMonth];
            const endMonthName = months[endMonth];
    
            // Ensure we only add weeks that belong to the selected month
            if (startMonth === month || endMonth === month) {
                weeks.push({
                    start: startDate.getDate(),
                    startMonth: startMonthName, // Store month name of start date
                    end: endDate.getDate(),
                    endMonth: endMonthName, // Store month name of end date
                });
            }
    
            // Move to the next week
            startDate.setDate(startDate.getDate() + 7);
        }
    
        // New filtering logic: Remove the last week if start day > end day
        if (weeks.length > 0) {
            const lastWeek = weeks[weeks.length - 1];
            if (lastWeek.start > lastWeek.end) {
                weeks.pop(); // Remove the last week
            }
        }
    
        return weeks;
    };


    // Weeks for the selected month and year
    const weeks = getWeeksInMonth(year, month);

    return (
        <div>
        <div style={{ padding: '15px' }}>
            <div className='flex justify-between'>
                {/* Dropdowns for Year, Quarter, Month, and Week */}
                <div className="flex space-x-4">
                    {/* Year Dropdown */}
                    <select
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        className="p-2 border rounded"
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>

                    {/* Quarter Dropdown */}
                    <select
                        value={quarter}
                        onChange={(e) => setQuarter(parseInt(e.target.value))}
                        className="p-2 border rounded"
                    >
                        {quarters.map((q) => (
                            <option key={q} value={q}>
                                Q{q}
                            </option>
                        ))}
                    </select>

                    {/* Month Dropdown */}
                    <select
                        value={month}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                        className="p-2 border rounded"
                    >
                        {months.map((m, index) => (
                            <option key={m} value={index}>
                                {m}
                            </option>
                        ))}
                    </select>
                    {/* Week Dropdown */}
                    <select
                        value={week}
                        onChange={(e) => setWeek(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="">Select Week</option>
                        {weeks.map((w, index) => (
                            <option key={index} value={`${w.startMonth} ${w.start} - ${w.endMonth} ${w.end}`}>
                                {`${w.startMonth} ${w.start} - ${w.endMonth} ${w.end}`}
                            </option>
                        ))}
                    </select>

                </div>
            </div>
        </div>
        <div>
            <h2 className='text-xl font-bold p-4'>Change Request Summary</h2>
        <div className="flex">
        <ChangeRequestComponent data={"AAT"}/>
        <ChangeRequestComponent data={"FTM"}/>
        <ChangeRequestComponent data={"FSST"}/>
        </div>
        </div>
        </div>
    );
}

const ChangeRequestComponent = ({data}) => {
    const theme = useTheme();
    return (
        <div className="w-[32%] m-[1%]">
            <div className='text-center rounded-t-lg' style={{backgroundColor: theme.colors.primaryButton, color: theme.colors.primary500}}>
                <h3>{data}</h3>
            </div>
        <div className="flex border rounded-b-lg">
            {/* First column: one cell that spans all 3 rows */}
            <div className="flex flex-col justify-center text-center p-4 w-1/3">
                <h4>Total Requests</h4>
                <h3>10</h3>
            </div>

            {/* Second Column */}
            <div className="flex flex-col w-1/3">
                <div className="flex-1 items-center justify-center text-center p-4 border">
                <h4>Approved</h4>
                <h3>5</h3>
                </div>
                <div className="flex-1 items-center justify-center text-center p-4 border">
                <h4>Waiting</h4>
                <h3>3</h3>
                </div>
                <div className="flex-1 items-center justify-center text-center p-4 border">
                <h4>Cancel</h4>
                <h3>2</h3>
                </div>
            </div>

            {/* Third Column */}
            <div className="flex flex-col w-1/3">
    {/* First Cell */}
    <div className="flex-2 flex items-center justify-center text-center p-4 border">
        <div>
            <h4>Completed</h4>
            <h3>3</h3>
        </div>
    </div>

    {/* Second Cell */}
    <div className="flex-2 flex items-center justify-center text-center p-4">
        <div>
            <h4>Ongoing</h4>
            <h3>2</h3>
        </div>
    </div>
</div>
        </div>
        </div>
    );
};