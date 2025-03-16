import React, { useEffect, useState } from "react";
import { useTheme } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Dialog from "./Dialog";

export default function ChangeRequestData() {
    const [changeRequests, setChangeRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState();
    const [selectedRequest, setSelectedRequest] = useState(null);

    const handleOpenDialog = (request) => {
        setSelectedRequest(request); // Store the clicked row's request
        setDialogOpen(true); // Open the dialog
    };

    const handleUpdate = () => {
        if (selectedRequest) {
            navigate("/change-request-update", { state: { request: selectedRequest } });
        }
        setDialogOpen(false);
    };
    const handleDelete = async () => {
        if(!selectedRequest){
            alert("Please select a data row to delete.");
            return;
        }
        const confirmDelete = window.confirm("Are you sure you want to delete this data row?");
        if(!confirmDelete) return;
        try{
            const response = await axiosPrivate.delete(`/change-requests/${selectedRequest.id}`);
            alert("✅ Change Request deleted successfully")
            setChangeRequests(prev => prev.filter(request => request.id !== selectedRequest.id));
            setDialogOpen(false);
        }catch (error) {
            console.error("❌ Error deleting Change Request", error.message);
            alert(`❌ Error: ${error.response?.data?.message || "An error occurred"}`);
        }
    }

    useEffect(() => {
        const fetchChangeRequests = async () => {
            try {
                // Make the API request with the token included in the Authorization header
                const response = await axiosPrivate.get(`/change-requests`);

                console.log("API Response:", response.data); // Debugging
                setChangeRequests(response.data);
            } catch (err) {
                console.error("Error fetching change requests:", err.response ? err.response.data : err.message); // Debugging
                setError(err.response ? err.response.data.message : err.message);
                navigate('/login', { state: { from: location }, replace: true });
            } finally {
                setLoading(false);
            }
        };

        fetchChangeRequests();
    }, []);


    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">Error: {error}</div>;
    }

    const thStyle1 = "py-2 px-4 border-b border-r";
    const thStyle2 = "py-2 px-4 border-b border-r whitespace-nowrap";
    const thStyle3 = "py-2 px-30 border-b border-r whitespace-nowrap";

    const handleAddChangeRequest = () => {
        navigate("/change-request");
    };

    return (
        <div className="h-170 flex flex-col">
            <h1 className="text-2xl font-bold text-center my-4">Change Request Data</h1>

            <div className="flex items-center p-2" style={{ border: '1px solid', borderColor: theme.colors.secondary400, borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                <h5 className="m-0">Change requests from 2024 - Quarter 1</h5>
                <button
                    onClick={handleAddChangeRequest}
                    className="hover:bg-blue-700 cursor-pointer font-bold py-2 px-4 rounded ml-auto"
                    style={{ background: theme.colors.primaryButton, color: theme.colors.primary500 }}
                >
                    Add Change Request
                </button>
            </div>

            {changeRequests.length === 0 ? (
                <div className="flex-1 overflow-auto">
                    <div className="overflow-x-auto h-full">
                        <table className="w-full border border-gray-300 rounded-lg shadow-md text-sm" style={{ backgroundColor: theme.colors.primary400 }}>
                            <thead className="sticky top-0 bg-gray-800">
                                <tr>
                                    <th className={thStyle1}>No change requests found.</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-auto">
                    <div className="overflow-x-auto h-full">
                        <table className="w-full border border-gray-300 rounded-lg shadow-md text-sm" style={{ backgroundColor: theme.colors.primary400 }}>
                            <thead className="sticky top-0 bg-gray-800">
                                <tr>
                                    <th className={thStyle1}>Change Record</th>
                                    <th className={thStyle1}>Category</th>
                                    <th className={thStyle1}>Reason</th>
                                    <th className={thStyle1}>Impact</th>
                                    <th className={thStyle1}>Priority</th>
                                    <th className={thStyle3}>Change Name</th>
                                    <th className={thStyle2}>Change Sites</th>
                                    <th className={thStyle2}>Common Change</th>
                                    <th className={thStyle1}>Request Change</th>
                                    <th className={thStyle1}>FTM Schedule Change</th>
                                    <th className={thStyle1}>AAT Schedule Change</th>
                                    <th className={thStyle1}>FSST Schedule Change</th>
                                    <th className={thStyle1}>Time of Change (Hours)</th>
                                    <th className={thStyle1}>Achieve 2 Weeks Request Change</th>
                                    <th className={thStyle3}>Description</th>
                                    <th className={thStyle3}>Test Plan</th>
                                    <th className={thStyle3}>Rollback Plan</th>
                                    <th className={thStyle2}>FTM Site IT Contact</th>
                                    <th className={thStyle2}>AAT Site IT Contact</th>
                                    <th className={thStyle2}>FSST Site IT Contact</th>
                                    <th className={thStyle2}>Global Team Contact</th>
                                    <th className={thStyle2}>Business Team Contact</th>
                                    <th className={thStyle2}>FTM CRQ</th>
                                    <th className={thStyle2}>AAT CRQ</th>
                                    <th className={thStyle2}>FSST CRQ</th>
                                    {/* <th className={thStyle2}>Common CRQ</th> */}
                                    <th className="py-2 px-4 border-b border-r">Approval</th>
                                    <th className={thStyle3}>Change Status</th>
                                    <th className={thStyle2}>Cancel Change Reason Category</th>
                                    <th className={thStyle3}>Cancel Change Reason Description</th>
                                    <th className={thStyle3}>Reschedule Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {changeRequests.map((request, index) => {
                                    const processSchedule = (scheduleString) => {
                                        if (!scheduleString) return { scheduleArray: [], totalDuration: 0 }; // Return empty array if no schedule
                                        const parts = scheduleString.split(" "); // Split by space
                                        const scheduleArray = [];
                                        let duration = 0;
                                    
                                        for (let i = 0; i < parts.length; i += 3) {
                                            if (i + 2 < parts.length) { // Ensure there's a valid start, end, and duration
                                                let start = parts[i].replace(/-/g, "/").replace(/['"]/g, ""); // Replace - with /
                                                let end = parts[i + 1].replace(/-/g, "/").replace(/['"]/g, ""); // Replace - with /
                                                let currentDuration = parseInt(parts[i + 2], 10) || 0; // Convert to integer safely
                                    
                                                scheduleArray.push(`${start} TO ${end}`);
                                                duration += currentDuration; // Accumulate total duration
                                            }
                                        }
                                    
                                        return { scheduleArray, totalDuration: duration }; // Always return an object
                                    };
                                    const ftmSchedule = processSchedule(request.ftm_schedule_change);
                                    const aatSchedule = processSchedule(request.aat_schedule_change);
                                    const fsstSchedule = processSchedule(request.fsst_schedule_change);

                                    return (
                                        <>
                                            <tr
                                                onClick={() => { handleOpenDialog(request); setCurrentRow(index + 1) }}
                                                key={request.id}
                                                className="hover:bg-gray-100 hover:text-black">
                                                <td className="py-2 px-4 border-b border-r text-center">{index + 1}</td>
                                                <td className="py-2 px-4 border-b border-r">{request.category}</td>
                                                <td className="py-2 px-4 border-b border-r">{request.reason}</td>
                                                <td className="py-2 px-4 border-b border-r text-center">{request.impact}</td>
                                                <td className="py-2 px-4 border-b border-r text-center">{request.priority}</td>
                                                <td className="py-2 px-4 border-b border-r">{request.change_name}</td>
                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    {String(request.change_sites || "")
                                                        .split(",")
                                                        .join(", ")
                                                        .toUpperCase()}
                                                </td>
                                                <td className="py-2 px-4 border-b border-r text-center">{request.common_change ? "YES" : "NO"}</td>
                                                <td className="py-2 px-4 border-b border-r">{new Date(request.request_change_date).toLocaleDateString()}</td>
                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    {ftmSchedule.scheduleArray.map((item, i) => (
                                                        <div key={i} className="mb-1">
                                                            <p className="p-1 border border-white rounded-md text-xs">{item}</p>
                                                        </div>
                                                    ))}

                                                </td>
                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    {aatSchedule.scheduleArray.map((item, i) => (
                                                        <div key={i} className="mb-1">
                                                            <p className="p-1 border border-white rounded-md text-xs">{item}</p>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="py-2 px-4 border text-center">
                                                    {fsstSchedule.scheduleArray.map((item, i) => (
                                                        <div key={i} className="mb-1">
                                                            <p className="p-1 border border-white rounded-md text-xs">{item}</p>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="py-2 px-4 border-b border-r text-center">{aatSchedule.totalDuration + ftmSchedule.totalDuration + fsstSchedule.totalDuration}</td>
                                                <td className="py-2 px-4 border-b border-r text-center">{request.achieve_2_week_change_request ? "Yes" : "No"}</td>
                                                <td className="py-2 px-4 border-b border-r">{request.description}</td>
                                                <td className="py-2 px-4 border-b border-r">{request.test_plan}</td>
                                                <td className="py-2 px-4 border-b border-r">{request.rollback_plan}</td>
                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    {request.ftm_it_contact == null ? "" :
                                                        request.ftm_it_contact.split(',').map((item, i) => (
                                                            <div key={i} className="mb-1">{item.trim()}</div>
                                                        ))}</td>
                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    {request.aat_it_contact == null ? "" :
                                                        request.aat_it_contact.split(",").map((item, i) => (
                                                            <div key={i} className='mb-1'>{item.trim()}</div>
                                                        ))}</td>
                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    {request.fsst_it_contact == null ? "" :
                                                        request.fsst_it_contact.split(",").map((item, i) => (
                                                            <div key={i} className="mb-1">{item.trim()}</div>
                                                        ))}
                                                </td>
                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    {request.global_team_contact == null ? "" :
                                                        request.global_team_contact.split(',').map((item, i) => (
                                                            <div key={i} className="mb-1">{item.trim()}</div>
                                                        ))}</td>
                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    {request.business_team_contact == null ? "" :
                                                        request.business_team_contact.split(',').map((item, i) => (
                                                            <div key={i} className="mb-1">{item.trim()}</div>
                                                        ))}</td>
                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    {request.ftm_crq &&
                                                        request.ftm_crq.split(",").map((item, i) => (
                                                            <div key={i} className="mb-1">{item.trim()}</div>
                                                        ))}
                                                </td>

                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    {request.aat_crq &&
                                                        request.aat_crq.split(",").map((item, i) => (
                                                            <div key={i} className="mb-1">{item.trim()}</div>
                                                        ))}
                                                </td>

                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    {request.fsst_crq &&
                                                        request.fsst_crq.split(",").map((item, i) => (
                                                            <div key={i} className="mb-1">{item.trim()}</div>
                                                        ))}
                                                </td>
                                                {/* <td className="py-2 px-4 border-b border-r">{request.common_crq}</td> */}
                                                <td className="py-2 px-4 border-b border-r text-center">{request.approval}</td>
                                                <td className="py-2 px-4 border-b border-r">{request.change_status}</td>
                                                <td className="py-2 px-4 border-b border-r text-center">{request.cancel_change_category}</td>
                                                <td className="py-2 px-4 border-b border-r">{request.cancel_change_reason}</td>
                                                <td className="py-2 px-4 border-b border-r">{request.reschedule_reason}</td>
                                            </tr>
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                            <h2 className="text-lg font-semibold mb-4">Update or Delete row {currentRow}</h2>
                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 cursor-pointer rounded hover:bg-blue-700"
                                    style={{ color: theme.colors.primary500, backgroundColor: theme.colors.primaryButton }}
                                    onClick={handleUpdate}
                                >
                                    Update
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 cursor-pointer rounded hover:bg-red-700"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </Dialog>
                    </div>
                </div>
            )}
        </div>
    );
}