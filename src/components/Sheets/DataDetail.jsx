import React, { useEffect, useState, useContext } from "react";
import { useTheme } from "styled-components";
export default function DataDetail({ requests }) {
    // const [changeRequests, setChangeRequests] = useState([]);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const [selectedRequest, setSelectedRequest] = useState(null);

    const thStyle1 = "py-2 px-4 border-b border-r";
    const thStyle2 = "py-2 px-15 border-b border-r whitespace-nowrap";
    const thStyle3 = "py-2 px-30 border-b border-r whitespace-nowrap";
    const thStyle4 = "py-2 px-8 border-b border-r whitespace-nowrap";


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
                            <table className="w-full border border-gray-300 rounded-lg shadow-md text-[8px]" style={{ backgroundColor: theme.colors.primary400 }}>
                                <thead className="sticky top-0 bg-gray-800 z-10">
                                    <tr>
                                        {/* <th className={thStyle1}>Change Record</th> */}
                                        <th className={thStyle2}>Change Name</th>
                                        <th className={thStyle1}>Change Sites</th>
                                        {/* <th className={thStyle2}>Common Change</th> */}
                                        {/* <th className={thStyle1}>Request Change</th> */}
                                        <th className={thStyle4}>Schedules</th>
                                        <th className={thStyle2}>Description</th>
                                        <th className={thStyle2}>Test Plan</th>
                                        <th className={thStyle1}>Rollback Plan</th>
                                        <th className={thStyle1}>General Information</th>
                                        <th className={thStyle2}>Contact</th>
                                        <th className={thStyle2}>CRQ</th>
                                        <th className={thStyle2}>Requestor</th>
                                        <th className="py-2 px-4 border-b border-r">Approval</th>
                                        <th className={thStyle2}>Change Status</th>
                                        <th className={thStyle2}>Cancel Change Reason Category</th>
                                        <th className={thStyle3}>Cancel Change Reason Description</th>
                                        <th className={thStyle1}>Reschedule Reason</th>
                                        <th className={thStyle3}>Lesson Learnt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request, index) => {
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
                                                    key={request.id}
                                                    className="hover:bg-gray-100 hover:text-black text-[8px]">
                                                    {/* <td className="py-2 px-4 border-b border-r text-center">{index + 1}</td> */}
                                                    <td className="py-2 px-1 border-b border-r">{request.change_name}</td>
                                                    <td className="py-2 px-1 border-b border-r text-center">
                                                        {String(request.change_sites || "")
                                                            .split(",")
                                                            .join(", ")
                                                            .toUpperCase()}
                                                    </td>
                                                    <td className="py-2 px-2 border-b border-r text-center">
                                                        {aatSchedule.scheduleArray.length > 0 &&
                                                            <>
                                                                <p className="font-semibold text-center text-[#beef70]">AAT</p>
                                                                {aatSchedule.scheduleArray.map((item, i) => (
                                                                    <div key={i} className="mb-1">
                                                                        <p className="p-1 border border-white rounded-md w-[100px]">{item}</p>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        }
                                                        {ftmSchedule.scheduleArray.length > 0 &&
                                                            <>
                                                                <p className="font-semibold text-center text-[#beef70]">FTM</p>
                                                                {ftmSchedule.scheduleArray.map((item, i) => (
                                                                    <div key={i} className="mb-1">
                                                                        <p className="p-1 border border-white rounded-md w-[100px]">{item}</p>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        }
                                                        {fsstSchedule.scheduleArray.length > 0 &&
                                                            <>
                                                                <p className="font-semibold text-center text-[#beef70]">FSST</p>
                                                                {fsstSchedule.scheduleArray.map((item, i) => (
                                                                    <div key={i} className="mb-1">
                                                                        <p className="p-1 border border-white rounded-md w-[100px]">{item}</p>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        }

                                                    </td>
                                                    <td className="py-2 px-2 border-b border-r">{request.description}</td>
                                                    <td className="px-2 py-2 border-b border-r">
                                                        <div className="max-h-70 overflow-y-auto border-2 border-gray-300 rounded-lg p-2">
                                                            {request.aat_test_plan !== null && request.aat_test_plan !== '' && <p className="font-semibold text-[#beef70] text-center">AAT Test Plan</p>}
                                                            {request.aat_test_plan == null ? "" :
                                                                <div className="mb-1">{request.aat_test_plan}</div>
                                                            }
                                                            {request.ftm_test_plan !== null && request.ftm_test_plan !== '' && <p className="font-semibold text-[#beef70] text-center">FTM Test Plan</p>}
                                                            {request.ftm_test_plan == null ? "" :
                                                                <div className="mb-1">{request.ftm_test_plan}</div>
                                                            }
                                                            {request.fsst_test_plan !== null && request.fsst_test_plan !== '' && <p className="font-semibold text-[#beef70] text-center">FSST Test Plan</p>}
                                                            {request.fsst_test_plan == null ? "" :
                                                                <div className="mb-1">{request.fsst_test_plan}</div>
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-2 border-b border-r">{request.rollback_plan}</td>
                                                    <td className="py-2 px-2 border-b border-r">
                                                        <div className='mb-2'><span className='font-bold text-[#beef70]'>Category: </span><div>{request.category}</div></div>
                                                        <div className='mb-2'><span className='font-bold text-[#beef70]'>Reason: </span><div>{request.reason}</div></div>
                                                        <div className='mb-2'><span className='font-bold text-[#beef70]'>Impact & Priority: </span><div>{request.impact} & {request.priority}</div></div>
                                                    </td>
                                                    <td className="px-2 py-2 border-b border-r text-center">
                                                        <div className="max-h-70 overflow-y-auto border-2 border-gray-300 rounded-lg p-2">
                                                            {request.aat_it_contact !== null && request.aat_it_contact !== ',' && <p className="font-semibold text-center text-[#beef70]">AAT Contact</p>}
                                                            {request.aat_it_contact == null ? "" :
                                                                request.aat_it_contact.split(',').map((item, i) => (
                                                                    <div key={i} className="mb-1">{item.trim()}</div>
                                                                ))}
                                                            {request.ftm_it_contact !== null && request.ftm_it_contact !== ',' && <p className="font-semibold text-center text-[#beef70]">FTM Contact</p>}
                                                            {request.ftm_it_contact == null ? "" :
                                                                request.ftm_it_contact.split(',').map((item, i) => (
                                                                    <div key={i} className="mb-1">{item.trim()}</div>
                                                                ))}
                                                            {request.fsst_it_contact !== null && request.fsst_it_contact !== ',' && <p className="font-semibold text-center text-[#beef70]">FSST Contact</p>}
                                                            {request.fsst_it_contact == null ? "" :
                                                                request.fsst_it_contact.split(',').map((item, i) => (
                                                                    <div key={i} className="mb-1">{item.trim()}</div>
                                                                ))}
                                                            {request.global_team_contact !== null && request.global_team_contact !== ',' && <p className="font-semibold text-center text-[#beef70]">Global Contact</p>}
                                                            {request.global_team_contact == null ? "" :
                                                                request.global_team_contact.split(',').map((item, i) => (
                                                                    <div key={i} className="mb-1">{item.trim()}</div>
                                                                ))}
                                                            {request.business_team_contact !== null && request.business_team_contact !== ',' && <p className="font-semibold text-center text-[#beef70]">Business Contact</p>}
                                                            {request.business_team_contact == null ? "" :
                                                                request.business_team_contact.split(',').map((item, i) => (
                                                                    <div key={i} className="mb-1">{item.trim()}</div>
                                                                ))}
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-2 border-b border-r text-center">
                                                        {request.aat_crq !== null && request.aat_crq !== ',' && <p className="font-semibold text-center text-[#beef70]">AAT CRQ</p>}
                                                        {request.aat_crq &&
                                                            request.aat_crq.split(",").map((item, i) => (
                                                                <div key={i} className="mb-1">
                                                                    {item.trim().split('!')[0]}
                                                                    <div>{item.trim().split('!')[1]}</div>
                                                                </div>
                                                            ))}
                                                        {request.ftm_crq !== null && request.ftm_crq !== ',' && <p className="font-semibold text-center text-[#beef70]">FTM CRQ</p>}
                                                        {request.ftm_crq &&
                                                            request.ftm_crq.split(",").map((item, i) => (
                                                                <div key={i} className="mb-1">
                                                                    {item.trim().split('!')[0]}
                                                                    <div>{item.trim().split('!')[1]}</div>
                                                                </div>
                                                            ))}
                                                        {request.fsst_crq !== null && request.fsst_crq !== ',' && <p className="font-semibold text-center text-[#beef70]">FSST CRQ</p>}
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
                                                    <td className="py-2 px-2 border-b border-r text-center">{request.approval}</td>
                                                    <td className="py-2 px-2 border-b border-r">{request.change_status}</td>
                                                    <td className="py-2 px-2 border-b border-r text-center">{request.cancel_change_category}</td>
                                                    <td className="py-2 px-2 border-b border-r">{request.cancel_change_reason}</td>
                                                    <td className="py-2 px-2 border-b border-r">{request.reschedule_reason}</td>
                                                    <td className="py-2 px-2 border-b border-r">{request.lesson_learnt}</td>
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