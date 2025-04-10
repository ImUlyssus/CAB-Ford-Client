import React from 'react';
import FilteredBar from '../components/FilteredBar'
import Dashboard from '../components/Dashboard';
import { useTheme } from 'styled-components';

const DataVisualization = () => {
    const theme = useTheme();
    return (
        <div style={{ paddingTop: "80px" }}>
            <div style={{
                position: "fixed", // Make FilteredBar stick to the top
                top: "83px",
                left: 0,
                right: 0,
                zIndex: 1000, // Ensure it stays above other content
                backgroundColor: theme.colors.primary500, // Add a background color to prevent transparency
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}>
                <FilteredBar />
            </div>
            <Dashboard />
        </div>
    );
};

export default DataVisualization;