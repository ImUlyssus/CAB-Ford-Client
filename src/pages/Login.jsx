import { Link } from "react-router-dom";

export default function LoginPage() {
    const labelStyle = "text-right pr-20";
    const inputStyle = "w-80 p-2 border rounded bg-gray-800 text-white";

    return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
            <div className="w-full">
                <h2 className="font-bold text-center mb-4" style={{ color: "#003478", fontSize: "36px" }}>
                    Welcome to FORD CAB
                </h2>
                <p className="text-xl font-bold text-center mb-2">Login to your account</p>
                <div className="w-65 mx-auto border-b-2 border-gray-400 mb-6"></div>

                {/* Email */}
                <div className="grid grid-cols-2 gap-4 items-center mb-3">
                    <label className={labelStyle}>Email:</label>
                    <div className="flex">
                        <input type="email" placeholder="Enter your Ford email" className="w-56 p-2 border rounded bg-gray-800 text-white" />
                        <span className="p-2 bg-gray-700 border rounded-r">@ford.com</span>
                    </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-2 gap-4 items-center mb-6">
                    <label className={labelStyle}>Password:</label>
                    <input type="password" placeholder="Enter password" className={inputStyle} />
                </div>

                {/* Forgot Password */}
                <div className="text-center text-sm mb-4">
                    <Link to="/forgot-password" className="text-blue-400 hover:underline">Forgot Password?</Link>
                </div>

                {/* Login Button */}
                <div className="flex justify-center">
                    <button className="w-40 bg-lime-400 text-black py-2 rounded font-bold hover:bg-lime-500">
                        Login
                    </button>
                </div>

                {/* Register Link */}
                <p className="text-center text-sm mt-4">
                    Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Register here</Link>
                </p>
            </div>
        </div>
    );
}
