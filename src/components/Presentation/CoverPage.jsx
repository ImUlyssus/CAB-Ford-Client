import React, { useEffect, useState } from 'react';
import Ford_Logo from '../../assets/ford_font.png';

const formatDate = (date) => {
    const day = date.getDate();
    const dayWithSuffix = (day) => {
        if (day >= 11 && day <= 13) {
            return day;
        }
        switch (day % 10) {
            case 1: return day + 'st';
            case 2: return day + 'nd';
            case 3: return day + 'rd';
            default: return day + 'th';
        }
    };
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    const dayWithFormat = dayWithSuffix(date.getDate());
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${weekday}, ${dayWithFormat} ${month} ${year}`;
};
// CoverPage.jsx
export default function CoverPage({ theme }) {
    const [meetingDate, setMeetingDate] = useState('');

    useEffect(() => {
        const calculateMeetingDate = () => {
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)

            let nextFriday = new Date(today); // Clone today's date
            let daysUntilFriday;

            if (dayOfWeek <= 5) { // If today is before or on Friday
                daysUntilFriday = (5 - dayOfWeek) % 7; // Calculate days until Friday
                if (daysUntilFriday === 0) {
                    nextFriday = new Date(today);
                }
                else {
                    nextFriday.setDate(today.getDate() + daysUntilFriday); // Set to this Friday
                }
            } else { // If today is Saturday (6) or Sunday (0)
                daysUntilFriday = (5 + 7 - dayOfWeek) % 7; // Calculate days until next Friday
                nextFriday.setDate(today.getDate() + daysUntilFriday); // Set to next Friday
            }

            const formattedDate = formatDate(nextFriday);
            setMeetingDate(formattedDate);
        };

        calculateMeetingDate();
    }, []);

    return (
        <div className="w-full h-full bg-white flex flex-col p-8 relative">
            {/* Centered content container */}
            <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center text-[#003478]">
                {/* Main heading with underline */}
                <h1 className="text-2xl font-bold border-b-2 border-gray-300">
                    Thailand Site IT Change Advisory Board (TH-CAB)
                </h1>

                {/* Date section */}
                <div className="my-2">
                    <p className="text-md">
                        {meetingDate}
                    </p>
                </div>
            </div>

            {/* Ford text in bottom right corner */}
            <div className="absolute bottom-8 right-8 text-[#003478]">
                <img src={Ford_Logo} alt="Ford Logo" className="h-40 w-80 inline-block" />
            </div>
        </div>
    );
}
