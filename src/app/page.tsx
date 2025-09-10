
'use client';

import { useState, useEffect } from 'react';
import PageHeader from "@/components/layout/page-header";
import { DashboardClient } from "./dashboard-client";
import { Skeleton } from '@/components/ui/skeleton';

function DashboardSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
        </div>
    )
}


export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's a snapshot of your fitness journey."
      />
      {isClient ? <DashboardClient /> : <DashboardSkeleton />}
    </div>
  );
}
