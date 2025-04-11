import React, { useContext, useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import AuthContext from "../../context/AuthProvider";
import Dialog from "./Dialog"; // Assuming you're using Material-UI for the dialog
import DataDetail from './DataDetail'
const FourthSheet = () => {
    const { auth } = useContext(AuthContext);
    const [aggregatedData, setAggregatedData] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    useEffect(() => {
        if (!auth.filteredData) return;
        console.log(auth.filteredData)
        const processData = (data) => {
            let result = {
                aat_cancel: 0, ftm_cancel: 0, fsst_cancel: 0,
                aat_cancel_data: [], ftm_cancel_data: [], fsst_cancel_data: [],
                reason_1: 0, reason_2: 0, reason_3: 0,
                reason_1_data: [], reason_2_data: [], reason_3_data: []
            };

            data.forEach((entry) => {
                const { change_sites, approval, cancel_change_category } = entry;
                const category_check = cancel_change_category !== null && cancel_change_category !== '';
                if (change_sites.includes("aat") && category_check) {
                    result.aat_cancel++;
                    result.aat_cancel_data.push(entry);
                    console.log(entry.cancel_change_category)
                }

                if (change_sites.includes("ftm") && category_check) {
                    result.ftm_cancel++;
                    result.ftm_cancel_data.push(entry);
                }

                if (change_sites.includes("fsst") && category_check) {
                    result.fsst_cancel++;
                    result.fsst_cancel_data.push(entry);
                }
                if (cancel_change_category == "Reason 1" ) {
                    result.reason_1++;
                    result.reason_1_data.push(entry);
                }
                if (cancel_change_category == "Reason 2" ) {
                    result.reason_2++;
                    result.reason_2_data.push(entry);
                }
                if (cancel_change_category == "Reason 3" ) {
                    result.reason_3++;
                    result.reason_3_data.push(entry);
                }
            });

            return result;
        };

        const allData = processData(auth.filteredData);
        console.log(allData)
        setAggregatedData(allData);
    }, [auth.filteredData]);
    return (
        <div>
            <h1 className="text-xl font-bold mb-2 text-center text-[#003478]">Cancelled change summary</h1>
            <div className="grid grid-cols-2 gap-4">
                <div className='p-2'>
                    <DonutChart data={aggregatedData} />
                </div>
                <div className='p-2'>
                    <BarChart data={aggregatedData} />
                </div>
            </div>
        </div>
    )
}
const DonutChart = ({ data }) => {
    const [selectedData, setSelectedData] = useState(null); // State to store the data for the dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
    const innerCount = [data.aat_cancel, data.ftm_cancel, data.fsst_cancel];
    const totalInner = d3.sum(innerCount); // Calculate the total cancellations

    const svgRef = useRef(null);

    useEffect(() => {
        const width = 320;
        const height = 240;
        const innerRadius = 50;
        const center = width / 2;

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height + 40}`)  // Added viewBox to scale the SVG properly
            .append("g")
            .attr("transform", `translate(${center}, ${center - 10})`);

        // Clear existing content
        svg.selectAll("*").remove();

        // Create pie generators
        const innerPie = d3.pie().sort(null);

        // Arc generators
        const innerArc = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(innerRadius + 60) // Adjust thickness
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

                const filteredData = data[`${category}_cancel_data`] || [];

                setSelectedData({
                    category: category,
                    date: new Date().toLocaleDateString(), // Example date, use your data here
                    site: category.toUpperCase(), // Example site, use your data here
                    filteredData: filteredData // Combined data
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
                    .text(label + " " + d.data);

                textElement
                    .append("tspan")
                    .attr("x", 0) // Center horizontally
                    .attr("dy", "1.2em") // Move down
                    .text(`${percentage}%`);
            });

        // Add Chart Title
        svg
            .append("text")
            .attr("x", 0)
            .attr("y", -height / 2 - 10)  // Position the title above the chart
            .attr("text-anchor", "middle")
            .attr("fill", "#003478")
            .attr("font-size", "18px")
            .text("Cancel change distribution by site");  // Replace with your dynamic title if needed

    }, [data, totalInner]);

    return (
        <>
        { totalInner !==0 ?
             <div className="flex justify-center items-center">
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
             : <div className="flex justify-center items-center bg-gray-900 mt-[40%]">
             <h1 className="text-[#003478]">No cancel change for this period.</h1>
             </div>
        }
        </>
    );
};
const BarChart = ({ data }) => {
    const [selectedData, setSelectedData] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const cancelArr = [data.reason_1, data.reason_2, data.reason_3];
    const totalCancel = d3.sum(cancelArr);

    const svgRef = useRef();

    useEffect(() => {
        if (!data || Object.keys(data).length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 270, height = 200;
        const barHeight = 20, spacing = 50;

        svg.attr("width", width).attr("height", height);

        // Prepare the data and sort based on value
        const reasons = [
            { name: "Reason 1", value: data.reason_1 },
            { name: "Reason 2", value: data.reason_2 },
            { name: "Reason 3", value: data.reason_3 },
        ];

        // Sort data in descending order based on values
        reasons.sort((a, b) => b.value - a.value);

        // Get the max value for the bars
        const maxVal = d3.max(reasons, d => d.value);
        const labelWidth = 80;
        // Set up the scale for the bars' width
        const xScale = d3.scaleLinear().domain([0, maxVal]).range([0, width - labelWidth + 40]); 

        // Create bar groups (one per reason)
        const bars = svg.selectAll(".bar-group")
            .data(reasons)
            .enter()
            .append("g")
            .attr("transform", (d, i) => `translate(${labelWidth}, ${i * (barHeight + spacing)})`);

        // Draw bars
        bars.append("rect")
            .attr("height", barHeight)
            .attr("width", d => Math.max(0, xScale(d.value) - 40))
            .attr("fill", "#E50046")
            .attr("rx", 10)
            .style("cursor", "pointer")
            .on("click", function (event, d) {
                // Handle bar click
                let processed_name = d.name.split(" ").join('_').toLowerCase();
                setSelectedData({
                    category: d.name,
                    filteredData: data[`${processed_name}_data`] || []// If needed, add filtered data logic here
                });
                console.log(d.name);
                setIsDialogOpen(true);
            });

        // Add text labels for values inside the bars (centered)
        bars.append("text")
            .attr("x", d => xScale(d.value) / 2-20)  // Center the text inside the bar
            .attr("y", barHeight / 2)
            .attr("dy", "0.35em")
            .attr("fill", "white")
            .attr("font-size", "14px")
            .attr("text-anchor", "middle")
            .text(d => d.value);

        // Add text labels for reason names next to the bars (outside the bars)
        svg.selectAll(".label")
            .data(reasons)
            .enter()
            .append("text")
            .attr("x", 70) // Position to the left of the bar
            .attr("y", (d, i) => i * (barHeight + spacing) + barHeight / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .attr("fill", "#E50046")
            .attr("font-weight", "bold")
            .attr("font-size", "14px")
            .text(d => d.name);
        
    }, [data]);

    return (
        <>
        { totalCancel !==0 ?
        <div>
        <h1 className="mb-3 text-center text-md text-[#003478]">Change Request Summary</h1>

        {/* Dialog */}
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
            <h2 className="text-lg font-semibold mb-2">
                {selectedData?.category.toUpperCase()} Requests
            </h2>
            <p className="text-sm mb-4">
                Showing {selectedData?.filteredData?.length} requests
            </p>
            <ul className="list-disc pl-5 space-y-2">
                {selectedData?.filteredData?.length ? (
                    <DataDetail requests={selectedData.filteredData} />
                ) : (
                    <p className="text-gray-500">No data available.</p>
                )}
            </ul>
        </Dialog>

        <svg ref={svgRef}></svg>
    </div>:
    <div className="flex justify-center items-center bg-gray-900 mt-[40%]">
        <h1 className="text-[#003478]">No cancel change for this period.</h1>
    </div>
        }
        </>
    );
};


export default FourthSheet;