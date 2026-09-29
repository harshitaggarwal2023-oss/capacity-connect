"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { GlobalSearch } from "@/components/global-search";
import { IconLogout } from "@tabler/icons-react";
import { signOut } from "next-auth/react";

interface PortalNavbarProps {
  navItems: { name: string; link: string }[];
  title?: string;
}

export function PortalNavbar({ navItems, title }: PortalNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const formattedNavItems = navItems.map((item) => ({
    ...item,
    active: pathname === item.link || (item.link !== "/" && pathname.startsWith(item.link)),
  }));

  return (
    <>
      <GlobalSearch />
      <Navbar>
        <NavbarLogo subtitle={title} />
        <NavBody>
          <NavItems items={formattedNavItems} />
          <div className="flex items-center gap-3 ml-2 pl-3 border-l border-slate-200">
            <NotificationBell />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              title="Sign Out"
              className="p-1.5 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <IconLogout size={18} />
            </button>
          </div>
        </NavBody>
        <MobileNav>
          <MobileNavHeader>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sign Out"
                className="p-1.5 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <IconLogout size={18} />
              </button>
              <MobileNavToggle isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
            </div>
          </MobileNavHeader>
          <MobileNavMenu isOpen={isOpen} items={navItems} onClose={() => setIsOpen(false)} />
        </MobileNav>
      </Navbar>
    </>
  );
}
