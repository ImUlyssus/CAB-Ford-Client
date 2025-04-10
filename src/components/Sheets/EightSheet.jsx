import React, { useContext, useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import AuthContext from "../../context/AuthProvider";

const EightSheet = () => {
  const { auth } = useContext(AuthContext);
  const [scheduleHours, setScheduleHours] = useState({
    aat: 0,
    ftm: 0,
    fsst: 0,
  });
  const svgRef = useRef();

  useEffect(() => {
    if (!auth.filteredData) return;

    const calculateScheduleHours = (data) => {
      let aatHours = 0;
      let ftmHours = 0;
      let fsstHours = 0;

      data.forEach((entry) => {
        const { aat_schedule_change, ftm_schedule_change, fsst_schedule_change } = entry;

        const processSchedule = (scheduleString) => {
          if (!scheduleString) return 0;
          let totalHours = 0;
          const schedules = scheduleString.split(" ");

          schedules.forEach((schedule) => {
            const parts = schedule.split("!");
            if (parts.length === 6) {
              const duration = parseFloat(parts[5]);
              if (!isNaN(duration)) {
                totalHours += duration;
              }
            }
          });
          return totalHours;
        };

        aatHours += processSchedule(aat_schedule_change);
        ftmHours += processSchedule(ftm_schedule_change);
        fsstHours += processSchedule(fsst_schedule_change);
      });

      return { aat: aatHours, ftm: ftmHours, fsst: fsstHours };
    };

    const calculatedHours = calculateScheduleHours(auth.filteredData);
    setScheduleHours(calculatedHours);
  }, [auth.filteredData]);

  useEffect(() => {
    if (!scheduleHours) return;

    const data = [
      { name: "AAT", hours: scheduleHours.aat },
      { name: "FTM", hours: scheduleHours.ftm },
      { name: "FSST", hours: scheduleHours.fsst },
    ];

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600,
      height = 220;
    const barHeight = 20,
      spacing = 5;
    const margin = { top: 20, right: 85, bottom: 20, left: 60 }; // Increased right margin

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    svg.attr("width", width)
        .attr("height", height)
        .style("display", "block"); // Try setting display to block

    const maxVal = d3.max(data, (d) => d.hours);
    const xScale = d3.scaleLinear().domain([0, maxVal]).range([0, chartWidth]);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, chartHeight])
      .padding(0);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Main bar
    chart
      .selectAll(".bar")  // Added class for easier selection
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar") // Added class for easier selection
      .attr("height", barHeight)
      .attr("width", (d) => xScale(d.hours))
      .attr("x", 0)
      .attr("y", (d) => yScale(d.name))
      .attr("fill", "#347928")
      .attr("rx", 10);

    // Text outside bar
    chart
      .selectAll(".text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(d.hours) + 5) // Position to the right of the bar
      .attr("y", (d) => yScale(d.name) + barHeight / 2)
      .attr("dy", "0.35em")
      .attr("fill", "#347928") // Use the bar color for the text
      .attr("font-size", "14px")
      .attr("text-anchor", "start") // Align text to the start (left)
      .text((d) => d.hours.toFixed(1) + " Hrs");

    // Always draw all labels regardless of value
    chart
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", -10) // Adjusted x position
      .attr("y", (d) => yScale(d.name) + barHeight / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("fill", "#347928")
      .attr("font-weight", "bold")
      .attr("alignment-baseline", "middle") // Vertically center the labels
      .text((d) => d.name);

    // Append x axis
    chart
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));

  }, [scheduleHours]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-10 mt-5 text-center text-[#003478]">
        Total Schedule Hours by Site
      </h1>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default EightSheet;
