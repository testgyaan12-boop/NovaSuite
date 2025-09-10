import PageHeader from "@/components/layout/page-header";
import { PlansClient } from "./plans-client";

export default function PlansPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Workout Plans"
        description="Create and manage your personalized workout routines."
      />
      <PlansClient />
    </div>
  );
}
