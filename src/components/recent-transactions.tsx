import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              {new Date(transaction.date).toLocaleDateString()}
            </TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell
              className={
                transaction.amount > 0 ? "text-green-500" : "text-red-500"
              }
            >
              ${Math.abs(transaction.amount).toFixed(2)}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
  );
}
