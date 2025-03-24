import React, { useState, useEffect } from "react";

function Dialog({ open, onClose, onSave }) {
    if (!open) return null;

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Disable the "Today" button in the date picker
    useEffect(() => {
        const disableTodayButton = () => {
            const dateInputs = document.querySelectorAll('input[type="date"]');
            dateInputs.forEach((input) => {
                input.addEventListener("focus", () => {
                    const picker = input._flatpickr; // Access the Flatpickr instance (if available)
                    if (picker) {
                        picker.set("disableMobile", true); // Disable mobile picker
                        picker.set("allowInput", true); // Allow manual input
                    }
                });
            });
        };

        disableTodayButton();
    }, []);

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        if (endDate && e.target.value > endDate) {
            setEndDate(""); // Reset end date if it is earlier than the new start date
        }
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-70">
            <div
                // className="p-6 rounded shadow-lg relative w-11/12 md:w-1/3 bg-gray-800"
                className="sticky rounded-lg top-0 w-11/12 md:w-1/3 z-10 p-4 border-b bg-gray-800"
                style={{
                    maxHeight: "60vh",
                    maxWidth: "50%",
                    overflowY: "auto",
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>

                <h2 className="text-lg font-bold mb-4 text-center">Select Date Range</h2>

                {/* Start Date Picker */}
                <label className="block mb-2 font-semibold">Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="border p-2 rounded w-full"
                />

                {/* End Date Picker */}
                <label className="block mt-4 mb-2 font-semibold">End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    min={startDate} // Prevent selecting an earlier date than startDate
                    className="border p-2 rounded w-full"
                    disabled={!startDate} // Disable endDate input until startDate is selected
                />

                {/* Save Button */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => onSave(startDate, endDate)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                        disabled={!startDate || !endDate}
                    >
                        Save
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dialog;