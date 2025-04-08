import React, { useEffect, useState, useContext } from "react";
import { useTheme } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Dialog from "./Dialog";
import FilteredBar from "./FilteredBar";
import AuthContext from '../context/AuthProvider';
import VHDrawer from './VHDrawer';
import { History } from "lucide-react";

export default function ChangeRequestData() {
    const [changeRequests, setChangeRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const { auth } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
    const email = localStorage.getItem("authEmail")?.split("@")[0];
    const id = selectedRequest?.id;
    const handleOpenDialog = (request) => {
        setSelectedRequest(request); // Store the clicked row's request
        setDialogOpen(true); // Open the dialog
    };
    const forceUpdateRequest = async (id, email) => {
        try {
            const response = await axiosPrivate.put(`/change-requests/force-update`, { id, email }, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.data.canUpdate) {
                alert("✅ Force update successful. You can now update the request.");
                navigate("/change-request-update", { state: { request: selectedRequest } });
            } else {
                alert(`❌ Force update failed: ${response.data.message}`);
            }
        } catch (error) {
            console.error("❌ Error forcing update:", error);
            alert("❌ Error forcing update. Please try again later.");
        }
    };

    const handleUpdate = async () => {
        const requestData = { email, id };

        try {
            const response = await axiosPrivate.put(`/change-requests/check-to-update`, requestData, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.data.canUpdate) {
                // ✅ User can update the request
                console.log("You can now update the request.");
                navigate("/change-request-update", { state: { request: selectedRequest } });
            } else if (response.data.canForceUpdate) {
                // ❌ Someone else is updating, allow force update
                const isForceUpdate = window.confirm(
                    `❌ Someone is already updating this request (CDSID: ${response.data.isSomeoneUpdating}). 
                    Would you like to force update?`
                );

                if (isForceUpdate) {
                    // 📝 Ask for email confirmation
                    const confirmEmail = window.prompt("Enter your email to confirm force update:");

                    if (confirmEmail && confirmEmail.split("@")[0] === email) {
                        // 🔥 Call API to force update
                        await forceUpdateRequest(id, email);
                    } else {
                        alert("❌ Incorrect email. Force update canceled.");
                    }
                }
            }
        } catch (error) {
            console.error("❌ Error submitting Change Request", error.message);
            alert("❌ An error occurred while checking update status.");
        }
        setDialogOpen(false);
    };


    const handleDelete = async () => {
        if (!selectedRequest) {
            alert("Please select a data row to delete.");
            return;
        }
        const confirmDelete = window.confirm("Are you sure you want to delete this data row?");
        if (!confirmDelete) return;
        try {
            const response = await axiosPrivate.delete(`/change-requests/${selectedRequest.id}`, { data: { email } });
            alert("✅ Change Request deleted successfully")
            setChangeRequests(prev => prev.filter(request => request.id !== selectedRequest.id));
            setDialogOpen(false);
        } catch (error) {
            console.error("❌ Error deleting Change Request", error.message);
            alert(`❌ Error: ${error.response?.data?.message || "An error occurred"}`);
        }
    }

    useEffect(() => {
        const updateChangeRequests = async () => {
            // Simulate async behavior (e.g., fetching, processing)
            await new Promise(resolve => setTimeout(resolve, 0)); // Example delay

            setChangeRequests(auth.filteredData);
        };

        updateChangeRequests();
    }, [auth]);


    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">Error: {error}</div>;
    }

    const thStyle1 = "py-2 px-4 border-b border-r";
    const thStyle2 = "py-2 px-4 border-b border-r whitespace-nowrap";
    const thStyle3 = "py-2 px-30 border-b border-r whitespace-nowrap";
    const thStyle4 = "py-2 px-15 border-b border-r whitespace-nowrap";

    const handleAddChangeRequest = () => {
        navigate("/change-request");
    };

    return (
        <>
            <FilteredBar />
            <div className="h-170 flex flex-col">
                <h1 className="text-2xl font-bold text-center my-4">Change Request Data</h1>

                <div className="flex items-center p-2" style={{ border: '1px solid', borderColor: theme.colors.secondary400, borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                    <button
                        onClick={handleAddChangeRequest}
                        className="hover:bg-blue-700 cursor-pointer font-bold py-2 px-4 rounded m-0"
                        style={{ background: theme.colors.primaryButton, color: theme.colors.primary500 }}
                    >
                        Add Change Request
                    </button>
                    <button
                        onClick={() => setIsVersionHistoryOpen(true)}
                        className="hover:bg-blue-700 cursor-pointer font-bold py-2 px-4 rounded ml-auto flex items-center space-x-2"
                        style={{ background: 'gray', color: '#ffffff' }}
                    >
                        <History size={20} />  {/* Version history icon */}
                        <span>Version History</span>
                    </button>

                </div>

                {changeRequests?.length === 0 ? (
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
                                        <th className={thStyle3}>Change Name</th>
                                        <th className={thStyle1}>Change Sites</th>
                                        <th className={thStyle1}>Common Change</th>
                                        <th className={thStyle1}>Request Date</th>
                                        <th className={thStyle4}>Scheduels</th>
                                        <th className={thStyle2}>Achieve 2 Weeks <div>Request Change</div></th>
                                        <th className={thStyle3}>Description</th>
                                        <th className={thStyle3}>Test Plan</th>
                                        <th className={thStyle3}>Rollback Plan</th>
                                        <th className={thStyle2}>General Information</th>
                                        <th className={thStyle4}>Contact</th>
                                        <th className={thStyle2}>CRQ</th>
                                        <th className={thStyle2}>Requestor</th>
                                        <th className="py-2 px-4 border-b border-r">Approval</th>
                                        <th className={thStyle4}>Change Status</th>
                                        <th className={thStyle2}>Cancel Change Reason Category</th>
                                        <th className={thStyle2}>Cancel Change Reason Description</th>
                                        <th className={thStyle2}>Reschedule Reason</th>
                                        <th className={thStyle2}>Lesson Learnt</th>
                                        <th className={thStyle3}>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {changeRequests?.map((request, index) => {
                                        const processSchedule = (scheduleString) => {
                                            if (!scheduleString) return { scheduleArray: [] }; // Return empty array if no schedule
                                            const parts = scheduleString.split(" "); // Split by space
                                            const scheduleArray = [];
                                            parts.forEach((part) => {
                                                let start = part.split("!")[0];
                                                let end = part.split("!")[1];
                                                scheduleArray.push(`${start} TO ${end}`);
                                            })

                                            return { scheduleArray }; // Always return an object
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
                                                        {aatSchedule.scheduleArray.length > 0 && <p className="text-xs font-semibold text-center">AAT</p>}
                                                        {aatSchedule.scheduleArray.map((item, i) => (
                                                            <div key={i} className="mb-1">
                                                                <p className="p-1 border border-white rounded-md text-xs">{item}</p>
                                                            </div>
                                                        ))}
                                                        {ftmSchedule.scheduleArray.length > 0 && <p className="text-xs font-semibold text-center">FTM</p>}
                                                        {ftmSchedule.scheduleArray.map((item, i) => (
                                                            <div key={i} className="mb-1">
                                                                <p className="p-1 border border-white rounded-md text-xs">{item}</p>
                                                            </div>
                                                        ))}
                                                        {fsstSchedule.scheduleArray.length > 0 && <p className="text-xs font-semibold text-center">FSST</p>}
                                                        {fsstSchedule.scheduleArray.map((item, i) => (
                                                            <div key={i} className="mb-1">
                                                                <p className="p-1 border border-white rounded-md text-xs">{item}</p>
                                                            </div>
                                                        ))}

                                                    </td>
                                                    <td className="py-2 px-4 border-b border-r text-center">{request.achieve_2_week_change_request ? "Yes" : "No"}</td>
                                                    <td className="py-2 px-4 border-b border-r">{request.description}</td>
                                                    <td className="px-2 py-2 border-b border-r text-center">
                                                        <div className="max-h-70 overflow-y-auto border-2 border-gray-300 rounded-lg p-2">
                                                            {request.aat_test_plan !== null && request.aat_test_plan !== '' && <p className="text-xs font-semibold text-center">AAT Test Plan</p>}
                                                            {request.aat_test_plan == null ? "" :
                                                                <div className="mb-1">{request.aat_test_plan}</div>
                                                            }
                                                            {request.ftm_test_plan !== null && request.ftm_test_plan !== '' && <p className="text-xs font-semibold text-center">FTM Test Plan</p>}
                                                            {request.ftm_test_plan == null ? "" :
                                                                <div className="mb-1">{request.ftm_test_plan}</div>
                                                            }
                                                            {request.fsst_test_plan !== null && request.fsst_test_plan !== '' && <p className="text-xs font-semibold text-center">FSST Test Plan</p>}
                                                            {request.fsst_test_plan == null ? "" :
                                                                <div className="mb-1">{request.fsst_test_plan}</div>
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-r">{request.rollback_plan}</td>
                                                    <td className="py-2 px-4 border-b border-r">
                                                        <div className='mb-2'><span className='font-bold text-[#beef70]'>Category: </span><div>{request.category}</div></div>
                                                        <div className='mb-2'><span className='font-bold text-[#beef70]'>Reason: </span><div>{request.reason}</div></div>
                                                        <div className='mb-2'><span className='font-bold text-[#beef70]'>Impact & Priority: </span><div>{request.impact} & {request.priority}</div></div>
                                                    </td>
                                                    <td className="px-2 py-2 border-b border-r text-center">
                                                        <div className="max-h-70 overflow-y-auto border-2 border-gray-300 rounded-lg p-2">
                                                            {request.aat_it_contact !== null && request.aat_it_contact !== ',' && <p className="text-xs font-semibold text-center text-[#beef70]">AAT Contact</p>}
                                                            {request.aat_it_contact == null ? "" :
                                                                request.aat_it_contact.split(',').map((item, i) => (
                                                                    <div key={i} className="mb-1">
                                                                    {item.trim().split('_').join(" ")}
                                                                </div>
                                                                ))}
                                                            {request.ftm_it_contact !== null && request.ftm_it_contact !== ',' && <p className="text-xs font-semibold text-center text-[#beef70]">FTM Contact</p>}
                                                            {request.ftm_it_contact == null ? "" :
                                                                request.ftm_it_contact.split(',').map((item, i) => (
                                                                    <div key={i} className="mb-1">
                                                                    {item.trim().split('_').join(" ")}
                                                                </div>
                                                                ))}
                                                            {request.fsst_it_contact !== null && request.fsst_it_contact !== ',' && <p className="text-xs font-semibold text-center text-[#beef70]">FSST Contact</p>}
                                                            {request.fsst_it_contact == null ? "" :
                                                                request.fsst_it_contact.split(',').map((item, i) => (
                                                                    <div key={i} className="mb-1">
                                                                    {item.trim().split('_').join(" ")}
                                                                </div>
                                                                ))}
                                                            {request.global_team_contact !== null && request.global_team_contact !== ',' && <p className="text-xs font-semibold text-center text-[#beef70]">Global Contact</p>}
                                                            {request.global_team_contact == null ? "" :
                                                                request.global_team_contact.split(',').map((item, i) => (
                                                                    <div key={i} className="mb-1">{item.trim()}</div>
                                                                ))}
                                                            {request.business_team_contact !== null && request.business_team_contact !== ',' && <p className="text-xs font-semibold text-center text-[#beef70]">Business Contact</p>}
                                                            {request.business_team_contact == null ? "" :
                                                                request.business_team_contact.split(',').map((item, i) => (
                                                                    <div key={i} className="mb-1">{item.trim()}</div>
                                                                ))}
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-r text-center">
                                                        {request.aat_crq !== null && request.aat_crq !== ',' && <p className="text-xs font-semibold text-center text-[#beef70]">AAT CRQ</p>}
                                                        {request.aat_crq &&
                                                            request.aat_crq.split(",").map((item, i) => (
                                                                <div key={i} className="mb-1">
                                                                    {item.trim().split('!')[0]}
                                                                    <div>{item.trim().split('!')[1]}</div>
                                                                </div>
                                                            ))}
                                                        {request.ftm_crq !== null && request.ftm_crq !== ',' && <p className="text-xs font-semibold text-center text-[#beef70]">FTM CRQ</p>}
                                                        {request.ftm_crq &&
                                                            request.ftm_crq.split(",").map((item, i) => (
                                                                <div key={i} className="mb-1">
                                                                    {item.trim().split('!')[0]}
                                                                    <div>{item.trim().split('!')[1]}</div>
                                                                </div>
                                                            ))}
                                                        {request.fsst_crq !== null && request.fsst_crq !== ',' && <p className="text-xs font-semibold text-center text-[#beef70]">FSST CRQ</p>}
                                                        {request.fsst_crq &&
                                                            request.fsst_crq.split(",").map((item, i) => (
                                                                <div key={i} className="mb-1">
                                                                    {item.trim().split('!')[0]}
                                                                    <div>{item.trim().split('!')[1]}</div>
                                                                </div>
                                                            ))}
                                                    </td>
                                                    <td className="py-2 px-2 border-b border-r text-center">
                                                        {request.aat_requestor !== null && <p className="font-semibold text-center text-[#beef70]">AAT</p>}
                                                        {request.aat_requestor &&
                                                                <div className="mb-1">
                                                                    {request.aat_requestor}
                                                                </div>
                                                            }
                                                        {request.ftm_requestor !== null && <p className="font-semibold text-center text-[#beef70]">FTM</p>}
                                                        {request.ftm_requestor &&
                                                                <div className="mb-1">
                                                                    {request.ftm_requestor}
                                                                </div>
                                                            }
                                                            {request.fsst_requestor !== null && <p className="font-semibold text-center text-[#beef70]">FSST</p>}
                                                        {request.fsst_requestor &&
                                                                <div className="mb-1">
                                                                    {request.fsst_requestor}
                                                                </div>
                                                            }
                                                    </td>
                                                    {/* <td className="py-2 px-4 border-b border-r">{request.common_crq}</td> */}
                                                    <td className="py-2 px-4 border-b border-r text-center">{request.approval}</td>
                                                    <td className="py-2 px-4 border-b border-r">{request.change_status}</td>
                                                    <td className="py-2 px-4 border-b border-r text-center">{request.cancel_change_category}</td>
                                                    <td className="py-2 px-4 border-b border-r">{request.cancel_change_reason}</td>
                                                    <td className="py-2 px-4 border-b border-r">{request.reschedule_reason}</td>
                                                    <td className="py-2 px-4 border-b border-r">{request.lesson_learnt}</td>
                                                    <td className="py-2 px-4 border-b border-r">{request.remarks}</td>
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
            {/* Version History Drawer */}
            <VHDrawer
                isOpen={isVersionHistoryOpen}
                onClose={() => setIsVersionHistoryOpen(false)}
            />
        </>
    );
}