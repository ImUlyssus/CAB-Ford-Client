import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/apiConfig";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [site, setSite] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (username.length < 3 || username.length > 60) newErrors.username = "Username must be between 3 to 60 characters";
    const formattedEmail = email.includes("@ford.com") ? email : `${email}@ford.com`;
    if (!formattedEmail.match(/^\w+([-+.']\w+)*@ford\.com$/)) newErrors.email = "Enter a valid Ford email";
    if (!site) newErrors.site = "Please select a site";
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,40}$/)) {
        newErrors.password = "Password must be 6-40 characters, contain one uppercase letter, one lowercase letter, and one number";
      }
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(`${API_BASE_URL}/users`, {
          username,
          email,
          password,
          site,
        });
  
        // Assuming successful registration
        const { user } = response.data;
        alert("Registration successful!");
  
        // Optionally, you can redirect the user to the login page or dashboard
        // For example:
        // history.push("/login"); // or navigate to dashboard
      } catch (error) {
        // Handle different types of errors
        let errorMessage = "An unexpected error occurred. Please try again later.";
  
        if (error.response) {
          // The request was made and the server responded with a status code
          errorMessage = error.response.data.message || error.response.statusText;
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage = "No response from the server. Please check your network connection.";
        } else {
          // Something happened in setting up the request
          errorMessage = error.message;
        }
  
        // Display the error message to the user
        alert(errorMessage);
  
        // Log the full error for debugging
        // console.error("Registration error:", error);
      }
    }
  };
  

  const labelStyle = "text-right pr-20";
  const inputStyle = "w-80 p-2 border rounded bg-gray-800 text-white";
  
  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="w-full">
        <h2 className="font-bold text-center mb-4" style={{color: "#003478", fontSize:"36px"}}>Welcome to FORD CAB</h2>
        <p className="text-xl font-bold text-center mb-2">Register your account</p>
        <div className="w-65 mx-auto border-b-2 border-gray-400 mb-6"></div>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="grid grid-cols-2 gap-4 items-center mb-3">
            <label className={labelStyle}>Username:</label>
            <div>
              <input type="text" placeholder="Enter username" className={inputStyle} value={username} onChange={(e) => setUsername(e.target.value)} />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>
          </div>
          {/* Site Selection */}
          <div className="grid grid-cols-2 gap-4 items-center mb-3">
            <label className={labelStyle}>Your Site:</label>
            <div className="flex gap-4">
              {["AAT", "FSST", "FTM"].map((s) => (
                <label key={s}>
                  <input type="radio" name="site" value={s} className="mr-1" onChange={(e) => setSite(e.target.value)} /> {s}
                </label>
              ))}
            </div>
            {errors.site && <p className="text-red-500 text-sm">{errors.site}</p>}
          </div>
          {/* Email */}
          <div className="grid grid-cols-2 gap-4 items-center mb-3">
            <label className={labelStyle}>Email:</label>
            <div>
              <div className="flex">
                <input type="email" placeholder="Enter your Ford email" className="w-56 p-2 border rounded bg-gray-800 text-white" value={email} onChange={(e) => setEmail(e.target.value)} />
                <span className="p-2 bg-gray-700 border rounded-r">@ford.com</span>
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
          </div>
          {/* Password */}
          <div className="grid grid-cols-2 gap-4 items-center mb-3">
            <label className={labelStyle}>Password:</label>
            <div>
              <input type="password" placeholder="Enter password" className={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} />
              {errors.password && <p className="text-red-500 text-xs w-100">{errors.password}</p>}
            </div>
          </div>
          {/* Confirm Password */}
          <div className="grid grid-cols-2 gap-4 items-center mb-6">
            <label className={labelStyle}>Confirm Password:</label>
            <div>
              <input type="password" placeholder="Confirm password" className={inputStyle} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button type="submit" className="w-40 bg-lime-400 text-black py-2 rounded font-bold hover:bg-lime-500">
              Register
            </button>
          </div>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
