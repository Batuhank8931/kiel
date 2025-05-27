import React, { useState, useEffect } from 'react';

const DateAndTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());  // Update the current time every second
        }, 1000);

        return () => clearInterval(intervalId);  // Cleanup interval on component unmount
    }, []);

    return (
        <div className="p-2 d-flex flex-column justify-content-center align-items-center" style={{ color: '#004081' }}>
            <div>{formatDate(currentTime)}</div>
            <div>{formatTime(currentTime)}</div>
        </div>
    );
};

export default DateAndTime;
