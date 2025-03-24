import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Dialog from './CustomDateDialog'; 
import DataComparison from './DataComparison';
import DataDialog from './VHDataDialog';
import DeletedData from './DeletedData';
// import DataDetail from './Sheets/DataDetail';
const VHDrawer = ({ isOpen, onClose }) => {
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [oldRequest, setOldRequest] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDataDialogOpen, setIsDataDialogOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  useEffect(() => {
    const handleVersionHistory = async () => {
      if (!selectedStartDate || !selectedEndDate) return;

      // const formattedStartDate = selectedStartDate;
      // const formattedEndDate = selectedEndDate;
      const formattedStartDate = `${selectedStartDate} 00:00:00`;
      const formattedEndDate = `${selectedEndDate} 23:59:59`;
      console.log("Selected Dates:", formattedStartDate, formattedEndDate);

      try {
        const response = await axiosPrivate.get("/change-requests/version-history", {
          params: {
            start: formattedStartDate,
            end: formattedEndDate,
          },
        });
        setOldRequest(response.data);
        console.log("📥 Custom Date Data:", response.data);
      } catch (err) {
        console.error("❌ Error fetching custom date data:", err.response ? err.response.data : err.message);
      }
    };

    if (isOpen) {
      handleVersionHistory(); // Call function when drawer opens AND dates update
    }
  }, [isOpen, selectedStartDate, selectedEndDate, axiosPrivate]);

  const handleSaveDates = (startDate, endDate) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    setIsDialogOpen(false);
  };
  const handleSeeDetails = async (id, updated_date, request, is_deleted) => {
    console.log("See details clicked for ID:", id, "Updated Date:", updated_date);

    try {
      // Send GET request with id and updated_date as query parameters
      const response = await axiosPrivate.get(`/change-requests/details/${id}`, {
        params: { updated_date, is_deleted }
      });

      console.log("📄 Details Data:", response.data);
      if(!is_deleted){
        setSelectedData([request, response.data]);
      }else{
        setSelectedData([response.data]);
      }
      setIsDataDialogOpen(true);
      // Handle the response data (e.g., display in modal)
    } catch (err) {
      console.error("❌ Error fetching details:", err.response ? err.response.data : err.message);
    }
  };

  const handleGoToVersion = () => {
    console.log("See details clicked");
  }
  return (
    <>
      {/* Overlay to close the drawer when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Version History Drawer */}
      <div
        className={`fixed top-20 right-0 h-full w-1/3 bg-gray-900 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          } z-50`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Version History</h2>
          <div>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="hover:bg-blue-700 font-bold py-2 px-4 rounded mr-2 border-1 border-[#beef00] text-[#beef00]"
            >
              Custom Date
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              ✕ {/* Close button */}
            </button>
          </div>
        </div>

        {/* Version history content */}
        <div className="p-2 max-h-screen overflow-y-auto pb-50">
          <ul className="space-y-2">
            {oldRequest?.length === 0 ? (
              <li className="text-gray-400">No version history found. Please select a date from custom date to see version history.</li>
            ) : (
              <>
                <p className="text-gray-400">Showing version history from {selectedStartDate} 00:00:00 to {selectedEndDate} 23:59:59</p>
                {oldRequest.map((request) => (
                  <div
                    key={request.id}
                    className="border-1 p-4 rounded-lg shadow-md flex flex-col gap-2"
                    style={{ borderColor: request.is_deleted ? "#D84040" : "#beef00" }}
                  >
                    {/* Text Row */}
                    <p>
                      {request.who?.toUpperCase()} {request.is_deleted ? "deleted" : "updated"} record{" "}
                      {request.original_id} with change name '{request.change_name}' at{" "}
                      {request.updated_date.split(" ")[0]} {request.updated_date.split(" ")[1]}.
                    </p>

                    {/* Buttons Row - Pushed to Right */}
                    <div className="flex justify-end gap-2">
                      <button className="btn-primary text-sm px-3 py-1 border-1 border-gray-500 rounded-sm" onClick={() => handleSeeDetails(request.original_id, request.updated_date, request, request.is_deleted)}>See details</button>
                      <button className="btn-secondary text-sm text-blue-500 px-3 py-1 border-1 border-blue-500 rounded-sm" onClick={handleGoToVersion}>Go to this version</button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Dialog for selecting custom dates */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveDates}
      />
      {/* Dialog */}
      {selectedData?.length > 1 ? <DataDialog open={isDataDialogOpen} onClose={() => setIsDataDialogOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">
          Change request updated rows comparison with its previous value
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          {selectedData?.length ? (
            <DataComparison requests={selectedData} />
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
        </ul>
      </DataDialog>:
      <DataDialog open={isDataDialogOpen} onClose={() => setIsDataDialogOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">
          Deleted data
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          {selectedData?.length ? (
            <DeletedData requests={selectedData} />
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
        </ul>
      </DataDialog>
      }
    </>
  );
};

export default VHDrawer;