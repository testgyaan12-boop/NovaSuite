import PageHeader from "@/components/layout/page-header";
import { ProgressClient } from "./progress-client";

export default function ProgressPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Progress Tracking"
        description="Log your body metrics and visualize your journey."
      />
      <ProgressClient />
    </div>
  );
}
