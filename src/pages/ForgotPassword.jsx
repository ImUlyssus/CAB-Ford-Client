import React, { useState } from 'react';
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/apiConfig";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Email Input, 2: Verification Code & New Password
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [codeError, setCodeError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const labelStyle = "text-right pr-20";
    const inputStyle = "w-80 p-2 border rounded bg-gray-800 text-white";

    const validatePassword = () => {
        let isValid = true;
        if (!newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,40}$/)) {
            setPasswordError("Password must be 6-40 characters, contain one uppercase letter, one lowercase letter, and one number");
            isValid = false;
        } else {
            setPasswordError("");
        }
        if (newPassword !== confirmNewPassword) {
            setConfirmPasswordError("Passwords do not match");
            isValid = false;
        } else {
            setConfirmPasswordError("");
        }
        if (newPassword === "") {
            setPasswordError("Password cannot be empty");
            isValid = false;
        }
        if (confirmNewPassword === "") {
            setConfirmPasswordError("Confirm Password cannot be empty");
            isValid = false;
        }
        return isValid;
    };

    const handleContinue = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const generatedVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            await axios.post("/send-email-verification", {
                OTP: generatedVerificationCode,
                recipient_email: email,
            });

            // Store the verification code in state for later comparison
            setVerificationCode(generatedVerificationCode);
            setStep(2); // Move to the next step
            setEmailError(""); // Clear any previous errors
            alert("Verification code sent to your email. Please check your inbox.");
        } catch (error) {
            let errorMessage = "An unexpected error occurred. Please try again later.";

            if (error.response) {
                errorMessage = error.response.data.message || error.response.statusText;
            } else if (error.request) {
                errorMessage = "No response from the server. Please check your network connection.";
            } else {
                errorMessage = error.message;
            }

            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (attempts >= 5) {
            setCodeError("Too many attempts! Please request a new verification code.");
            return;
        }
        if (verificationCode !== code) {
            setAttempts((prev) => prev + 1);
            setCodeError(`Invalid code! You have ${4 - attempts} attempts left.`);
            return;
        } else {
            setCodeError("");
        }
        if (validatePassword()) {
            setIsLoading(true);
            try {
                // Send a POST request to backend to update password
                const response = await axios.post("/users/reset-password", {
                    email,
                    password: newPassword,
                });
                alert("Password reset successful! Redirecting to login page.");
                navigate("/login");
            } catch (error) {
                let errorMessage = "An unexpected error occurred. Please try again later.";

                if (error.response) {
                    errorMessage = error.response.data.message || error.response.statusText;
                } else if (error.request) {
                    errorMessage = "No response from the server. Please check your network connection.";
                } else {
                    errorMessage = error.message;
                }
                alert(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const [code, setCode] = useState("");
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
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <div className="w-full">
                    <h2 className="font-bold text-center mb-4" style={{ color: "#003478", fontSize: "36px" }}>
                        Welcome to FORD CAB
                    </h2>

                    {step === 1 ? (
                        <>
                            <p className="text-xl font-bold text-center mb-2">Enter your Ford email</p>
                            <div className="w-65 mx-auto border-b-2 border-gray-400 mb-6"></div>
                            <form onSubmit={handleContinue}>
                                <div className="grid grid-cols-2 gap-4 items-center mb-3">
                                    <label className={labelStyle}>Email:</label>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Enter your Ford email"
                                            className="w-80 p-2 border rounded bg-gray-800 text-white"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                                    </div>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <button
                                        type="submit"
                                        className="w-40 bg-lime-400 text-black py-2 rounded font-bold hover:bg-lime-500"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <p className="text-xl font-bold text-center mb-2">Enter Verification Code and New Password</p>
                            <div className="w-65 mx-auto border-b-2 border-gray-400 mb-6"></div>
                            <form onSubmit={handleChangePassword}>
                                <div className="grid grid-cols-2 gap-4 items-center mb-3">
                                    <label className={labelStyle}>Verification Code:</label>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Enter 6-digit code"
                                            className="w-80 p-2 border rounded bg-gray-800 text-white"
                                            value={code}
                                            maxLength={6}
                                            onChange={(e) => setCode(e.target.value.replace(/\D/, ""))}
                                            disabled={attempts >= 5}
                                        />
                                        {codeError && <p className="text-red-500 text-sm">{codeError}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 items-center mb-3">
                                    <label className={labelStyle}>New Password:</label>
                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Enter new password"
                                            className="w-80 p-2 border rounded bg-gray-800 text-white"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 items-center mb-3">
                                    <label className={labelStyle}>Confirm New Password:</label>
                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Confirm new password"
                                            className="w-80 p-2 border rounded bg-gray-800 text-white"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        />
                                        {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
                                    </div>
                                </div>
                                <div className="flex justify-center mt-4">
                                    {attempts >= 5 ?
                                    <button
                                    type="button"
                                    className="w-40 bg-lime-400 text-black py-2 rounded font-bold hover:bg-lime-500"
                                    onClick={() => {navigate("/login")}}
                                >
                                    Back to Login
                                </button>:
                                <button
                                type="submit"
                                className="w-40 bg-lime-400 text-black py-2 rounded font-bold hover:bg-lime-500"
                            >
                                Change Password
                            </button>
                                }
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
