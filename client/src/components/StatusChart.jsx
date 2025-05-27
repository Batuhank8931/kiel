import React, { useEffect, useRef, useState } from 'react';
import { Chart } from "react-google-charts";
import API from "../utils/utilRequest";

const StatusChart = () => {
    const svgRef = useRef();
    const [totalSeats, settotalSeats] = useState(100);
    const [remainingSeats, setremainingSeats] = useState(62);
    const [remainingPercentage, setremainingPercentage] = useState(((remainingSeats / totalSeats) * 100));
    const [completedPercentage, setcompletedPercentage] = useState(100 - ((remainingSeats / totalSeats) * 100));
    const [chartData, setchartData] = useState([]);


    const GetStatusChart = async () => {
        try {
            const response = await API.GetStatusChart();
            setchartData(response.data)
        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };

    GetStatusChart();

    useEffect(() => {

        GetStatusChart();
    }, []);

    useEffect(() => {
        GetStatusChart();
        const interval = setInterval(GetStatusChart, 3000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []); 

    // Material chart options
    const options = {
        legend: { position: "top" }, // Position the legend at the top
        colors: ["#31356e", "#6ce5e8"], // Set colors for 'Completed' and 'Remaining'
        height: "150px"
    };



    useEffect(() => {
    }, []);

    return (
        <div className='d-flex row align-items-center justify-content-center '>
            <Chart
                chartType="Bar"
                data={chartData}
                options={options}
            />
        </div>
    );
};

export default StatusChart;
