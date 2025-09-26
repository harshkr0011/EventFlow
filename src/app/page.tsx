
'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (pathname === '/landing' || pathname === '/login' || pathname === '/signup') {
          router.push('/dashboard');
        }
      } else {
        if (pathname === '/dashboard') {
          router.push('/login');
        } else if (pathname === '/') {
          router.push('/landing');
        }
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
        <div className="flex flex-col min-h-screen w-full p-8 space-y-4">
            <Skeleton className="h-16 w-full" />
            <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-8">
                <Skeleton className="h-64 hidden md:block" />
                <div className="md:col-span-3 space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
    )
  }
  
  // Render nothing while redirecting
  return null;
}
