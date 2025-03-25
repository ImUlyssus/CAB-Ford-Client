
import { useTheme } from "styled-components";

export default function DaysOfWeek() {
    const theme = useTheme();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const repetitions = 5; // 5 repetitions of the week

    return (
        <div 
            className="grid" 
            style={{ gridTemplateColumns: "50px 100px repeat(37, 1fr)" }}
        >
            {/* Empty cells for alignment with GridComponent */}
            <div className="bg-transparent"></div>
            <div className="bg-transparent"></div>

            {/* Days of the week repeated 5 times */}
            {Array.from({ length: repetitions }, () =>
                days.map((day, idx) => (
                    <div
                        key={`${day}-${idx}`}
                        className="flex items-center justify-center border text-xs"
                        style={{
                            paddingTop: "6px", paddingBottom: "6px",
                            background: idx === 0 || idx === 6 ? theme.colors.secondary500 : "#003478",
                            color: idx === 0 || idx === 6 ? "black" : theme.colors.secondary500,
                            textAlign: "center",
                        }}
                    >
                        {day}
                    </div>
                ))
            )}

            {/* Add Sunday and Monday after the 5 repetitions */}
            {days.slice(0, 2).map((day, idx) => (
                <div
                    key={`extra-${day}-${idx}`}
                    className="flex items-center justify-center border text-xs"
                    style={{
                        paddingTop: "6px", paddingBottom: "6px",
                        background: idx === 0 ? theme.colors.secondary500 : "#003478", // Sunday is idx 0
                        color: idx === 0 ? "black" : theme.colors.secondary500,
                        textAlign: "center",
                    }}
                >
                    {day}
                </div>
            ))}
        </div>
    );
}
