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
    const [changeRequestData, setChangeRequestData] = useState({
        category: request.category,
        reason: request.reason,
        impact: request.impact,
        priority: request.priority,
        change_name: request.change_name||"",
        description: request.description||"",
        test_plan: request.test_plan || "",
        rollback_plan: request.rollback_plan || "",
        aat_it_contact_person: request?.aat_it_contact?.split(',')[0] || "",
        aat_it_contact_cdsid: request?.aat_it_contact?.split(',')[1] || "",
        ftm_it_contact_person: request?.ftm_it_contact?.split(',')[0] || "",
        ftm_it_contact_cdsid: request?.ftm_it_contact?.split(',')[1] || "",
        fsst_it_contact_person: request?.fsst_it_contact?.split(',')[0] || "",
        fsst_it_contact_cdsid: request?.fsst_it_contact?.split(',')[1] || "",
    });
    const theme = useTheme();
    const [changeStatus, setChangeStatus] = useState(request.change_status ?? "");
    // const [cancelChangeCategory, setCancelChangeCategory] = useState(request.cancel_change_category??"");
    const [selectedSites, setSelectedSites] = useState(request.change_sites.includes(',')?request.change_sites.split(','):[]);
    const [openDialog, setOpenDialog] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const [approval, setApproval] = useState(request.approval);
    const [businessContact, setBusinessContact] = useState(request.business_team_contact !== null ? request.business_team_contact.split(',') : {});
    const [globalContact, setGlobalContact] = useState(request.global_team_contact !== null ? request.global_team_contact.split(',') : {});
    const globalTeamContactRef = useRef(null);
    const navigate = useNavigate();
    console.log("From update", request);
    const handleRemoveContact = () => {
        if (globalTeamContactRef.current) {
            globalTeamContactRef.current.removeContact();
        }
    };
    // Function to handle change in select fields
