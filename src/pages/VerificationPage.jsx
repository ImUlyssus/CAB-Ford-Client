import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerificationPage() {
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    const labelStyle = "text-right pr-20";
    const inputStyle = "w-80 p-2 border rounded bg-gray-800 text-white text-center tracking-widest text-xl";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (code.length === 6) {
            // Simulating verification process
            console.log("Verification code submitted:", code);
            navigate("/dashboard"); // Redirect to dashboard or another page
        } else {
            alert("Please enter a valid 6-digit code.");
        }
    };

    return (
        <div className="flex items-center justify-center bg-black text-white h-screen">
            <div className="w-full">
                <h2 className="font-bold text-center mb-4" style={{ color: "#003478", fontSize: "36px" }}>
                    Email Verification
                </h2>
                <p className="text-xl font-bold text-center mb-2">Enter the 6-digit code sent to your email</p>
                <div className="w-100 mx-auto border-b-2 border-gray-400 mb-6"></div>

                {/* Verification Code Input */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 items-center mb-6">
                        <label className={labelStyle}>Verification Code:</label>
                        <input
                            type="text"
                            maxLength="6"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/, ""))}
                            placeholder="------"
                            className={inputStyle}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button className="w-40 bg-lime-400 text-black py-2 rounded font-bold hover:bg-lime-500">
                            Verify
                        </button>
                    </div>
                </form>

                {/* Resend Code */}
                <p className="text-center text-sm mt-4">
                    Didn't receive a code? <button className="text-blue-400 hover:underline">Resend Code</button>
                </p>
            </div>
        </div>
    );
}
