import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import API from "../utils/utilRequest";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StatusChart = () => {
  const [chartData, setChartData] = useState([]);

  const GetStatusChart = async () => {
    try {
      const response = await API.GetStatusChart();
      setChartData(response.data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    GetStatusChart();
    const interval = setInterval(GetStatusChart, 3000);
    return () => clearInterval(interval);
  }, []);

  // convert
  const convertToChartJS = () => {
    if (!chartData || chartData.length < 2) return null;
    const labels = chartData.slice(1).map((row) => row[0]);
    const values = chartData.slice(1).map((row) => row[1]);
    return {
      labels,
      datasets: [
        {
          label: "Status",
          data: values,
          backgroundColor: ["#31356e", "#6ce5e8"],
        },
      ],
    };
  };

  const data = convertToChartJS();

  const options = {
    responsive: true,
    // IMPORTANT: allow manual height via container or `height` prop
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="d-flex row align-items-center justify-content-center">
      {/* wrapper ile sabit yükseklik veriyoruz, overflow kontrolü sağlanıyor */}
      <div style={{ width: "100%", maxWidth: "100%", height: 240 }}>
        {data ? (
          // react-chartjs-2: height prop here is pixels, but maintainAspectRatio:false is required
          <Bar data={data} options={options} height={150} />
        ) : (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusChart;
