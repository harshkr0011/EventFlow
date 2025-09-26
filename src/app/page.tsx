
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardPage from './dashboard/page';
import LandingPage from './landing/page';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/landing');
    }
    if (!loading && user) {
        router.push('/dashboard');
    }
  }, [user, loading, router]);

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
  
  return null;
}
