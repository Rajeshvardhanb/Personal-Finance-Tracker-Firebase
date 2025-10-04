"use client";

import { useState, useEffect } from "react";
import {
  Home,
  PanelLeft,
  Settings,
  Wallet,
  Landmark,
  CreditCard,
  BookText,
  PiggyBank,
} from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import MonthSelector from "./MonthSelector";
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

export default function Header() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-secondary px-4 sm:h-[60px] sm:px-6">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-primary-foreground"
        >
          <AppLogo className="font-bold text-lg" />
        </Link>
      </div>

      <div className="h-8 border-l border-secondary-foreground/20"></div>

      <div className="flex w-full items-center gap-4">
        <div className="hidden sm:block">
            <h1 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">FINANCE TRACKER</h1>
        </div>
        <div className="ml-auto flex items-center gap-4 md:gap-2 lg:gap-4">
            <MonthSelector />
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full border-2 border-secondary-foreground/20"
                >
                <Image
                    src="https://picsum.photos/seed/user-avatar/36/36"
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                    data-ai-hint="person portrait"
                />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Rajesh's Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:hidden">
        {isClient ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="text-primary-foreground">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs bg-secondary border-r-0">
              <nav className="grid gap-6 text-lg font-medium">
                <SheetClose asChild>
                  <Link
                    href="/"
                    className="group flex h-10 shrink-0 items-center justify-start gap-2 rounded-lg bg-primary px-3 text-lg font-semibold text-primary-foreground md:text-base"
                  >
                     <AppLogo className="font-bold text-lg" />
                  </Link>
                </SheetClose>
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 px-2.5",
                        pathname === item.href
                          ? "text-primary-foreground"
                          : "text-muted-foreground/80 hover:text-primary-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground/80 hover:text-primary-foreground"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="h-10 w-10" />
        )}
      </div>
    </header>
  );
}
