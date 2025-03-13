import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "styled-components";
import Dialog from "../components/Dialog";
import Button from "../components/Button";
import AddedDatesList from "../components/AddedDatesList";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { HelpCircle } from "lucide-react";
import BusinessTeamContact from "./BusinessTeamContact";
import GlobalTeamContact from "./GlobalTeamContact";
import CRQSection from "./CRQInputs";
import { useNavigate, useLocation } from "react-router-dom";
function ChangeRequestUpdate() {
    const location = useLocation();
    const request = location.state?.request;
    const theme = useTheme();
    const [selectedSites, setSelectedSites] = useState(request.change_sites.split(','));
    const [openDialog, setOpenDialog] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const [businessContact, setBusinessContact] = useState(request.business_team_contact!==null ? request.business_team_contact.split(','):{});
    const [globalContact, setGlobalContact] = useState(request.global_team_contact!==null ? request.global_team_contact.split(','):{});
    const globalTeamContactRef = useRef(null);
    const navigate = useNavigate();
    console.log("From update", request);
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
        aat: { addedDates: [], startDateForRange: null, endDateForRange: null, duration: null },
        ftm: { addedDates: [], startDateForRange: null, endDateForRange: null, duration: null },
        fsst: { addedDates: [], startDateForRange: null, endDateForRange: null, duration: null },
    });
    // Structuring schedule change START
    // Function to parse the schedule change string into the desired format
    const parseSchedule = (scheduleString) => {
        if (!scheduleString) return [];
        const parts = scheduleString.split(" "); // Split by space
        const scheduleArray = [];

        for (let i = 0; i < parts.length; i += 3) {
            if (i + 1 < parts.length) { // Ensure there's a valid start and end time
                let start = parts[i].replace(/-/g, "/").replace(/['"]/g, ""); // Replace - with /
                let end = parts[i + 1].replace(/-/g, "/").replace(/['"]/g, ""); // Replace - with /
                let duration = parts[i + 2]; // Duration

                scheduleArray.push({
                    start: start,
                    end: end,
                    duration: duration,
                });
            }
        }
        return scheduleArray;
    };

    // Function to update the schedule data based on the request object
    const updateScheduleChanges = (request) => {
        setScheduleChanges((prevState) => ({
            ...prevState,
            aat: {
                ...prevState.aat,
                addedDates: parseSchedule(request.aat_schedule_change),
            },
            ftm: {
                ...prevState.ftm,
                addedDates: parseSchedule(request.ftm_schedule_change),
            },
            fsst: {
                ...prevState.fsst,
                addedDates: parseSchedule(request.fsst_schedule_change),
            },
        }));
    };
    // the following two useEffect are required for rendering each site date properly
    // Automatically check and set the selectedSites based on the request
    useEffect(() => {
        if (request) {
            updateScheduleChanges(request);
        }
    }, [request]);
    useEffect(() => {
        // Automatically check the sites that have schedule changes
        const sitesWithScheduleChanges = ["aat", "ftm", "fsst"].filter(
            (site) => scheduleChanges[site]?.addedDates.length > 0
        );
        setSelectedSites(sitesWithScheduleChanges);
    }, [scheduleChanges])
    // Structuring schedule change END
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


        if (!category || !reason || !impact || !priority || !change_name || selectedSitesString.length < 1) {
            alert("❌ A change request must include those fields: category, reason, impact, priority, change name and change site to submit.");
            return;
        }
        // Transform scheduleChanges into space-separated strings for each site
        const aat_schedule_change = scheduleChanges.aat?.addedDates
            ?.map(date => `${date.start} ${date.end} ${date.duration}`)
            .join(' ') || '';

        const ftm_schedule_change = scheduleChanges.ftm?.addedDates
            ?.map(date => `${date.start} ${date.end} ${date.duration}`)
            .join(' ') || '';

        const fsst_schedule_change = scheduleChanges.fsst?.addedDates
            ?.map(date => `${date.start} ${date.end} ${date.duration}`)
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
                .split(' ') // Split by space
                .filter((_, index) => index % 3 === 1) // Extract every second value (end date)
                .map(dateStr => new Date(dateStr)) // Convert to Date objects
                .filter(date => !isNaN(date)); // Remove invalid dates
        };

        // Extract end dates
        const aatEndDates = extractEndDates(aat_schedule_change);
        const ftmEndDates = extractEndDates(ftm_schedule_change);
        const fsstEndDates = extractEndDates(fsst_schedule_change);

        const hasEarlyEndDate = [...aatEndDates, ...ftmEndDates, ...fsstEndDates]
            .some(endDate => endDate < twoWeeksLater);

        const achieve_2_week_change_request = !hasEarlyEndDate;
        console.log(achieve_2_week_change_request);
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
            aat_schedule_change,
            ftm_schedule_change,
            fsst_schedule_change,
            aat_it_contact,
            ftm_it_contact,
            fsst_it_contact,
            business_team_contact: businessContact,
            global_team_contact: globalContact,
            aat_crq,
            ftm_crq,
            fsst_crq
        };

        try {
            const response = await axiosPrivate.post(`/change-requests`, requestData, {
                headers: { "Content-Type": "application/json" },
            });

            alert("✅ Change Request submitted successfully");
            // there will be an error in the console every time you make a change request bc of this refresh, related to access and refresh token. Don't worry about it.
            navigate(0);
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
                            value={request.category}
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
                            value={request.reason}
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
                            value={request.impact}
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
                            value={request.priority}
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
                                placeholder="Enter value (1500 characters max)"
                                rows={4}
                                maxLength={1500}
                                value={request.change_name}
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
                        <ScheduleChangeSection
                            key={site}
                            type={site}
                            startDateForRange={scheduleChanges[site].startDateForRange}
                            endDateForRange={scheduleChanges[site].endDateForRange}
                            duration={scheduleChanges[site].duration}
                            dates={scheduleChanges[site].addedDates}
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
                                value={request.description}
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
                                placeholder="Enter value (1500 characters max)"
                                rows={4}
                                maxLength={1500}
                                value={request.test_plan}
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
                                placeholder="Enter value (1500 characters max)"
                                rows={4}
                                value={request.rollback_plan}
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
    onKeyDown={(e) => e.key === ',' && e.preventDefault()} // Block comma input
    value={request?.[`${site}_it_contact`]?.split(',')[0] || ""} 
/>


                                <input
                                    type="text"
                                    id={`${site}ContactCdsid`}
                                    name={`${site}ContactCdsid`}
                                    placeholder="Enter CDSID (50 char max)"
                                    className="p-2 border border-gray-300 rounded w-full"
                                    maxLength={50}
                                    onKeyDown={(e) => e.key === ',' && e.preventDefault()} // Block comma input
                                    value={request?.[`${site}_it_contact`]?.split(',')[1] || ""} 
                                />
                            </div>
                        </div>
                    ))}
                    {/* Global Team Contact */}
                    <GlobalTeamContact onContactChange={setGlobalContact} globalContact={globalContact} isUpdate={1}/>
                    {/* Business Team Contact */}
                    <BusinessTeamContact onContactChange={setBusinessContact} businessContact={businessContact}  isUpdate={1}/>

                    {/* CRQ fields */}
                    {selectedSites.map((site) => (
                        <CRQSection type={site} onCRQChange={(updatedCRQs) => handleCRQChange(site, updatedCRQs)} />
                    ))}

                    {/* Approval */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2">
                        <label htmlFor="changeSite" style={labelStyle}>
                            Approval:
                        </label>
                        <div className="flex space-x-4">
                            {/* YES Option */}
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="approval"  // Same name ensures only one selection
                                    value="YES"
                                    // checked={approval === "YES"}  // Check if the approval value is "YES"
                                    onChange={() => handleApprovalChange("YES")}  // Handle change to "YES"
                                    className="mr-2"
                                />
                                YES
                            </label>

                            {/* NO Option */}
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="approval"  // Same name ensures only one selection
                                    value="NO"
                                    // checked={approval === "NO"}  // Check if the approval value is "NO"
                                    onChange={() => handleApprovalChange("NO")}  // Handle change to "NO"
                                    className="mr-2"
                                />
                                NO
                            </label>
                            {/* Waiting Option */}
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="approval"  // Same name ensures only one selection
                                    value="Waiting"
                                    // checked={approval === "Waiting"}  // Check if the approval value is "NO"
                                    onChange={() => handleApprovalChange("Waiting")}  // Handle change to "NO"
                                    className="mr-2"
                                />
                                Waiting
                            </label>
                        </div>
                    </div>
                    {/* Change Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2">
                        <label htmlFor="changeStatus" style={labelStyle}>Change status:</label>
                        <select
                            id="changeStatus"
                            style={{ backgroundColor: theme.colors.primary400 }}
                            className="p-2 border border-gray-300 rounded text-white"
                        >
                            <option value=""></option>
                            <option value="Completed with no issue">Completed with no issue</option>
                            <option value="Cancel change request">Cancel change request</option>
                            <option value="AAT change cancel">AAT change cancel</option>
                            <option value="FTM change cancel">FTM change cancel</option>
                            <option value="FSST change cancel">FSST change cancel</option>
                            <option value="Common change cancel">Common change cancel</option>
                        </select>
                    </div>
                    {/* Cancel Change Plan Field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
                        <label htmlFor="cancelChangeReason" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Cancel change reason:</label>
                        <div className="relative w-full">
                            <textarea
                                id="cancelChangeReason"
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white w-full"
                                placeholder="Enter value"
                                rows={4}
                            />

                            {/* Style your text dialog button */}
                            <button
                                type='button'
                                onClick={() => toggleSyntaxInfo("cancelChangeReason")}
                                className="flex items-center absolute top-0 right-0 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                                style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
                            >
                                Style your text
                                <HelpCircle className="w-4 h-4 ml-1" />
                            </button>

                            {/* Syntax Info Box */}
                            <SyntaxInfoBox
                                isVisible={openDialog === "cancelChangeReason"}
                                onClose={() => setOpenDialog(null)}
                            />
                        </div>
                    </div>

                    {/* Lesson Learnt Field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
                        <label htmlFor="lessonLearnt" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Lesson learnt:</label>
                        <div className="relative w-full">
                            <textarea
                                id="lessonLearnt"
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white w-full"
                                placeholder="Enter value"
                                rows={4}
                            />

                            {/* Style your text dialog button */}
                            <button
                                type='button'
                                onClick={() => toggleSyntaxInfo("lessonLearnt")}
                                className="flex items-center absolute top-0 right-0 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                                style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
                            >
                                Style your text
                                <HelpCircle className="w-4 h-4 ml-1" />
                            </button>

                            {/* Syntax Info Box */}
                            <SyntaxInfoBox
                                isVisible={openDialog === "lessonLearnt"}
                                onClose={() => setOpenDialog(null)}
                            />
                        </div>
                    </div>
                    {/* Reschedule Reason */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
                        <label htmlFor="rescheduleReason" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Reschedule reason:</label>
                        <div className="relative w-full">
                            <textarea
                                id="rescheduleReason"
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white w-full"
                                placeholder="Enter value"
                                rows={4}
                            />

                            {/* Style your text dialog button */}
                            <button
                                type='button'
                                onClick={() => toggleSyntaxInfo("rescheduleReason")}
                                className="flex items-center absolute top-0 right-0 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                                style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
                            >
                                Style your text
                                <HelpCircle className="w-4 h-4 ml-1" />
                            </button>

                            {/* Syntax Info Box */}
                            <SyntaxInfoBox
                                isVisible={openDialog === "rescheduleReason"}
                                onClose={() => setOpenDialog(null)}
                            />
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

function ScheduleChangeSection({
    type,
    startDateForRange,
    endDateForRange,
    duration,
    onScheduleChange,
    dates
}) {
    const typeLabels = {
        aat: "AAT",
        ftm: "FTM",
        fsst: "FSST",
    };
    const label = typeLabels[type] || "Schedule";
    const [openDialog, setOpenDialog] = useState(null);
    const [addedDates, setAddedDates] = useState(dates);  // ➡️ Store added dates here

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

export default ChangeRequestUpdate;