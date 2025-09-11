import type { ReactNode } from "react";
import { AppLayoutClient } from "./app-layout-client";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutClient>{children}</AppLayoutClient>;
}
