import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import API from "../utils/utilRequest";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// REQUIRED for pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [totalOperations, setTotalOperations] = useState(0);
  const [remainingOperations, setRemainingOperations] = useState(0);

  const remainingPercentage =
    totalOperations > 0 ? (remainingOperations / totalOperations) * 100 : 0;

  const completedPercentage =
    totalOperations > 0 ? 100 - remainingPercentage : 0;

  const checkchart = async () => {
    try {
      const response = await API.OperationNumber();

      const total = response.data.totalOperations;
      const remain = response.data.remainingOperations;

      setTotalOperations(total);
      setRemainingOperations(remain);
    } catch (error) {
      console.error("Error fetching warrant:", error);
    }
  };

  useEffect(() => {
    checkchart();
    const interval = setInterval(checkchart, 3000);
    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: ["Remaining", "Completed"],
    datasets: [
      {
        data: [remainingPercentage, completedPercentage],
        backgroundColor: ["#6ce5e8", "#31356e"],
        hoverBackgroundColor: ["#6ce5e8", "#31356e"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#233238",
          font: {
            size: 15,
          },
        },
      },
    },
  };

  return (
    <div className="d-flex row align-items-center justify-content-center">
      <div style={{ width: "100%", height: "100%" }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
