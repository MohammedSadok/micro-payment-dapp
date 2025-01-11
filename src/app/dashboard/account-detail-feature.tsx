"use client";

import { PublicKey } from "@solana/web3.js";
import { useParams } from "next/navigation";
import { useMemo } from "react";
// Hypothetical function to fetch user ID client-side
import { AccountBalance } from "../../components/account/account-ui";
import { ellipsify } from "../../components/ui/ui-layout";
// import { AccountTransactions } from "./account-transactions-table";
// import { AccountBalance, AccountButtons } from "./account-ui";
import { useGetTransactions } from "@/components/account/account-data-access";
import { MoneyFlow, Transaction } from "@/components/money-flow";
import { RecentTransactions } from "@/components/recent-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi } from "lucide-react";
interface AccountDetailFeatureProps {
  userId: string;
}

export default function AccountDetailFeature({
  userId,
}: AccountDetailFeatureProps) {
  const params = useParams();

  // Parse the address from params
  const address = useMemo(() => {
    if (!params?.address) {
      console.error("No address provided");
      return null;
    }
    try {
      return new PublicKey(params.address);
    } catch (e) {
      console.error("Invalid public key:", e);
      return null;
    }
  }, [params]);

  const query = useGetTransactions({ address: address! });

  const transformTransactions = (queryData: any[]): Transaction[] => {
    if (!queryData || !Array.isArray(queryData)) {
      return [];
    }

    return queryData.map((item): Transaction => {
      const fromPublicKey = item.transaction?.message?.accountKeys[0]?.pubkey;
      const toPublicKey = item.transaction?.message?.accountKeys[1]?.pubkey;

      return {
        id: item.signature || `tx-${Math.random()}`,
        amount: item.amount || 0,
        type: item.type,
        date: new Date(item.blockTime * 1000), // Convert Unix timestamp to Date
        description: `${item.type} ${item.amount} SOL`,
        fromPublicKey: fromPublicKey || "",
        toPublicKey: toPublicKey || "",
        status: item.meta?.err ? "failed" : "success",
        paymentMethod: "SOL",
      };
    });
  };
  // Usage in your component:
  const transactions = useMemo(() => {
    return transformTransactions(query.data || []);
  }, [query.data, address]);
  // Render error state
  if (!address) {
    return <div>Error loading account</div>;
  }

  // Render account details
  return (
    <>
      <Card className="w-full bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-75 mb-1">Current Balance</p>
              <AccountBalance address={address} />
            </div>
            <Wifi className="h-6 w-6 rotate-90" />
          </div>
          <div className="pt-4">
            <p className="text-lg tracking-wider">
              {ellipsify(address.toString())}
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Money Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <MoneyFlow transactions={transactions} />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] overflow-auto">
              <RecentTransactions transactions={transactions} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
