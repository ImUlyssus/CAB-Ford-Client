import React, { useEffect, useState } from 'react';

import PresentationSlides from '../components/PresentationSlides';
import API_BASE_URL from '../config/apiConfig';
import BusinessCalendar from '../components/BusinessCalendar';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';

const Presentation = () => {
    
    const [calendar, setCalendar] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const year = new Date().getFullYear();
        axiosPrivate.get(`${API_BASE_URL}/business-calendar/${year}`)
          .then(response => {
            // response.data contains the calendar records for previous, current, and next year.
            setCalendar(response.data);
          })
          .catch(err => {
            console.error(err);
            navigate('/login', { state: { from: location }, replace: true });
          });
      }, []);

    return (
        <div>
            {/* Presentation Section */}
            <div className="mt-4">
                <PresentationSlides />
            </div>
            {/* <div className="w-full mx-auto my-2" style={{ borderBottom: "1px solid", borderBlockColor: theme.colors.primary200 }}></div> */}
            {/* Calender Section */}
            <BusinessCalendar calendar={calendar} />
        </div>
    );
};

export default Presentation;