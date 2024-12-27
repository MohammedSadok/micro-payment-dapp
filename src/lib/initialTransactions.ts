// import { Transaction } from "@/types";
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

export const initialTransactions: Transaction[] = [
  {
    id: "1",
    amount: 500.0,
    type: "RECEIVE",
    date: new Date("2024-12-01"),
    status: "success",
    description: "Payment received from John Doe",
    toPublicKey: "0x1234...5678",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "2",
    amount: -250.0,
    type: "SEND",
    date: new Date("2024-12-02"),
    status: "pending",
    description: "Payment to Jane Smith",
    fromPublicKey: "0x5678...1234",
    paymentMethod: "Crypto Transfer",
  },
  {
    id: "3",
    amount: 1000.0,
    type: "RECEIVE",
    date: new Date("2024-12-03"),
    status: "success",
    description: "Salary deposit",
    toPublicKey: "0x9876...5432",
    paymentMethod: "Direct Deposit",
  },
  {
    id: "4",
    amount: -75.5,
    type: "SEND",
    date: new Date("2024-12-04"),
    status: "success",
    description: "Grocery shopping",
    fromPublicKey: "0x2468...1357",
    paymentMethod: "Credit Card",
  },
  {
    id: "5",
    amount: 300.0,
    type: "RECEIVE",
    date: new Date("2024-12-05"),
    status: "success",
    description: "Freelance payment",
    toPublicKey: "0x1357...2468",
    paymentMethod: "PayPal",
  },
  {
    id: "6",
    amount: -120.0,
    type: "SEND",
    date: new Date("2024-12-12"),
    status: "failed",
    description: "Online purchase",
    fromPublicKey: "0x8642...9753",
    paymentMethod: "Debit Card",
  },
  {
    id: "7",
    amount: 50.0,
    type: "RECEIVE",
    date: new Date("2024-12-07"),
    status: "success",
    description: "Refund",
    toPublicKey: "0x9753...8642",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "8",
    amount: -200.0,
    type: "SEND",
    date: new Date("2024-12-08"),
    status: "pending",
    description: "Rent payment",
    fromPublicKey: "0x3691...2580",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "9",
    amount: 150.0,
    type: "RECEIVE",
    date: new Date("2024-12-09"),
    status: "success",
    description: "Dividend payment",
    toPublicKey: "0x2580...3691",
    paymentMethod: "Direct Deposit",
  },
  {
    id: "10",
    amount: -80.0,
    type: "SEND",
    date: new Date("2024-12-10"),
    status: "success",
    description: "Utility bill",
    fromPublicKey: "0x1470...2581",
    paymentMethod: "Auto-payment",
  },
];
