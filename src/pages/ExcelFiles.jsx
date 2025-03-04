import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import API_BASE_URL from "../config/apiConfig";

function ExcelFiles() {
  const [data, setData] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  // Fetch MySQL data from API using axiosPrivate
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(`${API_BASE_URL}/change-requests`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [axiosPrivate]);

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
