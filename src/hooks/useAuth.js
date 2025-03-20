import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    const { auth, setAuth } = useContext(AuthContext);
    
    // Load the email from localStorage on mount if available
    useEffect(() => {
        const storedEmail = localStorage.getItem('authEmail');
        if (storedEmail) {
            setAuth((prev) => ({
                ...prev,
                email: storedEmail // Only store the email from localStorage
            }));
        }
    }, [setAuth]);

    // Store the email to localStorage whenever it changes
    useEffect(() => {
        if (auth?.email) {
            localStorage.setItem('authEmail', auth.email); // Store only the email
        }
    }, [auth?.email]);

    return { auth, setAuth };
};

export default useAuth;
