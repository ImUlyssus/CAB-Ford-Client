import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import API_BASE_URL from '../config/apiConfig';
import AuthContext from '../context/AuthProvider';

export default function Login() {
    const {setAuth} = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({});
    const [apiError, setApiError] = useState("");  // State to handle API errors
    const navigate = useNavigate();
    const location = useLocation();
    const [attempts, setAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const from = location.state?.from?.pathname || "/";

    const labelStyle = "text-right pr-20";
    const inputStyle = "w-80 p-2 border rounded bg-gray-800 text-white";

    // Form Validation
    const validateForm = () => {
        let newErrors = {};
        const formattedEmail = email.includes("@ford.com") ? email : `${email}@ford.com`;
        if (!formattedEmail.match(/^\w+([-+.']\w+)*@ford\.com$/)) {
            newErrors.email = "Enter a valid Ford email";
        }
        if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevents page reload
        setApiError("");
        if (isLocked) {
            alert("Too many failed attempts. Please try again after 5 minutes.");
            return;
        }
         // Clear previous API error
        if (validateForm()) {
            try {
                const response = await axios.post(
                    `${API_BASE_URL}/login`,
                    {
                        email: email.includes("@ford.com") ? email : `${email}@ford.com`,
                        password: password,
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,  // ✅ Fixed typo here
                    }
                );
                if (response.status === 200) {
                    const { accessToken } = response.data; // Ensure accessToken exists in the response
                    console.log(accessToken);
                    // Store accessToken and email (avoid storing passwords)
                    setAuth({ email, accessToken });
                    navigate(from, { replace: true });
                } else {
                    setApiError("Login failed. Please check your email and password.");
                }
            } catch (err) {
                setAttempts((prev) => prev + 1);
                if (attempts + 1 >= 5) {
                    setIsLocked(true); // ⏳ Lock login
                    alert("Too many failed attempts. Please try again after 5 minutes.");
    
                    // Unlock after 5 minutes
                    setTimeout(() => {
                        setAttempts(0);
                        setIsLocked(false);
                    }, 5 * 60 * 1000);
                }
                setApiError("Login failed. Please check your email and password.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
            <div className="w-full">
                <h2 className="font-bold text-center mb-4" style={{ color: "#003478", fontSize: "36px" }}>
                    Welcome to FORD CAB
                </h2>
                <p className="text-xl font-bold text-center mb-2">Login to your account</p>
                <div className="w-65 mx-auto border-b-2 border-gray-400 mb-6"></div>
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="grid grid-cols-2 gap-4 items-center mb-3">
                        <label className={labelStyle}>Email:</label>
                        <div className="flex">
                            <input 
                                type="email" 
                                placeholder="Enter your Ford email" 
                                className="w-56 p-2 border rounded bg-gray-800 text-white" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                            <span className="p-2 bg-gray-700 border rounded-r">@ford.com</span>
                        </div>
                        {error.email && <p className="text-red-500 text-sm col-span-2 text-center">{error.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="grid grid-cols-2 gap-4 items-center mb-3">
                        <label className={labelStyle}>Password:</label>
                        <input 
                            type="password" 
                            placeholder="Enter password" 
                            className={inputStyle} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        {error.password && <p className="text-red-500 text-sm col-span-2 text-center">{error.password}</p>}
                    </div>

                    {/* API Error Message */}
                    {apiError && <p className="text-red-500 text-center mb-4">{apiError}</p>}

                    {/* Forgot Password */}
                    <div className="text-center text-sm mb-4">
                        <Link to="/forgot-password" className="text-blue-400 hover:underline">Forgot Password?</Link>
                    </div>

                    {/* Login Button */}
                    <div className="flex justify-center">
                        <button type="submit" className="w-40 bg-lime-400 text-black py-2 rounded font-bold hover:bg-lime-500">
                            Login
                        </button>
                    </div>
                </form>

                {/* Register Link */}
                <p className="text-center text-sm mt-4">
                    Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Register here</Link>
                </p>
            </div>
        </div>
    );
}
