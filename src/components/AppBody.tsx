'use client';

import { useSidebar } from '@/hooks/use-sidebar-provider';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';

export default function AppBody({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  return (
    <div className="relative flex min-h-screen w-full flex-col" data-sidebar={state}>
      <Header />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 p-4 transition-all duration-300 ease-in-out data-[sidebar=expanded]:sm:ml-72 sm:px-6 sm:py-4 sm:ml-[78px]">
          {children}
        </main>
      </div>
    </div>
  )
}
