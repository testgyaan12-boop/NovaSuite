
import PageHeader from "@/components/layout/page-header";
import { LoginClient } from "./login-client";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Login"
        description="Access your personalized fitness dashboard."
      />
      <LoginClient />
    </div>
  );
}
