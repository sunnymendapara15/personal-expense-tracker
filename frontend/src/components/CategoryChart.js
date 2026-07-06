import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const palette = ["#6366f1", "#a855f7", "#ec4899", "#f97316", "#14b8a6", "#22d3ee", "#10b981"];

const CategoryChart = ({ data }) => {
  if (!data.length) {
    return <p className="placeholder">Add expenses to start seeing category insights.</p>;
  }

  const chartData = {
    labels: data.map((entry) => entry.category),
    datasets: [
      {
        label: "Spend",
        data: data.map((entry) => entry.total),
        backgroundColor: data.map((_, index) => palette[index % palette.length]),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>Category breakdown</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CategoryChart;
