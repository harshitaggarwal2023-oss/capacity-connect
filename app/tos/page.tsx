import Link from "next/link";
import { Navbar, NavbarLogo } from "@/components/ui/resizable-navbar";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar>
        <NavbarLogo />
        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Back to Home
        </Link>
      </Navbar>
      
      <main className="max-w-4xl mx-auto px-4 py-32 text-slate-800">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-8 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">1. Acceptance of Terms</h2>
            <p>By accessing and using the Capacity Connect platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">2. Use of Platform</h2>
            <p>You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the platform. Prohibited behavior includes harassing or causing distress to any person, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within the platform.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">3. Intellectual Property</h2>
            <p>All content included on the platform, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the site, is the property of Capacity Connect or its suppliers and protected by copyright and other laws that protect intellectual property and proprietary rights.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">4. User Obligations</h2>
            <p>As a user, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">5. Termination</h2>
            <p>We may terminate or suspend access to our platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms of Service.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">6. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
          </section>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-200">
          <p>For details on how we handle your data, please see our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.</p>
        </div>
      </main>
    </div>
  );
}
