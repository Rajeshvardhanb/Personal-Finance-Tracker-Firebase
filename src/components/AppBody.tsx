
'use client';

import { useSidebar } from '@/hooks/use-sidebar-provider';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';

export default function AppBody({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user && pathname !== '/login') {
    // Render nothing or a loading spinner while redirecting
    return null;
  }
  
  if (pathname === '/login') {
    return <main>{children}</main>;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1">
        <AppSidebar />
        <main
          className={cn(
            'flex-1 p-4 transition-all duration-300 ease-in-out sm:px-6 sm:py-4',
            state === 'expanded' ? 'sm:ml-56' : 'sm:ml-[78px]'
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
