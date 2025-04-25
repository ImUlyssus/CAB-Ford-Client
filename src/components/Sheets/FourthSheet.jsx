import React, { useContext, useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import AuthContext from "../../context/AuthProvider";
import Dialog from "./Dialog"; // Assuming you're using Material-UI for the dialog
import DataDetail from './DataDetail'

const FourthSheet = ({ isPdfMode }) => {
    const { auth } = useContext(AuthContext);
    const [aggregatedData, setAggregatedData] = useState({});

    useEffect(() => {
        if (!auth.filteredData) return;

        const processData = (data) => {
            let result = {
                aat_cancel: 0, ftm_cancel: 0, fsst_cancel: 0,
                aat_cancel_data: [], ftm_cancel_data: [], fsst_cancel_data: [],
                cancel_change: 0, postpone_scheduler: 0, encountered_error_during_implementation: 0,
                revisit_the_issue_and_conduct_a_thorough_analysis: 0, unable_to_contact_implementation_team: 0,
                cancel_change_data: [], postpone_scheduler_data: [], encountered_error_during_implementation_data: [],
                revisit_the_issue_and_conduct_a_thorough_analysis_data: [], unable_to_contact_implementation_team_data: [],
            };

            data.forEach((entry) => {
                const { change_sites, cancel_change_category } = entry;
                const category_check = cancel_change_category !== null && cancel_change_category !== '';

                if (change_sites?.includes("aat") && category_check) {
                    result.aat_cancel++;
                    result.aat_cancel_data.push(entry);
                }

                if (change_sites?.includes("ftm") && category_check) {
                    result.ftm_cancel++;
                    result.ftm_cancel_data.push(entry);
                }

                if (change_sites?.includes("fsst") && category_check) {
                    result.fsst_cancel++;
                    result.fsst_cancel_data.push(entry);
                }

                if (cancel_change_category === "Cancel change") {
                    result.cancel_change++;
                    result.cancel_change_data.push(entry);
                }
                if (cancel_change_category === "Postpone scheduler") {
                    result.postpone_scheduler++;
                    result.postpone_scheduler_data.push(entry);
                }
                if (cancel_change_category === "Encountered error(s) during implementation") {
                    result.encountered_error_during_implementation++;
                    result.encountered_error_during_implementation_data.push(entry);
                }
                if (cancel_change_category === "Revisit the issue and conduct a thorough analysis") {
                    result.revisit_the_issue_and_conduct_a_thorough_analysis++;
                    result.revisit_the_issue_and_conduct_a_thorough_analysis_data.push(entry);
                }
                if (cancel_change_category === "Unable to contact to implementation team") {
                    result.unable_to_contact_implementation_team++;
                    result.unable_to_contact_implementation_team_data.push(entry);
                }
            });

            return result;
        };

        const allData = processData(auth.filteredData);
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

            {/* Table */}
            {isPdfMode && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2 text-center">Cancellation Summary - By Site</h3>
                    <table className="min-w-full border border-gray-300 pdf-only">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b">Site</th>
                                <th className="py-2 px-4 border-b">Cancelled Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { site: 'AAT', cancelled: aggregatedData.aat_cancel },
                                { site: 'FTM', cancelled: aggregatedData.ftm_cancel },
                                { site: 'FSST', cancelled: aggregatedData.fsst_cancel },
                                { site: 'Total', cancelled: aggregatedData.aat_cancel + aggregatedData.ftm_cancel + aggregatedData.fsst_cancel },
                            ].map((row, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white text-center' : 'bg-gray-50 text-center'}>
                                    <td className="py-2 px-4 border-b">{row.site}</td>
                                    <td className="py-2 px-4 border-b">{row.cancelled}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3 className="text-lg font-semibold mt-4 mb-2 text-center">Cancellation Summary - By Reason</h3>
                    <table className="min-w-full border border-gray-300 pdf-only">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b">Reason</th>
                                <th className="py-2 px-4 border-b">Cancelled Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { reason: 'Cancel Change', cancelled: aggregatedData.cancel_change },
                                { reason: 'Postpone scheduler', cancelled: aggregatedData.postpone_scheduler },
                                { reason: 'Encountered error(s) during implementation', cancelled: aggregatedData.encountered_error_during_implementation },
                                { reason: 'Revisit the issue and conduct a thorough analysis', cancelled: aggregatedData.revisit_the_issue_and_conduct_a_thorough_analysis },
                                { reason: 'Unable to contact to implementation team', cancelled: aggregatedData.unable_to_contact_implementation_team },
                            ].map((row, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white text-center' : 'bg-gray-50 text-center'}>
                                    <td className="py-2 px-4 border-b">{row.reason}</td>
                                    <td className="py-2 px-4 border-b">{row.cancelled}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

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
        const height = 250;
        const innerRadius = 50;
        const center = width / 2;

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height + 40}`)
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
            {totalInner !== 0 ?
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

    const svgRef = useRef();

    useEffect(() => {
        if (!data || Object.keys(data).length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 270, height = 250;
        const barHeight = 10, spacing = 50;
        const labelWidth = 10;  // Increased label width for longer labels

        svg.attr("width", width).attr("height", height);

        // Prepare the data and sort based on value
        const reasons = [
            { name: "Cancel change", value: data.cancel_change, dataKey: "cancel_change_data" },
            { name: "Postpone scheduler", value: data.postpone_scheduler, dataKey: "postpone_scheduler_data" },
            { name: "Encountered error(s) during implementation", value: data.encountered_error_during_implementation, dataKey: "encountered_error_during_implementation_data" },
            { name: "Revisit the issue and conduct a thorough analysis", value: data.revisit_the_issue_and_conduct_a_thorough_analysis, dataKey: "revisit_the_issue_and_conduct_a_thorough_analysis_data" },
            { name: "Unable to contact to implementation team", value: data.unable_to_contact_implementation_team, dataKey: "unable_to_contact_implementation_team_data" },
        ];

        // Sort data in descending order based on values
        reasons.sort((a, b) => b.value - a.value);

        // Filter out reasons with null or undefined values
        const validReasons = reasons.filter(reason => reason.value !== null && reason.value !== undefined);

        // Get the max value for the bars
        const maxVal = d3.max(validReasons, d => d.value);

        // Set up the scale for the bars' width
        const xScale = d3.scaleLinear().domain([0, maxVal]).range([0, width - labelWidth - 20]);

        // Create y scale for positioning bars
        const yScale = d3.scaleBand()
            .domain(validReasons.map(d => d.name))
            .range([0, height - 50])
            .padding(0.3);


        // Create bar groups (one per reason)
        const bars = svg.selectAll(".bar-group")
            .data(validReasons)
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${labelWidth}, ${yScale(d.name) + 10})`);  // Adjusted translateY to move bars down

        // Draw bars
        bars.append("rect")
            .attr("height", yScale.bandwidth()/2)
            .attr("width", d => xScale(d.value))
            .attr("fill", "#E50046")
            .attr("rx", 5)
            .style("cursor", "pointer")
            .on("click", function (event, d) {
                setSelectedData({
                    category: d.name,
                    filteredData: data[d.dataKey] || []
                });
                setIsDialogOpen(true);
            });

        bars.append("text")
            .attr("x", d => xScale(d.value) / 2)  // 5px from the start of the bar (left edge)
            .attr("y", yScale.bandwidth() / 4)  // vertically centered in the bar
            .attr("dy", "0.35em")  // vertical alignment tweak
            .attr("fill", "white")  // white text for contrast
            .attr("font-size", "10px")  // optional: reduce size to fit inside
            .attr("text-anchor", "start")
            .text(d => d.value);
        // Add reason name labels above each bar, centered horizontally
        bars.append("text")
            .attr("x", 0) // Centered on the bar
            .attr("y", -4)
            .attr("fill", "#E50046")
            .attr("font-weight", "bold")
            .attr("font-size", "8px")
            .text(d => d.name);



    }, [data]);

    return (
        <>
            {data && Object.keys(data).length !== 0 ?
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
                </div> :
                <div className="flex justify-center items-center bg-gray-900 mt-[40%]">
                    <h1 className="text-[#003478]">No cancel change for this period.</h1>
                </div>
            }
        </>
    );
};

export default FourthSheet;
