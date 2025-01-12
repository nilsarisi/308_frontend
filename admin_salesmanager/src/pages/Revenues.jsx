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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Revenues = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [distributionData, setDistributionData] = useState(null);
  const [loadingDistribution, setLoadingDistribution] = useState(false);
  const [distributionError, setDistributionError] = useState("");

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchRevenueData(dateRange.start, dateRange.end);
    }
  }, [dateRange]);

  useEffect(() => {
    // Fetch categories on component mount
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:5001/api/products/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0]); // Set the first category as default
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error.message);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchDistributionData(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchRevenueData = async (startDate, endDate) => {
    setLoading(true);
    setErrorMessage(""); // Reset error message
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setErrorMessage("No access token found. Please log in.");
        return;
      }

      const response = await axios.get(
        `http://localhost:5001/api/orders/revenue?start=${startDate}&end=${endDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data || !response.data.revenue.length) {
        setErrorMessage("No data available for the selected date range.");
      } else {
        setRevenueData(response.data);
      }
    } catch (error) {
      setErrorMessage("Failed to fetch revenue data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDistributionData = async (category) => {
    setLoadingDistribution(true);
    setDistributionError(""); // Reset error message
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://localhost:5001/api/orders/distribution?category=${category}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDistributionData(response.data);
    } catch (error) {
      setDistributionError("Failed to fetch product distribution. Please try again later.");
    } finally {
      setLoadingDistribution(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Revenue and Product Distribution</h1>

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

      {/* Revenue/Profit/Loss Histogram */}
      {loading && <p>Loading revenue data...</p>}
      {errorMessage && <div className="text-red-500 my-4">{errorMessage}</div>}
      {revenueData && !loading && !errorMessage && (
        <div className="my-6">
          <Bar
            data={{
              labels: ["Revenue", "Profit", "Loss"],
              datasets: [
                {
                  label: "Amount",
                  data: [
                    revenueData.revenue[0] || 0,
                    revenueData.profit[0] || 0,
                    revenueData.loss[0] || 0,
                  ],
                  backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                x: {
                  type: "category",
                },
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: "Revenue, Profit, and Loss Histogram",
                },
              },
            }}
          />
        </div>
      )}

      {/* Category Selection */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Select Category</label>
          <select
            className="border px-4 py-2 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Distribution Graph */}
      {loadingDistribution && <p>Loading product distribution...</p>}
      {distributionError && (
        <div className="text-red-500 my-4">{distributionError}</div>
      )}
      {distributionData && !loadingDistribution && !distributionError && (
        <div className="my-6">
          <Bar
            data={{
              labels: Object.keys(distributionData),
              datasets: [
                {
                  label: "Products Sold",
                  data: Object.values(distributionData),
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                x: {
                  type: "category",
                },
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: `Product Distribution in Category: ${selectedCategory}`,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Revenues;