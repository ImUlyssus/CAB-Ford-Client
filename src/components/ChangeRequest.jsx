
import React, { useState, useRef } from "react";
import { useTheme } from "styled-components";
import Dialog from "../components/Dialog";
import Button from "../components/Button";
import AddedDatesList from "../components/AddedDatesList";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { HelpCircle } from "lucide-react";
import BusinessTeamContact from "./BusinessTeamContact";
import GlobalTeamContact from "./GlobalTeamContact";
import CRQSection from "./CRQInputs";
import { useNavigate } from "react-router-dom";
function ChangeRequest() {
    const theme = useTheme();
    const [selectedSites, setSelectedSites] = useState([]);
    const [openDialog, setOpenDialog] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const [businessContact, setBusinessContact] = useState({});
    const [globalContact, setGlobalContact] = useState({});
    const globalTeamContactRef = useRef(null);
    const navigate = useNavigate();

    const handleRemoveContact = () => {
        if (globalTeamContactRef.current) {
            globalTeamContactRef.current.removeContact();
        }
    };

    const [crqs, setCrqs] = useState({
        aat: [],
        ftm: [],
        fsst: [],
    });
    const [scheduleChanges, setScheduleChanges] = useState({
        aat: { addedDates: [], startDateForRange: null, endDateForRange: null, title: '', changeStatus: '', statusRemark: '' },
        ftm: { addedDates: [], startDateForRange: null, endDateForRange: null, title: '', changeStatus: '', statusRemark: '' },
        fsst: { addedDates: [], startDateForRange: null, endDateForRange: null, title: '', changeStatus: '', statusRemark: '' },
    });
    const handleCRQChange = (type, updatedCRQs) => {
        setCrqs((prev) => ({
            ...prev,
            [type]: updatedCRQs,
        }));
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

        const category = document.getElementById("category").value;
        const reason = document.getElementById("reason").value;
        const impact = document.getElementById("impact").value;
        const priority = document.getElementById("priority").value;
        const change_name = document.getElementById("changeName").value;
        const selectedSitesString = selectedSites.join(',');
        const isCommonChange = selectedSites.length > 1;
        const change_description = document.getElementById("changeDescription").value || "";
        const test_plan = document.getElementById("testPlan").value || "";
        const rollback_plan = document.getElementById("rollbackPlan")?.value || "";
        const aat_contact_name = document.getElementById("aatContactName")?.value || "";
        const aat_contact_cdsid = document.getElementById("aatContactCdsid")?.value || "";
        const ftm_contact_name = document.getElementById("ftmContactName")?.value || "";
        const ftm_contact_cdsid = document.getElementById("ftmContactCdsid")?.value || "";
        const fsst_contact_name = document.getElementById("fsstContactName")?.value || "";
        const fsst_contact_cdsid = document.getElementById("fsstContactCdsid")?.value || "";
        const aat_it_contact = aat_contact_name.trim() + "," + aat_contact_cdsid.trim();
        const ftm_it_contact = ftm_contact_name.trim() + "," + ftm_contact_cdsid.trim();
        const fsst_it_contact = fsst_contact_name.trim() + "," + fsst_contact_cdsid.trim();
        const aat_crq = crqs['aat'].join(',') || '';
        const ftm_crq = crqs['ftm'].join(',') || '';
        const fsst_crq = crqs['fsst'].join(',') || '';

        console.log(scheduleChanges)
        if (!category || !reason || !impact || !priority || !change_name || selectedSitesString.length < 1) {
            alert("❌ A change request must include those fields: category, reason, impact, priority, change name and change site to submit.");
            return;
        }
         // Transform scheduleChanges into space-separated strings for each site
         const aat_schedule_change = scheduleChanges.aat?.addedDates
         ?.map(date => {
             const title = (date.title || "").replace(/ /g, "_") || "_"; // Replace spaces with underscores, default to "_"
             const statusRemark = (date.statusRemark || "").replace(/ /g, "_") || "_"; // Replace spaces with underscores, default to "_"

             const status = (date.changeStatus || "").replace(/ /g, "_") || "_";
             return `${date.start}!${date.end}!${title}!${status}!${statusRemark}`;
         })
         .join(' ') || '';

     const ftm_schedule_change = scheduleChanges.ftm?.addedDates
         ?.map(date => {
             const title = (date.title || "").replace(/ /g, "_") || "_"; // Replace spaces with underscores, default to "_"
             const statusRemark = (date.statusRemark || "").replace(/ /g, "_") || "_"; // Replace spaces with underscores, default to "_"
             const status = (date.changeStatus || "").replace(/ /g, "_") || "_";
             return `${date.start}!${date.end}!${title}!${status}!${statusRemark}`;
         })
         .join(' ') || '';

     const fsst_schedule_change = scheduleChanges.fsst?.addedDates
         ?.map(date => {
             const title = (date.title || "").replace(/ /g, "_") || "_"; // Replace spaces with underscores, default to "_"
             const statusRemark = (date.statusRemark || "").replace(/ /g, "_") || "_"; // Replace spaces with underscores, default to "_"

             const status = (date.changeStatus || "").replace(/ /g, "_") || "_";
             return `${date.start}!${date.end}!${title}!${status}!${statusRemark}`;
         })
         .join(' ') || '';

        // Convert request_change_date to a Date object
        const requestChangeDate = new Date();
        const twoWeeksLater = new Date(requestChangeDate);
        twoWeeksLater.setDate(requestChangeDate.getDate() + 14); // Add 14 days

        /**
         * Extracts 'end' dates from the schedule change string.
         * @param {string} scheduleStr - The space-separated schedule string.
         * @returns {Date[]} - Array of end dates as Date objects.
         */
        const extractEndDates = (scheduleStr) => {
            if (!scheduleStr) return [];

            return scheduleStr
                .split('!') // Split by space
                .filter((_, index) => index % 5 === 1) // Extract every second value (end date)
                .map(dateStr => new Date(dateStr)) // Convert to Date objects
                .filter(date => !isNaN(date)); // Remove invalid dates
        };

        // Extract end dates
        const aatEndDates = extractEndDates(aat_schedule_change);
        const ftmEndDates = extractEndDates(ftm_schedule_change);
        const fsstEndDates = extractEndDates(fsst_schedule_change);
        // if no date to compare
        const allEmpty = !aatEndDates.length && !ftmEndDates.length && !fsstEndDates.length;

        const hasEarlyEndDate = allEmpty || [...aatEndDates, ...ftmEndDates, ...fsstEndDates]
            .some(endDate => endDate < twoWeeksLater);


        const achieve_2_week_change_request = !hasEarlyEndDate;
        // Helper function to extract every second date from a list
        const getEverySecondDate = (scheduleString) => {
            if (!scheduleString) return []; // Handle empty or undefined case

            // Convert string schedule to an array and parse as Date objects
            const scheduleArray = scheduleString.split("!").map(dateStr => new Date(dateStr));

            // Extract every second date (index 1, 3, 5, ...)
            return scheduleArray.filter((dateStr, index) => index % 5 === 1 && !isNaN(new Date(dateStr)));
        };

        // Extract second dates from each site's schedule
        const aatDates = getEverySecondDate(aat_schedule_change);
        const ftmDates = getEverySecondDate(ftm_schedule_change);
        const fsstDates = getEverySecondDate(fsst_schedule_change);

        // Combine all second dates
        const allSecondDates = [...aatDates, ...ftmDates, ...fsstDates];

        // Find the latest date
        const validSecondDates = allSecondDates.filter(date => date instanceof Date && !isNaN(date));
        const latestDate = validSecondDates.length > 0
            ? new Date(Math.max(...validSecondDates.map(date => date.getTime())))
            : null;
        // Format latest date as 'YYYY-MM-DD' if it exists
        const latest_schedule_date = latestDate ? latestDate.toISOString().split("T")[0] : null;
        // Create the request payload
        const requestData = {
            category,
            reason,
            impact,
            priority,
            change_name,
            change_sites: selectedSitesString,
            common_change: isCommonChange,
            description: change_description,
            request_change_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            test_plan,
            rollback_plan,
            achieve_2_week_change_request,
            aat_schedule_change: selectedSitesString.includes('aat') ? aat_schedule_change : "",
            ftm_schedule_change: selectedSitesString.includes('ftm') ? ftm_schedule_change : "",
            fsst_schedule_change: selectedSitesString.includes('fsst') ? fsst_schedule_change : "",
            latest_schedule_date,
            aat_it_contact: selectedSitesString.includes('aat') ? aat_it_contact : "",
            ftm_it_contact: selectedSitesString.includes('ftm') ? ftm_it_contact : "",
            fsst_it_contact: selectedSitesString.includes('fsst') ? fsst_it_contact : "",
            business_team_contact: businessContact,
            global_team_contact: globalContact,
            aat_crq: selectedSitesString.includes('aat') ? aat_crq : "",
            ftm_crq: selectedSitesString.includes('ftm') ? ftm_crq : "",
            fsst_crq: selectedSitesString.includes('fsst') ? fsst_crq : "",
        };

        try {
            const response = await axiosPrivate.post(`/change-requests`, requestData, {
                headers: { "Content-Type": "application/json" },
            });

            alert("✅ Change Request submitted successfully");
            // there will be an error in the console every time you make a change request bc of this refresh, related to access and refresh token. Don't worry about it.
            navigate(-1);
        } catch (error) {
            if (error.response) {
                alert(`❌ Error: ${error.response.data.message || "An error occurred"}`);
            } else if (error.request) {
                alert("❌ No response received. Please try again later.");
            } else {
                console.error("❌ Error submitting Change Request", error.message);
                alert("❌ Something went wrong. Please try again later.");
            }
        }
    };


    const labelStyle = {
        marginLeft: "auto", marginRight: "10rem"
    }
    const handleScheduleChangeEdit = (type, index, updatedDate) => {
        setScheduleChanges((prev) => {
          const updatedAddedDates = [...prev[type].addedDates]; // Create a copy
          updatedAddedDates[index] = updatedDate; // Update the date at the index
    
          return {
            ...prev,
            [type]: {
              ...prev[type],
              addedDates: updatedAddedDates, // Update addedDates
            },
          };
        });
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
                                placeholder="Enter value (300 characters max)"
                                rows={4}
                                maxLength={300}
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
                            {["aat", "ftm", "fsst"].map((site) => (
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
                    {/* schedule change section */}
                    {selectedSites.map((site) => (
                        <>
                        <ScheduleChangeSection
                            key={site}
                            type={site}
                            startDateForRange={scheduleChanges[site].startDateForRange}
                            endDateForRange={scheduleChanges[site].endDateForRange}
                            addedDates={scheduleChanges[site].addedDates}
                            onScheduleChange={(field, value) => setScheduleChanges((prev) => ({
                                ...prev,
                                [site]: { ...prev[site], [field]: value },
                            }))}
                            onAddDate={(newDate) => setScheduleChanges((prev) => ({
                                ...prev,
                                [site]: {
                                    ...prev[site],
                                    addedDates: [...prev[site].addedDates, newDate],
                                },
                            }))}
                            onRemoveDate={(index) => setScheduleChanges((prev) => ({
                                ...prev,
                                [site]: {
                                    ...prev[site],
                                    addedDates: prev[site].addedDates.filter((_, i) => i !== index),
                                },
                            }))}  // Handle removing dates dynamically
                        />
                        <AddedDatesList
            addedDates={scheduleChanges[site].addedDates}
            label={site.toUpperCase()}
            onRemove={(index) => handleRemoveDate(site, index)}
            onEdit={(index, updatedDate) => handleScheduleChangeEdit(site, index, updatedDate)} // Pass the onEdit function
        />
        </>
                    ))}


                    {/* Change Description Field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
                        <label htmlFor="changeDescription" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Change description:</label>
                        <div className="relative w-full">
                            <textarea
                                id="changeDescription"
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white w-full"
                                placeholder="Enter value (1500 characters max)"
                                rows={4}
                                maxLength={1500}
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
                                placeholder="Enter value (500 characters max)"
                                rows={4}
                                maxLength={500}
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
                                placeholder="Enter value (500 characters max)"
                                rows={4}
                                maxLength={500}
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
                    {selectedSites.map((site) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2 relative">
                            <label htmlFor="aatSiteItContact" style={{ marginLeft: "auto", marginRight: "10rem" }}>
                                {site.toUpperCase()} site IT contact:
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    id={`${site}ContactName`}
                                    name={`${site}ContactName`}
                                    placeholder="Enter name (50 char max)"
                                    className="p-2 border border-gray-300 rounded w-full"
                                    maxLength={50}
                                    onKeyDown={(e) => (e.key === ',' || e.key === ' ') && e.preventDefault()} // Block comma input
                                />

                                <input
                                    type="text"
                                    id={`${site}ContactCdsid`}
                                    name={`${site}ContactCdsid`}
                                    placeholder="Enter CDSID (50 char max)"
                                    className="p-2 border border-gray-300 rounded w-full"
                                    maxLength={50}
                                    onKeyDown={(e) => (e.key === ',' || e.key === ' ') && e.preventDefault()} // Block comma input
                                />
                            </div>
                        </div>
                    ))}
                    {/* Global Team Contact */}
                    <GlobalTeamContact onContactChange={setGlobalContact} globalContact={globalContact} update={0} />
                    {/* Business Team Contact */}
                    <BusinessTeamContact onContactChange={setBusinessContact} businessContact={businessContact} update={0} />

                    {/* CRQ fields */}
                    {selectedSites.map((site) => (
                        <CRQSection type={site} onCRQChange={(updatedCRQs) => handleCRQChange(site, updatedCRQs)} crqs={crqs[site]} />
                    ))}

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
    addedDates,
    startDateForRange,
    endDateForRange,
    onScheduleChange,
    onAddDate,
    onRemoveDate
}) {
    const typeLabels = {
        aat: "AAT",
        ftm: "FTM",
        fsst: "FSST",
    };
    const label = typeLabels[type] || "Schedule";
    const [openDialog, setOpenDialog] = useState(null);
    const theme = useTheme();
    const [title, setTitle] = useState("");
    const [changeStatus, setChangeStatus] = useState("");
    const [statusRemark, setStatusRemark] = useState("");
    // Handle adding a date
    const handleAddDate = () => {
        if (startDateForRange && endDateForRange) {
            const newDate = { start: startDateForRange, end: endDateForRange, title: title, changeStatus: changeStatus, statusRemark: statusRemark };
            if (addedDates.length < 5) {
                onAddDate(newDate);  // Pass the added date to the parent
            } else {
                alert("You can only add up to 5 date ranges.");
            }
        }
        setOpenDialog(null);
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

                <div className="grid grid-cols-1 relative">
                    <Button type="button" onClick={() => setOpenDialog("range")}>
                        Choose date and time
                    </Button>
                </div>
            </div>

            {/* Display the list of added dates */}
            {/* <AddedDatesList
                addedDates={addedDates}
                label={label}
                onRemove={(index) => onRemoveDate(index)}  // Use the new prop
            /> */}

            <Dialog open={openDialog === "range"} onClose={() => setOpenDialog(null)}>
                <h4 className="text-md font-semibold mb-2">Schedule Change Information</h4>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Schedule title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title (20 characters max)"
                        className="p-2 border border-gray-300 rounded w-full"
                        onKeyDown={(e) => (e.key === '!' || e.key === '_') && e.preventDefault()}
                        maxLength={20}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Start date and time
                        </label>
                        <input
                            type="datetime-local"
                            value={startDateForRange || ""}
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
                            value={endDateForRange || ""}
                            onChange={(e) => onScheduleChange("endDateForRange", e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                        />

                    </div>
                </div>
                <div className="w-full mb-4">
                    <label htmlFor="changeStatus" className="block text-sm font-medium text-gray-400 mb-1">Change status</label>
                    <select
                        id="changeStatus"
                        value={changeStatus} // Controlled component
                        onChange={(e) => setChangeStatus(e.target.value)} // Update state
                        style={{ backgroundColor: theme.colors.primary400 }}
                        className="w-full p-2 border border-gray-300 rounded text-white"
                    >
                        <option value="_">_</option>
                        <option value="Completed with no issue">Completed with no issue</option>
                        <option value="Cancel change request">Cancel change request</option>
                        <option value="AAT change cancel">AAT change cancel</option>
                        <option value="FTM change cancel">FTM change cancel</option>
                        <option value="FSST change cancel">FSST change cancel</option>
                        <option value="Common change cancel">Common change cancel</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Status remark
                    </label>
                    <input
                        type="text"
                        value={statusRemark}
                        onChange={(e) => setStatusRemark(e.target.value)}
                        placeholder="Enter remark (50 characters max)"
                        className="p-2 border border-gray-300 rounded w-full"
                        maxLength={50}
                        onKeyDown={(e) => (e.key === '!' || e.key === '_') && e.preventDefault()}
                    />
                </div>
                {/* <div className="mb-4">
                    <input
                        type="number"
                        value={duration || ""}
                        onChange={(e) => onScheduleChange("duration", e.target.value)}
                        placeholder="Choose duration in hour"
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                </div> */}
                <div className="flex">
                    <Button type="button" onClick={handleAddDate} className="ml-auto">
                        Add
                    </Button>
                </div>
            </Dialog>
        </div>
    );
}

export default ChangeRequest;

