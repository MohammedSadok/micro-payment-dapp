"use client";

// import { Transaction } from "@/lib/types";
export interface Transaction {
  id: string;
  amount: number;
  type: "SEND" | "RECEIVE";
  date: Date;
  description?: string;
  toPublicKey?: string;
  fromPublicKey?: string;
  status: "pending" | "success" | "failed";
  paymentMethod: string;
}
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MoneyFlowProps {
  transactions: Transaction[];
}

const generateMonthlyData = (transactions: Transaction[]) => {
  const monthlyData: {
    [key: string]: { month: string; income: number; expense: number };
  } = {};
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Initialize all months
  months.forEach((month) => {
    monthlyData[month] = { month, income: 0, expense: 0 };
  });

  // Aggregate transaction data
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const month = months[date.getMonth()];
    if (transaction.amount > 0) {
      monthlyData[month].income += transaction.amount;
    } else {
      monthlyData[month].expense += Math.abs(transaction.amount);
    }
  });

  return Object.values(monthlyData);
};

export function MoneyFlow({ transactions }: MoneyFlowProps) {
  const data = generateMonthlyData(transactions);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="income"
          name="Income"
          fill="#4CAF50"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expense"
          name="Expense"
          fill="#FF5252"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
