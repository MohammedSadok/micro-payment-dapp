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
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface OverviewProps {
  selectedPeriod: string;
  transactions: Transaction[];
}

const generateData = (period: string, transactions: Transaction[]) => {
  const data: { name: string; income: number; expense: number }[] = [];
  const now = new Date();
  const intervals = period === "24h" ? 24 : period === "7d" ? 7 : 30;
  const intervalType = period === "24h" ? "hour" : "day";
  const msPerInterval =
    intervalType === "hour" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  for (let i = intervals - 1; i >= 0; i--) {
    const intervalStart = new Date(now.getTime() - i * msPerInterval);
    const intervalEnd = new Date(intervalStart.getTime() + msPerInterval);

    const intervalTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= intervalStart && transactionDate < intervalEnd;
    });

    const income = intervalTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = intervalTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    data.push({
      name:
        intervalType === "hour"
          ? `${intervalStart.getHours()}:00`
          : intervalStart.toLocaleDateString(),
      income,
      expense,
    });
  }

  return data;
};

export function Overview({ selectedPeriod, transactions }: OverviewProps) {
  const data = generateData(selectedPeriod, transactions);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          // fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          // fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#4CAF50"
          strokeWidth={2}
          dot={false}
          name="Income"
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#FF5252"
          strokeWidth={2}
          dot={false}
          name="Expense"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
