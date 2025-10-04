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
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-card sm:flex">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <AppLogo className="h-8 w-auto text-primary" />
        </Link>
      </div>
      <nav className="flex flex-col gap-2 p-2 sm:py-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-start gap-3 rounded-lg px-3 py-2 transition-all",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-stretch gap-2 p-2 sm:py-3">
        <Link
          href="#"
          className="flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </nav>
    </aside>
  );
}
