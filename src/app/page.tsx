import PageHeader from "@/components/layout/page-header";
import { DashboardClient } from "./dashboard-client";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's a snapshot of your fitness journey."
      />
      <DashboardClient />
    </div>
  );
}
