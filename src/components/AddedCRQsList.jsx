import React from "react";
import { X } from "lucide-react"; // Import cross icon

function AddedCRQsList({ addedCRQs, label, onRemove }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mt-2">
            <label htmlFor="scheduleChangeDate" style={{ marginLeft: "auto", marginRight: "10rem" }}>
                {label} CRQs:
            </label>

            {/* Display Added CRQs */}
            {addedCRQs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center relative">
                    {addedCRQs.map((crq, index) => (
                        <div
                            key={index}
                            className="p-1 border border-gray-300 rounded bg-white shadow-md flex items-center justify-between"
                        >
                            <div>
                                <div className="w-full text-md text-gray-700">
                                    {crq}
                                </div>
                            </div>

                            {/* Cross Icon for Removing CRQ */}
                            <button
                                type='button'
                                onClick={() => onRemove(index)}
                                className="bg-red-500 hover:bg-red-600 text-white p-1 rounded ml-2"
                                title="Remove CRQ"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No CRQ added for {label}</div>
            )}
        </div>
    );
}

export default AddedCRQsList;
