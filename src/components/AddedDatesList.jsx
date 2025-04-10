import React, { useState, useContext } from "react";
import { X, Edit } from "lucide-react";
import Dialog from "../components/Dialog"; // Assuming you have a Dialog component
import Button from "../components/Button"; // Assuming you have a Button component
import { useTheme } from "styled-components";

function AddedDatesList({ addedDates, label, onRemove, onEdit }) {
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedDate, setEditedDate] = useState({});
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for controlling the dialog
    const theme = useTheme();

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setEditedDate({ ...addedDates[index] });
        setIsEditDialogOpen(true); // Open the dialog
    };

    const handleInputChange = (e, field) => {
        let value = e.target.value;

        if (field === "duration") {
            // Apply validation for duration
            if (!/^\d{0,3}(\.\d{0,1})?$/.test(value)) {
                return; // Reject invalid input
            }
        }

        setEditedDate({ ...editedDate, [field]: value });
    };

    const handleSaveClick = () => {
        if (!editedDate.duration || editedDate.duration.trim() === "") {
            alert("Please enter a duration.");
            return;
        }
            onEdit(editingIndex, editedDate);
            setIsEditDialogOpen(false); // Close the dialog
            setEditingIndex(null);
        };

    const handleCancelClick = () => {
        setIsEditDialogOpen(false); // Close the dialog
        setEditingIndex(null);
    };
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
                            className="p-1 border border-gray-300 rounded bg-white shadow-md flex flex-col items-start justify-between"
                        >
                            {/* Render display values and buttons when not editing */}

                            <div className="text-xs text-gray-700">
                                {date.start}
                                <span className="font-bold"> TO </span>
                                {date.end}
                            </div>
                            <div className="text-sm text-gray-700">
                                <span className="font-semibold">Title:</span> {date.title}
                            </div>
                            <div className="text-sm text-gray-700">
                                <span className="font-semibold">Duration:</span> {date.duration}
                            </div>
                            <div className="text-sm text-gray-700">
                                <span className="font-semibold">Status:</span> {date.changeStatus}
                            </div>
                            <div className="text-sm text-gray-700">
                                <span className="font-semibold">Remark:</span> {date.statusRemark}
                            </div>
                            <div className="flex justify-end text-xs mt-1 w-full">
                                <button
                                    type="button"
                                    onClick={() => handleEditClick(index)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded ml-2"
                                    title="Edit date"
                                >
                                    Edit
                                    {/* <Edit size={16} /> */}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onRemove(index)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded ml-2"
                                    title="Remove date"
                                >
                                    Delete
                                    {/* <X size={16} /> */}
                                </button>
                            </div>


                        </div>
                    ))}
                </div>
            ) : (
                <div>No schedule change for {label}</div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onClose={handleCancelClick}>
                <h4 className="text-md font-semibold mb-2">Edit Schedule Change</h4>
                <div className="mb-1">
                    <label className="block text-sm font-bold mb-1">Title:</label>
                    <input
                        type="text"
                        value={editedDate.title || ""}
                        onChange={(e) => handleInputChange(e, "title")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        maxLength={20}
                        onKeyDown={(e) => {
                            if (e.key === '_' || e.key === '!') {
                                e.preventDefault();
                            }
                        }}
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="mb-1">
                        <label className="block text-sm font-bold mb-1">Start:</label>
                        <input
                            type="datetime-local"
                            value={editedDate.start || ""}
                            onChange={(e) => handleInputChange(e, "start")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-1">
                        <label className="block text-sm font-bold mb-1">End:</label>
                        <input
                            type="datetime-local"
                            value={editedDate.end || ""}
                            onChange={(e) => handleInputChange(e, "end")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>
                <div className="mb-1">
                        <label className="block text-sm font-bold mb-1">Duration:</label>
                        <input
                            type="number"
                            value={editedDate.duration || ""}
                            onChange={(e) => handleInputChange(e, "duration")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            step="0.1"
                            min="0"
                            onKeyDown={e => {e.key === 'e' && e.preventDefault()}}
                        />
                    </div>
                <div className="w-full">
                    <label htmlFor="changeStatus" className="block text-sm font-bold mb-1">Change status</label>
                    <select
                        id="changeStatus"
                        value={editedDate.changeStatus || ""}
                        onChange={(e) => handleInputChange(e, "changeStatus")}
                        style={{ backgroundColor: theme.colors.primary400 }}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="_">_</option>
                        <option value="Completed with no issue">Completed with no issue</option>
                        <option value="On plan">On plan</option>
                        <option value="In progress">In progress</option>
                    </select>
                </div>
                <div className="mb-1">
                    <label className="block text-sm font-bold mb-1">Remark:</label>
                    <input
                        type="text"
                        value={editedDate.statusRemark || ""}
                        onChange={(e) => handleInputChange(e, "statusRemark")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        maxLength={100}
                        onKeyDown={(e) => {
                            if (e.key === '_' || e.key === '!') {
                                e.preventDefault();
                            }
                        }}
                    />
                </div>
                <div className="flex justify-end mt-4">
                    <Button type="button" onClick={handleSaveClick} className="mr-2">
                        Save
                    </Button>
                    <Button type="button" onClick={handleCancelClick}>
                        Cancel
                    </Button>
                </div>
            </Dialog>
        </div>
    );
}

export default AddedDatesList;
