import React from 'react';

const ApprovedCRR = () => {
    return (
        <div className="w-full h-full bg-white p-8">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6 text-[#003478] border-b-2 border-gray-300 pb-2">
                Approved Change Requests Status (Postponed/Cancelled)
            </h1>

            {/* Table */}
            <div className="w-full max-h-[80%] overflow-y-auto border border-gray-300">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-[#003478] text-center text-xs sticky top-0 z-10">
                        <tr>
                            <th className="border border-gray-300 px-2 py-2">Status</th>
                            <th className="border border-gray-300 px-4 py-2">Change name</th>
                            <th className="border border-gray-300 px-4 py-2">Site</th>
                            <th className="border border-gray-300 px-4 py-2">Schedule (Thailand GMT+7)</th>
                            <th className="border border-gray-300 px-4 py-2">Contact</th>
                            <th className="border border-gray-300 px-4 py-2">Comment / Issue</th>
                        </tr>
                    </thead>
                    <tbody className="text-black text-xs">
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">R</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">C</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">C</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">C</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">C</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">C</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">C</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">C</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">C</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">C</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">C</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">C</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">C</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">C</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">C</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                        {/* Row 1 */}
                        <tr>
                            <td className="bg-red-700 text-white border border-gray-300 text-center">C</td>
                            <td className="border border-gray-300 px-4 py-2">Microsoft SQL Database Security Patch update</td>
                            <td className="border border-gray-300 text-center">FTM</td>
                            <td className="border border-gray-300 px-4 text-center">Sat, 17 Aug 24 13:00 – 19:00</td>
                            <td className="border border-gray-300 text-center">Suiya (SKAMMEEJ)</td>
                            <td className="border border-gray-300 text-center">Complete with no issue</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="flex justify-center text-black gap-4 absolute bottom-2 justify-center w-full">
                <p className="font-semibold mb-2"><span className='px-2 py-1 bg-blue-900 text-white mr-2'>C</span>Completed</p>
                <p className="font-semibold mb-2"><span className='px-2 py-1 bg-blue-300 text-white mr-2'>O</span>Approved & ongoing implementation</p>
                <p className="font-semibold mb-2"><span className='px-2 py-1 bg-red-700 text-white mr-2'>R</span>Postponed / Cancelled</p>
            </div>
        </div>
    );
};

export default ApprovedCRR;