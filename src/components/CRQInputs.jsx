import React, { useState } from "react";
import Dialog from "./Dialog";
import { X } from "lucide-react";  // Import cross icon
import { useTheme } from "styled-components";
import AddedCRQsList from "./AddedCRQsList";
function CRQSection({ type, onCRQChange }) {
    const theme = useTheme();
    const typeLabels = {
        aat: "AAT",
        ftm: "FTM",
        fsst: "FSST",
    };
    const label = typeLabels[type] || "CRQ";
    const [openDialog, setOpenDialog] = useState(false);
    const [crqInput, setCrqInput] = useState("");
    const [addedCRQs, setAddedCRQs] = useState([]); // Store added CRQs

    // Handle adding CRQ
    const handleAddCRQ = () => {
        if (crqInput.trim() !== "") {
            const updatedCRQs = [...addedCRQs, crqInput.trim()];
            setAddedCRQs(updatedCRQs);
            setCrqInput("");  // Clear input after adding
            onCRQChange(updatedCRQs); // Send updated CRQs to parent
        }
        setOpenDialog(false);
    };

    // Handle removing CRQ
    const handleRemoveCRQ = (index) => {
        const updatedCRQs = addedCRQs.filter((_, i) => i !== index);
        setAddedCRQs(updatedCRQs);
        onCRQChange(updatedCRQs); // Send updated CRQs to parent
    };

    return (
        <div className="m-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <label htmlFor={`${type}CRQ`} style={{ marginLeft: "auto", marginRight: "10rem" }}>
                    Add {label} CRQ:
                </label>
                <div className="grid grid-cols-1">
                    <button
                        type="button"
                        onClick={() => setOpenDialog(true)}
                        className="p-2 cursor-pointer border border-gray-300 rounded w-full hover:bg-white hover:text-black"
                    >
                        Add CRQ
                    </button>
                </div>
            </div>

            {/* Display added CRQs with improved UI */}
            {addedCRQs.length > 0 && (
                <AddedCRQsList
                    addedCRQs={addedCRQs}
                    label={label}
                    onRemove={handleRemoveCRQ} // Pass the remove handler
                />
            )}

            {/* Dialog for Adding CRQ */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-90">
                <div className={`p-6 rounded shadow-lg relative`} style={{ backgroundColor: theme.colors.primary400 }}>
                    <h2 className="text-xl mb-4">Enter {label} CRQ</h2>
                    <input
                        type="text"
                        placeholder="Enter CRQ"
                        value={crqInput}
                        onChange={(e) => setCrqInput(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full mb-4"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={handleAddCRQ}
                            className="px-4 py-2 bg-[#beef00] rounded hover:bg-green-600"
                            style={{ color: theme.colors.primary500 }}
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setOpenDialog(false)}
                            className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-600 hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default CRQSection;
