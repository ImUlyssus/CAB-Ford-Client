import { NavLink } from "react-router-dom";
import { useTheme } from "styled-components";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
function Navbar() {
    const theme = useTheme(); // Access theme
    const { setAuth } = useContext(AuthContext);

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
                borderBottomStyle: "solid",
                borderBottomWidth: "1px",
            }}
        >
            <h2 style={{ margin: 0, paddingLeft: "20px" }}>
                <NavLink
                    to="/"
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                        fontWeight: "bold",
                    }}
                >
                    Welcome Kyaw
                </NavLink>
            </h2>
            <div style={{ padding: "10px" }}>
                {[
                    { path: "/change-request-data", label: "Change Request" },
                    { path: "/pdf-report", label: "PDF Reports" },
                    { path: "/excel-files", label: "Excel Files" },
                    { path: "/presentation", label: "Presentation" },
                    { path: "/data-visualization", label: "Data Visualization" }
                ].map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            color: isActive ? theme.colors.primaryButton : theme.colors.secondary500,
                            textDecoration: "none",
                            margin: "0 15px",
                            padding: "8px 13px",
                            borderBottom: isActive ? `2px solid ${theme.colors.primaryButton}` : "none",
                        })}
                    >
                        {item.label}
                    </NavLink>
                ))}

                <button
                    onClick={() => {
                        setAuth({});
                        navigate("/login");
                    }}
                    style={{
                        color: "red",
                        textDecoration: "none",
                        margin: "0 15px",
                        border: "1px solid red",
                        padding: "8px 13px",
                        borderRadius: "5px",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>

            </div>
        </nav>
    );
}

export default Navbar;
