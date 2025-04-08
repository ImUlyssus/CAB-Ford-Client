import React, { useState, useRef, useEffect, useContext } from "react";
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
import AuthContext from '../context/AuthProvider';
import ScheduleInfo from "../assets/schedule_info.jpg";
import AISuggestionDialog from "../components/AISuggestionDialog";
function ChangeRequestUpdate() {
    const location = useLocation();
    const { auth } = useContext(AuthContext);
    const request = location.state?.request;
    const [isAISuggestionDialogOpen, setIsAISuggestionDialogOpen] = useState(false);
    // const users = location.state?.users;
    const [changeRequestData, setChangeRequestData] = useState({
        category: request.category,
        reason: request.reason,
        impact: request.impact,
        priority: request.priority,
        change_name: request.change_name || "",
        description: request.description || "",
        aat_test_plan: request.aat_test_plan || "",
        ftm_test_plan: request.ftm_test_plan || "",
        fsst_test_plan: request.fsst_test_plan || "",
        rollback_plan: request.rollback_plan || "",
        aat_it_contact_person: request?.aat_it_contact?.split(',')[0] || "",
        aat_it_contact_cdsid: request?.aat_it_contact?.split(',')[1] || "",
        ftm_it_contact_person: request?.ftm_it_contact?.split(',')[0] || "",
        ftm_it_contact_cdsid: request?.ftm_it_contact?.split(',')[1] || "",
        fsst_it_contact_person: request?.fsst_it_contact?.split(',')[0] || "",
        fsst_it_contact_cdsid: request?.fsst_it_contact?.split(',')[1] || "",
        cancel_change_category: request.cancel_change_category || "",
        cancel_change_reason: request.cancel_change_reason || "",
        lesson_learnt: request.lesson_learnt == null ? "" : request.lesson_learnt,
        reschedule_reason: request.reschedule_reason == null ? "" : request.reschedule_reason,
        remarks: request.remarks == null ? "" : request.remarks,
    });
    const theme = useTheme();
    const [changeStatus, setChangeStatus] = useState(request.change_status ?? "");
    const [changeDescription, setChangeDescription] = useState("");
    const [selectedSites, setSelectedSites] = useState(request.change_sites.includes(',') ? request.change_sites.split(',') : []);
    const [openDialog, setOpenDialog] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const [approval, setApproval] = useState(request.approval);
    const [businessContact, setBusinessContact] = useState(request.business_team_contact !== null ? request.business_team_contact.split(',') : {});
    const [globalContact, setGlobalContact] = useState(request.global_team_contact !== null ? request.global_team_contact.split(',') : {});
    const globalTeamContactRef = useRef(null);
    const navigate = useNavigate();
    const [requestors, setRequestors] = useState({
        AAT: '',
        FTM: '',
        FSST: '',
    });
    const [users, setUsers] = useState([]);
    console.log("From update", request);
    const handleChange = (event) => {
        const { name, value } = event.target; // Destructure name and value from the event

        setChangeRequestData({
            ...changeRequestData,
            [name]: value, // Dynamically set the correct field based on the name
        });
        if (name == "change_status" && (value == "Completed with no issue" || value == "")) {
            setChangeRequestData({
                ...changeRequestData,
                cancel_change_category: "",
                cancel_change_reason: ""
            });
        }
    };

    // the following useEffect is required when there is only one site in request.change_sites with no comma
    // or it will cause bug
    useEffect(() => {
        if (!selectedSites.length) {
            setSelectedSites([request.change_sites]);
        }
    }, [selectedSites.length, request.change_sites]);

    useEffect(() => {
        setRequestors(() => ({
            AAT: request.aat_requestor,
            FTM: request.ftm_requestor,
            FSST: request.fsst_requestor,
        }));
        // setUsers(location.state?.users);
    }, [request]);
    useEffect(() => {
        let isMounted = true; // Prevent memory leaks on unmount
        const controller = new AbortController(); // To cancel the request
    
        const getAllUsers = async () => {
            try {
                const response = await axiosPrivate.get("/users", {
                    signal: controller.signal, // Link request to controller
                });
                if (isMounted) {
                    setUsers(response.data);
                }
            } catch (error) {
                if (error.name === "CanceledError") {
                    console.log("Request canceled:", error.message);
                } else {
                    console.error("❌ Error fetching users:", error.response?.data || error.message);
                }
            }
        };
    
        getAllUsers();
    
        return () => {
            isMounted = false;
            controller.abort(); // Cleanup request on unmount
        };
    }, []);
    console.log("From update", users);
    const [crqs, setCrqs] = useState({
        aat: [],
        ftm: [],
        fsst: [],
    });
    const [scheduleChanges, setScheduleChanges] = useState({
        aat: { addedDates: [], startDateForRange: null, endDateForRange: null },
        ftm: { addedDates: [], startDateForRange: null, endDateForRange: null },
        fsst: { addedDates: [], startDateForRange: null, endDateForRange: null },
    });
    const handleApprovalChange = (status) => {
        setApproval(status)
    }
    const handleCRQChange = (type, updatedCRQs) => {
        setCrqs((prev) => ({
            ...prev,
            [type]: updatedCRQs,
        }));
    };

    const toggleSyntaxInfo = (textareaId) => {
        setOpenDialog(openDialog === textareaId ? null : textareaId);
    };
    const parseSchedule = (scheduleString) => {
        if (!scheduleString) return [];
    
        return scheduleString
            .split(" ") // Split by space into entries
            .map((entry) => {
                const [start, end, title, changeStatus, statusRemark] = entry.split("!");
                return {
                    start: start?.replace(/-/g, "/"),
                    end: end?.replace(/-/g, "/"),
                    title: title.replace(/_/g, " "),
                    changeStatus: changeStatus.replace(/_/g, " "),
                    statusRemark:  statusRemark.replace(/_/g, " "),
                };
            });
    };
    
    const handleRequestorChange = (site, value) => {
        setRequestors((prev) => ({
            ...prev,
            [site]: value,
        }));
    };
    useEffect((prev) => {
        setScheduleChanges((prevState) => ({
            ...prevState,
            aat: {
                ...prevState.aat,
                addedDates: parseSchedule(request.aat_schedule_change),
                startDateForRange: prevState.aat.startDateForRange ?? null,
                endDateForRange: prevState.aat.endDateForRange ?? null,
            },
            ftm: {
                ...prevState.ftm,
                addedDates: parseSchedule(request.ftm_schedule_change),
                startDateForRange: prevState.ftm.startDateForRange ?? null,
                endDateForRange: prevState.ftm.endDateForRange ?? null,
            },
            fsst: {
                ...prevState.fsst,
                addedDates: parseSchedule(request.fsst_schedule_change),
                startDateForRange: prevState.fsst.startDateForRange ?? null,
                endDateForRange: prevState.fsst.endDateForRange ?? null,
            },
        }));
        updateDurations();
    }, [request]);
    const handleOpenAISuggestionDialog = () => {
        setIsAISuggestionDialogOpen(true);
    };
    const handleCloseAISuggestionDialog = () => {
        setIsAISuggestionDialogOpen(false);
    };
    const handleDescriptionChange = (newDescription) => {
        setChangeDescription(newDescription);
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
                        start: entry.start?.replace(/\//g, "-") ?? getRandomDate(),
                        end: entry.end?.replace(/\//g, "-") ?? getRandomDate()
                    })),
                    // Ensure site-level start, end are assigned if null
                    startDateForRange: prevState[site].startDateForRange ?? null,
                    endDateForRange: prevState[site].endDateForRange ?? null
                };
            });

            return updatedState;
        });
    };
    useEffect(() => {
        // Set crqs by splitting the comma-separated string into arrays
        setCrqs({
            aat: request.aat_crq ? request.aat_crq.split(",") : [],
            ftm: request.ftm_crq ? request.ftm_crq.split(",") : [],
            fsst: request.fsst_crq ? request.fsst_crq.split(",") : [],
        });
    }, [request]);
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
    const handleRemoveDate = (site, index) => {
        setScheduleChanges(prevState => {
            const updatedAddedDates = prevState[site].addedDates.filter((_, i) => i !== index);
            return {
                ...prevState,
                [site]: {
                    ...prevState[site],
                    addedDates: updatedAddedDates
                }
            };
        });
    };
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedSitesString = selectedSites.join(',');
        const aat_crq = crqs['aat'].join(',') || '';
        const ftm_crq = crqs['ftm'].join(',') || '';
        const fsst_crq = crqs['fsst'].join(',') || '';
        const isCommonChange = selectedSites.length > 1;
        const aat_it_contact = changeRequestData.aat_it_contact_person.trim() + "," + changeRequestData.aat_it_contact_cdsid.trim();
        const ftm_it_contact = changeRequestData.ftm_it_contact_person.trim() + "," + changeRequestData.ftm_it_contact_cdsid.trim();
        const fsst_it_contact = changeRequestData.fsst_it_contact_person.trim() + "," + changeRequestData.fsst_it_contact_cdsid.trim();
        const aat_requestor = requestors['aat'] || '';
        const ftm_requestor = requestors['ftm'] || '';
        const fsst_requestor = requestors['fsst'] || '';
        console.log(aat_requestor, ftm_requestor, fsst_requestor);
        if (!changeRequestData.category || !changeRequestData.reason || !changeRequestData.impact || !changeRequestData.priority || !changeRequestData.change_name || selectedSitesString.length < 1) {
            alert("❌ A change request must include those fields: category, reason, impact, priority, change name and change site to submit.");
            return;
        }
        // Transform scheduleChanges into space-separated strings for each site
        const aat_schedule_change = scheduleChanges.aat?.addedDates
            ?.map(date => `${date.start} ${date.end}`)
            .join(' ') || '';

        const ftm_schedule_change = scheduleChanges.ftm?.addedDates
            ?.map(date => `${date.start} ${date.end}`)
            .join(' ') || '';

        const fsst_schedule_change = scheduleChanges.fsst?.addedDates
            ?.map(date => `${date.start} ${date.end}`)
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
        // if no date to compare
        const allEmpty = !aatEndDates.length && !ftmEndDates.length && !fsstEndDates.length;

        const hasEarlyEndDate = allEmpty || [...aatEndDates, ...ftmEndDates, ...fsstEndDates]
            .some(endDate => endDate < twoWeeksLater);
        const achieve_2_week_change_request = !hasEarlyEndDate;
        const is_someone_updating = localStorage.getItem('authEmail')?.split("@")[0];
        if (!is_someone_updating) {
            alert("Cannot get email from local storage! Contact developer to solve this issue.")
            return;
        }
        const getEverySecondDate = (scheduleString) => {
            if (!scheduleString) return []; // Handle empty or undefined case

            // Convert string schedule to an array and parse as Date objects
            const scheduleArray = scheduleString.split(" ").map(dateStr => new Date(dateStr));

            // Extract every second date (index 1, 3, 5, ...)
            return scheduleArray.filter((_, index) => index % 2 === 1);
        };

        // Extract second dates from each site's schedule
        const aatDates = getEverySecondDate(aat_schedule_change);
        const ftmDates = getEverySecondDate(ftm_schedule_change);
        const fsstDates = getEverySecondDate(fsst_schedule_change);

        // Combine all second dates
        const allSecondDates = [...aatDates, ...ftmDates, ...fsstDates];

        // Find the latest date
        const latestDate = allSecondDates.length > 0
            ? new Date(Math.max(...allSecondDates.map(date => date.getTime())))
            : null;

        // Format latest date as 'YYYY-MM-DD' if it exists
        const latest_schedule_date = latestDate ? latestDate.toISOString().split("T")[0] : null;
        const requestData = {
            email: localStorage.getItem("authEmail").split("@")[0],
            id: request.id,
            category: changeRequestData.category,
            reason: changeRequestData.reason,
            impact: changeRequestData.impact,
            priority: changeRequestData.priority,
            common_change: isCommonChange,
            change_sites: selectedSitesString,
            change_name: changeRequestData.change_name,
            request_change_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            aat_schedule_change: selectedSitesString.includes('aat') ? aat_schedule_change : "",
            ftm_schedule_change: selectedSitesString.includes('ftm') ? ftm_schedule_change : "",
            fsst_schedule_change: selectedSitesString.includes('fsst') ? fsst_schedule_change : "",
            latest_schedule_date,
            description: changeRequestData.description,
            test_plan: changeRequestData.test_plan,
            rollback_plan: changeRequestData.rollback_plan,
            achieve_2_week_change_request,
            aat_it_contact: selectedSitesString.includes('aat') ? aat_it_contact : "",
            ftm_it_contact: selectedSitesString.includes('ftm') ? ftm_it_contact : "",
            fsst_it_contact: selectedSitesString.includes('fsst') ? fsst_it_contact : "",
            business_team_contact: businessContact,
            global_team_contact: globalContact,
            aat_crq: selectedSitesString.includes('aat') ? aat_crq : "",
            ftm_crq: selectedSitesString.includes('ftm') ? ftm_crq : "",
            fsst_crq: selectedSitesString.includes('fsst') ? fsst_crq : "",
            approval,
            change_status: changeStatus,
            cancel_change_category: changeStatus == "Completed with no issue" || changeStatus == "" ? "" : changeRequestData.cancel_change_category,
            cancel_change_reason: changeStatus == "Completed with no issue" || changeStatus == "" ? "" : changeRequestData.cancel_change_reason,
            lesson_learnt: changeRequestData.lesson_learnt,
            reschedule_reason: changeRequestData.reschedule_reason,
            is_someone_updating
        }
        // try {
        //     const response = await axiosPrivate.put(`/change-requests`, requestData, {
        //         headers: { "Content-Type": "application/json" },
        //     });

        //     alert("✅ Change Request updated successfully");
        //     // there will be an error in the console every time you make a change request bc of this refresh, related to access and refresh token. Don't worry about it.
        //     navigate(-1);
        // } catch (error) {
        //     if (error.response) {
        //         console.error("❌ Error submitting Change Request", error.message);
        //         alert(`❌ Error: ${error.response.data.message || "An error occurred"}`);
        //     } else if (error.request) {
        //         alert("❌ No response received. Please try again later.");
        //     } else {
        //         console.error("❌ Error submitting Change Request", error.message);
        //         alert("❌ Something went wrong. Please try again later.");
        //     }
        // }
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
    const handleBack = async () => {
        try {
            const response = await axiosPrivate.put(`/change-requests/go-back-update`, { id: request.id, email: "" }, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.data.canUpdate) {
                navigate(-1);
            }
        } catch (error) {
            console.error("❌ Error: ", error);
        }
    };
    // useReleaseLock({id:request.id, email:localStorage.getItem("authEmail").split("@")[0]});
    return (
        <div>
            <button
                onClick={handleBack} // Go back to the previous page
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
                                placeholder="Enter value (max 300 characters)"
                                rows={4}
                                maxLength={300}
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
                    {/* Change requestor */}
                    {selectedSites.map((site) => (
                        <div key={site} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2">
                            <label htmlFor={`${site}Requestor`} style={labelStyle}>
                                {site.toUpperCase()} change requestor:
                            </label>
                            <select
                                id={`${site}Requestor`}
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white"
                                value={requestors[`${site.toUpperCase()}`] || ""}
                                onChange={(e) => handleRequestorChange(site, e.target.value)}
                            >
                                <option key="_" value="">
                                        _
                                    </option>
                                {users?.filter((user) => user.site === site.toUpperCase()) // 🔥 Filter users by site
                                    .map((filteredUser) => (
                                        <option key={filteredUser.email} value={`${filteredUser.name} ${filteredUser.email}`}>
                                            {filteredUser.name} ({filteredUser.email})
                                        </option>
                                    ))}
                            </select>
                        </div>
                    ))}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2">
                        <label htmlFor="changeDescription" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Change description:</label>
                        <div className="relative w-full">
                            <Button className='w-full' type="button" onClick={handleOpenAISuggestionDialog}>
                                Add description
                            </Button>
                        </div>
                    </div>
                    <AISuggestionDialog
                        isOpen={isAISuggestionDialogOpen}
                        onClose={handleCloseAISuggestionDialog}
                        onDescriptionChange={handleDescriptionChange}
                        value={changeRequestData.description}
                    />
                    {/* Test Plan Field */}
                    {selectedSites.map((site) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
                            <label htmlFor={`${site}TestPlan`} style={{ marginLeft: 'auto', marginRight: '10rem' }}>{site.toUpperCase()} Test plan:</label>
                            <div className="relative w-full">
                                <textarea
                                    id={`${site}TestPlan`}
                                    style={{ backgroundColor: theme.colors.primary400 }}
                                    className="p-2 border border-gray-300 rounded text-white w-full"
                                    placeholder="Enter value (max 500 characters)"
                                    value={changeRequestData[`${site}_test_plan`] || ""}
                                    rows={4}
                                    maxLength={500}
                                    onChange={handleChange}
                                />

                                {/* Style your text dialog button */}
                                <button
                                    type='button'
                                    onClick={() => toggleSyntaxInfo(`${site}testPlan`)}
                                    className="flex items-center absolute top-0 right-0 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                                    style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
                                >
                                    Style your text
                                    <HelpCircle className="w-4 h-4 ml-1" />
                                </button>

                                {/* Syntax Info Box */}
                                <SyntaxInfoBox
                                    isVisible={openDialog === `${site}testPlan`}
                                    onClose={() => setOpenDialog(null)}
                                />
                            </div>
                        </div>
                    ))}
                    {/* Rollback Plan Field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
                        <label htmlFor="rollback_plan" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Rollback plan:</label>
                        <div className="relative w-full">
                            <textarea
                                id="rollback_plan"
                                name="rollback_plan"
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white w-full"
                                placeholder="Enter value (max 500 characters)"
                                rows={4}
                                value={changeRequestData.rollback_plan}
                                onChange={handleChange}
                                maxLength={500}
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
                                    placeholder="Enter name (max 50 characters)"
                                    className="p-2 border border-gray-300 rounded w-full"
                                    maxLength={50}
                                    onKeyDown={(e) => (e.key === ',') && e.preventDefault()}
                                    value={changeRequestData?.[`${site}_it_contact_person`] || ""}
                                    onChange={handleChange}
                                />


                                <input
                                    type="text"
                                    id={`${site}_it_contact_cdsid`}
                                    name={`${site}_it_contact_cdsid`}
                                    placeholder="Enter CDSID (max 50 characters)"
                                    className="p-2 border border-gray-300 rounded w-full"
                                    maxLength={50}
                                    onKeyDown={(e) => (e.key === ',' || e.key === ' ') && e.preventDefault()}// Block comma input
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
                            <option value="_">_</option>
                        <option value="Completed with no issue">Completed with no issue</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Postponed/Rejected">Postponed/Rejected</option>
                        </select>
                    </div>
                    {/* Change cancel category */}
                    {changeStatus == "Completed with no issue" || changeStatus != "" && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2">
                                <label htmlFor="cancel_change_category" style={labelStyle}>Cancel change category:</label>
                                <select
                                    id="cancel_change_category"
                                    name="cancel_change_category"
                                    style={{ backgroundColor: theme.colors.primary400 }}
                                    className="p-2 border border-gray-300 rounded text-white"
                                    value={changeRequestData.cancel_change_category}
                                    onChange={handleChange}
                                >
                                    <option value=""></option>
                                    <option value="Reason 1">Reason 1</option>
                                    <option value="Reason 2">Reason 2</option>
                                    <option value="Reason 3">Reason 3</option>
                                </select>
                            </div>

                            {/* Cancel Change Reason Field */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
                                <label htmlFor="cancel_change_reason" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Cancel change reason:</label>
                                <div className="relative w-full">
                                    <textarea
                                        id="cancel_change_reason"
                                        name="cancel_change_reason"
                                        style={{ backgroundColor: theme.colors.primary400 }}
                                        className="p-2 border border-gray-300 rounded text-white w-full"
                                        placeholder="Enter value (max 500 characters)"
                                        rows={4}
                                        value={changeRequestData.cancel_change_reason}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Lesson Learnt Field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
                        <label htmlFor="lesson_learnt" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Lesson learnt:</label>
                        <div className="relative w-full">
                            <textarea
                                id="lesson_learnt"
                                name="lesson_learnt"
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white w-full"
                                placeholder="Enter value (max 500 characters)"
                                rows={4}
                                value={changeRequestData.lesson_learnt}
                                onChange={handleChange}
                            />

                            {/* Style your text dialog button */}
                            <button
                                type='button'
                                onClick={() => toggleSyntaxInfo("lesson_learnt")}
                                className="flex items-center absolute top-0 right-0 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                                style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
                            >
                                Style your text
                                <HelpCircle className="w-4 h-4 ml-1" />
                            </button>

                            {/* Syntax Info Box */}
                            <SyntaxInfoBox
                                isVisible={openDialog === "lesson_learnt"}
                                onClose={() => setOpenDialog(null)}
                            />
                        </div>
                    </div>
                    {/* Reschedule Reason */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
                        <label htmlFor="reschedule_reason" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Reschedule reason:</label>
                        <div className="relative w-full">
                            <textarea
                                id="reschedule_reason"
                                name="reschedule_reason"
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white w-full"
                                placeholder="Enter value (max 500 characters)"
                                rows={4}
                                value={changeRequestData.reschedule_reason}
                                onChange={handleChange}
                            />

                            {/* Style your text dialog button */}
                            <button
                                type='button'
                                onClick={() => toggleSyntaxInfo("reschedule_reason")}
                                className="flex items-center absolute top-0 right-0 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                                style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
                            >
                                Style your text
                                <HelpCircle className="w-4 h-4 ml-1" />
                            </button>

                            {/* Syntax Info Box */}
                            <SyntaxInfoBox
                                isVisible={openDialog === "reschedule_reason"}
                                onClose={() => setOpenDialog(null)}
                            />
                        </div>
                    </div>
                    {/* Remark Plan Field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
                        <label htmlFor="remarks" style={{ marginLeft: 'auto', marginRight: '10rem' }}>Remarks:</label>
                        <div className="relative w-full">
                            <textarea
                                id="remarks"
                                style={{ backgroundColor: theme.colors.primary400 }}
                                className="p-2 border border-gray-300 rounded text-white w-full"
                                placeholder="Enter value (max 500 characters)"
                                value={changeRequestData.remarks}
                                rows={4}
                                maxLength={500}
                            />

                            {/* Style your text dialog button */}
                            <button
                                type='button'
                                onClick={() => toggleSyntaxInfo("remarks")}
                                className="flex items-center absolute top-0 right-0 mt-2 mr-2 text-sm rounded-full px-2 py-1 hover:bg-gray-600"
                                style={{ backgroundColor: "#fff18d", color: theme.colors.primary500 }}
                            >
                                Style your text
                                <HelpCircle className="w-4 h-4 ml-1" />
                            </button>

                            {/* Syntax Info Box */}
                            <SyntaxInfoBox
                                isVisible={openDialog === "remarks"}
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
                            className="hover:bg-blue-700 font-bold py-2 px-4 rounded cursor-pointer"
                        >
                            Update Change Request
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
    const [helpDialogOpen, setHelpDialogOpen] = useState(false);

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
                        Set up schedule information
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
                <div className="flex items-center">
                    <h4 className="text-md font-semibold mb-2">Schedule Change Information</h4>
                    <button
  type="button"
  onClick={() => setHelpDialogOpen(true)}
  className="mb-2 ml-2 cursor-pointer text-green-700 hover:text-gray-700 focus:outline-none"
>
  <HelpCircle size={20} />
</button>

                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Schedule title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title (max 20 characters)"
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
                        <option value="On plan">On plan</option>
                        <option value="In progress">In progress</option>
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
                        placeholder="Enter remark (max 50 characters)"
                        className="p-2 border border-gray-300 rounded w-full"
                        maxLength={50}
                        onKeyDown={(e) => (e.key === '!' || e.key === '_') && e.preventDefault()}
                    />
                </div>
                <div className="flex">
                    <Button type="button" onClick={handleAddDate} className="ml-auto">
                        Add
                    </Button>
                </div>
            </Dialog>

            {/* Help Dialog */}
            <Dialog open={helpDialogOpen} onClose={() => setHelpDialogOpen(false)}>
                <h4 className="text-md font-semibold mb-2">Schedule Change Information</h4>
                <p className="text-sm mb-4">
                    Each schedule should have its start date and end date. They are mandatory information. In addition, you can add title, status and remark of the schedule.
                    But they are optional and will be used in presentation interface as in the photo.
                    Please note that the status from here will only be used in presentation and it has no affect to 'Dashboard (Data Visualization)' feature. There is
                    another status field that you will need to enter in the form, which has only three status ('Completed', 'Ongoing,' and 'Canceled/Postponed'), which will be used in Dashboard feature.
                </p>
                <img src={ScheduleInfo} alt="Schedule Change Information" className="w-full h-auto mb-2" />
                <div className="flex justify-end">
                    <Button onClick={() => setHelpDialogOpen(false)} className="">Close</Button>
                </div>
            </Dialog>
        </div>
    );
}

export default ChangeRequestUpdate;