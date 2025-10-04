"use client";

import Link from "next/link";
import {
  Home,
  Settings,
  Wallet,
  Landmark,
  CreditCard,
  BookText,
  PiggyBank,
} from "lucide-react";

import { AppLogo } from "./icons";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/income", icon: Landmark, label: "Income" },
    { href: "/expenses", icon: Wallet, label: "Expenses" },
    { href: "/credit-cards", icon: CreditCard, label: "Credit Cards" },
    { href: "/net-worth", icon: PiggyBank, label: "Net Worth" },
    { href: "/reports", icon: BookText, label: "Reports" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-card sm:flex">
      <nav className="flex flex-col items-stretch gap-4 px-4 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:text-base"
        >
          <AppLogo className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="">Personal Finance Tracker</span>
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-9 items-center justify-start gap-3 rounded-lg px-3 transition-colors",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="">{item.label}</span>
          </Link>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-stretch gap-4 px-4 sm:py-5">
        <Link
          href="#"
          className="flex h-9 items-center justify-start rounded-lg px-3 text-muted-foreground transition-colors hover:text-foreground md:h-8"
        >
          <Settings className="h-5 w-5 mr-3" />
          <span className="">Settings</span>
        </Link>
      </nav>
    </aside>
  );
}
