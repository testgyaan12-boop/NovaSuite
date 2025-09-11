
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Dumbbell,
  ClipboardList,
  LineChart,
  UtensilsCrossed,
  User,
  Store,
  IdCard,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApexAthleticsLogo } from "@/components/icons/logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import type { ReactNode } from "react";
import { Toaster } from "../ui/toaster";
import { Sheet, SheetContent } from "../ui/sheet";
import { useSidebar } from "../ui/sidebar";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/plans", label: "Plans", icon: ClipboardList },
  { href: "/diet", label: "Diet", icon: UtensilsCrossed },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/trainer", label: "Trainer", icon: User },
  { href: "/gyms", label: "Gyms", icon: Store },
  { href: "/membership", label: "Membership", icon: IdCard },
];

function NavMenu() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
      <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  onClick={() => setOpenMobile(false)}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
      </SidebarMenu>
  )
}

function Header() {
    return (
        <header className="flex h-14 items-center justify-between p-2 border-b md:justify-end">
            <div className="flex items-center md:hidden">
                <SidebarTrigger />
                <div className="flex items-center gap-2 ml-2">
                    <ApexAthleticsLogo className="size-6 text-primary" />
                    <h1 className="text-lg font-semibold font-headline">
                    Apex Athletics
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <User />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/login">Login</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

function MobileSheet({ children }: { children: ReactNode }) {
    const { openMobile, setOpenMobile } = useSidebar();
    return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
            <SheetContent side="left" className="w-[18rem] bg-sidebar text-sidebar-foreground flex flex-col p-0">
                {children}
            </SheetContent>
        </Sheet>
    );
}


export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
         <Sidebar className="hidden md:flex">
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
        <MobileSheet>
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
        </MobileSheet>
        <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
