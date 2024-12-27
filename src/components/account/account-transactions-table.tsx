"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PublicKey } from "@solana/web3.js";
import { ChevronDown, ChevronUp, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { ExplorerLink } from "../cluster/cluster-ui";
import { ellipsify } from "../ui/ui-layout";
import { useGetTransactions } from "./account-data-access";

interface Transaction {
  signature: string;
  amount: number;
  type: "SEND" | "RECEIVE";
  blockTime: number;
  meta: {
    err: any;
    status: { Ok: null } | { Err: any };
  };
}

type SortKey = "signature" | "amount" | "type" | "blockTime" | "status";
type SortOrder = "asc" | "desc";

export function AccountTransactions({ address }: { address: PublicKey }) {
  const [sortKey, setSortKey] = useState<SortKey>("blockTime");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const query = useGetTransactions({ address });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedItems = useMemo(() => {
    if (!query.data) return [];
    return [...query.data].sort((a, b) => {
      if (sortKey === "status") {
        const aStatus = a.meta?.err ? "Failed" : "Success";
        const bStatus = b.meta?.err ? "Failed" : "Success";
        return sortOrder === "asc"
          ? aStatus.localeCompare(bStatus)
          : bStatus.localeCompare(aStatus);
      }

      if (sortKey === "amount") {
        const aAmount = a.amount || 0;
        const bAmount = b.amount || 0;
        return sortOrder === "asc" ? aAmount - bAmount : bAmount - aAmount;
      }

      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue == null || bValue == null) return 0;
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [query.data, sortKey, sortOrder]);

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => query.refetch()}
          disabled={query.isLoading}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      {query.isError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">
            {" "}
            {query.error?.message.toString()}
          </span>
        </div>
      )}

      {query.isSuccess && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer">Signature</TableHead>
                <TableHead
                  className="cursor-pointer "
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center">
                    Amount <SortIcon columnKey="amount" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center">
                    Type <SortIcon columnKey="type" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("blockTime")}
                >
                  <div className="flex items-center">
                    Date <SortIcon columnKey="blockTime" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status <SortIcon columnKey="status" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedItems.map((item) => (
                  <TableRow key={item.signature}>
                    <TableCell className="font-mono">
                      <ExplorerLink
                        path={`tx/${item.signature}`}
                        label={ellipsify(item.signature, 8)}
                      />
                    </TableCell>
                    <TableCell className="font-mono">
                      {item.amount} SOL
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          item.type === "SEND"
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        {item.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date((item.blockTime ?? 0) * 1000).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {item.meta?.err ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Success
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
