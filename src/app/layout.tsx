import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FinanceProvider } from '@/hooks/use-finances';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarProvider } from '@/hooks/use-sidebar-provider';
import { Inter as FontSans } from "next/font/google";
import { DM_Serif_Display as FontSerif } from "next/font/google";
import { Space_Mono as FontMono } from "next/font/google";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontSerif = FontSerif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
});

const fontMono = FontMono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: 'INR Tracker',
  description: 'A personal finance dashboard to track your income, expenses, and net worth.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontSerif.variable,
          fontMono.variable
        )}
      >
        <FinanceProvider>
          <SidebarProvider>
            <div className="relative flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1 transition-all duration-300 ease-in-out data-[state=expanded]:sm:ml-64" data-state='expanded'>
                <Header />
                <main className="p-4 sm:px-6 sm:py-4">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </FinanceProvider>
        <Toaster />
      </body>
    </html>
  );
}
