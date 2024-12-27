"use client";

import { PublicKey } from "@solana/web3.js";
import { useParams } from "next/navigation";
import { useMemo } from "react";
// Hypothetical function to fetch user ID client-side
import { ExplorerLink } from "../cluster/cluster-ui";
import { AppHero, ellipsify } from "../ui/ui-layout";
import { AccountTransactions } from "./account-transactions-table";
import { AccountBalance, AccountButtons } from "./account-ui";

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

  // Render error state
  if (!address) {
    return <div>Error loading account</div>;
  }

  // Render account details
  return (
    <div>
      <AppHero
        title={<AccountBalance address={address} />}
        subtitle={
          <div className="my-2">
            <ExplorerLink
              path={`account/${address}`}
              label={ellipsify(address.toString())}
            />
          </div>
        }
      >
        <AccountButtons address={address} userId={userId} />
      </AppHero>
      {/* <div className="space-y-8"> */}
      {/* <AccountTokens address={address} /> */}
      <AccountTransactions address={address} />
      {/* </div> */}
    </div>
  );
}
