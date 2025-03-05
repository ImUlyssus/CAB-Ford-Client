import React from 'react';
import { useTheme } from 'styled-components';

const Footer = () => {
    const theme = useTheme();
    return (
        <footer style={{padding: "40px",backgroundColor: theme.colors.primary400}}>
            <div className="text-center">
            <p>&copy; 2025 CAB Company. All rights reserved.</p>
                 <nav>
                     <a href="/privacy" style={{ padding: '10px' }}>Privacy Policy</a> | 
                     <a href="/terms" style={{ padding: '10px' }}>Terms of Service</a> | 
                     <a href="/contact" style={{ padding: '10px' }}>Contact Us</a>
                 </nav>
            </div>
        </footer>
    );
};

export default Footer;