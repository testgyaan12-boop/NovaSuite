
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Dumbbell,
  ClipboardList,
  LineChart,
  UtensilsCrossed,
  UserSquare,
  LogIn,
} from "lucide-react";
import { ApexAthleticsLogo } from "@/components/icons/logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/plans", label: "Plans", icon: ClipboardList },
  { href: "/diet", label: "Diet", icon: UtensilsCrossed },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/trainer", label: "Trainer", icon: UserSquare },
];

const bottomNavItems = [
    { href: "/login", label: "Login", icon: LogIn },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0" asChild>
              <Link href="/">
                <ApexAthleticsLogo className="size-6 text-primary" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold font-headline">
              Apex Athletics
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarContent className="mt-auto">
            <SidebarMenu>
                 {bottomNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.label}
                        >
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    ))}
            </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-start p-2 border-b md:hidden">
            <SidebarTrigger />
            <div className="flex items-center gap-2 ml-2">
                 <ApexAthleticsLogo className="size-6 text-primary" />
                <h1 className="text-lg font-semibold font-headline">
                Apex Athletics
                </h1>
            </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
