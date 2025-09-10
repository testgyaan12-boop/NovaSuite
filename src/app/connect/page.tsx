
import PageHeader from "@/components/layout/page-header";
import { ConnectClient } from "./connect-client";

export default function ConnectPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Connect Apps"
        description="Sync your data from other health and fitness services."
      />
      <ConnectClient />
    </div>
  );
}
