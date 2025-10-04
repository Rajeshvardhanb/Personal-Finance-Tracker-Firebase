
"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Menu,
  Settings,
  Wallet,
  Landmark,
  CreditCard,
  BookText,
  PiggyBank,
  LogOut,
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
import { AppLogo, AppLogoIcon } from "./icons";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

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
  const { user, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-0 border-b border-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-cyan-500 sm:h-[60px]">
      <div className="flex w-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
           <AppLogo />
        </div>
        <div className="flex-1 text-center hidden sm:block">
            <h1 className="text-xl font-semibold uppercase tracking-wider text-white/90">FINANCE TRACKER</h1>
        </div>
        <div className="flex items-center justify-end gap-4 md:gap-2 lg:gap-4">
            <div className="hidden sm:block">
              <MonthSelector />
            </div>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full border-2 border-white/20"
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
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuLabel className="font-normal capitalize">{user?.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex items-center gap-2 sm:hidden">
              {isClient ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-primary-foreground">
                      <Menu className="h-6 w-6" />
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
                          <AppLogoIcon className="h-8 w-8" />
                          <span className="font-bold">Menu</span>
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
                       <div className="pt-4 mt-auto">
                        <MonthSelector />
                       </div>
                    </nav>
                  </SheetContent>
                </Sheet>
              ) : (
                <div className="h-10 w-10" />
              )}
            </div>
        </div>
      </div>
    </header>
  );
}
