import React, { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useTheme } from 'styled-components';
import Dialog from "./Dialog";
import DataDetail from './DataDetail';
const FirstSheet = () => {
    const [weeklyData, setWeeklyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const [week1, setWeek1] = useState([]);
    const [week2, setWeek2] = useState([]);
    const [week3, setWeek3] = useState([]);
    const [week4, setWeek4] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        const fetchWeeklyData = async () => {
            try {
                const response = await axiosPrivate.get('/change-requests/get-four-week-data');
                setWeeklyData(response.data);
            } catch (err) {
                console.error("Error fetching weekly data:", err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data.message : err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeeklyData();
    }, []);
    useEffect(() => {
        if (weeklyData.length === 0) return;
    
        const processWeekData = (weekData) => {
            let result = {
                aat_total: 0, aat_ongoing: 0, aat_rejected: 0, aat_completed: 0,
                ftm_total: 0, ftm_ongoing: 0, ftm_rejected: 0, ftm_completed: 0,
                fsst_total: 0, fsst_ongoing: 0, fsst_rejected: 0, fsst_completed: 0,
                aat_ongoing_data: [], aat_completed_data: [], aat_rejected_data: [],
                ftm_ongoing_data: [], ftm_completed_data: [], ftm_rejected_data: [],
                fsst_ongoing_data: [], fsst_completed_data: [], fsst_rejected_data: [],
                date: "", // Formatted date range
            };
    
            // Process the start and end dates
            const startDate = new Date(weekData.week.start);
            const endDate = new Date(weekData.week.end);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            result.date = `${monthNames[startDate.getMonth()]} ${startDate.getDate()} - ${monthNames[endDate.getMonth()]} ${endDate.getDate()}`;
    
            // Process data entries and store the full objects
            weekData.data.forEach((entry) => {
                const { change_sites, change_status } = entry;
    
                if (change_sites.includes("aat")) {
                    result.aat_total++;
                    if (change_status === "") {
                        result.aat_ongoing++;
                        result.aat_ongoing_data.push(entry);
                    } else if (change_status === "Completed with no issue") {
                        result.aat_completed++;
                        result.aat_completed_data.push(entry);
                    } else {
                        result.aat_rejected++;
                        result.aat_rejected_data.push(entry);
                    }
                }
    
                if (change_sites.includes("ftm")) {
                    result.ftm_total++;
                    if (change_status === "") {
                        result.ftm_ongoing++;
                        result.ftm_ongoing_data.push(entry);
                    } else if (change_status === "Completed with no issue") {
                        result.ftm_completed++;
                        result.ftm_completed_data.push(entry);
                    } else {
                        result.ftm_rejected++;
                        result.ftm_rejected_data.push(entry);
                    }
                }
    
                if (change_sites.includes("fsst")) {
                    result.fsst_total++;
                    if (change_status === "") {
                        result.fsst_ongoing++;
                        result.fsst_ongoing_data.push(entry);
                    } else if (change_status === "Completed with no issue") {
                        result.fsst_completed++;
                        result.fsst_completed_data.push(entry);
                    } else {
                        result.fsst_rejected++;
                        result.fsst_rejected_data.push(entry);
                    }
                }
            });
    
            return result;
        };
    
        // Process each week's data
        setWeek1(processWeekData(weeklyData[0]));
        setWeek2(processWeekData(weeklyData[1]));
        setWeek3(processWeekData(weeklyData[2]));
        setWeek4(processWeekData(weeklyData[3]));
    
    }, [weeklyData]);
    

    // Create an array of labels for the Y-axis
    let weeks = [week4, week3, week2, week1];
    useEffect(() => {
        weeks = [week4, week3, week2, week1];
    }, [week1, week2, week3, week4])
    const chartHeight = 247; // Adjust this value based on your chart's height
    const totals = weeks.flatMap(week =>
        [(week.aat_ongoing ?? 0) + (week.aat_completed ?? 0) + (week.aat_rejected ?? 0),
        (week.ftm_ongoing ?? 0) + (week.ftm_completed ?? 0) + (week.ftm_rejected ?? 0),
        (week.fsst_ongoing ?? 0) + (week.fsst_completed ?? 0) + (week.fsst_rejected ?? 0)]
    );

    const maxY = Math.max(...totals);
    const interval = Math.ceil(maxY / 5); // Divide maxY into 5 intervals
    
    const yAxisLabels = Array.from({ length: 7 }, (_, index) => interval * index).reverse();
    // Scale factor to normalize bar heights
    const scaleFactor = chartHeight / maxY;
    // Function to handle bar clicks
const handleBarClick = (weekData, site, category) => {
    const dataField = `${site}_${category}_data`; // Use the new data field name

    const filteredData = weekData[dataField]; // Get the full data array directly

    setSelectedData({
        category,
        filteredData,
        date: weekData.date,
        site
    });
    setIsDialogOpen(true);
};

    
    return (
        <div className='p-4'>
            <h1 className="text-xl font-bold mb-5 text-center text-[#beef70]">Change request summary from last 4 weeks</h1>

            <div className="relative w-full h-64 border-l border-b border-gray-700 ml-3">
                {/* Vertical Y-Axis Label */}
    <div
        className="absolute left-[-40px] bottom-4 transform -translate-y-1/2 -rotate-90 whitespace-nowrap"
        style={{
            transformOrigin: "left center", // Ensure the text rotates around the correct point
        }}
    >
        <span className="text-sm">Change Request Amount</span>
    </div>
                {/* Y-Axis Labels */}
                <div className="absolute left-[-20px] top-0 h-full flex flex-col justify-between">
                    {yAxisLabels.map((num, index) => (
                        <div key={index} className="flex items-end">
                            <span className="text-sm">{num}</span>
                        </div>
                    ))}
                </div>

                {/* Horizontal Grid Lines */}
                {yAxisLabels.map((_, index) => (
                    <div
                        key={index}
                        className="absolute w-full border-t border-gray-700"
                        style={{
                            top: `${(index / (yAxisLabels.length - 1)) * 100}%`,
                            transform: "translateY(-50%)",
                        }}
                    />
                ))}
                {/* X-Axis Line */}
                <div className="absolute bottom-0 left-0 w-full border-t border-gray-700"></div>

                {/* Bars and X-Axis Labels */}
                <div className="absolute bottom-[-20px] left-2 right-0 flex justify-around space-x-4">
                    {weeks.map((weekData, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col items-center">
                            {/* Render 3 bars for each site */}
                            <div className="flex flex-row space-x-1 h-full">
                                {["aat", "ftm", "fsst"].map((site, siteIndex) => {
                                    const ongoing = weekData[`${site}_ongoing`];
                                    const completed = weekData[`${site}_completed`];
                                    const rejected = weekData[`${site}_rejected`];
                                    const totalHeight = ongoing + completed + rejected;

                                    // Scale the bar heights to match the Y-axis
                                    const ongoingHeight = ongoing * scaleFactor * 0.69;
                                    const completedHeight = completed * scaleFactor * 0.69;
                                    const rejectedHeight = rejected * scaleFactor * 0.69;

                                    return (
                                        <div key={siteIndex} className="flex flex-col items-center justify-end h-full">
                                            {/* Stack bars for each category */}
                                            <p style={{ transform: 'rotate(-90deg)', marginBottom: "10px", color: 'gray' }}>{site.toUpperCase()}</p>

                                            {/* Ongoing Bar with Number */}
<div 
    className="relative w-4 bg-blue-500 flex justify-center items-center cursor-pointer" 
    style={{ height: `${ongoingHeight}px` }} 
    onClick={() => handleBarClick(weekData, site, "ongoing")}
>
    {ongoing > 0 && (
        <span
            className="absolute left-3 transform -translate-x-1/2 text-xs text-white"
            style={{ top: "50%", transform: "translate(-50%, -50%)" }}
        >
            {ongoing}
        </span>
    )}
</div>

{/* Completed Bar with Number */}
<div 
    className="relative w-4 bg-green-500 flex justify-center items-center cursor-pointer" 
    style={{ height: `${completedHeight}px` }} 
    onClick={() => handleBarClick(weekData, site, "completed")}
>
    {completed > 0 && (
        <span
            className="absolute left-3 transform -translate-x-1/2 text-xs text-white"
            style={{ top: "50%", transform: "translate(-50%, -50%)" }}
        >
            {completed}
        </span>
    )}
</div>

{/* Rejected Bar with Number */}
<div 
    className="relative w-4 bg-red-500 flex justify-center items-center cursor-pointer" 
    style={{ height: `${rejectedHeight}px` }} 
    onClick={() => handleBarClick(weekData, site, "rejected")}
>
    {rejected > 0 && (
        <span
            className="absolute left-3 transform -translate-x-1/2 text-xs text-center"
            style={{ top: "50%", transform: "translate(-50%, -50%)" }}
        >
            {rejected}
        </span>
    )}
</div>


                                        </div>
                                    );
                                })}
                            </div>

                            {/* X-Axis Label for Each Week */}
                            <span className="text-sm mt-auto">
                                {weeks[weekIndex].date}
                            </span>

                        </div>
                    ))}
                </div>
                {/* X-Axis Label - "Date" */}
                <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 text-md">
                    Date
                </div>

                {/* Legend */}
                <div className="flex justify-center mt-4 space-x-4">
                    {/* Completed */}
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 mr-2 rounded-[50%]"></div>
                        <span className="text-sm">Completed</span>
                    </div>

                    {/* Rejected */}
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 mr-2 rounded-[50%]"></div>
                        <span className="text-sm">Rejected</span>
                    </div>

                    {/* Ongoing */}
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 mr-2 rounded-[50%]"></div>
                        <span className="text-sm">Ongoing</span>
                    </div>
                </div>
                {/* Dialog Component */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <h2 className="text-lg font-semibold mb-2">
                    {selectedData?.category.toUpperCase()} Requests ({selectedData?.date})
                </h2>
                <p className="text-sm mb-4">
                    Showing requests for <strong>{selectedData?.site.toUpperCase()}</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    {selectedData?.filteredData ? (
                        <DataDetail requests={selectedData.filteredData} />
                    ) : (
                        <p className="text-gray-500">No data available.</p>
                    )}
                </ul>
            </Dialog>
            </div>
        </div>
    );
};

export default FirstSheet;

