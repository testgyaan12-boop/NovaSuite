import PageHeader from "@/components/layout/page-header";
import { WorkoutsClient } from "./workouts-client";

export default function WorkoutsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Workout Logs"
        description="Log your sessions and track your history."
      />
      <WorkoutsClient />
    </div>
  );
}
