import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import API_BASE_URL from "../config/apiConfig";
import { useNavigate, useLocation } from "react-router-dom";

function PDFReport() {
  const [data, setData] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch change request data using axiosPrivate
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(`${API_BASE_URL}/change-requests`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    fetchData();
  }, [axiosPrivate]);

  // Function to generate PDF with background color
  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 20; // Vertical position for text
    const pageWidth = doc.internal.pageSize.width;

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Change Request Report", 10, 10);

    // Loop through each data item
    data.forEach((item, index) => {
      const bgColor = index % 2 === 0 ? [230, 240, 255] : [200, 220, 255]; // Light blue shades

      // Draw background rectangle
      doc.setFillColor(...bgColor);
      doc.rect(5, y - 5, pageWidth - 10, 80, "F"); // (x, y, width, height, fill)

      // Set text color and font
      doc.setTextColor(0, 0, 0); // Black text
      doc.setFont("helvetica", "bold");
      doc.text(`Request ${index + 1}:`, 10, y);

      doc.setFont("helvetica", "normal");
      doc.text(`Category: ${item.category}`, 10, y + 10);
      doc.text(`Reason: ${item.reason}`, 10, y + 20);
      doc.text(`Impact: ${item.impact}`, 10, y + 30);
      doc.text(`Priority: ${item.priority}`, 10, y + 40);
      doc.text(`Change Name: ${item.change_name}`, 10, y + 50);
      doc.text(`Change Sites: ${item.change_sites}`, 10, y + 60);
      y += 70; // Move down for the next item

      // Add new page if content exceeds page height
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("ChangeRequestReport.pdf");
  };

  return (
    <div>
      <h1>PDF Report</h1>
      <button
        onClick={generatePDF}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Download PDF Report
      </button>
    </div>
  );
}

export default PDFReport;
