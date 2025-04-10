import React from 'react';
import Ford_Logo from '../../assets/ford_logo.png';
const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-US', { // Or your desired locale
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Bangkok' // Set the timezone
    });

    return formatter.format(date);
};
const ForApprovalAAT = ({changeRequests}) => {
    return (
        <div className="w-full h-full bg-white p-8">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6 text-[#003478] border-b-2 border-gray-300 pb-2">
                <span className='text-red-500'>AAT</span> - Change Requests for Approval
            </h1>
            <div className='flex absolute top-2 right-2'>
                <img src={Ford_Logo} className='h-5 w-15' />
            </div>
            {/* Table */}
            <div className="w-full max-h-[80%] overflow-y-auto border border-gray-300">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-[#003478] text-center text-xs sticky top-0 z-10">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Change name</th>
                            <th className="border border-gray-300 px-4 py-2">Schedule (Thailand GMT+7)</th>
                            <th className="border border-gray-300 px-7 py-2">Description</th>
                            <th className="border border-gray-300 px-4 py-2">Test plan</th>
                            <th className="border border-gray-300 px-4 py-2">Rollback plan</th>
                            <th className="border border-gray-300 px-1 py-2">Impact/<div>Priority</div></th>
                            <th className="border border-gray-300 px-4 py-2">Contact</th>
                            <th className="border border-gray-300 px-4 py-2">Reference #</th>
                            <th className="border border-gray-300 px-1 py-2">Approval</th>
                        </tr>
                    </thead>
                    <tbody className="text-black text-xs">
                        {changeRequests.toApprove.filter(request => request.change_sites.includes('aat') && !request.change_sites.includes('ftm') && !request.change_sites.includes('fsst')).map((request, index) => (
                            <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2 align-top min-w-[140px] max-w-[160px]">{request.change_name}</td>
                            <td className="border border-gray-300 px-2 py-2 text-center max-w-[120px] align-top">
                                <div className="flex flex-col justify-start gap-4">
                                    {[
                                        ...(request?.aat_schedule_change || []).map(s => ({ ...s, site: 'AAT' })),
                                    ].map((schedule, index2) => (
                                        <div key={index2} className="space-y-1">
                                            <div className="font-bold text-blue-500">{schedule.schedule_title}</div>
                                            <div>{formatDate(schedule.startdate)} - </div>
                                            <div> {formatDate(schedule.enddate)}</div>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="border border-gray-300 px-2 min-w-[160px] max-w-[180px]">{request.description}</td>
                            <td className="border border-gray-300 px-2 min-w-[160px] max-w-[180px]">
                                {request.aat_test_plan?.length > 0 &&
                                <div className='mb-2'>
                                    <div className="font-bold text-blue-500">AAT</div>
                                    <div className="text-sm">{request.aat_test_plan}</div>
                                </div>}
                            </td>
                            <td className="border border-gray-300 text-center">{request?.rollback_plan || ""}</td>
                            <td className="border border-gray-300 text-center align-top p-1">{request.impact}/<div>{request.priority}</div></td>
                            <td className="border border-gray-300 text-center min-w-[100px] max-w-[130px]">
                                {request?.aat_it_contact?.length > 0 &&
                                    <>
                                        <div className='font-bold text-blue-500'>AAT</div>
                                        <div>{request.aat_it_contact.split(',')[0].replace(/_/g, ' ')}</div>
                                        <div className='mb-2'>{request.aat_it_contact.split(',')[1]}</div>
                                    </>
                                }
                                {request?.business_team_contact?.length > 0 &&
                                    <>
                                        <div className='font-bold text-blue-500'>Business</div>
                                        <div>{request.business_team_contact.split(',')[0].replace(/_/g, ' ')}</div>
                                        <div className='mb-2'>{request.business_team_contact.split(',')[1]}</div>
                                    </>
                                }
                                {request?.global_team_contact?.length > 0 &&
                                    <>
                                        <div className='font-bold text-blue-500'>Global</div>
                                        <div>{request.global_team_contact.split(',')[0].replace(/_/g, ' ')}</div>
                                        <div className='mb-2'>{request.global_team_contact.split(',')[1]}</div>
                                    </>
                                }
                            </td>
                            <td className="border border-gray-300 text-center min-w-[100px] max-w-[130px] align-top">
                                {request?.aat_crq?.length > 1 &&
                                    <>
                                        <div className='font-bold text-blue-500'>AAT</div>
                                        <div>{request.aat_crq.split(',')[0].replace(/_/g, ' ')}</div>
                                        <div className='mb-2'>{request.aat_crq.split(',')[1]}</div>
                                    </>
                                }
                            </td>
                            <td className="border border-gray-300 text-center align-top">{request.approval}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ForApprovalAAT;