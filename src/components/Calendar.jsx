
import React from 'react';
import { useTheme } from 'styled-components';

export default function Calendar({ data }) {
    const theme = useTheme();
    console.log(data);
    return (
        <div>
            <div style={{ height: "400px", overflowY: "auto" }}>
                {data.map((monthData, index) => (
                    <div key={index} style={{ paddingTop: "10px" }}>
                        <GridComponent data={monthData} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function GridComponent({ data }) {
    // console.log(data['month']);
    return (
        <div
            className="grid grid-rows-4 border"
            style={{ gridTemplateColumns: "90px 60px repeat(37, 1fr)" }}
        >
            {/* First column merged across all rows */}
            <div className="row-span-4 flex items-center text-center justify-center border p-2 text-xs bg-blue-300 font-bold">
                {data['year'] || "Loading..."} <br />
                {data['month'] || "Loading..."}
            </div>


            {/* Second column merged across all rows */}
            <div className="flex items-center justify-center border p-2 text-xs bg-green-300 font-bold">
                Category
            </div>

            {/* Remaining 36 columns * 4 rows = 144 cells */}
            {Array.from({ length: 1 * 37 }, (_, index) => (
                <div
                    key={index}
                    className="flex items-center justify-center border py-2 text-xs bg-gray-200"
                >
                    {index + 1}
                </div>
            ))}
            <div className="flex items-center justify-center border p-2 text-xs bg-green-300 font-bold">
                Category
            </div>

            {/* Remaining 36 columns * 4 rows = 144 cells */}
            {Array.from({ length: 1 * 37 }, (_, index) => (
                <div
                    key={index}
                    className="flex items-center justify-center border py-2 text-xs bg-gray-200"
                >
                    {index + 1}
                </div>
            ))}
            <div className="flex items-center justify-center border p-2 text-xs bg-green-300 font-bold">
                Category
            </div>

            {/* Remaining 36 columns * 4 rows = 144 cells */}
            {Array.from({ length: 1 * 37 }, (_, index) => (
                <div
                    key={index}
                    className="flex items-center justify-center border py-2 text-xs bg-gray-200"
                >
                    {index + 1}
                </div>
            ))}
            <div className="flex items-center justify-center border p-2 text-xs bg-green-300 font-bold">
                Category
            </div>

            {/* Remaining 36 columns * 4 rows = 144 cells */}
            {Array.from({ length: 1 * 37 }, (_, index) => (
                <div
                    key={index}
                    className="flex items-center justify-center border py-2 text-xs bg-gray-200"
                >
                    {index + 1}
                </div>
            ))}
        </div>
    );
}