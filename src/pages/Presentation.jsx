import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PresentationSlides from '../components/PresentationSlides';
import BusinessCalendar from '../components/BusinessCalendar';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import PresentationComponents from '../components/PresentationComponents';

const getUpcomingFriday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    let daysUntilFriday = 5 - dayOfWeek;

    if (dayOfWeek === 5) {
        daysUntilFriday = 0;
    } else if (daysUntilFriday < 0) {
        daysUntilFriday += 7;
    }

    const upcomingFriday = new Date(today);
    upcomingFriday.setDate(today.getDate() + daysUntilFriday);

    const year = upcomingFriday.getFullYear();
    const month = String(upcomingFriday.getMonth() + 1).padStart(2, '0');
    const day = String(upcomingFriday.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Presentation = () => {
    const [calendar, setCalendar] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const [informationalData, setInformationalData] = useState([]);
    const [remarksSummary, setRemarksSummary] = useState([]);
    // Cache the upcoming Friday date for the entire day
    const upcomingFriday = useMemo(() => getUpcomingFriday(), []);

    useEffect(() => {
        const year = new Date().getFullYear();
        axiosPrivate.get(`/business-calendar/${year}`)
            .then(response => {
                setCalendar(response.data);
            })
            .catch(err => {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            });
    }, [axiosPrivate, navigate, location]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await axiosPrivate.get(`/informational?date=${upcomingFriday}`);

                const parsedData = response.data.map(item => ({
                    ...item,
                }));
                setInformationalData(parsedData);
            } catch (error) {
                console.error("Failed to fetch informational data:", error);
            }
        };

        fetchInitialData();
    }, [axiosPrivate, upcomingFriday]);

    useEffect(() => {
      const fetchRemarksSummary = async () => {
          try {
              const response = await axiosPrivate.get(`/summary-remarks?date=${upcomingFriday}`);

              const parsedData = response.data.map(item => ({
                  ...item,
              }));
              setRemarksSummary(parsedData);
          } catch (error) {
              console.error("Failed to fetch informational data:", error);
          }
      };

      fetchRemarksSummary();
  }, [axiosPrivate, upcomingFriday]);

    return (
        <div>
            {/* Presentation Section */}
            <div className="mt-4">
                <PresentationSlides calendar={calendar} informationalData={informationalData} remarksSummary={remarksSummary} />
            </div>
            <PresentationComponents calendar={calendar} informationalData={informationalData} setInformationalData={setInformationalData} remarksSummary={remarksSummary} setRemarksSummary={setRemarksSummary}/>
        </div>
    );
};

export default Presentation;
