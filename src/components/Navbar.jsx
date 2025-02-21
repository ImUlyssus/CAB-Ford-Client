import { Link } from "react-router-dom";
import { useTheme } from "styled-components";

function Navbar() {
    const theme = useTheme(); // Access theme
    const navLinkStyle = {
        color: theme.colors.secondary500, textDecoration: "none", margin: "0 15px", borderWidth: "1px", borderStyle: 'solid', borderColor: theme.colors.secondary500, padding: "8px 13px", borderRadius: "5px"
    }

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: theme.colors.primary500, // Use primary color
                color: "white",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 1000,
                paddingTop: "10px",
                paddingBottom: "10px",
                borderBottomColor: theme.colors.primary200,
        borderBottomStyle: "solid", // Add this line
        borderBottomWidth: "1px",
            }}
        >
            <h2 style={{ margin: 0, paddingLeft: "20px" }}>
                <Link
                    to="/"
                    style={{
                        textDecoration: "none",   // Remove the underline
                        listStyle: "none",        // This is not necessary for <Link> but harmless
                        color: "inherit",         // Keeps the link color same as surrounding text
                        fontWeight: "bold",       // Makes the text bold
                    }}
                >
                    Welcome Kyaw
                </Link>
            </h2>
            <div style={{ padding: "10px" }}>
                <Link
                    to="change-request"
                    style={navLinkStyle}
                >
                    Change Request
                </Link>
                <Link
                    to="pdf-report"
                    style={navLinkStyle}
                >
                    PDF Reports
                </Link>
                <Link
                    to="excel-files"
                    style={navLinkStyle}
                >
                    Excel Files
                </Link>
                <Link
                    to="presentation"
                    style={navLinkStyle}
                >
                    Presentation
                </Link>
                <Link
                    to="data-visualization"
                    style={navLinkStyle}
                >
                    Data Visualization
                </Link>
                <Link
                    to="logout"
                    style={{color: "red", textDecoration: "none", margin: "0 15px", borderWidth: "1px", borderStyle: 'solid', borderColor: "red", padding: "8px 13px", borderRadius: "5px"}}
                >
                    Logout
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
