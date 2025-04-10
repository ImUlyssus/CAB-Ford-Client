import React, { useEffect, useState, useContext } from "react";
import { useTheme } from "styled-components";
export default function DeletedData({requests}) {
    // const [changeRequests, setChangeRequests] = useState([]);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const [selectedRequest, setSelectedRequest] = useState(null);

    const thStyle1 = "py-2 px-4 border-b border-r";
    const thStyle2 = "py-2 px-4 border-b border-r whitespace-nowrap";
    const thStyle3 = "py-2 px-30 border-b border-r whitespace-nowrap";


    return (
        <>
        <div className="h-170 flex flex-col">

            {requests.length === 0 ? (
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
                            <thead className="sticky top-0 bg-gray-800 z-10">
                                <tr>
                                    <th className={thStyle1}>Category</th>
                                    <th className={thStyle1}>Reason</th>
                                    <th className={thStyle1}>Impact</th>
                                    <th className={thStyle1}>Priority</th>
                                    <th className={thStyle3}>Change Name</th>
                                    <th className={thStyle2}>Change Sites</th>
                                    <th className={thStyle2}>Common Change</th>
                                    <th className={thStyle1}>Request Date</th>
                                    <th className={thStyle1}>FTM Schedule Change</th>
                                    <th className={thStyle1}>AAT Schedule Change</th>
                                    <th className={thStyle1}>FSST Schedule Change</th>
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
                                    <th className={thStyle3}>Lesson Learnt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request, index) => {
                                    const processSchedule = (scheduleString) => {
                                        if (!scheduleString) return { scheduleArray: [] }; // Return empty array if no schedule
                                        const parts = scheduleString.split(" "); // Split by space
                                        const scheduleArray = [];
                                    
                                        for (let i = 0; i < parts.length; i += 2) {
                                            if (i + 1 < parts.length) { // Ensure there's a valid start, end, and duration
                                                let start = parts[i].replace(/-/g, "/").replace(/['"]/g, ""); // Replace - with /
                                                let end = parts[i + 1].replace(/-/g, "/").replace(/['"]/g, "");
                                    
                                                scheduleArray.push(`${start} TO ${end}`);
                                            }
                                        }
                                    
                                        return { scheduleArray }; // Always return an object
                                    };
                                    const ftmSchedule = processSchedule(request.ftm_schedule_change);
                                    const aatSchedule = processSchedule(request.aat_schedule_change);
                                    const fsstSchedule = processSchedule(request.fsst_schedule_change);

                                    return (
                                        <>
                                            <tr
                                                key={request.id}
                                                className="hover:bg-gray-100 hover:text-black">
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
                                                <td className="py-2 px-4 border-b border-r">{request.lesson_learnt}</td>
                                            </tr>
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
        </>
    );
}