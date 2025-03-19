import React, { useContext, useState, useEffect, useRef } from 'react'
import AuthContext from '../../context/AuthProvider';
import * as d3 from "d3";
import Dialog from "./Dialog";
import DataDetail from './DataDetail';
const SecondSheet = () => {
    const { auth } = useContext(AuthContext);
    const [aggregatedData, setAggregatedData] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    console.log(auth.filteredData);
    useEffect(() => {
        if (!auth.filteredData) return;  // Assuming filteredData is the data source

        const processData = (data) => {
            let result = {
                aat_total: 0, aat_ongoing: 0, aat_rejected: 0, aat_completed: 0,
                ftm_total: 0, ftm_ongoing: 0, ftm_rejected: 0, ftm_completed: 0,
                fsst_total: 0, fsst_ongoing: 0, fsst_rejected: 0, fsst_completed: 0,
                aat_ongoing_data: [], aat_completed_data: [], aat_rejected_data: [],
                ftm_ongoing_data: [], ftm_completed_data: [], ftm_rejected_data: [],
                fsst_ongoing_data: [], fsst_completed_data: [], fsst_rejected_data: [],
            };

            // Loop through all entries in filteredData
            data.forEach((entry) => {
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

        // Process the filteredData and store it in a single result
        const allData = processData(auth.filteredData);  // Assuming filteredData is your array of entries
        setAggregatedData(allData);  // Store the result in your state (setAggregatedData should be defined)
    }, [auth.filteredData]);  // Run this effect whenever the filtered data changes
    // Determine the data to pass based on the selected category
    const getSelectedData = () => {
        if (!selectedCategory) return null;
        switch (selectedCategory) {
            case "total":
                return {
                    category: "Total",
                    filteredData: [...aggregatedData.aat_ongoing_data, ...aggregatedData.aat_completed_data, ...aggregatedData.aat_rejected_data,
                    ...aggregatedData.ftm_ongoing_data, ...aggregatedData.ftm_completed_data, ...aggregatedData.ftm_rejected_data,
                    ...aggregatedData.fsst_ongoing_data, ...aggregatedData.fsst_completed_data, ...aggregatedData.fsst_rejected_data],
                };
            case "ongoing":
                return {
                    category: "Ongoing",
                    filteredData: [...aggregatedData.aat_ongoing_data, ...aggregatedData.ftm_ongoing_data, ...aggregatedData.fsst_ongoing_data],
                };
            case "completed":
                return {
                    category: "Completed",
                    filteredData: [...aggregatedData.aat_completed_data, ...aggregatedData.ftm_completed_data, ...aggregatedData.fsst_completed_data],
                };
            case "rejected":
                return {
                    category: "Rejected",
                    filteredData: [...aggregatedData.aat_rejected_data, ...aggregatedData.ftm_rejected_data, ...aggregatedData.fsst_rejected_data],
                };
            default:
                return null;
        }
    };
    // Handle opening dialog with the selected category
    const openDialog = (category) => {
        setSelectedCategory(category);
        setIsDialogOpen(true);
    };
    return (
        <div className="grid grid-cols-5">
            {/* First column */}
            <div className="col-span-2 bg-transparent p-4">
                <h2 className="text-xl font-semibold mb-6 text-center">All 3 sites</h2>

                <div className="space-y-6">
                    {/* Card 1 - Total */}
                    <div
                        className="bg-transparent p-2 rounded-lg shadow-md text-center border-2 border-blue-500 text-blue-500 cursor-pointer"
                        onClick={() => openDialog("total")}
                    >
                        <p className="text-sm font-medium">Total</p>
                        <p className="text-sm font-xl font-bold">{aggregatedData.aat_total + aggregatedData.ftm_total + aggregatedData.fsst_total}</p>
                    </div>

                    {/* Card 2 - Completed */}
                    <div
                        className="bg-transparent p-2 rounded-lg shadow-md text-center border-2 border-green-500 text-green-500 cursor-pointer"
                        onClick={() => openDialog("completed")}
                    >
                        <p className="text-sm font-medium">Completed</p>
                        <p className="text-sm font-xl font-bold">{aggregatedData.aat_completed + aggregatedData.ftm_completed + aggregatedData.fsst_completed}</p>
                    </div>

                    {/* Card 3 - Ongoing */}
                    <div
                        className="bg-transparent p-2 rounded-lg shadow-md text-center border-2 border-yellow-500 text-yellow-500 cursor-pointer"
                        onClick={() => openDialog("ongoing")}
                    >
                        <p className="text-sm font-medium">Ongoing</p>
                        <p className="text-sm font-xl font-bold">{aggregatedData.aat_ongoing + aggregatedData.ftm_ongoing + aggregatedData.fsst_ongoing}</p>
                    </div>

                    {/* Card 4 - Rejected */}
                    <div
                        className="bg-transparent p-2 rounded-lg shadow-md text-center border-2 border-red-500 text-red-500 cursor-pointer"
                        onClick={() => openDialog("rejected")}
                    >
                        <p className="text-sm font-medium">Rejected</p>
                        <p className="text-sm font-xl font-bold">{aggregatedData.aat_rejected + aggregatedData.ftm_rejected + aggregatedData.fsst_rejected}</p>
                    </div>
                </div>
            </div>

            {/* Fourth column (merged into one) */}
            <div className="col-span-3 p-4">
                <h2 className="text-xl font-semibold mb-1 text-center">Change request distribution by site</ h2>
                {/* <LayeredDonutChart aggregatedData={aggregatedData} /> */}
                <TwoLayerDonutChart data={aggregatedData} />
            </div>
            {/* Dialog for displaying selected data */}
            {isDialogOpen && (
                <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                    <h2 className="text-lg font-semibold mb-2">{selectedCategory.toUpperCase()} Requests</h2>
                    <p className="text-sm mb-4">Showing requests for <strong>{selectedCategory}</strong></p>
                    <DataDetail requests={getSelectedData()?.filteredData || []} />
                </Dialog>
            )}
        </div>

    );
}
const TwoLayerDonutChart = ({ data }) => {
    const [selectedData, setSelectedData] = useState(null); // State to store the data for the dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
    const innerCount = [data.aat_total, data.ftm_total, data.fsst_total];
    const outerCount = [
        data.aat_completed, data.aat_ongoing, data.aat_rejected,
        data.ftm_completed, data.ftm_ongoing, data.ftm_rejected,
        data.fsst_completed, data.fsst_ongoing, data.fsst_rejected
    ];
    const svgRef = useRef(null);
    const outerColors = ["#5B913B", "#FFEB00", "#D84040", "#5B913B", "#FFEB00", "#D84040", "#5B913B", "#FFEB00", "#D84040"];

    useEffect(() => {
        const width = 320;
        const height = 320;
        const innerRadius = 50;
        const outerRadius = 100;
        const center = width / 2;

        // Calculate the total for innerCount
        const totalInner = d3.sum(innerCount);

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)  // Added viewBox to scale the SVG properly
            .append("g")
            .attr("transform", `translate(${center}, ${center})`);

        // Create pie generators
        const innerPie = d3.pie().sort(null);
        const outerPie = d3.pie().sort(null);

        // Arc generators
        const innerArc = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(innerRadius + 50) // Adjust thickness
            .cornerRadius(5);

        const outerArc = d3
            .arc()
            .innerRadius(outerRadius)
            .outerRadius(outerRadius + 60)
            .cornerRadius(5);

        // Inner Sections
        svg
            .selectAll(".innerSlice")
            .data(innerPie(innerCount))
            .enter()
            .append("path")
            .attr("d", innerArc)
            .attr("fill", (d, i) => ["#22177A", "#FF2DF1", "#2196F3"][i]) // Different colors
            .attr("stroke", "#111827")
            .attr("stroke-width", 2)
            .style("cursor", "pointer")
            .on("click", function (event, d) {
                const labels = ["aat", "ftm", "fsst"];
                const category = labels[d.index]; // Use d.index instead of i

                // Combine ongoing, completed, and rejected data into filteredData
                const ongoingData = data[`${category}_ongoing_data`] || [];
                const completedData = data[`${category}_completed_data`] || [];
                const rejectedData = data[`${category}_rejected_data`] || [];

                const filteredData = ongoingData.concat(completedData, rejectedData); // Concatenate arrays

                setSelectedData({
                    category: category,
                    date: new Date().toLocaleDateString(), // Example date, use your data here
                    site: category.toUpperCase(), // Example site, use your data here
                    ongoingData: ongoingData, // Fallback to empty array if key doesn't exist
                    completedData: completedData, // Fallback to empty array if key doesn't exist
                    rejectedData: rejectedData, // Fallback to empty array if key doesn't exist
                    filteredData: filteredData // Combined data
                });
                setIsDialogOpen(true);
            });
        // Outer Sections
        svg
            .selectAll(".outerSlice")
            .data(outerPie(outerCount))
            .enter()
            .append("path")
            .attr("d", outerArc)
            .attr("fill", (d, i) => outerColors[i]) // Gradient color
            .attr("stroke", "#111827")
            .attr("stroke-width", 2)
            .style("cursor", "pointer")
            .on("click", function (event, d) {
                // Get the index of the clicked slice
                const index = d.index; // Use the index from the bound data

                const sectionNames = ["completed", "ongoing", "rejected"];
                const sectionIndex = index % 3; // Index for section (0, 1, 2)
                const categoryIndex = Math.floor(index / 3); // Index for category (0, 1, 2)
                const labels = ["aat", "ftm", "fsst"];
                // Get category and section
                const category = labels[categoryIndex];
                const section = sectionNames[sectionIndex];

                setSelectedData({
                    category: `${category} - ${section}`,
                    date: new Date().toLocaleDateString(),
                    site: category,
                    filteredData: data[`${category}_${section}_data`] || [] // Fallback to empty array if key doesn't exist
                });
                setIsDialogOpen(true);
            });

        // Inner Section Labels
        svg
            .selectAll(".innerText")
            .data(innerPie(innerCount))
            .enter()
            .append("text")
            .attr("transform", (d) => `translate(${innerArc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-size", "14px")
            .each(function (d, i) {
                // Calculate percentage for each section
                const percentage = ((d.data / totalInner) * 100).toFixed(1);

                // Add corresponding text (AAT, FTM, FSST) based on index
                const labels = ["AAT", "FTM", "FSST"];

                // Split the text into two lines
                const label = labels[i];
                const textElement = d3.select(this);
                textElement
                    .append("tspan")
                    .attr("x", 0) // Center horizontally
                    .attr("dy", "-0.6em") // Move up slightly
                    .text(label);

                textElement
                    .append("tspan")
                    .attr("x", 0) // Center horizontally
                    .attr("dy", "1.2em") // Move down
                    .text(`${percentage}%`);
            });

        // Outer Section Labels with Status and Percentage
        svg
    .selectAll(".outerText")
    .data(outerPie(outerCount))
    .enter()
    .append("text")
    .attr("transform", (d) => `translate(${outerArc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("font-size", "12px")
    .each(function (d, i) {
        const totalOuter = innerCount[Math.floor(i / 3)];
        const percentage = ((d.data / totalOuter) * 100).toFixed(1);
        const status = ["C", "O", "R"][i % 3];

        const textElement = d3.select(this);
        textElement
            .append("tspan")
            .attr("font-weight", "bold") // Make status bold
            .text(status);

        textElement
            .append("tspan")
            .attr("dx", "4px") // Add space between status and percentage
            .text(` ${percentage}%`);
    });


        // Add Chart Title
        svg
            .append("text")
            .attr("x", 0)
            .attr("y", -height / 2 - 20)  // Position the title above the chart
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-size", "18px")
            .attr("font-weight", "bold")
            .text("Donut Chart Title");  // Replace with your dynamic title if needed

    }, [data]);
    return (
        <div className="flex justify-center items-center bg-gray-900 p-4">
            <svg ref={svgRef}></svg>
            {/* Dialog for displaying data */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <h2 className="text-lg font-semibold mb-2">
                    {selectedData?.category.toUpperCase()} Requests
                </h2>
                <p className="text-sm mb-4">
                    Showing {selectedData?.filteredData.length} requests for <strong>{selectedData?.site.toUpperCase()}</strong>
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
    );
};

export default SecondSheet