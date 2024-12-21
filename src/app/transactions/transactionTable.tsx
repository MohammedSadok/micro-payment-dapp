"use client";

import { NewTransactionForm } from "@/components/new-transaction-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { initialTransactions } from "@/lib/initialTransactions";
import { Transaction } from "@/lib/types";
import { ArrowUpDown, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [isNewTransactionFormOpen, setIsNewTransactionFormOpen] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: "asc" | "desc";
  } | null>(null);

  const handleNewTransaction = (newTransaction: Transaction) => {
    setTransactions([newTransaction, ...transactions]);
    setIsNewTransactionFormOpen(false);
  };

  const handleSort = (key: keyof Transaction) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = transactions;

    if (searchTerm) {
      result = result.filter(
        (transaction) =>
          transaction.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.amount.toString().includes(searchTerm) ||
          transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [transactions, searchTerm, sortConfig]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button onClick={() => setIsNewTransactionFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Transaction
        </Button>
      </div>
      <div className="mb-4 flex items-center">
        <Search className="mr-2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search transactions..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" onClick={() => handleSort("date")}>
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("amount")}>
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("status")}>
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="text-sm">
                <TableCell className="font-medium">
                  {transaction.date.toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell
                  className={
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  ${Math.abs(transaction.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      transaction.status === "success"
                        ? "bg-green-100 text-green-800"
                        : transaction.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {isNewTransactionFormOpen && (
        <NewTransactionForm
          onSubmit={handleNewTransaction}
          onCancel={() => setIsNewTransactionFormOpen(false)}
        />
      )}
    </div>
  );
}
