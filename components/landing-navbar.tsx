"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Navbar,
  NavbarLogo,
  NavBody,
  NavItems,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Features", link: "#features" },
    { name: "Portals", link: "#portals" },
    { name: "Trainee", link: "/trainee/login" },
    { name: "Teacher", link: "/trainer/login" },
    { name: "Admin", link: "/admin/login" },
  ];

  return (
    <Navbar>
      <NavbarLogo subtitle="Official Portal" />
      <NavBody>
        <NavItems items={navItems} />
        <div className="flex items-center gap-2.5 ml-2 pl-3 border-l border-slate-200">
          <Link href="/trainee/login">
            <NavbarButton variant="secondary">Sign In</NavbarButton>
          </Link>
          <Link href="/trainee/signup">
            <LiquidMetalButton label="Get Started" />
          </Link>
        </div>
      </NavBody>
      <MobileNav>
        <MobileNavHeader>
          <div className="flex items-center gap-2">
            <Link href="/trainee/login">
              <NavbarButton variant="secondary">Login</NavbarButton>
            </Link>
            <MobileNavToggle isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
          </div>
        </MobileNavHeader>
        <MobileNavMenu isOpen={isOpen} items={navItems} onClose={() => setIsOpen(false)} />
      </MobileNav>
    </Navbar>
  );
}
