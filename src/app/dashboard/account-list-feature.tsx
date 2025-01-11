"use client";

import { WalletButton } from "@/components/solana/solana-provider";
import { useWallet } from "@solana/wallet-adapter-react";

import { redirect } from "next/navigation";

export default function AccountListFeature() {
  const { publicKey } = useWallet();

  if (publicKey) {
    return redirect(`/dashboard/${publicKey.toString()}`);
  }

  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <WalletButton />
      </div>
    </div>
  );
}
