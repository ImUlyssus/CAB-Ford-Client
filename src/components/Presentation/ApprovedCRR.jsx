import React from 'react';
import Ford_Logo from '../../assets/ford_logo.png';
// Function to format the date
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

const ApprovedCRR = ({ changeRequests }) => {
    if (!changeRequests || !changeRequests.approved) {
        return <div className="w-full h-full bg-white p-8">No approved change requests available.</div>;
    }

    return (
        <div className="w-full h-full bg-white p-8">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6 text-[#003478] border-b-2 border-gray-300 pb-2">
                Approved Change Requests Status (Postponed/Cancelled)
            </h1>
            <div className='flex absolute top-2 right-2'>
                <img src={Ford_Logo} className='h-5 w-15' alt="Ford Logo" />
            </div>
            {/* Table */}
            <div className="w-full max-h-[80%] overflow-y-auto border border-gray-300">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-[#003478] text-center text-xs sticky top-0 z-10">
                        <tr>
                            <th className="border border-gray-300 px-2 py-2">Status</th>
                            <th className="border border-gray-300 px-2 py-2">Change name</th>
                            <th className="border border-gray-300 px-4 py-2">Site</th>
                            <th className="border border-gray-300 px-4 py-2">Schedule (Thailand GMT+7)</th>
                            <th className="border border-gray-300 px-4 py-2">Contact</th>
                            <th className="border border-gray-300 px-4 py-2">Comment / Issue</th>
                        </tr>
                    </thead>
                    <tbody className="text-black text-xs">
                        {changeRequests?.approved
                            ?.filter(request => request.final_status === "Postponed/Canceled") // Filtering step
                            .map((request, index) => (
                                <tr key={index}>
                                    <td className="bg-red-700 text-white border border-gray-300 text-center">R</td>
                                    <td className="border border-gray-300 px-2 py-2 align-top min-w-[200px] max-w-[300px]">{request.change_name}</td>
                                    <td className="border border-gray-300 py-2 text-center align-top">
                                        {request.change_sites.split(',').join(", ").toUpperCase()}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-2 text-center min-w-[210px] max-w-[300px] align-top">
                                        <div className="flex flex-col justify-start gap-4">
                                            {[
                                                ...(request?.aat_schedule_change || []).map(s => ({ ...s, site: 'AAT' })),
                                                ...(request?.ftm_schedule_change || []).map(s => ({ ...s, site: 'FTM' })),
                                                ...(request?.fsst_schedule_change || []).map(s => ({ ...s, site: 'FSST' })),
                                            ].map((schedule, index2) => (
                                                <div key={index2} className="space-y-1">
                                                    <div className="font-bold text-blue-500">{schedule.schedule_title}</div>
                                                    <div>{formatDate(schedule.startdate)} - </div>
                                                    <div> {formatDate(schedule.enddate)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="border border-gray-300 text-center min-w-[100px] max-w-[130px]">
                                        {request?.aat_it_contact?.length > 0 &&
                                            <>
                                                <div className='font-bold text-blue-500'>AAT</div>
                                                <div>{request.aat_it_contact.split(',')[0].replace(/_/g, ' ')}</div>
                                                <div className='mb-2'>{request.aat_it_contact.split(',')[1]}</div>
                                            </>
                                        }
                                        {request?.ftm_it_contact?.length > 0 &&
                                            <>
                                                <div className='font-bold text-blue-500'>FTM</div>
                                                <div>{request.ftm_it_contact.split(',')[0].replace(/_/g, ' ')}</div>
                                                <div className='mb-2'>{request.ftm_it_contact.split(',')[1]}</div>
                                            </>
                                        }
                                        {request?.fsst_it_contact?.length > 0 &&
                                            <>
                                                <div className='font-bold text-blue-500'>FSST</div>
                                                <div>{request.fsst_it_contact.split(',')[0].replace(/_/g, ' ')}</div>
                                                <div className='mb-2'>{request.fsst_it_contact.split(',')[1]}</div>
                                            </>
                                        }
                                        {request?.business_team_contact?.length > 0 &&
                                            <>
                                                <div className='font-bold text-blue-500'>FSST</div>
                                                <div>{request.business_team_contact.split(',')[0].replace(/_/g, ' ')}</div>
                                                <div className='mb-2'>{request.business_team_contact.split(',')[1]}</div>
                                            </>
                                        }
                                        {request?.global_team_contact?.length > 0 &&
                                            <>
                                                <div className='font-bold text-blue-500'>FSST</div>
                                                <div>{request.global_team_contact.split(',')[0].replace(/_/g, ' ')}</div>
                                                <div className='mb-2'>{request.global_team_contact.split(',')[1]}</div>
                                            </>
                                        }
                                    </td>
                                    <td className="border border-gray-300 py-2 text-center min-w-[200px] max-w-[300px] align-top">
                                        <div className="flex flex-col justify-start gap-4">
                                            {[...(request?.aat_schedule_change || []), ...(request?.ftm_schedule_change || []), ...(request?.fsst_schedule_change || [])]
                                                .map((schedule, index2) => (
                                                    <div key={index2} className="space-y-1">
                                                        <div className='font-bold text-blue-500'>{schedule.status}</div>
                                                        <div>{schedule.comment}</div>
                                                    </div>
                                                ))}
                                        </div>
                                    </td>

                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="flex justify-center text-black gap-4 absolute bottom-2 justify-center w-full">
                <p className="font-semibold mb-2"><span className='px-2 py-1 bg-blue-700 text-white mr-2'>C</span>Completed</p>
                <p className="font-semibold mb-2"><span className='px-2 py-1 bg-blue-400 text-white mr-2'>O</span>Approved & ongoing implementation</p>
                <p className="font-semibold mb-2"><span className='px-2 py-1 bg-red-700 text-white mr-2'>R</span>Postponed / Cancelled</p>
            </div>
        </div>
    );
};

export default ApprovedCRR;
