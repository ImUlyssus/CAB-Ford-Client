import React, { useState } from "react";
import { useTheme } from "styled-components";
import { CalendarIcon } from "lucide-react";
import API_BASE_URL from '../config/apiConfig';
import axios from 'axios';
function ChangeRequest() {
  const theme = useTheme();
  const [isCommonChange, setIsCommonChange] = useState(false);
  const [selectedSites, setSelectedSites] = useState([]);
  const [requestChangeDate, setRequestChangeDate] = useState("");
  const labelStyle = {
    marginLeft: "auto", marginRight: "10rem"
  }

  const handleCommonChange = (e) => {
    const value = e.target.value === "yes";
    setIsCommonChange(value);
    setSelectedSites([]); // Reset selection when toggling
  };

  const handleSiteSelection = (e) => {
    const { value, checked } = e.target;
  
    setSelectedSites((prev) => {
      if (checked) {
        return [...prev, value]; // Add site
      } else {
        return prev.filter((site) => site !== value); // Remove site
      }
    });
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isCommonChange && selectedSites.length < 2) {
        alert("❌ Please select at least two sites for a common change.");
        return;
    }

    const category = document.getElementById("category").value;
    const reason = document.getElementById("reason").value;
    const impact = document.getElementById("impact").value;
    const priority = document.getElementById("priority").value;
    const change_name = document.getElementById("changeName").value;

    if (!category || !reason || !impact || !priority || !change_name) {
        alert("❌ Please fill out all fields.");
        return;
    }

    const requestData = {
        category,
        reason,
        impact,
        priority,
        change_name,
        change_sites: selectedSites,
        common_change: isCommonChange,
        request_change_date: requestChangeDate,
    };

    try {
        // Using Axios to send a POST request
        const response = await axios.post(`${API_BASE_URL}/change-requests`, requestData, {
            headers: { "Content-Type": "application/json" }
        });

        // If the request is successful
        console.log("✅ Change Request submitted successfully", response.data);
        // Reset the form fields
        setIsCommonChange(false);
        setSelectedSites([]);
        setRequestChangeDate("");
        document.getElementById("category").value = "";
        document.getElementById("reason").value = "";
        document.getElementById("impact").value = "";
        document.getElementById("priority").value = "";
        document.getElementById("changeName").value = "";
    } catch (error) {
        // Handle error responses
        if (error.response) {
            // The request was made and the server responded with a status code
            alert(`❌ Error: ${error.response.data.message || "An error occurred"}`);
        } else if (error.request) {
            // The request was made but no response was received
            alert("❌ No response received. Please try again later.");
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("❌ Error submitting Change Request", error.message);
            alert("❌ Something went wrong. Please try again later.");
        }
    }
};

  return (
    <div>
      <div className="px-8 py-4 border-1 rounded-lg" style={{ borderColor: theme.colors.secondary500 }}>
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold text-center mb-3">Add Change Request</h1>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Category Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2">
            <label htmlFor="category" style={labelStyle}>Category fix issue:</label>
            <select
              id="category"
              style={{ backgroundColor: theme.colors.primary400 }}
              className="p-2 border border-gray-300 rounded text-white"
            >
              <option value="Hardware">Hardware</option>
              <option value="Application">Application</option>
              <option value="New tech update">New tech update</option>
              <option value="Password reset">Password reset</option>
            </select>
          </div>

          {/* Reason Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2">
            <label htmlFor="reason" style={labelStyle}>Change reason:</label>
            <select
              id="reason"
              style={{ backgroundColor: theme.colors.primary400 }}
              className="p-2 border border-gray-300 rounded text-white"
            >
              <option value="Fix/Repair">Fix/Repair</option>
              <option value="New functionality">New functionality</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Upgrade">Upgrade</option>
              <option value="Tech refresh">Tech refresh</option>
              <option value="Yearly change">Yearly change</option>
            </select>
          </div>

          {/* Impact Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2">
            <label htmlFor="impact" style={labelStyle}>Impact:</label>
            <select
              id="impact"
              style={{ backgroundColor: theme.colors.primary400 }}
              className="p-2 border border-gray-300 rounded text-white"
            >
              <option value="Extensive">Extensive</option>
              <option value="Significant">Significant</option>
              <option value="Moderate">Moderate</option>
              <option value="Minor">Minor</option>
            </select>
          </div>

          {/* Priority Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2">
            <label htmlFor="priority" style={labelStyle}>Priority:</label>
            <select
              id="priority"
              style={{ backgroundColor: theme.colors.primary400 }}
              className="p-2 border border-gray-300 rounded text-white"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Change Name Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
            <label htmlFor="changeName" style={labelStyle}>Change name:</label>
            <textarea
              id="changeName"
              style={{ backgroundColor: theme.colors.primary400 }}
              className="p-2 border border-gray-300 rounded text-white"
              placeholder="Enter value"
              rows={4}
            />
          </div>
          {/* Common Change Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2">
            <label style={labelStyle}>Common Change:</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="commonChange"
                  value="yes"
                  checked={isCommonChange}
                  onChange={handleCommonChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="commonChange"
                  value="no"
                  checked={!isCommonChange}
                  onChange={handleCommonChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          {/* Change Sites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2">
            <label htmlFor="changeSite" style={labelStyle}>
              Change site:
            </label>
            <div className="flex space-x-4">
              {["ftm", "fsst", "aat"].map((site) => (
                <label key={site} className="flex items-center">
                  <input
                    type="checkbox"
                    name="changeSite"
                    value={site}
                    checked={selectedSites.includes(site)}
                    onChange={handleSiteSelection}
                    className="mr-2"
                  />
                  {site.toUpperCase()}
                </label>
              ))}
            </div>
          </div>
          {/* Request change */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2 relative">
            <label htmlFor="requestChange" style={{ marginLeft: "auto", marginRight: "10rem" }}>
              Request change:
            </label>
            <div className="relative">
              <input
                type="date"
                id="requestChange"
                name="requestChange"
                value={requestChangeDate}
                onChange={(e) => setRequestChangeDate(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full pr-10"
              />
              <button
                type="button"
                onClick={() => document.getElementById("requestChange").showPicker()} // Show date picker on click
                className="absolute right-3 top-2 text-gray-500"
              >
                <CalendarIcon size={20} />
              </button>
            </div>
          </div>


          {/* Submit Button */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
            <button
              type="submit"
              style={{
                backgroundColor: theme.colors.primaryButton,
                color: theme.colors.primary500,
              }}
              className="hover:bg-blue-700 font-bold py-2 px-4 rounded"
            >
              Add Change Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeRequest;
