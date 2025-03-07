import React, { useState } from "react";
import { useTheme } from "styled-components";
import { CalendarIcon } from "lucide-react";
import API_BASE_URL from '../config/apiConfig';
import Dialog from "../components/Dialog";
import Button from "../components/Button";
import AddedDatesList from "../components/AddedDatesList";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { HelpCircle } from "lucide-react";
import BusinessTeamContact from "./BusinessTeamContact";
import GlobalTeamContact from "./GlobalTeamContact";
import CRQSection from "./CRQInputs";
function ChangeRequest() {
    const theme = useTheme();
    const [isCommonChange, setIsCommonChange] = useState(false);
    const [selectedSites, setSelectedSites] = useState([]);
    const [requestChangeDate, setRequestChangeDate] = useState("");
    const [changeNameContent, setChangeNameContent] = useState('');
    const [openDialog, setOpenDialog] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const [crqs, setCrqs] = useState({
        aat: [],
        ftm: [],
        fsst: [],
    });
    const [scheduleChanges, setScheduleChanges] = useState({
        aat: {
            startDateForRange: "",
            endDateForRange: "",
            duration: "",  // Added duration field
        },
        ftm: {
            startDateForRange: "",
            endDateForRange: "",
            duration: "",  // Added duration field
        },
        fsst: {
            startDateForRange: "",
            endDateForRange: "",
            duration: "",  // Added duration field
        },
    });
    const handleCRQChange = (type, updatedCRQs) => {
        setCrqs((prev) => ({
            ...prev,
            [type]: updatedCRQs,
        }));
    };
    const handleChangeContent = (contentInHTML) => {
        setChangeNameContent(contentInHTML); // Update the state with the HTML content
    };

    const toggleSyntaxInfo = (textareaId) => {
        setOpenDialog(openDialog === textareaId ? null : textareaId);
    };
    // Common dialog box component
    const SyntaxInfoBox = ({ isVisible, onClose }) => (
        isVisible && (
            <div className="absolute top-0 right-12 mt-2 w-64 p-3 bg-gray-800 text-white rounded-lg shadow-lg text-sm z-10">
                <h3 className="font-bold mb-2">Text Styling Syntax:</h3>
                <ul className="list-disc list-inside">
                    <li><strong>New Line:</strong> <code>[br]</code></li>
                    <li><strong>Bold:</strong> <code>[b]text[/b]</code></li>
                    <li><strong>Center:</strong> <code>[center]text[/center]</code></li>
                    <li><strong>Bullet Point:</strong> <code>[*] item</code></li>
                </ul>
                <button
                    onClick={onClose}
                    className="mt-2 text-sm text-red-400 hover:text-red-300"
                >
                    Close
                </button>
            </div>
        )
    );
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
            const response = await axiosPrivate.post(`/change-requests`, requestData, {
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

    const handleScheduleChange = (type, field, value) => {
        setScheduleChanges((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value,
            },
        }));
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
                        <label htmlFor="changeName" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Change name:</label>
                        <div className="relative w-full">
                            <textarea
                                id="changeName"
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white w-full"
                                placeholder="Enter value"
                                rows={4}
                            />

                            {/* Style your text dialog button */}
                            <button
                                type='button'
                                onClick={() => toggleSyntaxInfo("changeName")}
                                className="flex items-center absolute top-0 right-0 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                                style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
                            >
                                Style your text
                                <HelpCircle className="w-4 h-4 ml-1" />
                            </button>

                            {/* Syntax Info Box */}
                            <SyntaxInfoBox
                                isVisible={openDialog === "changeName"}
                                onClose={() => setOpenDialog(null)}
                            />
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

                    {/* ScheduleChangeSection for AAT */}
                    <ScheduleChangeSection
                        type="aat"
                        startDateForRange={scheduleChanges.aat.startDateForRange}
                        endDateForRange={scheduleChanges.aat.endDateForRange}
                        duration={scheduleChanges.aat.duration}  // Pass duration
                        onScheduleChange={(field, value) =>
                            handleScheduleChange("aat", field, value)
                        }
                    />

                    {/* ScheduleChangeSection for FTM */}
                    <ScheduleChangeSection
                        type="ftm"
                        startDateForRange={scheduleChanges.ftm.startDateForRange}
                        endDateForRange={scheduleChanges.ftm.endDateForRange}
                        duration={scheduleChanges.ftm.duration}  // Pass duration
                        onScheduleChange={(field, value) =>
                            handleScheduleChange("ftm", field, value)
                        }
                    />

                    {/* ScheduleChangeSection for FSST */}
                    <ScheduleChangeSection
                        type="fsst"
                        startDateForRange={scheduleChanges.fsst.startDateForRange}
                        endDateForRange={scheduleChanges.fsst.endDateForRange}
                        duration={scheduleChanges.fsst.duration}  // Pass duration
                        onScheduleChange={(field, value) =>
                            handleScheduleChange("fsst", field, value)
                        }
                    />

                    {/* Change Description Field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
                        <label htmlFor="changeDescription" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Change description:</label>
                        <div className="relative w-full">
                            <textarea
                                id="changeDescription"
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white w-full"
                                placeholder="Enter value"
                                rows={4}
                            />

                            {/* Style your text dialog button */}
                            <button
                                type='button'
                                onClick={() => toggleSyntaxInfo("changeDescription")}
                                className="flex items-center absolute top-0 right-0 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                                style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
                            >
                                Style your text
                                <HelpCircle className="w-4 h-4 ml-1" />
                            </button>

                            {/* Syntax Info Box */}
                            <SyntaxInfoBox
                                isVisible={openDialog === "changeDescription"}
                                onClose={() => setOpenDialog(null)}
                            />
                        </div>
                    </div>
                    {/* Test Plan Field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
                        <label htmlFor="testPlan" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Test plan:</label>
                        <div className="relative w-full">
                            <textarea
                                id="testPlan"
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white w-full"
                                placeholder="Enter value"
                                rows={4}
                            />

                            {/* Style your text dialog button */}
                            <button
                                type='button'
                                onClick={() => toggleSyntaxInfo("testPlan")}
                                className="flex items-center absolute top-0 right-0 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                                style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
                            >
                                Style your text
                                <HelpCircle className="w-4 h-4 ml-1" />
                            </button>

                            {/* Syntax Info Box */}
                            <SyntaxInfoBox
                                isVisible={openDialog === "testPlan"}
                                onClose={() => setOpenDialog(null)}
                            />
                        </div>
                    </div>
                    {/* Rollback Plan Field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
                        <label htmlFor="rollbackPlan" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Rollback plan:</label>
                        <div className="relative w-full">
                            <textarea
                                id="rollbackPlan"
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white w-full"
                                placeholder="Enter value"
                                rows={4}
                            />

                            {/* Style your text dialog button */}
                            <button
                                type='button'
                                onClick={() => toggleSyntaxInfo("rollbackPlan")}
                                className="flex items-center absolute top-0 right-0 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                                style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
                            >
                                Style your text
                                <HelpCircle className="w-4 h-4 ml-1" />
                            </button>

                            {/* Syntax Info Box */}
                            <SyntaxInfoBox
                                isVisible={openDialog === "rollbackPlan"}
                                onClose={() => setOpenDialog(null)}
                            />
                        </div>
                    </div>
                    {/* AAT Site IT Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2 relative">
                        <label htmlFor="aatSiteItContact" style={{ marginLeft: "auto", marginRight: "10rem" }}>
                            AAT site IT contact:
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                id="aatContactName"
                                name="aatContactName"
                                placeholder="Enter name"
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                            <input
                                type="text"
                                id="aatContactCdsid"
                                name="aatContactCdsid"
                                placeholder="Enter CDSID"
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                        </div>
                    </div>
                    {/* FTM Site IT Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2 relative">
                        <label htmlFor="ftmSiteItContact" style={{ marginLeft: "auto", marginRight: "10rem" }}>
                            FTM site IT contact:
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                id="ftmContactName"
                                name="ftmContactName"
                                placeholder="Enter name"
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                            <input
                                type="text"
                                id="ftmContactCdsid"
                                name="ftmContactCdsid"
                                placeholder="Enter CDSID"
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                        </div>
                    </div>

                    {/* FSST Site IT Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2 relative">
                        <label htmlFor="fsstSiteItContact" style={{ marginLeft: "auto", marginRight: "10rem" }}>
                            FSST site IT contact:
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                id="fsstContactName"
                                name="fsstContactName"
                                placeholder="Enter name"
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                            <input
                                type="text"
                                id="fsstContactCdsid"
                                name="fsstContactCdsid"
                                placeholder="Enter CDSID"
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                        </div>
                    </div>
                    {/* Global Team Contact */}
                    <GlobalTeamContact />
                    {/* Business Team Contact */}
                    <BusinessTeamContact />

                    {/* AAT CRQ */}
                    <CRQSection
                type="aat"
                onCRQChange={(updatedCRQs) => handleCRQChange("aat", updatedCRQs)}
            />
            {/* FTM CRQ */}
            <CRQSection
                type="ftm"
                onCRQChange={(updatedCRQs) => handleCRQChange("ftm", updatedCRQs)}
            />
            {/* FSST CRQ */}
            <CRQSection
                type="fsst"
                onCRQChange={(updatedCRQs) => handleCRQChange("fsst", updatedCRQs)}
            />

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
function ScheduleChangeSection({
    type,
    startDateForRange,
    endDateForRange,
    duration,
    onScheduleChange,
}) {
    const typeLabels = {
        aat: "AAT",
        ftm: "FTM",
        fsst: "FSST",
    };
    const label = typeLabels[type] || "Schedule";
    const [openDialog, setOpenDialog] = useState(null);
    const [addedDates, setAddedDates] = useState([]);  // ➡️ Store added dates here

    // ➡️ Handle adding dates
    const handleAddDate = () => {
        if (startDateForRange && endDateForRange && duration) {
            setAddedDates(prev => [
                ...prev,
                { start: startDateForRange, end: endDateForRange, duration }
            ]);
        }
        setOpenDialog(null)
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2 relative">
                <label
                    htmlFor={`${type}ScheduleChange`}
                    style={{ marginLeft: "auto", marginRight: "10rem" }}
                >
                    Choose {label} schedule change date:
                </label>

                {/* Buttons for Individual Date and Date Range */}
                <div className="grid grid-cols-1 relative">
                    <Button type="button" onClick={() => setOpenDialog("range")}>
                        Choose date and duration
                    </Button>
                </div>
            </div>

            {/* ➡️ Use AddedDatesList component here */}
            <AddedDatesList
                addedDates={addedDates}
                label={label}
                onRemove={(index) => setAddedDates((prev) => prev.filter((_, i) => i !== index))}
            />


            {/* Dialog for Date Range */}
            <Dialog open={openDialog === "range"} onClose={() => setOpenDialog(null)}>
                <h4 className="text-md font-semibold mb-2">Select Date Range</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Start date and time
                        </label>
                        <input
                            type="datetime-local"
                            value={startDateForRange}
                            onChange={(e) => onScheduleChange("startDateForRange", e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            End date and time
                        </label>
                        <input
                            type="datetime-local"
                            value={endDateForRange}
                            onChange={(e) => onScheduleChange("endDateForRange", e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        type="number"
                        value={duration}
                        onChange={(e) => onScheduleChange("duration", e.target.value)}
                        placeholder="Choose duration in hour"
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                </div>
                <div className='flex'>
                    <Button type="button" onClick={handleAddDate} className='ml-auto'>Add</Button>
                </div>
            </Dialog>
        </div>
    );
}

export default ChangeRequest;