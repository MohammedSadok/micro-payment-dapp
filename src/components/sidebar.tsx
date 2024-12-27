"use client";

import {
  Activity,
  CreditCard,
  LayoutDashboard,
  PanelLeftOpen,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Transactions",
    icon: Activity,
    href: "/account",
    color: "text-violet-500",
  },

  {
    label: "Profile",
    icon: User,
    href: "/profile",
    color: "text-orange-700",
  },
  // {
  //   label: "Settings",
  //   icon: Settings,
  //   href: "/settings",
  // },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } transition-all duration-300 ease-in-out space-y-4 py-4 flex flex-col h-screen bg-[#111827] text-white`}
    >
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <h1 className={`text-2xl font-bold ${isOpen ? "" : "hidden"}`}>
            Crypto<span className="text-primary">Pay</span>
          </h1>
          {!isOpen && <CreditCard className="h-8 w-8" />}
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {isOpen && route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 hover:bg-white/10 rounded-lg transition"
      >
        <PanelLeftOpen
          className={`h-5 w-5 ${
            isOpen ? "rotate-180" : ""
          } transition-transform`}
        />
      </button>
    </div>
  );
}
