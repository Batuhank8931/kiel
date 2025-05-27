import React, { useEffect, useRef, useState } from 'react';
import { Chart } from "react-google-charts";
import API from "../utils/utilRequest";

const PieChart = () => {
    const svgRef = useRef();
    const [totalOperations, settotalOperations] = useState("");
    const [remainingOperations, setremainingOperations] = useState("");
    const [remainingPercentage, setremainingPercentage] = useState(((remainingOperations / totalOperations) * 100));
    const [completedPercentage, setcompletedPercentage] = useState(100 - ((remainingOperations / totalOperations) * 100));


    useEffect(() => {
        checkchart();
        const interval = setInterval(checkchart, 3000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []); // Runs when id changes

    const checkchart = async () => {
        try {
            const response = await API.OperationNumber();

            const total = (response.data.totalOperations);
            const remain = (response.data.remainingOperations);

            settotalOperations(total);
            setremainingOperations(remain);
            setremainingPercentage(((remain / total) * 100));
            setcompletedPercentage(100 - ((remain / total) * 100));
        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };

    const data = [
        ["Task", "Percentage"],
        ["Remaining", remainingPercentage],
        ["Completed", completedPercentage],
    ];

    const options = {
        pieSliceText: "percentage",
        slices: {
            0: { offset: 0, color: "#6ce5e8" },
            1: { color: "#31356e" },
        },
        legend: {
            alignment: "left",
            position: "bottom",
            textStyle: {
                color: "#233238",
                fontSize: 15,
            },
        },
        backgroundColor: 'transparent',
        width: "100%",
        height: "300px"
    };

    useEffect(() => {
    }, []);

    return (
        <div className='d-flex row align-items-center justify-content-center '>
            <Chart
                chartType="PieChart"
                data={data}
                options={options}
            />
        </div>
    );
};

export default PieChart;
