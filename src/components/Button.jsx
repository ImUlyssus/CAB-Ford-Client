// src/components/Button.jsx
import React from "react";
import { useTheme } from "styled-components";

function Button({ children, onClick, className = "", ...props }) {
    const theme = useTheme();
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded hover:bg-['#beef00'] transition ${className}`}
      style={{backgroundColor: theme.colors.primary500, border: `1px solid ${theme.colors.secondary500}`}}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
