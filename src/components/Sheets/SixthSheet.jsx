import React, { useContext, useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import AuthContext from "../../context/AuthProvider";
import Dialog from "./Dialog.jsx";
import DataDetail from "./DataDetail";

const SixthSheet = () => {
  const { auth } = useContext(AuthContext);
  const [aggregatedData, setAggregatedData] = useState({});
  const [selectedData, setSelectedData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState("aat"); // Default to AAT
  const svgRef = useRef();

  // Define possible priorities
  const priorities = ["Critical", "High", "Medium", "Low"];

  useEffect(() => {
    if (!auth.filteredData) return;

    const processData = (data) => {
      let result = {
        aat: {
          Critical: { count: 0, selectedObjects: [] },
          High: { count: 0, selectedObjects: [] },
          Medium: { count: 0, selectedObjects: [] },
          Low: { count: 0, selectedObjects: [] },
        },
        ftm: {
          Critical: { count: 0, selectedObjects: [] },
          High: { count: 0, selectedObjects: [] },
          Medium: { count: 0, selectedObjects: [] },
          Low: { count: 0, selectedObjects: [] },
        },
        fsst: {
          Critical: { count: 0, selectedObjects: [] },
          High: { count: 0, selectedObjects: [] },
          Medium: { count: 0, selectedObjects: [] },
          Low: { count: 0, selectedObjects: [] },
        },
      };

      data.forEach((entry) => {
        const { change_sites, priority } = entry;

        const sites = ["aat", "ftm", "fsst"];

        sites.forEach((site) => {
          if (change_sites.includes(site)) {
            if (priorities.includes(priority)) {
              result[site][priority].count++;
              result[site][priority].selectedObjects.push(entry);
            }
          }
        });
      });

      return result;
    };

    const allData = processData(auth.filteredData);
    setAggregatedData(allData);
  }, [auth.filteredData]);

  useEffect(() => {
    if (!aggregatedData || Object.keys(aggregatedData).length === 0) return;

    const data = priorities.map((priority) => ({
      name: priority,
      count: aggregatedData[selectedSite][priority].count,
    }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600,
      height = 220;
    const barHeight = 20,
      spacing = 5;

    svg.attr("width", width).attr("height", height);

    const maxVal = d3.max(data, (d) => d.count);
    const xScale = d3.scaleLinear().domain([0, maxVal]).range([0, width - 150]);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, height])
      .padding(0.2);

    const offset = 5;

    // Filter out rows where count is zero
    const barData = data.filter((d) => d.count > 0);

    const bars = svg
      .selectAll(".bar-group")
      .data(barData)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(150, ${yScale(d.name)})`);

    // Main bar
    bars
      .append("rect")
      .attr("height", barHeight)
      .attr("width", (d) => xScale(d.count))
      .attr("x", 0)
      .attr("fill", "#EB5B00")
      .attr("rx", 10)
      .style("cursor", "pointer")
      .on("click", function (event, d) {
        const filteredData =
          aggregatedData[selectedSite][d.name].selectedObjects;
        setSelectedData({
          category: `${selectedSite.toUpperCase()} - ${d.name}`,
          filteredData: filteredData,
        });
        setIsDialogOpen(true);
      });

    // Text inside bar
    bars
      .append("text")
      .attr("x", (d) => xScale(d.count) / 2)
      .attr("y", barHeight / 2)
      .attr("dy", "0.35em")
      .attr("fill", "white")
      .attr("font-size", "14px")
      .attr("text-anchor", "middle")
      .text((d) => d.count);

    // Always draw all labels regardless of value
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", 110)
      .attr("y", (d) => yScale(d.name) + barHeight / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("fill", "#EB5B00")
      .attr("font-weight", "bold")
      .text((d) => d.name);
  }, [aggregatedData, selectedSite]);

  const handleSiteChange = (event) => {
    setSelectedSite(event.target.value);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-3 text-center text-[#beef70]">
        Change Requests by Priority
      </h1>

      {/* Site Selection Dropdown */}
      <div className="flex justify-center mb-2">
        <label htmlFor="site-select" className="mr-2">
          Select Site:
        </label>
        <select
          id="site-select"
          value={selectedSite}
          onChange={handleSiteChange}
          className="border rounded px-2 py-1"
        >
          <option value="aat">AAT</option>
          <option value="ftm">FTM</option>
          <option value="fsst">FSST</option>
        </select>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <h2 className="text-lg font-semibold mb-2">
          {selectedData?.category.toUpperCase()} Requests
        </h2>
        <p className="text-sm mb-4">
          Showing {selectedData?.filteredData?.length} requests
        </p>
        <ul className="list-disc pl-5 space-y-2">
          {selectedData?.filteredData ? (
            <DataDetail requests={selectedData.filteredData} />
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
        </ul>
      </Dialog>

      <svg ref={svgRef}></svg>
    </div>
  );
};

export default SixthSheet;
