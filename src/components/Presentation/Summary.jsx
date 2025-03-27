import React from 'react';
import Ford_Logo from '../../assets/ford_logo.png';
const Summary = () => {
    return (
        <div className="w-full h-full bg-white p-8">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6 text-[#003478] border-b-2 border-gray-300 pb-2">
                Summary
            </h1>
            <div className='flex absolute top-2 right-2'>
                <img src={Ford_Logo} className='h-5 w-15' />
            </div>
            {/* Table */}
            <div className="w-full max-h-[80%] overflow-y-auto border border-gray-300">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-[#003478] text-center text-xs sticky top-0 z-10">
                        <tr>
                            <th className="border border-gray-300 px-1 py-2">Area</th>
                            <th className="border border-gray-300 py-1">Total change <div>requests</div></th>
                            <th className="bg-green-500 border border-gray-300 px-1 py-2">Approved</th>
                            <th className="bg-blue-700 border border-gray-300 px-1 py-2">Completed</th>
                            <th className="bg-blue-300 border border-gray-300 px-1 py-2">Ongoing</th>
                            <th className="bg-red-700 border border-gray-300 px-1 py-2">Cancelled/<div>Postponed</div></th>
                            <th className="bg-red-700 border border-gray-300 px-1 py-2">Rejected</th>
                            <th className="border border-gray-300 px-10 py-2">Remark</th>
                        </tr>
                    </thead>
                    <tbody className="text-black text-xs font-bold">
                        {/* Row 1 */}
                        <tr>
                            <td className="border border-gray-300 px-2 py-2 text-center">Common</td>
                            <td className="border border-gray-300 py-2 text-center">2</td>
                            <td className="border border-gray-300 py-2 text-center">-</td>
                            <td className="border border-gray-300 py-2 text-center">1</td>
                            <td className="border border-gray-300 py-2 text-center">-</td>
                            <td className="border border-gray-300 py-2 text-center">-</td>
                            <td className="border border-gray-300 py-2 text-center">-</td>
                            <td className="border border-gray-300 px-2 py-2 text-center"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Summary;