import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
const VHDrawer = ({ isOpen, onClose }) => {
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const startDate = auth.startDateFinal;
  const endDate = auth.endDateFinal;
  const [oldRequest, setOldRequest] = useState([]);
  // useEffect(()=>{
  //   console.log(auth.startDateFinal, auth.endDateFinal);
  // },[auth.startDateFinal, auth.endDateFinal]);
  console.log(startDate, endDate);
  useEffect(() => {
    const handleVersionHistory = async () => {
      if (!startDate || !endDate) return;

      const formattedStartDate = startDate;
      const formattedEndDate = endDate;  // ✅ Use the correct end date

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
      handleVersionHistory(); // ✅ Call function when drawer opens AND dates update
    }
  }, [isOpen, auth]); // ✅ Now it reacts to updated dates

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
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✕ {/* Close button */}
          </button>
        </div>

        {/* Version history content */}
        <div className="p-4 max-h-screen overflow-y-auto pb-50">
          <ul className="space-y-3">
            {oldRequest?.length === 0 ? (
              <li className="text-gray-400">No version history found</li>
            ) : (
              oldRequest.map((request) => (
                <div
                  key={request.id}
                  className="border-2 p-4 rounded-lg shadow-md"
                  style={{ borderColor: request.is_deleted ? "#D84040" : "#beef00" }}
                >
                  <p>
                    {request.who?.toUpperCase()} {request.is_deleted ? "deleted" : "updated"} record{" "}
                    {request.original_id} with change name '{request.change_name}' at{" "}
                    {request.updated_date.split("T")[0]} {request.updated_date.split("T")[1].split(".")[0]}.
                  </p>
                </div>
              ))
            )}
          </ul>
        </div>

      </div>
    </>
  );
};

export default VHDrawer;
