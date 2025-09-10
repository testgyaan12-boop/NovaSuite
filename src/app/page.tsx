
'use client';

import { useState, useEffect } from 'react';
import PageHeader from "@/components/layout/page-header";
import { DashboardClient } from "./dashboard-client";

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
      {isClient ? <DashboardClient /> : null}
    </div>
  );
}
