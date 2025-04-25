import React, {useState} from 'react';
import Ford_Logo from '../../assets/ford_logo.png';
import DaysOfWeek from '../DaysOfWeek';
import GridComponent from '../GridComponent'; // Import the GridComponent
import { Info } from 'lucide-react';
import AppendixDialog from './AppendixDialog';

const monthMap = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
};

const BusinessCalendarSlide = ({ theme, calendar }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    console.log("BusinessCalendarSlide", calendar);
    // Get current date and year to retrieve just three months of data
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Function to retrieve month name from month index
    const getMonthName = (monthIndex) => {
        const monthNames = Object.keys(monthMap);
        return monthNames[monthIndex];
    };

    // Create the data for the current and next two months
    const calendarData = [];
    for (let i = 0; i < 3; i++) {
        const monthIndex = (currentMonthIndex + i) % 12;
        const year = currentYear + Math.floor((currentMonthIndex + i) / 12);
        const monthName = getMonthName(monthIndex);

        // Find the month data in the calendar prop
        const monthData = calendar.find(
            (item) => item.year === year && item.month === monthName
        );

        if (monthData) {
            calendarData.push(monthData);
        } else {
            // If data is not found, create placeholder data with default values
            const placeholderData = {
                year: year,
                month: monthName,
                aat: "0".repeat(31),
                ftm: "0".repeat(31),
                fsst: "0".repeat(31),
            };
            calendarData.push(placeholderData);
        }
    }

    return (
        <div className="w-full h-full bg-white flex items-center justify-center p-8">
            <div className='absolute top-2 right-2 items-center'>
                <img src={Ford_Logo} className='h-5 w-15 mr-2' alt="Ford Logo" />
                <button
                    onClick={()=>setIsDialogOpen(true)}
                    className="flex ml-auto mb-2 mr-2 mt-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                    aria-label="Show Appendix Information"
                >
                    <Info size={15} />
                </button>
            </div>
            <div className="w-full">
                <h2 className="text-2xl font-bold text-black">
                    Business Calendar
                </h2>
                <div className="flex justify-end mt-1 text-sm" style={{ color: theme.colors.primary500 }}>
                <h5 className='py-1 px-5 font-bold mx-1 rounded-xl' style={{ color: "white", backgroundColor: '#f005bd' }}>Holiday</h5>
                <h5 className='py-1 px-5 font-bold mx-1 rounded-xl' style={{ color: "white", backgroundColor: 'green' }}>Non-PROD</h5>
                <h5 className='py-1 px-5 font-bold mx-1 rounded-xl' style={{ color:"black", backgroundColor: '#10e7f7' }}>Overtime</h5>
                <h5 className='py-1 px-5 font-bold mx-1 rounded-xl' style={{ color: "white", backgroundColor: 'black' }}>Working Day</h5>
            </div>
                {/* Days of week section */}
            <div className="my-2">
                <DaysOfWeek isForPresentation={true} />
            </div>
                {/* Render the GridComponent for each month */}
                {calendarData.map((monthData, index) => (
                    <div key={index} className="mb-4">
                        <GridComponent data={monthData} activeYear={monthData.year} isForPresentation={true} />
                    </div>
                ))}
            </div>
            {/* Appendix Dialog */}
            <AppendixDialog open={isDialogOpen} onClose={()=>setIsDialogOpen(false)} />
        </div>
    );
};

export default BusinessCalendarSlide;
