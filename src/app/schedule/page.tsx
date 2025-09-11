import PageHeader from "@/components/layout/page-header";
import { ScheduleClient } from "./schedule-client";

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Workout Schedule"
        description="Plan your week, schedule your workouts, and stay consistent."
      />
      <ScheduleClient />
    </div>
  );
}
