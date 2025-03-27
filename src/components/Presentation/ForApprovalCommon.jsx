import React from 'react';
import Ford_Logo from '../../assets/ford_logo.png';
const ForApprovalCommon = () => {
    return (
        <div className="w-full h-full bg-white p-8">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6 text-[#003478] border-b-2 border-gray-300 pb-2">
                <span className='text-red-500'>Common</span> - Change Requests for Approval
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
                        {/* Row 1 */}
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">Sat, 17 Aug 24 <div>13:00 – 19:00</div></td>
                            <td className="border border-gray-300 px-2">Hi, how are you? I hope you are well. I have a girlfriend. Do you? NO? Haha! Not surprised.</td>
                            <td className="border border-gray-300 px-2">This is test plan. this is test plan.</td>
                            <td className="border border-gray-300 text-center">Rollback plan nakub</td>
                            <td className="border border-gray-300 text-center">Minor/<div>Medium</div></td>
                            <td className="border border-gray-300 text-center">AAT Site IT Kyaw (KSWARHEI)</td>
                            <td className="border border-gray-300 px-2 text-center">CRQ392797439820923</td>
                            <td className="border border-gray-300 text-center"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ForApprovalCommon;