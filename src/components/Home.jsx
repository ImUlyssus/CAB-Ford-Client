import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Home() {
    const { auth } = useAuth();
    const navigate = useNavigate();

    // Redirect to login if no access token
    useEffect(() => {
        if (!auth?.accessToken) {
            navigate('/login');
        }
    }, [auth, navigate]);

    return (
        <div className="font-bold text-white text-center mt-50" style={{ fontSize: "4rem" }}>
            <h1>Welcome To <span style={{ color: '#beef00' }}>CAB</span></h1>
        </div>
    );
}

export default Home;
