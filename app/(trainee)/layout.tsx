import { requireRole } from "@/lib/auth-helpers";
import { Navbar, NavBody, NavItems, MobileNav, NavbarLogo, NavbarButton, MobileNavHeader, MobileNavToggle, MobileNavMenu } from "@/components/ui/resizable-navbar";
import { ReactNode } from "react";

export default async function TraineeLayout({ children }: { children: ReactNode }) {
  await requireRole("TRAINEE");

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex flex-col md:flex-row">
      <Navbar className="hidden md:flex">
        <NavbarLogo title="Capacity Connect" />
        <NavBody>
          <NavItems>
            <NavbarButton href="/trainee/dashboard" label="Dashboard" />
            <NavbarButton href="/trainee/courses" label="Courses" />
            <NavbarButton href="/trainee/assessments" label="Assessments" />
            <NavbarButton href="/trainee/results" label="Results" />
            <NavbarButton href="/trainee/messages" label="Messages" />
          </NavItems>
        </NavBody>
      </Navbar>
      <MobileNav className="md:hidden">
        <MobileNavHeader>
          <NavbarLogo title="Capacity Connect" />
          <MobileNavToggle />
        </MobileNavHeader>
        <MobileNavMenu>
          <NavItems>
            <NavbarButton href="/trainee/dashboard" label="Dashboard" />
            <NavbarButton href="/trainee/courses" label="Courses" />
            <NavbarButton href="/trainee/assessments" label="Assessments" />
            <NavbarButton href="/trainee/results" label="Results" />
            <NavbarButton href="/trainee/messages" label="Messages" />
          </NavItems>
        </MobileNavMenu>
      </MobileNav>
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
