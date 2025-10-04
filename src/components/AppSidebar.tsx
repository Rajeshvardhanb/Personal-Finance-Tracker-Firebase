
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
import { useSidebar } from "@/hooks/use-sidebar-provider";
import { SidebarToggle } from "./SidebarToggle";

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
  const { state, isMobile, open } = useSidebar();

  if (isMobile && !open) {
    return null;
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex-col border-r border-transparent bg-gradient-to-b from-indigo-700 via-purple-700 to-cyan-500 text-white transition-all duration-300 ease-in-out",
        state === 'expanded' ? 'w-72' : 'w-[78px]',
        isMobile ? "flex" : "hidden sm:flex"
      )}
    >
      <SidebarToggle />
      <div className={cn("flex h-14 items-center px-4 lg:h-[60px] lg:px-6", state === 'expanded' ? 'justify-start' : 'justify-center')}>
      </div>
      <nav className="flex flex-col gap-2 p-2 sm:py-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300",
              state === 'expanded' ? "justify-start" : "justify-center",
              pathname === item.href
                ? "bg-white/20 text-white shadow-lg"
                : "text-white/80 hover:bg-white/10"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className={cn("font-medium", state === 'collapsed' && "hidden")}>{item.label}</span>
          </Link>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-stretch gap-2 p-2 sm:py-3">
        <Link
          href="#"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-white/80 transition-all hover:bg-white/10",
            state === 'expanded' ? "justify-start" : "justify-center"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span className={cn("font-medium", state === 'collapsed' && "hidden")}>Settings</span>
        </Link>
      </nav>
    </aside>
  );
}
