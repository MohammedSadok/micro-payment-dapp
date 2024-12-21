"use client";

import { CreditCard } from "@/components/credit-card";
import { MoneyFlow } from "@/components/money-flow";
import { Overview } from "@/components/overview";
import { RecentTransactions } from "@/components/recent-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initialTransactions } from "@/lib/initialTransactions";
import { useMemo, useState } from "react";

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const periodInDays =
      selectedPeriod === "24h" ? 1 : selectedPeriod === "7d" ? 7 : 30;
    const startDate = new Date(
      now.getTime() - periodInDays * 24 * 60 * 60 * 1000
    );

    return initialTransactions.filter(
      (transaction) => new Date(transaction.date) >= startDate
    );
  }, [selectedPeriod]);

  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const totalExpense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [filteredTransactions]);

  const currentBalance = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  return (
    <div className="flex-1 space-y-3">
      <div className="flex items-center justify-between ">
        <h2 className="text-2xl font-bold tracking-tight">Banking Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <TabsList>
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 ">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Primary Account</CardTitle>
          </CardHeader>
          <CardContent>
            <CreditCard
              balance={currentBalance}
              cardNumber="1234 5678 9012 3456"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              ${totalIncome.toFixed(2)}
            </div>
            <Overview
              selectedPeriod={selectedPeriod}
              transactions={filteredTransactions.filter((t) => t.amount > 0)}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] overflow-auto">
              <RecentTransactions transactions={filteredTransactions} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Money Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <MoneyFlow transactions={initialTransactions} />
        </CardContent>
      </Card>
    </div>
  );
}
