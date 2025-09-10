import PageHeader from "@/components/layout/page-header";
import { GymsClient } from "./gyms-client";

export default function GymsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Find a Gym"
        description="Browse local gyms, see their plans, and find special offers."
      />
      <GymsClient />
    </div>
  );
}
