import React from "react";
import { useTheme } from "styled-components";

function ChangeRequest() {
  const theme = useTheme();
  const labelStyle = {
    marginLeft: "auto", marginRight: "10rem"
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedSites = [];
    document.querySelectorAll("input[name='changeSite']:checked").forEach((checkbox) => {
      selectedSites.push(checkbox.value);
    });

    const requestData = {
      category: document.getElementById("category").value,
      reason: document.getElementById("reason").value,
      impact: document.getElementById("impact").value,
      priority: document.getElementById("priority").value,
      change_name: document.getElementById("changeName").value,
      change_sites: selectedSites, // Array of selected sites
    };

    const response = await fetch("http://localhost:3001/api/change-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      console.log("✅ Change Request submitted successfully");
    } else {
      console.error("❌ Error submitting Change Request");
    }
  };

  return (
    <div>
      <div className="p-8 border-1 rounded-lg" style={{ borderColor: theme.colors.secondary500 }}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2">
            <label htmlFor="changeName" style={labelStyle}>Change name:</label>
            <input
              id="changeName"
              type="text"
              style={{ backgroundColor: theme.colors.primary400 }}
              className="p-2 border border-gray-300 rounded text-white"
              placeholder="Enter value"
            />
          </div>

          {/* Change Sites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2">
            <label htmlFor="changeSite" style={labelStyle}>Change site:</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  id="ftm"
                  name="changeSite"
                  value="ftm"
                  className="mr-2"
                />
                FTM
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  id="fsst"
                  name="changeSite"
                  value="fsst"
                  className="mr-2"
                />
                FSST
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  id="aat"
                  name="changeSite"
                  value="aat"
                  className="mr-2"
                />
                AAT
              </label>
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
