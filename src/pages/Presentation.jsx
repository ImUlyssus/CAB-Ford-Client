import React, { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import PresentationSlides from '../components/PresentationSlides';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
import BusinessCalendar from '../components/BusinessCalendar';
const slides = [
    {
      title: "Slide 1",
      content: "This is the first slide with a custom UI.",
      buttonText: "Learn More",
    },
    {
      title: "Slide 2",
      content: "Here’s another slide with different content.",
      buttonText: "Explore",
    },
    {
      title: "Slide 3",
      content: "You can customize each slide as needed!",
      buttonText: "Get Started",
    },
  ];

const Presentation = () => {
    const theme = useTheme();
    const [calendar, setCalendar] = useState([]);
    useEffect(() => {
        const year = new Date().getFullYear();
        axios.get(`${API_BASE_URL}/business-calendar/${year}`)
          .then(response => {
            // response.data contains the calendar records for previous, current, and next year.
            console.log(response.data);
            setCalendar(response.data);
          })
          .catch(err => console.error(err));
      }, []);

    return (
        <div>
            {/* Presentation Section */}
            <div className="flex justify-between items-center mt-2">
                <h1 className="m-0 font-bold text-xl">This week presentation</h1>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 rounded cursor-pointer" style={{backgroundColor: theme.colors.secondary500, color: theme.colors.primary500}}>Edit</button>
                    <button className="px-4 py-2 rounded cursor-pointer" style={{backgroundColor: theme.colors.primaryButton, color: theme.colors.primary500}}>Present now</button>
                </div>
            </div>
            <div className="w-340 mx-auto my-2" style={{ borderBottom: "1px solid", borderBlockColor: theme.colors.primary200 }}></div>
            <div className="mt-4">
                <PresentationSlides slides={slides} />
            </div>
            {/* <div className="w-full mx-auto my-2" style={{ borderBottom: "1px solid", borderBlockColor: theme.colors.primary200 }}></div> */}
            {/* Calender Section */}
            <div className="flex justify-between items-center mt-10">
                <h1 className="m-0 font-bold text-xl">Business Calender</h1>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 rounded cursor-pointer" style={{backgroundColor: theme.colors.primaryButton, color: theme.colors.primary500}}>Edit calender</button>
                </div>
            </div>
            <div className="w-340 mx-auto my-2" style={{ borderBottom: "1px solid", borderBlockColor: theme.colors.primary200 }}></div>
            <BusinessCalendar calendar={calendar} />
        </div>
    );
};

export default Presentation;