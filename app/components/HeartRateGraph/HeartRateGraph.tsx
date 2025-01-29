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
  TooltipItem,
  Chart as ChartType,
  ChartOptions,
} from "chart.js";

import styles from "./HeartRateGraph.module.css";

import Loading from "../Loading/Loading";

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
  const [buffer, setBuffer] = useState<
    { timestamp: number; heartRate: number }[]
  >([]);
  const [bufferIndex, setBufferIndex] = useState(0);
  const fetchHeartRateData = async () => {
    const response = await fetch(
      `https://nowatch-fullstack-test-assignment.vercel.app/api/measurements?username=${username}`
    );
    if (!response.ok) return;
    const data = await response.json();
    const newHeartRateData: { timestamp: number; heartRate: number }[] =
      data.measurements;
    setBuffer((prevBuffer) => {
      const prevBufferTimestamps = new Set([
        ...prevBuffer.map((d) => d.timestamp),
      ]);
      const uniqueNewData = newHeartRateData.filter(
        (d) => !prevBufferTimestamps.has(d.timestamp)
      );
      return [...prevBuffer, ...uniqueNewData];
    });
  };
  useEffect(() => {
    const interval = setInterval(fetchHeartRateData, 1000);
    return () => clearInterval(interval);
  }, [username]);
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRateData((oldHeartRateData) => {
        if (bufferIndex >= buffer.length) return oldHeartRateData;
        const nextItem = buffer[bufferIndex];
        const updatedData = [...oldHeartRateData, nextItem];
        if (updatedData.length > 180) {
          updatedData.shift();
        }
        return updatedData;
      });
      setBufferIndex((prevIndex) => prevIndex + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [bufferIndex]);
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
        borderColor: (context: { chart: ChartType }) => {
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
          gradient.addColorStop(0, "yellow");
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
  const chartOptions: ChartOptions<"line"> = {
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
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          color: "white",
          callback: (value: string | number) => {
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
          label: (tooltipItem: TooltipItem<"line">) => {
            const closestData = heartRateData[tooltipItem.dataIndex];
            const closestZone =
              closestData.heartRate > 160
                ? "5"
                : closestData.heartRate > 120
                  ? "4"
                  : closestData.heartRate > 80
                    ? "3"
                    : "2";
            const closestTimestamp = new Date(
              closestData.timestamp
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            return ` Heart Rate: ${tooltipItem.raw} | Zone: ${closestZone} | BPM Time: ${closestTimestamp} `;
          },
        },
      },
    },
  };
  return (
    <div className={styles.graph}>
      {heartRateData.length < 4 ? (
        <Loading />
      ) : (
        <>
          <img
            src={`/images/heart.svg`}
            alt={`heart`}
            className={styles.heart}
          />
          <Line data={chartData} options={chartOptions} />
        </>
      )}
    </div>
  );
};

export default HeartRateGraph;
