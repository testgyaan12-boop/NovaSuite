
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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Dumbbell,
  ClipboardList,
  LineChart,
  UtensilsCrossed,
  UserSquare,
  LogIn,
  Scan,
  User,
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
  { href: "/profile", label: "Profile", icon: User },
];

const bottomNavItems = [
    { href: "/login", label: "Login", icon: LogIn },
]

function NavMenu() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
     <>
      <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href} onClick={handleLinkClick}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
      </SidebarMenu>
      <SidebarContent className="mt-auto">
            <SidebarMenu>
                 {bottomNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.label}
                        >
                        <Link href={item.href} onClick={handleLinkClick}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    ))}
            </SidebarMenu>
      </SidebarContent>
    </>
  )
}


export function AppLayout({ children }: { children: React.ReactNode }) {

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
          <NavMenu />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-2 border-b md:hidden">
            <div className="flex items-center">
              <SidebarTrigger />
              <div className="flex items-center gap-2 ml-2">
                  <ApexAthleticsLogo className="size-6 text-primary" />
                  <h1 className="text-lg font-semibold font-headline">
                  Apex Athletics
                  </h1>
              </div>
            </div>
             <Button variant="ghost" size="icon" asChild>
                <Link href="/nutrition">
                  <Scan />
                </Link>
              </Button>
        </header>
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
