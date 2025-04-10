import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "styled-components";
import { useState, useEffect } from "react";

const Layout = () => {
    const theme = useTheme();
    const location = useLocation();
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement ||
                !!document.webkitFullscreenElement ||
                !!document.msFullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Hide Navbar and Footer for '/change-request-update' route or when in fullscreen
    const hideNavbarAndFooter = location.pathname === "/change-request-update" || isFullscreen;

    return (
        <div style={{
            color: theme.colors.secondary500,
            // Add this to ensure full height in fullscreen mode
            height: isFullscreen ? '100vh' : 'auto',
            overflow: isFullscreen ? 'hidden' : 'visible'
        }}>
            {/* Conditionally render Navbar */}
            {!hideNavbarAndFooter && <NavBar />}

            <main style={{
                minHeight: "80vh",
                padding: isFullscreen ? "0" : "40px",
                backgroundColor:
                    isFullscreen
                        ? theme.colors.secondary500
                        : location.pathname === "/data-visualization" ? "#F2EFE7":theme.colors.primary500,
                marginTop: !hideNavbarAndFooter ? "60px" : "0",
                height: isFullscreen ? '100vh' : 'auto',
                width: isFullscreen ? '100vw' : 'auto',
                position: isFullscreen ? 'fixed' : 'relative',
                top: isFullscreen ? 0 : 'auto',
                left: isFullscreen ? 0 : 'auto'
            }}>
                <Outlet />
            </main>


            {/* Conditionally render Footer */}
            {!hideNavbarAndFooter && <Footer />}
        </div>
    );
};

export default Layout;