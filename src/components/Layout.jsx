import { Outlet, useLocation } from "react-router-dom";
// import NavBar from "./NavBar";
import NavBar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "styled-components";

const Layout = () => {
    const theme = useTheme();
    const location = useLocation(); // Get current route

    // Hide Navbar and Footer for '/change-request-update' route
    const hideNavbarAndFooter = location.pathname === "/change-request-update";

    return (
        <div style={{ color: theme.colors.secondary500 }}>
            {/* Conditionally render Navbar */}
            {!hideNavbarAndFooter && <NavBar />}

            <main style={{ minHeight: "80vh", padding: "40px", backgroundColor: theme.colors.primary500, marginTop: !hideNavbarAndFooter && "60px" }}>
                <Outlet /> {/* This renders the child components */}
            </main>

            {/* Conditionally render Footer */}
            {!hideNavbarAndFooter && <Footer />}
        </div>
    );
};

export default Layout;
