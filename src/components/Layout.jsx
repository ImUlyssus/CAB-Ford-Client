import { Outlet } from "react-router-dom";
// import NavBar from "./NavBar";
import NavBar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "styled-components";

const Layout = () => {
    const theme = useTheme();
  return (
    <div style={{color: theme.colors.secondary500}}>
      <NavBar />
      <main style={{ minHeight: "80vh", padding: "40px", backgroundColor: theme.colors.primary500,marginTop: "40px" }}>
        <Outlet /> {/* This renders the child components */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
