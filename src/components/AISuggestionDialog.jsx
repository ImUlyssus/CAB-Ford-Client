import React, { useState } from "react";
import Dialog from "../components/Dialog";
import Button from "../components/Button";

function AISuggestionDialog({ isOpen, onClose, onDescriptionChange, value }) {
    const [input1, setInput1] = useState("");
    const [input2, setInput2] = useState("");
    const [input3, setInput3] = useState("");
    const [input4, setInput4] = useState("");
    const [firstRevise, setFirstRevise] = useState(true);

    const handleInputChange = (setter) => (e) => {
        const value = e.target.value;
        // const ampersandCount = (value.match(/&/g) || []).length;
        setter(value);
    };
    if(value){
        const [input1Value, input2Value, input3Value, input4Value] = value.split("!");
        setInput1(input1Value);
        setInput2(input2Value);
        setInput3(input3Value);
        setInput4(input4Value);
    }

    const handleGetAISuggestion = async () => {
        setFirstRevise(false);
        onDescriptionChange("This is a dummy AI suggestion.");
    };

    const handleUseThis = () => {
        const combinedInput = `${input1}!${input2}!${input3}!${input4}`;
        console.log("Combined Input:", combinedInput);
        onDescriptionChange(combinedInput);
        // onClose();
    }

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <h4 className="text-2xl font-semibold text-[#beef70] text-center mb-2">Add detail and revise with AI</h4>
            <div>
                <label className="block text-sm font-medium mb-1">Request detail:</label>
                <textarea
                    value={input1}
                    onChange={handleInputChange(setInput1)}
                    rows={2}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    maxLength={400}
                    placeholder="Enter request detail (400 characters max)"
                    onKeyDown={(e) => e.key === '!' && e.preventDefault()}
                />

                <label className="block text-sm font-medium mb-1">Risk:</label>
                <textarea
                    value={input2}
                    onChange={handleInputChange(setInput2)}
                    rows={2}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    maxLength={400}
                    placeholder="Enter risk (400 characters max)"
                />

                <label className="block text-sm font-medium mb-1">Impact:</label>
                <textarea
                    value={input3}
                    onChange={handleInputChange(setInput3)}
                    rows={2}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    maxLength={400}
                    placeholder="Enter impact (400 characters max)"
                />

                <label className="block text-sm font-medium mb-1">Reference sites (Optional):</label>
                <textarea
                    value={input4}
                    onChange={handleInputChange(setInput4)}
                    rows={2}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    maxLength={250}
                    placeholder="Enter reference sites (250 characters max)"
                />

                <div className="flex justify-end w-full mt-4">
                    <Button type="button" onClick={handleGetAISuggestion} className="cursor-pointer">
                        {firstRevise ? "Revise with AI" : "Revise again"}
                    </Button>
                    <button type="button" onClick={handleUseThis} className="bg-[#beef00] text-black ml-2 px-4 py-2 rounded hover:bg-[#beef80] transition cursor-pointer">
                        Use this
                    </button>
                </div>
            </div>
        </Dialog>
    );
}

export default AISuggestionDialog;
