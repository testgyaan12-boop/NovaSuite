import PageHeader from "@/components/layout/page-header";
import { TrainerClient } from "./trainer-client";

export default function TrainerPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Personal Trainer"
        description="Manage your assigned trainer and find new experts nearby."
      />
      <TrainerClient />
    </div>
  );
}
