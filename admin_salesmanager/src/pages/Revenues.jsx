import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const Revenues = () => {
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [revenueData, setRevenueData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (dateRange.start && dateRange.end) {
            fetchRevenueData(dateRange.start, dateRange.end);
        }
    }, [dateRange]);

    const fetchRevenueData = async (startDate, endDate) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("accessToken"); 
            if (!token) {
                console.error("No access token found. Please log in.");
                return;
            }
    
            const response = await axios.get(
                `http://localhost:5001/api/orders/revenue?start=${startDate}&end=${endDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                }
            );
    
            setRevenueData(response.data);
        } catch (error) {
            console.error("Failed to fetch revenue data:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Revenue and Profit/Loss</h1>

            {/* Date Range Selection */}
            <div className="flex items-center gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium">Start Date</label>
                    <input
                        type="date"
                        className="border px-4 py-2 rounded"
                        value={dateRange.start}
                        onChange={(e) =>
                            setDateRange({ ...dateRange, start: e.target.value })
                        }
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">End Date</label>
                    <input
                        type="date"
                        className="border px-4 py-2 rounded"
                        value={dateRange.end}
                        onChange={(e) =>
                            setDateRange({ ...dateRange, end: e.target.value })
                        }
                    />
                </div>
            </div>

            {/* Loading Indicator */}
            {loading && <p>Loading revenue data...</p>}

            {/* Revenue/Profit/Loss Chart */}
            {revenueData && !loading && (
                <div className="my-6">
                    <Bar
                        data={{
                            labels: revenueData.labels, 
                            datasets: [
                                {
                                    label: "Revenue",
                                    data: revenueData.revenue, 
                                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                                },
                                {
                                    label: "Profit",
                                    data: revenueData.profit,
                                    backgroundColor: "rgba(153, 102, 255, 0.6)",
                                },
                                {
                                    label: "Loss",
                                    data: revenueData.loss, 
                                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            scales: {
                                y: { beginAtZero: true },
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Revenues;

