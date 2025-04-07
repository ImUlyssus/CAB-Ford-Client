import React, { useState, useEffect } from "react";
import Dialog from "./Dialog";
import { X } from "lucide-react";  // Import cross icon
import { useTheme } from "styled-components";
import AddedCRQsList from "./AddedCRQsList";

function CRQSection({ type, onCRQChange, crqs }) {
    const theme = useTheme();
    const typeLabels = {
        aat: "AAT",
        ftm: "FTM",
        fsst: "FSST",
    };
    const label = typeLabels[type] || "CRQ";
    const [openDialog, setOpenDialog] = useState(false);
    const [crqTitle, setCrqTitle] = useState(""); // State for CRQ Title
    const [crqInput, setCrqInput] = useState("");
    const [addedCRQs, setAddedCRQs] = useState(crqs || []);

    // Helper function to format CRQ entry
    const formatCRQEntry = (title, crq) => {
        // Replace spaces in title with underscores
        const formattedTitle = title.replace(/ /g, "_");
        return `${title}!${crq}`; // Title!CRQ
    };

    // Handle adding CRQ
    const handleAddCRQ = () => {
        if (addedCRQs.length === 10) {
            alert("You can only add up to 10 CRQs.");
        } else {
            if (crqInput.trim() !== "" && crqTitle.trim() !== "") {
                const formattedEntry = formatCRQEntry(crqTitle.trim(), crqInput.trim());
                const updatedCRQs = [...addedCRQs, formattedEntry];
                setAddedCRQs(updatedCRQs);
                setCrqInput("");  // Clear input after adding
                setCrqTitle(""); // Clear title after adding
                onCRQChange(updatedCRQs); // Send updated CRQs to parent
            } else {
                alert("Please enter both CRQ Title and CRQ value.");
            }
        }
        setOpenDialog(false);
    };

    useEffect(() => {
        setAddedCRQs(crqs || []);
    }, [crqs]);

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

                    {/* CRQ Title Input */}
                    <input
                        type="text"
                        placeholder="Enter CRQ Title (max 20 chars)"
                        value={crqTitle}
                        onChange={(e) => {
                            // Disallow underscores
                            if (!e.target.value.includes("_") && e.target.value.length <= 20) {
                                setCrqTitle(e.target.value);
                            }
                        }}
                        className="p-2 border border-gray-300 rounded w-full mb-2"
                        maxLength={20}
                    />

                    {/* CRQ Value Input */}
                    <input
                        type="text"
                        placeholder="Enter CRQ Value (max 15 chars)"
                        value={crqInput}
                        onChange={(e) => setCrqInput(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full mb-4"
                        maxLength={15}
                        onKeyDown={(e) => (e.key === ',' || e.key === ' ') && e.preventDefault()}
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
