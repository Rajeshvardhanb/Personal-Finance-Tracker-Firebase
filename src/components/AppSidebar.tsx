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
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r bg-secondary pt-14 sm:flex">
      <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
      </div>
      <nav className="flex flex-col gap-2 p-2 sm:py-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-start gap-3 rounded-lg px-3 py-2 transition-all duration-300",
              pathname === item.href
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground/80 hover:bg-secondary-foreground/10 hover:text-primary-foreground"
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
          className="flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground/80 transition-all hover:bg-secondary-foreground/10 hover:text-primary-foreground"
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </nav>
    </aside>
  );
}
