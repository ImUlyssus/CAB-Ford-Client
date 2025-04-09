import React, { useEffect, useState, useContext } from "react";
import { useTheme } from "styled-components";
export default function DataComparison({ requests }) {
    // const [changeRequests, setChangeRequests] = useState([]);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const [selectedRequest, setSelectedRequest] = useState(null);

    const thStyle1 = "py-2 px-4 border-b border-r";
    const thStyle2 = "py-2 px-4 border-b border-r whitespace-nowrap";
    const thStyle3 = "py-2 px-30 border-b border-r whitespace-nowrap";
    const matchColStyle = "py-2 px-30 border-b border-r whitespace-nowrap bg-[#beef30] text-black";

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
    const ftmScheduleThead1 = processSchedule(requests[0].ftm_schedule_change);
    const aatScheduleThead1 = processSchedule(requests[0].aat_schedule_change);
    const fsstScheduleThead1 = processSchedule(requests[0].fsst_schedule_change);
    const ftmScheduleThead2 = processSchedule(requests[1].ftm_schedule_change);
    const aatScheduleThead2 = processSchedule(requests[1].aat_schedule_change);
    const fsstScheduleThead2 = processSchedule(requests[1].fsst_schedule_change);
    const durationDifference = (aatScheduleThead1.totalDuration + ftmScheduleThead1.totalDuration + fsstScheduleThead1.totalDuration) !== 
                               (aatScheduleThead2.totalDuration + ftmScheduleThead2.totalDuration + fsstScheduleThead2.totalDuration);
    const firstRowPlannedUnplanned = requests[0].achieve_2_week_change_request ? "YES" : "NO";
    const secondRowPlannedUnplanned = requests[1].achieve_2_week_change_request ? "YES" : "NO";
    const plannedUnplanned = firstRowPlannedUnplanned !== secondRowPlannedUnplanned;
    const firstRowChangeStatus = requests[0].change_status == null || requests[0].change_status == "" ? "NULL" : "NOT NULL";
    const secondRowChangeStatus = requests[1].change_status == null || requests[1].change_status == "" ? "NULL" : "NOT NULL";
    const changeStatusCheck = firstRowChangeStatus !== secondRowChangeStatus;
    const firstRowAATItContact = requests[0].aat_it_contact == ',' || requests[0].aat_it_contact == null || requests[0].aat_it_contact == "" ? "NULL" : "NOT NULL";
    const secondRowAATItContact = requests[1].aat_it_contact == ',' || requests[1].aat_it_contact == null || requests[1].aat_it_contact == "" ? "NULL" : "NOT NULL";
    const aatItContactCheck = firstRowAATItContact !== secondRowAATItContact;
    const firstRowFSSTItContact = requests[0].fsst_it_contact == ',' || requests[0].fsst_it_contact == null || requests[0].fsst_it_contact == "" ? "NULL" : "NOT NULL";
    const secondRowFSSTItContact = requests[1].fsst_it_contact == ',' || requests[1].fsst_it_contact == null || requests[1].fsst_it_contact == "" ? "NULL" : "NOT NULL";
    const fsstItContactCheck = firstRowFSSTItContact !== secondRowFSSTItContact;
    const firstRowFTMItContact = requests[0].ftm_it_contact == ',' || requests[0].ftm_it_contact == null || requests[0].ftm_it_contact == "" ? "NULL" : "NOT NULL";
    const secondRowFTMItContact = requests[1].ftm_it_contact == ',' || requests[1].ftm_it_contact == null || requests[1].ftm_it_contact == "" ? "NULL" : "NOT NULL";
    const ftmItContactCheck = firstRowFTMItContact !== secondRowFTMItContact;
    return (
        <>
            <div className="h-170 flex flex-col">

                {requests?.length === 0 ? (
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
                            <table className="w-full border rounded-lg shadow-md text-sm" style={{ backgroundColor: theme.colors.primary400 }}>
                                <thead className="sticky top-0 bg-gray-800 z-10">
                                    <tr>
                                        <th className={thStyle1}>Comparison</th>
                                        <th className={requests[0].category !== requests[1].category ? matchColStyle : thStyle1}>Category</th>
                                        <th className={requests[0].reason !== requests[1].reason ? matchColStyle : thStyle1}>Reason</th>
                                        <th className={requests[0].impact !== requests[1].impact ? matchColStyle : thStyle1}>Impact</th>
                                        <th className={requests[0].priority !== requests[1].priority ? matchColStyle : thStyle1}>Priority</th>
                                        <th className={requests[0].change_name !== requests[1].change_name ? matchColStyle : thStyle3}>Change Name</th>
                                        <th className={requests[0].change_sites !== requests[1].change_sites ? matchColStyle : thStyle2}>Change Sites</th>
                                        <th className={requests[0].common_change !== requests[1].common_change ? matchColStyle : thStyle2}>Common Change</th>
                                        <th className={requests[0].request_change_date !== requests[1].request_change_date ? matchColStyle : thStyle1}>Request Change</th>
                                        <th className={requests[0].ftm_schedule_change !== requests[1].ftm_schedule_change ? matchColStyle : thStyle1}>FTM Schedule Change</th>
                                        <th className={requests[0].aat_schedule_change !== requests[1].aat_schedule_change ? matchColStyle : thStyle1}>AAT Schedule Change</th>
                                        <th className={requests[0].fsst_schedule_change !== requests[1].fsst_schedule_change ? matchColStyle : thStyle1}>FSST Schedule Change</th>
                                        <th className={plannedUnplanned ? matchColStyle : thStyle1}>Achieve 2 Weeks Request Change</th>
                                        <th className={requests[0].description !== requests[1].description ? matchColStyle : thStyle3}>Description</th>
                                        <th className={requests[0].test_plan !== requests[1].test_plan ? matchColStyle : thStyle3}>Test Plan</th>
                                        <th className={requests[0].rollback_plan !== requests[1].rollback_plan ? matchColStyle : thStyle3}>Rollback Plan</th>
                                        <th className={ftmItContactCheck ? matchColStyle : thStyle2}>FTM Site IT Contact</th>
                                        <th className={aatItContactCheck ? matchColStyle : thStyle2}>AAT Site IT Contact</th>
                                        <th className={fsstItContactCheck ? matchColStyle : thStyle2}>FSST Site IT Contact</th>
                                        <th className={requests[0].global_team_contact !== requests[1].global_team_contact ? matchColStyle : thStyle2}>Global Team Contact</th>
                                        <th className={requests[0].business_team_contact !== requests[1].business_team_contact ? matchColStyle : thStyle2}>Business Team Contact</th>
                                        <th className={requests[0].ftm_crq !== requests[1].ftm_crq ? matchColStyle : thStyle2}>FTM CRQ</th>
                                        <th className={requests[0].aat_crq !== requests[1].aat_crq ? matchColStyle : thStyle2}>AAT CRQ</th>
                                        <th className={requests[0].fsst_crq !== requests[1].fsst_crq ? matchColStyle : thStyle2}>FSST CRQ</th>
                                        <th className={requests[0].approval !== requests[1].approval ? matchColStyle : "py-2 px-4 border-b border-r"}>Approval</th>
                                        <th className={changeStatusCheck ? matchColStyle : thStyle3}>Change Status</th>
                                        <th className={requests[0].cancel_change_category !== requests[1].cancel_change_category ? matchColStyle : thStyle2}>Cancel Change Reason Category</th>
                                        <th className={requests[0].cancel_change_reason !== requests[1].cancel_change_reason ? matchColStyle : thStyle3}>Cancel Change Reason Description</th>
                                        <th className={requests[0].reschedule_reason !== requests[1].reschedule_reason ? matchColStyle : thStyle3}>Reschedule Reason</th>
                                        <th className={requests[0].lesson_learnt !== requests[1].lesson_learnt ? matchColStyle : thStyle3}>Lesson Learnt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request, index) => {
                                        const ftmSchedule = processSchedule(request.ftm_schedule_change);
                                        const aatSchedule = processSchedule(request.aat_schedule_change);
                                        const fsstSchedule = processSchedule(request.fsst_schedule_change);

                                        return (
                                            <>
                                                <tr
                                                    key={request.id}
                                                    className="hover:bg-gray-100 hover:text-black">
                                                    <td className="py-2 px-4 border-b border-r text-center">{index == 0 ? 'Before' : 'After'}</td>
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