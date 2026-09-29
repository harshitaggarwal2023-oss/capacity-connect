"use client";

import React, { useState } from "react";
import { Navbar, NavBody, NavItems, MobileNav, NavbarLogo, MobileNavHeader, MobileNavToggle, MobileNavMenu } from "@/components/ui/resizable-navbar";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { GlobalSearch } from "@/components/global-search";

interface PortalNavbarProps {
  navItems: { name: string; link: string }[];
  title?: string;
}

export function PortalNavbar({ navItems, title }: PortalNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <GlobalSearch />
      <Navbar>
        <NavbarLogo />
        <NavBody>
          <NavItems items={navItems} />
          <div className="flex items-center gap-4 ml-4 border-l border-slate-200 pl-4">
            <NotificationBell />
          </div>
        </NavBody>
        <MobileNav>
          <MobileNavHeader>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <MobileNavToggle isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
            </div>
          </MobileNavHeader>
          <MobileNavMenu isOpen={isOpen} items={navItems} onClose={() => setIsOpen(false)} />
        </MobileNav>
      </Navbar>
    </>
  );
}
