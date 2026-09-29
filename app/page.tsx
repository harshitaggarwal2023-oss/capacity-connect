import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { PortalCards } from "@/components/landing/portal-cards";
import { DemoSection } from "@/components/landing/demo-section";
import { AnnouncementsFeed } from "@/components/landing/announcements-feed";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Navbar, NavbarLogo, NavBody, NavItems, NavbarButton } from "@/components/ui/resizable-navbar";

export const revalidate = 60;

export default async function LandingPage() {
  const announcements = await prisma.announcement.findMany({
    take: 4,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-plus-jakarta">
      <Navbar>
        <NavbarLogo />
        <NavBody>
          <NavItems items={[
            { name: "Features", link: "#features" },
            { name: "How it Works", link: "#demo" },
            { name: "Portals", link: "#portals" },
          ]} />
          <div className="flex items-center gap-4">
            <Link href="/trainee/login">
              <NavbarButton variant="secondary">Log In</NavbarButton>
            </Link>
            <Link href="/trainee/signup">
              <button className="px-5 py-2 rounded-xl bg-gradient-to-b from-slate-200 to-slate-400 text-slate-900 text-sm font-semibold shadow-inner border border-slate-500 hover:from-slate-300 hover:to-slate-500 transition-all">
                Get Started
              </button>
            </Link>
          </div>
        </NavBody>
      </Navbar>
      
      <main className="pt-20">
        <Hero />
        <div id="features"><Features /></div>
        <div id="portals"><PortalCards /></div>
        <div id="demo"><DemoSection /></div>
        <AnnouncementsFeed announcements={announcements} />
      </main>
      
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800 text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} Capacity Connect. All rights reserved.</p>
          <div className="flex gap-6 mt-6 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/tos" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}