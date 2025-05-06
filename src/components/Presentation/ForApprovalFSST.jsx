import React, { useState, useEffect } from 'react';
import Ford_Logo from '../../assets/ford_logo.png';
import { Info } from 'lucide-react';
import AppendixDialog from './AppendixDialog';
import StyleText from '../StyleText';
import useAxiosPrivate from "../../hooks/useAxiosPrivate"; // Import the hook

const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Bangkok'
    });

    return formatter.format(date);
};

const ForApprovalFSST = ({ changeRequests }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    const [approvals, setApprovals] = useState({});

    useEffect(() => {
        const initialApprovals = {};
        const filteredRequests = changeRequests?.toApprove?.filter(request =>
            request.change_sites && // Added check for existence
            request.change_sites.includes('fsst') &&
            !request.change_sites.includes('aat') &&
            !request.change_sites.includes('ftm')
        ) || [];

        filteredRequests.forEach((request) => {
            initialApprovals[request.id] = request.approval;
        });

        setApprovals(initialApprovals);

    }, [changeRequests]);

    const handleApprovalChange = async (requestId, newValue) => {
        setApprovals(prevApprovals => ({
            ...prevApprovals,
            [requestId]: newValue
        }));

        try {
            const response = await axiosPrivate.put('/change-requests/update-approval', {
                id: requestId,
                approval: newValue
            });

            console.log('Approval updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating approval:', error);
            setApprovals(prevApprovals => {
                 // Simple revert attempt
                 return {
                     ...prevApprovals,
                     [requestId]: prevApprovals[requestId] // Revert to value before optimistic update
                 };
            });
        }
    };

    const filteredChangeRequests = changeRequests?.toApprove?.filter(request =>
        request.change_sites && // Added check for existence
        request.change_sites.includes('fsst') &&
        !request.change_sites.includes('aat') &&
        !request.change_sites.includes('ftm')
    ) || [];


    return (
        <div className="w-full h-full bg-white p-8">
            <h1 className="text-2xl font-bold mb-6 text-[#003478] border-b-2 border-gray-300 pb-2">
                <span className='text-red-500'>FSST</span> - Change Requests for Approval
            </h1>
            <div className='absolute top-2 right-2 items-center'>
                <img src={Ford_Logo} className='h-5 w-15 mr-2' alt="Ford Logo" />
                <button
                    onClick={()=>setIsDialogOpen(true)}
                    className="flex ml-auto mb-2 mr-2 mt-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                    aria-label="Show Appendix Information"
                >
                    <Info size={15} />
                </button>
            </div>
            <div className="w-full max-h-[80%] overflow-y-auto border border-gray-300">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-[#003478] text-center text-xs sticky top-0 z-10">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Change name</th>
                            <th className="border border-gray-300 px-2 py-2 min-w-[120px]">Schedule (Thailand GMT+7)</th>
                            <th className="border border-gray-300 px-4 py-2">Description</th>
                            <th className="border border-gray-300 px-4 py-2">Test plan</th>
                            <th className="border border-gray-300 px-2 py-2">Rollback plan</th>
                            <th className="border border-gray-300 px-1 py-2">Impact/<div>Priority</div></th>
                            <th className="border border-gray-300 px-4 py-2">Contact</th>
                            <th className="border border-gray-300 px-4 py-2">Reference #</th>
                            <th className="border border-gray-300 px-1 py-2">Approval</th>
                        </tr>
                    </thead>
                    <tbody className="text-black text-xs">
                        {filteredChangeRequests.map((request, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2 align-top min-w-[140px] max-w-[160px]">{StyleText(request.change_name)}</td>
                                <td className="border border-gray-300 px-2 py-2 text-center max-w-[120px] align-top">
                                    <div className="flex flex-col justify-start gap-4">
                                        {[
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
                                <td className="border border-gray-300 px-2 align-top">{StyleText(request.description)}</td>
                                <td className="border border-gray-300 px-2 align-top">
                                    {request.fsst_test_plan?.length > 0 &&
                                    <div className='mb-2'>
                                        <div className="font-bold text-blue-500 text-center">FSST</div>
                                        <div className="text-sm">{StyleText(request.fsst_test_plan)}</div>
                                    </div>}
                                </td>
                                <td className="border border-gray-300 align-top p-1">{StyleText(request?.rollback_plan) || ""}</td>
                                <td className="border border-gray-300 text-center align-top p-1">{request.impact}/<div>{request.priority}</div></td>
                                <td className="border border-gray-300 text-center min-w-[100px] max-w-[130px] align-top">
                                    {request?.fsst_it_contact?.length > 0 &&
                                        <>
                                            <div className='font-bold text-blue-500'>FSST</div>
                                            <div>{request.fsst_it_contact.split(',')[0].replace(/_/g, ' ')}</div>
                                            <div className='mb-2'>{request.fsst_it_contact.split(',')[1]}</div>
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
                                <td className="border border-gray-300 text-center min-w-[100px] max-w-[130px] align-top p-1">
                                {request?.fsst_crq?.length > 1 &&
                                    <>
                                        <div className='font-bold text-blue-500'>FSST</div>
                                        {request.fsst_crq.split(',').map((crq, index) => (
                                            <div key={index} className='mb-2'>
                                                <div>{crq.split('!')[0].replace(/_/g, ' ')}</div>
                                            <div className='mb-2'>{crq.split('!')[1]}</div>
                                            </div>
                                        ))}
                                        </>
                                    }
                                </td>
                                <td className="p-2 border border-gray-300 text-center align-top">
                                    <select
                                        value={approvals[request.id] || ''}
                                        onChange={(e) => handleApprovalChange(request.id, e.target.value)}
                                        className="border rounded px-2 py-1 text-xs"
                                    >
                                        {(!['YES', 'NO', 'Waiting'].includes(request.approval) && request.approval) && (
                                            <option value={request.approval} disabled>
                                                {request.approval === 'Waiting' ? "HOLD" : request.approval}
                                            </option>
                                        )}
                                        <option value="YES">YES</option>
                                        <option value="NO">NO</option>
                                        <option value="Waiting">HOLD</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <AppendixDialog open={isDialogOpen} onClose={()=>setIsDialogOpen(false)} />
        </div>
    );
};

export default ForApprovalFSST;
