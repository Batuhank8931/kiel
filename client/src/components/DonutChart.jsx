import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import API from "../utils/utilRequest";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

// REQUIRED ⬇️
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = () => {
  const [total, setTotal] = useState(0);
  const [remain, setRemain] = useState(0);

  const completed = total - remain;

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const response = await API.OperationNumber();
      setTotal(response.data.totalOperations);
      setRemain(response.data.remainingOperations);
    } catch (err) {
      console.log(err);
    }
  };

  const data = {
    labels: ["Remaining", "Completed"],
    datasets: [
      {
        data: [remain, completed],
        backgroundColor: ["#6ce5e8", "#31356e"],
      },
    ],
  };

  const options = {
    cutout: "40%",
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div style={{ position: "relative", width: "300px" }}>
      <Doughnut data={data} options={options} />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div>Total</div>
        <div>{total}</div>
      </div>
    </div>
  );
};

export default DonutChart;