const handleChange = (event) => {
    const { name, value } = event.target; // Destructure name and value from the event

    setChangeRequestData({
        ...changeRequestData,
        [name]: value, // Dynamically set the correct field based on the name
    });
};

    // the following useEffect is required when there is only one site in request.change_sites with no comma
    // or it will cause bug
    useEffect(() =>{
        if (!selectedSites.length){
            setSelectedSites([request.change_sites])
        }
    })

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
    const handleApprovalChange = (status) => {
        setApproval(status)
    }
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
    const extractIntegers = (duration) => {
        if (!duration) return null; // Handle null or undefined cases
    
        return duration
            .match(/\d+/g) // Extract all numbers using regex
            ?.map(Number) || []; // Convert to numbers and return an array
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
        updateDurations();
    };
    
    // Function to update the duration and date format
    const updateDurations = () => {
        const sites = ["aat", "ftm", "fsst"]; // Define site keys
    
        setScheduleChanges((prevState) => {
            let updatedState = { ...prevState };
    
            sites.forEach((site) => {
                updatedState[site] = {
                    ...prevState[site],
                    addedDates: prevState[site].addedDates.map((entry) => ({
                        ...entry,
                        // Update start and end date formats
                        start: entry.start?.replace(/\//g, "-"),
                        end: entry.end?.replace(/\//g, "-"),
                        // Extract and reformat duration
                        duration: extractIntegers(entry.duration).join(" "), // Extract and reformat duration
                    })),
                };
            });
    
            return updatedState;
        });
    };
    
    // keep the following 4 useEffect in order or it will mess up change site, schedule date, crq. Idk why
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
    // Update crqs state when request data is available
    useEffect(() => {
        // Set crqs by splitting the comma-separated string into arrays
        setCrqs({
            aat: request.aat_crq ? request.aat_crq.split(",") : [],
            ftm: request.ftm_crq ? request.ftm_crq.split(",") : [],
            fsst: request.fsst_crq ? request.fsst_crq.split(",") : [],
        });
    }, [request]);
    
    // useEffect(() => {
    //     setSelectedSites(request.change_sites.split(','));
    // }, [scheduleChanges])
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
        const selectedSitesString = selectedSites.join(',');
        const aat_crq = crqs['aat'].join(',') || '';
        const ftm_crq = crqs['ftm'].join(',') || '';
        const fsst_crq = crqs['fsst'].join(',') || '';
        const requestBody = {
            category: changeRequestData.category,
            reason: changeRequestData.reason,
            impact: changeRequestData.impact,
            priority: changeRequestData.priority,
            change_name: changeRequestData.change_name,
            description: changeRequestData.description,
            test_plan: changeRequestData.test_plan,
            rollback_plan: changeRequestData.rollback_plan,
            aat_it_contact: changeRequestData.aat_it_contact_person+","+changeRequestData.aat_it_contact_cdsid,
            ftm_it_contact: changeRequestData.ftm_it_contact_person+","+changeRequestData.ftm_it_contact_cdsid,
            fsst_it_contact: changeRequestData.fsst_it_contact_person+","+changeRequestData.fsst_it_contact_cdsid,
            business_team_contact: businessContact,
            global_team_contact: globalContact,
            aat_crq: selectedSitesString.includes('aat') ? aat_crq : "",
            ftm_crq: selectedSitesString.includes('ftm') ? ftm_crq : "",
            fsst_crq: selectedSitesString.includes('fsst') ? fsst_crq : "",
        }
        console.log(requestBody);
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
            <button 
                onClick={() => navigate(-1)} // Go back to the previous page
                className="px-4 py-2 bg-gray-500 text-white rounded-lg mb-4 hover:bg-gray-600"
            >
                ← Back
            </button>
            <div className="px-8 py-4 border-1 rounded-lg" style={{ borderColor: theme.colors.secondary500 }}>
                <div className="flex justify-center">
                    <h1 className="text-2xl font-bold text-center mb-3">Update Change Request</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* Category Field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2">
                        <label htmlFor="category" style={labelStyle}>Category fix issue:</label>
                        <select
                            id="category"
                            name="category"
                            style={{ backgroundColor: theme.colors.primary400 }}
                            className="p-2 border border-gray-300 rounded text-white"
                            value={changeRequestData.category} // Bind the value to state
                    onChange={handleChange}
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
                            name="reason"
                            style={{ backgroundColor: theme.colors.primary400 }}
                            className="p-2 border border-gray-300 rounded text-white"
                            value={changeRequestData.reason} // Bind the value to state
                    onChange={handleChange}
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
                            name="impact"
                            style={{ backgroundColor: theme.colors.primary400 }}
                            className="p-2 border border-gray-300 rounded text-white"
                            value={changeRequestData.impact} // Bind the value to state
                    onChange={handleChange}
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
                            name="priority"
                            style={{ backgroundColor: theme.colors.primary400 }}
                            className="p-2 border border-gray-300 rounded text-white"
                            value={changeRequestData.priority} // Bind the value to state
                            onChange={handleChange}
                        >
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    {/* Change Name Field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
            <label htmlFor="change_name" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Change name:</label>
            <div className="relative w-full">
                <textarea
                    id="change_name"
                    name="change_name"
                    style={{ backgroundColor: theme.colors.primary400 }}
                    className="p-2 border border-gray-300 rounded text-white w-full"
                    placeholder="Enter value (1500 characters max)"
                    rows={4}
                    maxLength={1500}
                    value={changeRequestData.change_name} // Bind the value to state
                    onChange={handleChange} // Add the onChange handler
                />

                {/* Style your text dialog button */}
                <button
                    type="button"
                    onClick={() => toggleSyntaxInfo("change_name")}
                    className="flex items-center absolute top-0 right-0 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                    style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
                >
                    Style your text
                    <HelpCircle className="w-4 h-4 ml-1" />
                </button>

                {/* Syntax Info Box */}
                <SyntaxInfoBox
                    isVisible={openDialog === "change_name"}
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
                            {request.change_sites ? ["aat", "ftm", "fsst"].map((site) => (
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
                            )):<></>}
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
                        <label htmlFor="description" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Change description:</label>
                        <div className="relative w-full">
                            <textarea
                                id="description"
                                name="description"
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white w-full"
                                placeholder="Enter value (1500 characters max)"
                                rows={4}
                                maxLength={1500}
                                value={changeRequestData.description}
                                onChange={handleChange}
                            />

                            {/* Style your text dialog button */}
                            <button
                                type='button'
                                onClick={() => toggleSyntaxInfo("description")}
                                className="flex items-center absolute top-0 right-0 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                                style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
                            >
                                Style your text
                                <HelpCircle className="w-4 h-4 ml-1" />
                            </button>

                            {/* Syntax Info Box */}
                            <SyntaxInfoBox
                                isVisible={openDialog === "description"}
                                onClose={() => setOpenDialog(null)}
                            />
                        </div>
                    </div>
                    {/* Test Plan Field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
                        <label htmlFor="test_plan" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Test plan:</label>
                        <div className="relative w-full">
                            <textarea
                                id="test_plan"
                                name="test_plan"
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white w-full"
                                placeholder="Enter value (1500 characters max)"
                                rows={4}
                                maxLength={1500}
                                value={changeRequestData.test_plan}
                                onChange={handleChange}
                            />

                            {/* Style your text dialog button */}
                            <button
                                type='button'
                                onClick={() => toggleSyntaxInfo("test_plan")}
                                className="flex items-center absolute top-0 right-0 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                                style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
                            >
                                Style your text
                                <HelpCircle className="w-4 h-4 ml-1" />
                            </button>

                            {/* Syntax Info Box */}
                            <SyntaxInfoBox
                                isVisible={openDialog === "test_plan"}
                                onClose={() => setOpenDialog(null)}
                            />
                        </div>
                    </div>
                    {/* Rollback Plan Field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
                        <label htmlFor="rollback_plan" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Rollback plan:</label>
                        <div className="relative w-full">
                            <textarea
                                id="rollback_plan"
                                name="rollback_plan"
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white w-full"
                                placeholder="Enter value (1500 characters max)"
                                rows={4}
                                value={changeRequestData.rollback_plan}
                                onChange={handleChange}
                            />

                            {/* Style your text dialog button */}
                            <button
                                type='button'
                                onClick={() => toggleSyntaxInfo("rollback_plan")}
                                className="flex items-center absolute top-0 right-0 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                                style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
                            >
                                Style your text
                                <HelpCircle className="w-4 h-4 ml-1" />
                            </button>

                            {/* Syntax Info Box */}
                            <SyntaxInfoBox
                                isVisible={openDialog === "rollback_plan"}
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
                                    id={`${site}_it_contact_person`}
                                    name={`${site}_it_contact_person`}
                                    placeholder="Enter name (50 char max)"
                                    className="p-2 border border-gray-300 rounded w-full"
                                    maxLength={50}
                                    onKeyDown={(e) => e.key === ',' && e.preventDefault()} // Block comma input
                                    value={changeRequestData?.[`${site}_it_contact_person`] || ""}
                                    onChange={handleChange}
                                />


                                <input
                                    type="text"
                                    id={`${site}_it_contact_cdsid`}
                                    name={`${site}_it_contact_cdsid`}
                                    placeholder="Enter CDSID (50 char max)"
                                    className="p-2 border border-gray-300 rounded w-full"
                                    maxLength={50}
                                    onKeyDown={(e) => e.key === ',' && e.preventDefault()} // Block comma input
                                    value={changeRequestData?.[`${site}_it_contact_cdsid`] || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    ))}
                    {/* Global Team Contact */}
                    <GlobalTeamContact onContactChange={setGlobalContact} globalContact={globalContact} isUpdate={1} />
                    {/* Business Team Contact */}
                    <BusinessTeamContact onContactChange={setBusinessContact} businessContact={businessContact} isUpdate={1} />

                    {/* CRQ fields */}
                    {selectedSites.map((site) => (
                        <CRQSection type={site} onCRQChange={(updatedCRQs) => handleCRQChange(site, updatedCRQs)} crqs={crqs[site]} />
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
                                    checked={approval === "YES"}  // Check if the approval value is "YES"
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
                                    checked={approval === "NO"}  // Check if the approval value is "NO"
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
                                    checked={approval === "Waiting"}  // Check if the approval value is "NO"
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
                            value={changeStatus} // Controlled component
                            onChange={(e) => setChangeStatus(e.target.value)} // Update state
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
                    {/* Change cancel category */}
                    {changeStatus == "Completed with no issue" || changeStatus != "" && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2">
                                <label htmlFor="cancelChangeCategory" style={labelStyle}>Cancel change category:</label>
                                <select
                                    id="cancelChangeCategory"
                                    style={{ backgroundColor: theme.colors.primary400 }}
                                    className="p-2 border border-gray-300 rounded text-white"
                                >
                                    <option value="Reason 1">Reason 1</option>
                                    <option value="Reason 2">Reason 2</option>
                                    <option value="Reason 3">Reason 3</option>
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
                                </div>
                            </div>
                        </>
                    )}

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