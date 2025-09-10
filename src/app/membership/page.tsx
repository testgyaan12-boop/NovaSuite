import PageHeader from "@/components/layout/page-header";
import { MembershipClient } from "./membership-client";

export default function MembershipPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="My Membership"
        description="View your active plan, trainer details, and attendance."
      />
      <MembershipClient />
    </div>
  );
}
