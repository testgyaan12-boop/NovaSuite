import PageHeader from "@/components/layout/page-header";
import { TrainerClient } from "./trainer-client";

export default function TrainerPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Trainer Routines"
        description="Add workout plans from your trainer using a plan code."
      />
      <TrainerClient />
    </div>
  );
}
