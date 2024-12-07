"use client";

import styles from "./chart.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ data: data2 }) => {
  const {
    todayPayments,
    sumPayments,
    yesterdayPayments,
    sumPaymentsYesterday,
    beforeYesterdayPayments,
    sumPaymentsBeforeYesterday,
  } = data2;
  const data = [
    {
      name: "Before Yesterday",
      count: beforeYesterdayPayments,
      amount: sumPaymentsBeforeYesterday,
    },
    {
      name: "Yesterday",
      count: yesterdayPayments,
      amount: sumPaymentsYesterday,
    },
    {
      name: "Today",
      count: todayPayments,
      amount: sumPayments,
    },
  ];
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Weekly Recap</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip contentStyle={{ background: "#151c2c", border: "none" }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#82ca9d"
            strokeDasharray="3 4 5 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
