"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

import styles from "./HeartRateGraph.module.css";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

interface Props {
  username: string;
}

const HeartRateGraph = ({ username }: Props) => {
  const [heartRateData, setHeartRateData] = useState<
    { timestamp: number; heartRate: number }[]
  >([]);
  const fetchHeartRateData = async () => {
    const response = await fetch(
      `https://nowatch-fullstack-test-assignment.vercel.app/api/measurements?username=${username}`
    );
    const data = await response.json();
    const newHeartRateData = data.measurements;
    if (response.ok) {
      setHeartRateData((oldHeartRateData) => {
        const updatedData = [...oldHeartRateData];
        newHeartRateData.forEach((newData) => {
          if (
            !updatedData.some((data) => data.timestamp === newData.timestamp)
          ) {
            updatedData.push(newData);
          }
        });
        if (updatedData.length > 60) {
          updatedData.shift();
        }
        return updatedData;
      });
    }
  };
  useEffect(() => {
    const interval = setInterval(fetchHeartRateData, 1000);
    return () => clearInterval(interval);
  }, [username]);
  const chartData = {
    labels: heartRateData.map((data) =>
      new Date(data.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    ),
    datasets: [
      {
        label: "Heart Rate (BPM)",
        data: heartRateData.map((data) => data.heartRate),
        borderColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return "red";
          }
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, "orange");
          gradient.addColorStop(1, "red");
          return gradient;
        },
        fill: true,
        yAxisID: "y-bpm",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "white",
        },
      },
      y: {
        min: 2,
        max: 5,
        stepSize: 1,
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          color: "white",
          callback: (value: number) => {
            if (value === 2 || value === 3 || value === 4 || value === 5) {
              return value;
            }
            return "";
          },
        },
      },
      "y-bpm": {
        position: "right",
        min: 40,
        max: 160,
        grid: {
          display: false,
        },
        ticks: {
          color: "white",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "white",
        titleColor: "black",
        bodyColor: "black",
        borderColor: "gray",
        borderWidth: 1,
        callbacks: {
          label: (tooltipItem: any) => {
            const closestData = heartRateData[tooltipItem.dataIndex];
            const closestTimestamp = new Date(
              closestData.timestamp
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            return `Time: ${closestTimestamp} | Heart Rate: ${tooltipItem.raw} BPM`;
          },
        },
      },
    },
  };
  return (
    <div className={styles.graph}>
      {heartRateData.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default HeartRateGraph;
