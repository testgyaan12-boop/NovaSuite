
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
  SidebarFooter,
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
  Rocket,
  Camera,
  MoreHorizontal,
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
import { useState, useEffect } from "react";
import { Toaster } from "../ui/toaster";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useSidebar } from "../ui/sidebar";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { cn } from "@/lib/utils";
import { BodybuilderIcon } from "../icons/bodybuilder-icon";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/plans", label: "Plans", icon: ClipboardList },
  { href: "/diet", label: "Diet", icon: UtensilsCrossed },
  { href: "/nutrition", label: "Nutrition", icon: Camera },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/trainer", label: "Trainer", icon: User },
  { href: "/gyms", label: "Gyms", icon: Store },
  { href: "/membership", label: "Membership", icon: IdCard },
  { href: "/profile", label: "Profile", icon: User },
];

const bottomNavPrimaryItems = navItems.slice(0, 4);
const moreNavItems = navItems.slice(4);

function NavMenu() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
      <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href} id={`nav-${item.label.toLowerCase()}`}>
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
        <header className="flex h-14 items-center justify-between p-2 border-b md:justify-end" id="app-header">
            <div className="flex items-center md:hidden">
                <SidebarTrigger />
                <div className="flex items-center gap-2 ml-2">
                    <BodybuilderIcon className="size-6 text-primary" />
                    <h1 className="text-lg font-semibold font-headline">
                    Apex Athletics
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="md:hidden" asChild>
                    <Link href="/nutrition">
                        <Camera />
                    </Link>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" id="profile-button">
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

function BottomNavBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50">
      <nav className="flex justify-around items-center h-full">
        {bottomNavPrimaryItems.map((item) => {
           const isActive = pathname === item.href;
           return (
              <Link href={item.href} key={item.label} className={cn("flex flex-col items-center justify-center gap-1 flex-1 h-full", isActive ? "text-primary" : "text-muted-foreground")}>
                <item.icon className="size-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
           )
        })}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
                <button className={cn("flex flex-col items-center justify-center gap-1 flex-1 h-full text-muted-foreground")}>
                    <MoreHorizontal className="size-5" />
                    <span className="text-xs">More</span>
                </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
                <SheetHeader>
                    <SheetTitle>More</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-4 gap-4 py-4">
                    {moreNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                href={item.href} 
                                key={item.label} 
                                className={cn("flex flex-col items-center justify-center gap-1 p-2 rounded-md", isActive ? "text-primary bg-muted" : "text-muted-foreground")}
                                onClick={() => setMoreOpen(false)}
                            >
                                <item.icon className="size-6" />
                                <span className="text-xs text-center">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
      </nav>
    </div>
    </>
  )
}

function PageLoader() {
    const pathname = usePathname();
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        setIsNavigating(false);
    }, [pathname]);

    useEffect(() => {
        const handleAnchorClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const anchor = target.closest('a');
            if (anchor && anchor.href && anchor.target !== '_blank' && new URL(anchor.href).origin === window.location.origin && new URL(anchor.href).pathname !== pathname) {
                setIsNavigating(true);
            }
        };

        const handleMutation: MutationCallback = () => {
             const anchors = document.querySelectorAll('a');
             anchors.forEach(anchor => anchor.addEventListener('click', handleAnchorClick));
        };

        document.body.addEventListener('click', handleAnchorClick);
        const observer = new MutationObserver(handleMutation);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.body.removeEventListener('click', handleAnchorClick);
            observer.disconnect();
        };

    }, [pathname]);

    return isNavigating ? (
        <div className="fixed top-0 left-0 w-full h-1 z-50">
            <div className="loader-bar"></div>
        </div>
    ) : null;
}

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { isMobile, setOpenMobile } = useSidebar();

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      allowClose: false,
      onHighlightStarted: () => {
        if (isMobile) {
          setOpenMobile(true);
        }
      },
       onPopoverRender: (popover) => {
        popover.wrapper.style.borderRadius = 'var(--radius)';
        popover.wrapper.style.backgroundColor = 'hsl(var(--background))';
      },
      onDestroyStarted: () => {
        if (!driverObj.isLastStep() || isMobile) {
          setOpenMobile(false);
        }
        if (!driverObj.isLastStep()) {
          driverObj.destroy();
        }
      },
      steps: [
        { popover: { title: 'Welcome to Apex Athletics!', description: 'Let\'s take a quick tour of the features.' } },
        { element: '#nav-dashboard', popover: { title: 'Dashboard', description: 'This is your main hub, showing a snapshot of your activity and goals.' } },
        { element: '#nav-schedule', popover: { title: 'Schedule', description: 'Plan your weekly workouts using the interactive calendar.' } },
        { element: '#nav-workouts', popover: { title: 'Workouts', description: 'Log your daily training sessions and view your history.' } },
        { element: '#nav-plans', popover: { title: 'Plans', description: 'Create, manage, and get AI suggestions for your personalized workout routines.' } },
        { element: '#nav-diet', popover: { title: 'Diet', description: 'Manage your nutritional goals and get AI-powered diet plans.' } },
        { element: '#nav-nutrition', popover: { title: 'Nutrition Analyzer', description: 'Use your camera to get instant nutritional info for your meals.' } },
        { element: '#profile-button', popover: { title: 'Your Profile', description: 'Access your profile settings and log out from here.' } },
        { popover: { title: 'Tour Complete!', description: 'You\'re all set! Feel free to explore and start your fitness journey.' } }
      ]
    });
    driverObj.drive();
  }

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar className="hidden md:flex">
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="shrink-0" asChild>
                <Link href="/">
                  <BodybuilderIcon className="size-6 text-primary" />
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
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={startTour} id="tour-start-button">
                  <Rocket />
                  <span>Start Tour</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <MobileSheet>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="shrink-0" asChild>
                <Link href="/">
                  <BodybuilderIcon className="size-6 text-primary" />
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
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={startTour}>
                  <Rocket />
                  <span>Start Tour</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </MobileSheet>
        <div className="flex flex-col flex-1">
          <PageLoader />
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6" id="main-content">{children}</main>
        </div>
      </div>
      <BottomNavBar />
      <Toaster />
    </>
  );
}


export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
