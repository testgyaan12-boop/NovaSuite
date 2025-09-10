
import PageHeader from "@/components/layout/page-header";
import { ProfileClient } from "./profile-client";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Your Profile"
        description="Manage your personal information and preferences."
      />
      <ProfileClient />
    </div>
  );
}
