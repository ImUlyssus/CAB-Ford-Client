import React from 'react';
import Ford_Logo from '../../assets/ford_logo.png';
const ApprovedCRC = ({ changeRequests }) => {
    if (!changeRequests || !changeRequests.approved) {
        return <div className="w-full h-full bg-white p-8">No approved change requests available.</div>;
    }
    return (
        <div className="w-full h-full bg-white p-8">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6 text-[#003478] border-b-2 border-gray-300 pb-2">
                Approved Change Requests Status (Completed)
            </h1>
            <div className='flex absolute top-2 right-2'>
                <img src={Ford_Logo} className='h-5 w-15' />
            </div>
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
                        {changeRequests?.approved
  ?.filter(request => request.change_status === "Completed with no issue") // Filtering step
  .map((request, index) => {
    return (
      <tr key={index}>
        <td className="border border-gray-300 bg-blue-700 text-center text-white">C</td>
        <td className="border border-gray-300 px-4 py-2">{request.change_name}</td>
        <td className="border border-gray-300 text-center">
          {request.change_sites.split(',').join(", ").toUpperCase()}
        </td>
        <td className="border border-gray-300 px-4 text-center">
          {request.aat_schedule_change && <div>{request.aat_schedule_change}</div>}
          {request.ftm_schedule_change && <div>{request.ftm_schedule_change}</div>}
          {request.fsst_schedule_change && <div>{request.fsst_schedule_change}</div>}
        </td>
        <td className="border border-gray-300 text-center">
          {request.aat_it_contact && <div>{request.aat_it_contact}</div>}
          {request.ftm_it_contact && <div>{request.ftm_it_contact}</div>}
          {request.fsst_it_contact && <div>{request.fsst_it_contact}</div>}
        </td>
        <td className="border border-gray-300 text-center">
          {request.change_status && <div>{request.change_status}</div>}
        </td>
      </tr>
    );
  })}

                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="flex justify-center text-black gap-4 absolute bottom-2 justify-center w-full">
                <p className="font-semibold mb-2"><span className='px-2 py-1 bg-blue-700 text-white mr-2'>C</span>Completed</p>
                <p className="font-semibold mb-2"><span className='px-2 py-1 bg-blue-300 text-white mr-2'>O</span>Approved & ongoing implementation</p>
                <p className="font-semibold mb-2"><span className='px-2 py-1 bg-red-700 text-white mr-2'>R</span>Postponed / Cancelled</p>
            </div>
        </div>
    );
};

export default ApprovedCRC;