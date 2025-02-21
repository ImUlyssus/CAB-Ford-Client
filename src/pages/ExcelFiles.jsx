import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function ExcelFiles() {
  const [data, setData] = useState([]);

  // Fetch MySQL data from API
  useEffect(() => {
    fetch("http://localhost:3001/api/change-requests") // Change URL as needed
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Function to generate and download Excel file
  const generateExcel = () => {
    if (data.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Convert JSON to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Change Requests");

    // Convert to binary and create a Blob
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });

    // Save the file
    saveAs(fileData, "ChangeRequestData.xlsx");
  };

  return (
    <div>
      <h1>Download Excel Report</h1>
      <button
        onClick={generateExcel}
        style={{
          backgroundColor: "#28a745",
          color: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Download Excel
      </button>
    </div>
  );
}

export default ExcelFiles;
