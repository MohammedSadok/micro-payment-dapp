"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ClusterUiSelect } from "./cluster/cluster-ui";
import { WalletButton } from "./solana/solana-provider";

export function TopBar() {
  const pathname = usePathname();
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
  });

  const getPageTitle = (path: string) => {
    const routes: { [key: string]: string } = {
      "/": "Dashboard",
      "/transactions": "Transactions",
      "/exchange": "Exchange",
      "/profile": "Profile",
      "/settings": "Settings",
      "/clothes": "Clothes",
    };
    return routes[path] || "Page Not Found";
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
  };

  return (
    <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between">
      <h1 className="text-xl font-semibold">{getPageTitle(pathname)}</h1>
      <div className="flex items-center space-x-4">
        <WalletButton className="" />
        <ClusterUiSelect />
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
