import React, { useContext, useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as d3 from "d3";
import jsPDF from "jspdf";
import AuthContext from "../../context/AuthProvider";
import Dialog from './Dialog.jsx';
import DataDetail from "./DataDetail";

const ThirdSheet = forwardRef((props, ref) => {
    const { auth } = useContext(AuthContext);
    const [aggregatedData, setAggregatedData] = useState({});
    const [selectedData, setSelectedData] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
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
        {
          name: "TOTAL",
          planned:
            aggregatedData.aat_planned +
            aggregatedData.ftm_planned +
            aggregatedData.fsst_planned,
          unplanned:
            aggregatedData.aat_unplanned +
            aggregatedData.ftm_unplanned +
            aggregatedData.fsst_unplanned,
        },
        {
          name: "AAT",
          planned: aggregatedData.aat_planned,
          unplanned: aggregatedData.aat_unplanned,
        },
        {
          name: "FTM",
          planned: aggregatedData.ftm_planned,
          unplanned: aggregatedData.ftm_unplanned,
        },
        {
          name: "FSST",
          planned: aggregatedData.fsst_planned,
          unplanned: aggregatedData.fsst_unplanned,
        },
      ];
    
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
    
      const width = 600,
        height = 220;
      const barHeight = 20,
        spacing = 5;
    
      svg.attr("width", width).attr("height", height);
    
      const maxVal = d3.max(data, (d) => d.planned + d.unplanned);
      const xScale = d3
        .scaleLinear()
        .domain([0, maxVal])
        .range([0, width - 150]);
    
      const yScale = d3
        .scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, height])
        .padding(0.2);
    
      const offset = 5;
    
      // Filter out rows where both planned and unplanned are zero
      const barData = data.filter((d) => d.planned > 0 || d.unplanned > 0);
    
      const bars = svg
        .selectAll(".bar-group")
        .data(barData)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(100, ${yScale(d.name)})`);
    
      // Planned bar
      bars
        .append("rect")
        .attr("height", barHeight)
        .attr("width", (d) => xScale(d.planned) + 20)
        .attr("x", (d) => xScale(d.unplanned))
        .attr("fill", "#76e2ff")
        .attr("rx", 10)
        .style("cursor", "pointer")
        .on("click", function (event, d) {
          let siteData;
          if (d.name === "TOTAL") {
            siteData = auth.filteredData.filter(
              (item) => item.achieve_2_week_change_request
            );
          } else {
            switch (d.name) {
              case "AAT":
                siteData = auth.filteredData.filter(
                  (item) =>
                    item.change_sites.includes("aat") &&
                    item.achieve_2_week_change_request
                );
                break;
              case "FTM":
                siteData = auth.filteredData.filter(
                  (item) =>
                    item.change_sites.includes("ftm") &&
                    item.achieve_2_week_change_request
                );
                break;
              case "FSST":
                siteData = auth.filteredData.filter(
                  (item) =>
                    item.change_sites.includes("fsst") &&
                    item.achieve_2_week_change_request
                );
                break;
              default:
                siteData = [];
            }
          }
          setSelectedData({
            category: `${d.name} - Planned`,
            filteredData: siteData,
          });
          setIsDialogOpen(true);
        });
    
      // Unplanned bar
      bars
        .append("rect")
        .attr("height", barHeight)
        .attr("width", (d) => xScale(d.unplanned))
        .attr("x", -(offset - 20))
        .attr("fill", "#3498db")
        .attr("rx", 10)
        .style("cursor", "pointer")
        .on("click", function (event, d) {
          let siteData;
          if (d.name === "TOTAL") {
            siteData = auth.filteredData.filter(
              (item) => !item.achieve_2_week_change_request
            );
          } else {
            switch (d.name) {
              case "AAT":
                siteData = auth.filteredData.filter(
                  (item) =>
                    item.change_sites.includes("aat") &&
                    !item.achieve_2_week_change_request
                );
                break;
              case "FTM":
                siteData = auth.filteredData.filter(
                  (item) =>
                    item.change_sites.includes("ftm") &&
                    !item.achieve_2_week_change_request
                );
                break;
              case "FSST":
                siteData = auth.filteredData.filter(
                  (item) =>
                    item.change_sites.includes("fsst") &&
                    !item.achieve_2_week_change_request
                );
                break;
              default:
                siteData = [];
            }
          }
          setSelectedData({
            category: `${d.name} - Unplanned`,
            filteredData: siteData,
          });
          setIsDialogOpen(true);
        });
    
      // Unplanned text inside bar
      bars
        .append("text")
        .attr("x", (d) => (xScale(d.unplanned) - offset) / 2 + 17)
        .attr("y", barHeight / 2)
        .attr("dy", "0.35em")
        .attr("fill", "white")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .text((d) => d.unplanned);
    
      // Planned text inside bar
      bars
        .append("text")
        .attr("x", (d) => xScale(d.unplanned) - offset + xScale(d.planned) / 2 + 20)
        .attr("y", barHeight / 2)
        .attr("dy", "0.35em")
        .attr("fill", "white")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .text((d) => d.planned);
    
      // Always draw all labels regardless of value
      svg
        .selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("x", 80)
        .attr("y", (d) => yScale(d.name) + barHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("fill", "#3498db")
        .attr("font-weight", "bold")
        .text((d) => d.name);
    }, [aggregatedData]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const generatePDF = () => {
        if (isMounted && svgRef.current) {
            const svg = svgRef.current;
            const svgData = new XMLSerializer().serializeToString(svg);

            // Define A4 page dimensions in points (jsPDF uses points by default)
            const a4Width = 1100;
            const a4Height = 842;

            // Define chart dimensions
            const chartWidth = a4Width / 2;
            const chartHeight = 200; // Adjusted height

            // Define chart position
            const chartX = 20; // Add some margin
            const chartY = 50; // Leave space for the title

            // Define table position
            const tableY = chartY + chartHeight + 40; // Position table below chart and legend

            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'pt', // Use points
                format: 'a4'
            });

            // Add Title
            pdf.setFontSize(16);
            pdf.setTextColor(0); // Black
            pdf.text("Achieved two-week change request or not", a4Width / 4, 30, {
                align: 'center'
            });

            // Legend Positioning
            const legendY = chartY + chartHeight + 10;  // Vertical position
            const legendCircleRadius = 5;
            const legendTextSpacing = 10;

            // "Not-achieved" Legend
            const notAchievedX = a4Width / 8; // Position on the left side of the center
            pdf.setFillColor("#3498db");
            pdf.circle(notAchievedX, legendY, legendCircleRadius, 'F');
            pdf.text("Not-achieved", notAchievedX + legendTextSpacing, legendY + 5);

            // "Achieved" Legend
            const achievedX = a4Width / 4 + 50; // Position on the right side of the center with margin left
            pdf.setFillColor("#76e2ff");
            pdf.circle(achievedX, legendY, legendCircleRadius, 'F');
            pdf.text("Achieved", achievedX + legendTextSpacing, legendY + 5);

            // Add the chart
            const canvas = document.createElement('canvas');
            canvas.width = chartWidth;
            canvas.height = chartHeight;
            const ctx = canvas.getContext('2d');

            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, chartWidth, chartHeight);
                pdf.addImage(canvas.toDataURL('JPEG'), 'JPEG', chartX, chartY, chartWidth, chartHeight);

                // Add the data table to the PDF
                addDataTable(pdf, chartX, tableY, a4Width/2, aggregatedData);

                pdf.save('chart.pdf');
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
    };

    const addDataTable = (pdf, startX, startY, pageWidth, data) => {
      const colWidth = pageWidth / 4; // 4 columns: Name, Planned, Unplanned, Total
      const rowHeight = 20;
      const fontSize = 10;
  
      pdf.setFontSize(fontSize);
      pdf.setTextColor(0); // Black color
  
      // Table Header
      const headers = ["Category", "Planned", "Unplanned", "Total"];
      let currentX = startX;
      let currentY = startY;
  
      headers.forEach((header, i) => {
          pdf.text(header, currentX + 5, currentY + 15); // 5px padding
          pdf.rect(currentX, currentY, colWidth, rowHeight); // Draw border for header cell
          currentX += colWidth;
      });
  
      currentY += rowHeight; // Move to data rows
  
      // Table Data
      const tableData = [
          { name: "TOTAL", planned: data.aat_planned + data.ftm_planned + data.fsst_planned, unplanned: data.aat_unplanned + data.ftm_unplanned + data.fsst_unplanned },
          { name: "AAT", planned: data.aat_planned, unplanned: data.aat_unplanned },
          { name: "FTM", planned: data.ftm_planned, unplanned: data.ftm_unplanned },
          { name: "FSST", planned: data.fsst_planned, unplanned: data.fsst_unplanned }
      ];
  
      tableData.forEach(rowData => {
          currentX = startX;
  
          const cells = [
              rowData.name,
              String(rowData.planned),
              String(rowData.unplanned),
              String(rowData.planned + rowData.unplanned)
          ];
  
          cells.forEach(cellText => {
              pdf.text(cellText, currentX + 5, currentY + 15); // Text inside the cell
              pdf.rect(currentX, currentY, colWidth, rowHeight); // Border for the cell
              currentX += colWidth;
          });
  
          currentY += rowHeight; // Move to next row
      });
  };
  

    useImperativeHandle(ref, () => ({
        generatePDF: generatePDF,
    }));

    return (
        <div>
          {!props.isForPdf && (
              <>
                  <h1 className="text-xl font-bold mb-3 text-center text-[#003478]">
                      Achieved two-week change request or not
                  </h1>
                  {/* Add legend here below the title */}
                  <div className="flex justify-center mb-2 text-[#003478]">
                      <div className="flex items-center mr-4">
                          <div className="w-4 h-4 bg-[#3498db] mr-2 rounded-[50%]"></div>
                          <span className="text-sm">Not-achieved</span>
                      </div>
                      <div className="flex items-center">
                          <div className="w-4 h-4 bg-[#76e2ff] mr-2 rounded-[50%]"></div>
                          <span className="text-sm">Achieved</span>
                      </div>
                  </div>
              </>
          )}
          {/* Dialog */}
          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
              <h2 className="text-lg font-semibold mb-2">
                  {selectedData?.category.toUpperCase()} Requests
              </h2>
              <p className="text-sm mb-4">
                  {selectedData?.category.includes("TOTAL") &&
                      <p className="text-yellow-700">
                          Note: For common change, 1 change request may contain more than one achieved/not-achieved change request since there are more than one site.
                      </p>
                  }
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
});

ThirdSheet.displayName = "ThirdSheet"; // Optional: Useful for debugging

export default ThirdSheet;
