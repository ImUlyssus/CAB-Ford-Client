import React from "react";
import { X } from "lucide-react";  // Import cross icon

function AddedDatesList({ addedDates, label, onRemove }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start m-2">
            <label
                htmlFor="scheduleChangeDate"
                style={{ marginLeft: "auto", marginRight: "10rem" }}
            >
                {label} schedule date(s):
            </label>

            {/* Display Added Dates */}
            {addedDates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center relative">
                    {addedDates.map((date, index) => (
                        <div
                            key={index}
                            className="p-1 border border-gray-300 rounded bg-white shadow-md flex items-center justify-between"
                        >
                            <div>
                                <div className="text-xs text-gray-700">
                                    {date.start}
                                    <span className="font-bold"> TO </span>
                                    {date.end}
                                </div>
                                {date.duration && (
                                    <div className="text-sm text-gray-700">
                                        <span className="font-semibold">Duration:</span> {date.duration}
                                    </div>
                                )}
                            </div>

                            {/* Cross Icon for Removing Date */}
                            <button
                                onClick={() => onRemove(index)}
                                className="bg-red-500 hover:bg-red-600 text-white p-1 rounded ml-2"
                                title="Remove date"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No schedule change for {label}</div>
            )}
        </div>
    );
}

export default AddedDatesList;