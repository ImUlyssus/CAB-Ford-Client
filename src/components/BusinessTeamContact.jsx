import { useState, useEffect } from "react";
import { useTheme } from "styled-components";

const BusinessTeamContact = ({ onContactChange, businessContact, isUpdate }) => {
  const theme = useTheme();
  const [showPersonDialog, setShowPersonDialog] = useState(false);

  // State to store input values for person contact
  const [position, setPosition] = useState("");
  const [personName, setPersonName] = useState("");
  const [personCdsid, setPersonCdsid] = useState("");

  // State to store the contact as a single string
  const [businessTeamContact, setBusinessTeamContact] = useState("");

  useEffect(() => {
    if (Array.isArray(businessContact) && businessContact.length > 0 && isUpdate) {
      setPosition(businessContact[0] ?? "");  // If exists, use it; otherwise, set to empty string
      setPersonName(businessContact[1] ?? "");
      setPersonCdsid(businessContact[2] ?? "");
    }
  }, [businessContact]);

  // Handle saving person contact
  const savePersonContact = () => {
    if (position.trim() !== "" || personName.trim() !== "" || personCdsid.trim() !== "") {
      const contact = position.trim() + "," + personName.trim() + "," + personCdsid.trim();
      setBusinessTeamContact(contact);
      onContactChange(contact);
    } else {
      alert("Please fill in at least one field before saving.");
    }
  };

  // Handle remove contact
  const removeContact = () => {
    setBusinessTeamContact("");
    setPosition("");
    setPersonName("");
    setPersonCdsid("");
    onContactChange("");
  };

  // Handle closing the dialog (including clearing values)
  const closePersonDialog = () => {
    setShowPersonDialog(false);
    setPosition("");
    setPersonName("");
    setPersonCdsid("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center m-2 relative">
      <label htmlFor="fsstSiteItContact" style={{ marginLeft: "auto", marginRight: "10rem" }}>
        Business Team Contact:
      </label>

      {!businessTeamContact && !(position || personName || personCdsid) ? (

        <button
          type="button"
          onClick={() => setShowPersonDialog(true)}
          className={`p-2 cursor-pointer border border-gray-300 rounded w-full hover:bg-white hover:text-black`}
        >
          Add Contact
        </button>
      ) : (
        <div className="grid grid-cols-1 gap-4" style={{ color: theme.colors.primary500 }}>
          <div className="grid grid-cols-4 gap-2 items-center">
            <div className="relative">
              <input
                type="text"
                value={position}
                readOnly
                className="p-2 border border-gray-300 rounded w-full bg-gray-100"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                value={personName}
                readOnly
                className="p-2 border border-gray-300 rounded w-full bg-gray-100"
              />
            </div>
            <div className="relative">
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
      )}

      {/* Dialog for Person Contact */}
      {showPersonDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-90">
          <div className={`p-6 rounded shadow-lg relative w-11/12 md:w-1/2`}
            style={{ backgroundColor: theme.colors.primary400 }}>
            <h2 className="text-xl mb-4">Enter Contact</h2>
            <input
              type="text"
              placeholder="Position (50 characters max)"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full mb-2"
              maxLength={50}
              onKeyDown={(e) => e.key === ',' && e.preventDefault()}
            />
            <input
              type="text"
              placeholder="Name (50 characters max)"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full mb-2"
              maxLength={50}
              onKeyDown={(e) => e.key === ',' && e.preventDefault()}
            />
            <input
              type="text"
              placeholder="CDSID (50 characters max)"
              value={personCdsid}
              onChange={(e) => setPersonCdsid(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full mb-2"
              maxLength={50}
              onKeyDown={(e) => (e.key === ',' || e.key === ' ') && e.preventDefault()}
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
                onClick={closePersonDialog} // Use the new closePersonDialog function
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

export default BusinessTeamContact;
