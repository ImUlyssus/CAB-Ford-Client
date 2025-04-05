import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";

export default function VerificationPage() {
    const [code, setCode] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    
    // Retrieve user data from navigation state
    const email = location.state?.email || "";
    const password = location.state?.password || "";
    const site = location.state?.site || "";
    const verificationCode = location.state?.verificationCode || "";
    const username = location.state?.username || "";
    const [systemCode, setSystemCode] = useState(verificationCode);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (attempts >= 5) {
            setError("Too many attempts! Please request a new verification code.");
            setSystemCode("");
            return;
        }
        
        if (code === systemCode) {
            try {
                // Send a POST request to backend to insert user
                await axios.post("/users/insert-user", {
                    username,
                    email,
                    password,
                    site,
                });

                alert("Verification successful! Redirecting to login page.");
                navigate("/login");
            } catch (error) {
                alert("Server error! Please try again later.");
                console.error("Error registering user:", error);
            }
        } else {
            setAttempts((prev) => prev + 1);
            setError(`Invalid code! You have ${4 - attempts} attempts left.`);
        }
    };
    const handleResendEmail = async () => {
        setIsLoading(true); // 🔴 Show loading before making the request
        setAttempts(0);
        setError("");
    
        // Generate a new verification code
        const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        setSystemCode(newVerificationCode);
    
        try {
            // Send the new verification code to the backend to resend the email
            await axios.post("/send-email-verification", {
                OTP: newVerificationCode,
                recipient_email: email,
            });
    
            console.log("Verification email sent successfully");
            alert("Verification email sent successfully. Please check your email.");
        } catch (error) {
            console.error("Error sending verification email:", error);
            alert("Error sending verification email. Please try again later.");
        } finally {
            setIsLoading(false); // 🔴 Hide loading after request completes
        }
    };

    return (
        <>
    {isLoading && (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30">
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold">Processing...</p>
            <p>Please wait a moment.</p>
        </div>
    </div>
)}
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
                        <label className="text-right pr-20">Verification Code:</label>
                        <input
                            type="text"
                            maxLength="6"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/, ""))}
                            placeholder="------"
                            className="w-80 p-2 border rounded bg-gray-800 text-white text-center tracking-widest text-xl"
                            disabled={attempts >= 5}
                        />
                    </div>

                    {error && <p className="text-red-400 text-center pb-4">{error}</p>}

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-40 bg-lime-400 text-black py-2 rounded font-bold hover:bg-lime-500"
                            disabled={attempts >= 5}
                        >
                            Verify
                        </button>
                    </div>
                </form>

                {/* Resend Code */}
                <p className="text-center text-sm mt-4">
                    Didn't receive a code?{" "}
                    <button
                        className="text-blue-400 hover:underline"
                        onClick={handleResendEmail}
                    >
                        Resend Code
                    </button>
                </p>
            </div>
        </div>
        </>
    );
}

