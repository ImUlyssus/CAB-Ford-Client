import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using axios for API requests
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const FirstSheet = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const response = await axiosPrivate.get('/change-requests/get-four-week-data');
        console.log('Weekly data from server:', response.data);
        setWeeklyData(response.data);
      } catch (err) {
        console.error("Error fetching weekly data:", err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchWeeklyData();
  }, []);
  

  return (
    <div>
      <h1>First Sheet</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div>
        Shite
      </div>
    </div>
  );
};

export default FirstSheet;

