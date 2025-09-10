import PageHeader from "@/components/layout/page-header";
import { DietClient } from "./diet-client";

export default function DietPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Diet Plan"
        description="Set and track your daily nutrition goals."
      />
      <DietClient />
    </div>
  );
}
