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

  useEffect(() => {
    if (!auth.filteredData) return;

    const processData = (data) => {
      let result = {
        aat: {}, // Will store requestors and their counts
        ftm: {},
        fsst: {},
      };

      data.forEach((entry) => {
        const {
          change_sites,
          aat_requestor,
          ftm_requestor,
          fsst_requestor,
        } = entry;

        const processRequestor = (site, requestorString) => {
          if (!requestorString) return;

          // Extract email from the requestor string (assuming it's the last word)
          const email = requestorString.split(" ").pop();

          if (!result[site][email]) {
            result[site][email] = {
              count: 0,
              selectedObjects: [],
              fullName: requestorString, // Store the full name
            };
          }
          result[site][email].count++;
          result[site][email].selectedObjects.push(entry);
        };

        if (change_sites.includes("aat") && aat_requestor) {
          processRequestor("aat", aat_requestor);
        }

        if (change_sites.includes("ftm") && ftm_requestor) {
          processRequestor("ftm", ftm_requestor);
        }

        if (change_sites.includes("fsst") && fsst_requestor) {
          processRequestor("fsst", fsst_requestor);
        }
      });

      return result;
    };

    const allData = processData(auth.filteredData);
    setAggregatedData(allData);
  }, [auth.filteredData]);

  useEffect(() => {
    if (!aggregatedData || Object.keys(aggregatedData).length === 0) return;

    // Transform data for selected site
    const siteData = aggregatedData[selectedSite] || {};
    const data = Object.entries(siteData).map(([email, values]) => ({
      name: email, // Use email for display
      count: values.count,
    }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600,
      height = 400; // Increased height for vertical bars and labels
    const barWidth = 20,
      spacing = 5;
    const margin = { top: 20, right: 20, bottom: 100, left: 60 }; // Added margins

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    svg.attr("width", width).attr("height", height);

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, chartWidth])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .range([chartHeight, 0]);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Vertical bars
    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name))
      .attr("y", (d) => yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d.count))
      .attr("fill", "#347928")
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
    chart
      .selectAll(".text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "text")
      .attr("x", (d) => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.count) + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text((d) => d.count);

    // X-axis labels (vertical)
    chart
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-50)"); // Rotate labels

    // Y-axis labels
    chart.append("g").call(d3.axisLeft(yScale));
  }, [aggregatedData, selectedSite]);

  const handleSiteChange = (event) => {
    setSelectedSite(event.target.value);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-3 text-center text-[#beef70]">
        Requestor Occurrence by Site
      </h1>

      {/* Site Selection Dropdown */}
      <div className="flex justify-center">
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
