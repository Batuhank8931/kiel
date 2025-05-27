import React, { useEffect, useRef, useState } from 'react';
import { Chart } from "react-google-charts";
import API from "../utils/utilRequest";

const DonutChart = () => {
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
            setremainingPercentage( ((remain / total) * 100));
            setcompletedPercentage( 100 - ((remain / total) * 100));
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
        pieHole: 0.4,
        is3D: false,
        backgroundColor: 'transparent',
        height:"350px"
    };

    useEffect(() => {}, []);

    return (
        <div className="d-flex row align-items-center justify-content-center mb-5" style={{ position: "relative" }}>
            <Chart
                chartType="PieChart"
                data={data}
                options={options}
            />
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#31356e",
                }}
            >
                <div style={{ fontSize: "12px", fontWeight: "normal" }}>Total</div>
                <div style={{ fontSize: "12px", fontWeight: "normal" }}>{totalOperations}</div>
            </div>
        </div>
    );
};

export default DonutChart;
