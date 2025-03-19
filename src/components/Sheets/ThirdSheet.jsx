import React, { useContext, useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import AuthContext from "../../context/AuthProvider";
import Daialog from './Dialog.jsx';
import DataDetail from "./DataDetail";
const ThirdSheet = () => {
    const { auth } = useContext(AuthContext);
    const [aggregatedData, setAggregatedData] = useState({});
    const [selectedData, setSelectedData] = useState(null);
const [isDialogOpen, setIsDialogOpen] = useState(false);

    const svgRef = useRef();
  
    useEffect(() => {
      if (!auth.filteredData) return;
  
      const processData = (data) => {
        let result = {
          aat_planned: 0, aat_unplanned: 0,
          ftm_planned: 0, ftm_unplanned: 0,
          fsst_planned: 0, fsst_unplanned: 0
        };
  
        data.forEach((entry) => {
          const { change_sites, achieve_2_week_change_request } = entry;
  
          if (change_sites.includes("aat")) {
            achieve_2_week_change_request ? result.aat_planned++ : result.aat_unplanned++;
          }
  
          if (change_sites.includes("ftm")) {
            achieve_2_week_change_request ? result.ftm_planned++ : result.ftm_unplanned++;
          }
  
          if (change_sites.includes("fsst")) {
            achieve_2_week_change_request ? result.fsst_planned++ : result.fsst_unplanned++;
          }
        });
  
        return result;
      };
  
      const allData = processData(auth.filteredData);
      setAggregatedData(allData);
    }, [auth.filteredData]);
  
    useEffect(() => {
      if (!aggregatedData || Object.keys(aggregatedData).length === 0) return;
  
      const data = [
        { name: "TOTAL", planned: aggregatedData.aat_planned + aggregatedData.ftm_planned + aggregatedData.fsst_planned, unplanned: aggregatedData.aat_unplanned + aggregatedData.ftm_unplanned + aggregatedData.fsst_unplanned },
        { name: "AAT", planned: aggregatedData.aat_planned, unplanned: aggregatedData.aat_unplanned },
        { name: "FTM", planned: aggregatedData.ftm_planned, unplanned: aggregatedData.ftm_unplanned },
        { name: "FSST", planned: aggregatedData.fsst_planned, unplanned: aggregatedData.fsst_unplanned }
      ];
  
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
  
      const width = 600, height = 220;
      const barHeight = 20, spacing = 5;
  
      svg.attr("width", width).attr("height", height);
  
      const maxVal = d3.max(data, (d) => d.planned + d.unplanned);
      const xScale = d3.scaleLinear().domain([0, maxVal]).range([0, width - 150]);
  
      const yScale = d3.scaleBand().domain(data.map(d => d.name)).range([0, height]).padding(0.2);
  
      const bars = svg.selectAll(".bar-group").data(data).enter().append("g").attr("transform", (d) => `translate(100, ${yScale(d.name)})`);
  
      const offset = 5; // Offset for unplanned bars
  
      // Draw planned bar first (below unplanned bar)
      bars.append("rect")
        .attr("height", barHeight)
        .attr("width", d => xScale(d.planned)+20)
        .attr("x", d => xScale(d.unplanned))
        .attr("fill", "#76e2ff")
        .attr("rx", 10);
  
      // Draw unplanned bar second (on top of planned bar)
      bars.append("rect")
        .attr("height", barHeight)
        .attr("width", d => xScale(d.unplanned))
        .attr("x", -(offset - 20))
        .attr("fill", "#3498db")
        .attr("rx", 10);
  
      bars.append("text")
        .attr("x", d => (xScale(d.unplanned) - offset) / 2 +17)
        .attr("y", barHeight / 2)
        .attr("dy", "0.35em")
        .attr("fill", "white")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .text(d => d.unplanned);
  
      bars.append("text")
        .attr("x", d => xScale(d.unplanned) - offset + xScale(d.planned) / 2 +20)
        .attr("y", barHeight / 2)
        .attr("dy", "0.35em")
        .attr("fill", "white")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .text(d => d.planned);
  
      svg.selectAll(".label").data(data).enter()
        .append("text")
        .attr("x", 80)
        .attr("y", d => yScale(d.name) + barHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("fill", "#3498db")
        .attr("font-weight", "bold")
        .text(d => d.name);
    }, [aggregatedData]);
  
    return (
        <div className="p-2">
        <h1 className="text-xl font-bold mb-3 text-center">Plan and Unplanned change request summary</h1>
        
        {/* Add legend here below the title */}
        <div className="flex justify-center mb-2">
          <div className="flex items-center mr-4">
            <div className="w-4 h-4 bg-[#3498db] mr-2 rounded-[50%]"></div>
            <span className="text-sm">Unplanned</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#76e2ff] mr-2 rounded-[50%]"></div>
            <span className="text-sm">Planned</span>
          </div>
        </div>
      
        <svg ref={svgRef}></svg>
      </div>
      
    );
  };
  

export default ThirdSheet;