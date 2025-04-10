import { useState } from "react";
import Three_Dates_Usage from "../assets/three_dates_usage.jpg";
import { HelpCircle } from "lucide-react";
import Dialog from "../components/Dialog";
import Button from "../components/Button";
function CustomDateDialog({ open, onClose, onSave }) {
    const [startDate, setStartDate] = useState("");
    const [presentationDate, setPresentationDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dateError, setDateError] = useState("");
    const [helpDialogOpen, setHelpDialogOpen] = useState(false);

    const validateDates = (start, presentation, end) => {
        if (!start || !presentation || !end) {
            return "Please fill in all dates.";
        }

        const startObj = new Date(start);
        const presentationObj = new Date(presentation);
        const endObj = new Date(end);

        if (startObj >= presentationObj) {
            return "Start date must be before presentation date.";
        }

        if (presentationObj >= endObj) {
            return "Presentation date must be before end date.";
        }

        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
        if ((presentationObj - startObj) < oneDay || (endObj - presentationObj) < oneDay) {
            return "Each date must be at least one day apart.";
        }

        return ""; // No error
    };

    const handleSave = () => {
        const error = validateDates(startDate, presentationDate, endDate);
        if (error) {
            setDateError(error);
            return;
        }

        setDateError(""); // Clear any previous errors
        onSave(startDate, presentationDate, endDate);
        onClose(); // Close the dialog after saving
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-70 ${open ? '' : 'hidden'}`}>
        <div
            className="sticky rounded-lg top-0 w-11/12 md:w-1/3 z-10 p-4 border-b bg-gray-800"
            style={{
                maxHeight: "60vh",
                maxWidth: "50%",
                overflowY: "auto",
            }}
        >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>
                <div className="flex items-center justify-center mb-4">
                <h2 className="text-lg font-bold text-center">Select Date Range</h2>
                <button
                        type='button'
                        onClick={() => setHelpDialogOpen(true)}
                        className="ml-2 cursor-pointer text-green-700 hover:text-gray-700 focus:outline-none"
                    >
                        <HelpCircle size={20}/>
                    </button>
                    </div>
                {/* Start Date Picker */}
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>

                {/* Presentation Date Picker */}
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Presentation Date:</label>
                    <input
                        type="date"
                        value={presentationDate}
                        onChange={(e) => setPresentationDate(e.target.value)}
                        min={startDate}
                        className="border p-2 rounded w-full"
                    />
                </div>
                {/* End Date Picker */}
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={presentationDate}
                        className="border p-2 rounded w-full"
                    />
                </div>

                {dateError && <p className="text-red-500 mb-4">{dateError}</p>}

                {/* Save Button */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSave}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
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
            {/* Help Dialog */}
            <Dialog open={helpDialogOpen} onClose={() => setHelpDialogOpen(false)}>
                <h4 className="text-md font-semibold mb-2">Three Dates Usage</h4>
                <p className="text-sm mb-4">
                    The presentation is mainly divided into two parts:
                    the first part is for change requests that are already approved and the second part is for change requests that are not yet approved.
                    Three dates are used to filter the data as in the following photo.
                </p>
                <img src={Three_Dates_Usage} alt="Three Date Usage Information" className="w-full h-auto mb-2" />
                <div className="flex justify-end">
                    <Button onClick={() => setHelpDialogOpen(false)} className="">Close</Button>
                </div>
            </Dialog>
        </div>
    );
}

export default CustomDateDialog;
