import React, {useState} from 'react';
import Ford_Logo from '../../assets/ford_logo.png';
import StyleText from '../StyleText';
import { Info } from 'lucide-react';
import AppendixDialog from './AppendixDialog';
const Summary = ({ changeRequests, remarksSummary }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const toApprove = changeRequests?.toApprove || [];
    const approved = changeRequests?.approved || [];

    // Function to count occurrences for a specific site
    const countBySite = (site) => {
        return toApprove.filter(request => {
            const sites = request.change_sites.toLowerCase().split(',').map(s => s.trim());
            return sites.includes(site);
        }).length;
    };
    console.log(remarksSummary);
    // Function to count approved requests for a specific site
    const countApprovedBySite = (site) => {
        return toApprove.filter(request => {
            const sites = request.change_sites.toLowerCase().split(',').map(s => s.trim());
            return sites.includes(site) && request.approval === "YES";
        }).length;
    };

    // Function to count completed requests for a specific site
    const countCompletedBySite = (site) => {
        return toApprove.filter(request => {
            const sites = request.change_sites.toLowerCase().split(',').map(s => s.trim());
            return sites.includes(site) && request.change_status === "Completed with no issue";
        }).length;
    };

    // Function to count ongoing requests for a specific site
    const countOngoingBySite = (site) => {
        return approved.filter(request => {
            const sites = request.change_sites.toLowerCase().split(',').map(s => s.trim());
            return sites.includes(site) && (request.change_status === "_" || request.change_status === "Ongoing");
        }).length;
    };

    // Function to count cancelled/postponed requests for a specific site
    const countCancelledPostponedBySite = (site) => {
        return approved.filter(request => {
            const sites = request.change_sites.toLowerCase().split(',').map(s => s.trim());
            return sites.includes(site) && request.change_status === "Postponed/Rejected";
        }).length;
    };

    // Function to count rejected requests for a specific site
    const countRejectedBySite = (site) => {
        return approved.filter(request => {
            const sites = request.change_sites.toLowerCase().split(',').map(s => s.trim());
            return sites.includes(site) && request.approval === "NO";
        }).length;
    };

    const commonCount = toApprove.filter(request => request.change_sites.split(',').length > 1).length;
    const commonApprovedCount = toApprove.filter(request => request.change_sites.split(',').length > 1 && request.approval === "YES").length;
    const commonCompletedCount = toApprove.filter(request => request.change_sites.split(',').length > 1 && request.change_status === "Completed with no issue").length;
    const commonOngoingCount = toApprove.filter(request => request.change_sites.split(',').length > 1 && (request.change_status === "_" || request.change_status === "Ongoing")).length;
    const commonCancelledPostponedCount = toApprove.filter(request => request.change_sites.split(',').length > 1 && request.change_status === "Postponed/Rejected").length;
    const commonRejectedCount = toApprove.filter(request => request.change_sites.split(',').length > 1 && request.approval === "NO").length;
    return (
        <div className="w-full h-full bg-white p-8">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6 text-[#003478] border-b-2 border-gray-300 pb-2">
                Summary
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
                            <td className="border border-gray-300 py-2 text-center">{commonCount}</td>
                            <td className="border border-gray-300 py-2 text-center">{commonApprovedCount}</td>
                            <td className="border border-gray-300 py-2 text-center">{commonCompletedCount}</td>
                            <td className="border border-gray-300 py-2 text-center">{commonOngoingCount}</td>
                            <td className="border border-gray-300 py-2 text-center">{commonCancelledPostponedCount}</td>
                            <td className="border border-gray-300 py-2 text-center">{commonRejectedCount}</td>
                            <td className="border border-gray-300 px-2 py-2">{StyleText(remarksSummary[0]?.common_remark)}</td>
                        </tr>
                        {/* Row 2 */}
                        <tr>
                            <td className="border border-gray-300 px-2 py-2 text-center">AAT</td>
                            <td className="border border-gray-300 py-2 text-center">{countBySite('aat')}</td>
                            <td className="border border-gray-300 py-2 text-center">{countApprovedBySite('aat')}</td>
                            <td className="border border-gray-300 py-2 text-center">{countCompletedBySite('aat')}</td>
                            <td className="border border-gray-300 py-2 text-center">{countOngoingBySite('aat')}</td>
                            <td className="border border-gray-300 py-2 text-center">{countCancelledPostponedBySite('aat')}</td>
                            <td className="border border-gray-300 py-2 text-center">{countRejectedBySite('aat')}</td>
                            <td className="border border-gray-300 px-2 py-2">{StyleText(remarksSummary[0]?.aat_remark)}</td>
                        </tr>
                        {/* Row 3 */}
                        <tr>
                            <td className="border border-gray-300 px-2 py-2 text-center">FTM</td>
                            <td className="border border-gray-300 py-2 text-center">{countBySite('ftm')}</td>
                            <td className="border border-gray-300 py-2 text-center">{countApprovedBySite('ftm')}</td>
                            <td className="border border-gray-300 py-2 text-center">{countCompletedBySite('ftm')}</td>
                            <td className="border border-gray-300 py-2 text-center">{countOngoingBySite('ftm')}</td>
                            <td className="border border-gray-300 py-2 text-center">{countCancelledPostponedBySite('ftm')}</td>
                            <td className="border border-gray-300 py-2 text-center">{countRejectedBySite('ftm')}</td>
                            <td className="border border-gray-300 px-2 py-2">{StyleText(remarksSummary[0]?.ftm_remark)}</td>
                        </tr>
                        {/* Row 4 */}
                        <tr>
                            <td className="border border-gray-300 px-2 py-2 text-center">FSST</td>
                            <td className="border border-gray-300 py-2 text-center">{countBySite('fsst')}</td>
                            <td className="border border-gray-300 py-2 text-center">{countApprovedBySite('fsst')}</td>
                            <td className="border border-gray-300 py-2 text-center">{countCompletedBySite('fsst')}</td>
                            <td className="border border-gray-300 py-2 text-center">{countOngoingBySite('fsst')}</td>
                            <td className="border border-gray-300 py-2 text-center">{countCancelledPostponedBySite('fsst')}</td>
                            <td className="border border-gray-300 py-2 text-center">{countRejectedBySite('fsst')}</td>
                            <td className="border border-gray-300 px-2 py-2">{StyleText(remarksSummary[0]?.fsst_remark)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* Appendix Dialog */}
            <AppendixDialog open={isDialogOpen} onClose={()=>setIsDialogOpen(false)} />
        </div>
    );
};

export default Summary;
