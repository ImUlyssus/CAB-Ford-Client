import { useState } from "react";
import { useTheme } from "styled-components";

const GlobalTeamContact = () => {
    const theme = useTheme();
    const [showPersonDialog, setShowPersonDialog] = useState(false);
    const [showGlobalDialog, setShowGlobalDialog] = useState(false);

    // State to store input values
    const [position, setPosition] = useState("");
    const [personName, setPersonName] = useState("");
    const [personCdsid, setPersonCdsid] = useState("");
    const [teamCdsid, setTeamCdsid] = useState("");

    // State to store the global team contact as a single string
    const [globalTeamContact, setGlobalTeamContact] = useState("");
    const [contactType, setContactType] = useState(""); // 'person' or 'team'

    // Handle saving person contact
    const savePersonContact = () => {
        const contact = `Position: ${position}, Name: ${personName}, CDSID: ${personCdsid}`;
        setGlobalTeamContact(contact);
        setContactType("person");
    };

    // Handle saving global contact
    const saveGlobalContact = () => {
        setGlobalTeamContact(`Team CDSID: ${teamCdsid}`);
        setContactType("team");
    };

    // Handle remove contact
    const removeContact = () => {
        setGlobalTeamContact("");
        setContactType("");
        setPosition("");
        setPersonName("");
        setPersonCdsid("");
        setTeamCdsid("");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2 relative">
            <label htmlFor="fsstSiteItContact" style={{ marginLeft: "auto", marginRight: "10rem" }}>
                Global team Contact:
            </label>


            {!globalTeamContact ? (
                <>
                    {/* Button for Person Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setShowPersonDialog(true)}
                            className={`p-2 cursor-pointer border border-gray-300 rounded w-full hover:bg-white hover:text-black`}
                        >
                            Person contact
                        </button>

                        {/* Button for Global Contact */}
                        <button
                            type="button"
                            onClick={() => setShowGlobalDialog(true)}
                            className={`p-2 cursor-pointer border border-gray-300 rounded w-full hover:bg-white hover:text-black`}
                        >
                            Global contact
                        </button>
                    </div>
                </>
            ) : contactType === "person" ? (
                <div className="grid grid-cols-1 gap-4" style={{ color: theme.colors.primary500 }}>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <div className="relative">
                            {/* <label className="absolute -top-2.5 left-2 text-xs px-1 text-gray-500">Position</label> */}
                            <input
                                type="text"
                                value={position}
                                readOnly
                                className="p-2 border border-gray-300 rounded w-full bg-gray-100"
                            />
                        </div>
                        <div className="relative">
                            {/* <label className="absolute -top-2.5 left-2 text-xs px-1 text-gray-500">Name</label> */}
                            <input
                                type="text"
                                value={personName}
                                readOnly
                                className="p-2 border border-gray-300 rounded w-full bg-gray-100"
                            />
                        </div>
                        <div className="relative">
                            {/* <label className="absolute -top-1 text-xs px-1 text-black">CDSID</label> */}
                            <input
                                type="text"
                                value={personCdsid}
                                readOnly
                                className="p-2 border border-gray-300 rounded w-full bg-gray-100"
                            />
                        </div>
                        <button
                            onClick={removeContact}
                            className="p-2 border border-red-500 text-red-500 rounded hover:bg-red-600 hover:text-white"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4" style={{ color: theme.colors.primary500 }}>
                    <div className="grid grid-cols-2 gap-2 items-center">
                        <input
                            type="text"
                            value={teamCdsid}
                            readOnly
                            className="p-2 border border-gray-300 rounded w-full bg-gray-100"
                        />
                        <button
                            onClick={removeContact}
                            className="p-2 border border-red-500 text-red-500 rounded hover:bg-red-600 hover:text-white"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}

            {/* Dialog for Person Contact */}
            {showPersonDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-90">
                    <div className={`p-6 rounded shadow-lg relative w-11/12 md:w-1/2`}
                        style={{ backgroundColor: theme.colors.primary400 }}>
                        <h2 className="text-xl mb-4">Enter Person Contact</h2>
                        <input
                            type="text"
                            placeholder="Position"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Name"
                            value={personName}
                            onChange={(e) => setPersonName(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full mb-2"
                        />
                        <input
                            type="text"
                            placeholder="CDSID"
                            value={personCdsid}
                            onChange={(e) => setPersonCdsid(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full mb-2"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    savePersonContact();
                                    setShowPersonDialog(false);
                                }}
                                className="px-4 py-2 bg-[#beef00] rounded hover:bg-green-600"
                                style={{ color: theme.colors.primary500 }}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setShowPersonDialog(false)}
                                className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-600 hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dialog for Global Contact */}
            {showGlobalDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-90">
                    <div className={`p-6 rounded shadow-lg relative w-11/12 md:w-1/2`}
                        style={{ backgroundColor: theme.colors.primary400 }}>
                        <h2 className="text-xl mb-4">Enter Team Contact</h2>
                        <input
                            type="text"
                            placeholder="Team CDSID"
                            value={teamCdsid}
                            onChange={(e) => setTeamCdsid(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    saveGlobalContact();
                                    setShowGlobalDialog(false);
                                }}
                                className="px-4 py-2 bg-[#beef00] rounded hover:bg-green-600"
                                style={{ color: theme.colors.primary500 }}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setShowGlobalDialog(false)}
                                className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-600 hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalTeamContact;
