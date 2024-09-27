import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { format } from "date-fns";
import { getGraphData } from "./api";

const RevenueGraph = () => {
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [yearlyRevenue, setYearlyRevenue] = useState([]);

  const fetchPayments = async (startDate, endDate) => {
    try {
      const response = await getGraphData(startDate, endDate);
      return response.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchRevenueData = async () => {
      const today = new Date();
      const dailyStartDate = today.toISOString().split("T")[0];
      const dailyEndDate = today.toISOString().split("T")[0];

      const monthlyStartDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
        .toISOString()
        .split("T")[0];
      const monthlyEndDate = today.toISOString().split("T")[0];

      const yearlyStartDate = new Date(today.getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0];
      const yearlyEndDate = today.toISOString().split("T")[0];

      const dailyData = await fetchPayments(dailyStartDate, dailyEndDate);
      const monthlyData = await fetchPayments(monthlyStartDate, monthlyEndDate);
      const yearlyData = await fetchPayments(yearlyStartDate, yearlyEndDate);

      setDailyRevenue(dailyData);
      setMonthlyRevenue(monthlyData);
      setYearlyRevenue(yearlyData);
    };

    fetchRevenueData();
  }, []);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MM/dd");
  };

  return (
    <div>
      <h2>Revenue Graphs</h2>

      <h4>Daily Revenue</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dailyRevenue}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="created_at" />
          <YAxis
            domain={[0, Math.max(...dailyRevenue.map((data) => data.amount))]}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <h4>Monthly Revenue</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyRevenue}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="created_at" tickFormatter={formatDate} />
          <YAxis
            domain={[0, Math.max(...monthlyRevenue.map((data) => data.amount))]}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <h4>Yearly Revenue</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={yearlyRevenue}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="created_at" tickFormatter={formatDate} />
          <YAxis
            domain={[0, Math.max(...yearlyRevenue.map((data) => data.amount))]}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#ffc658"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueGraph;
