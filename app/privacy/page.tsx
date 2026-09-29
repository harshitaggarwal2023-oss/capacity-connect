import Link from "next/link";
import { Navbar, NavbarLogo } from "@/components/ui/resizable-navbar";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar>
        <NavbarLogo />
        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Back to Home
        </Link>
      </Navbar>
      
      <main className="max-w-4xl mx-auto px-4 py-32 text-slate-800">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">1. Data We Collect</h2>
            <p>We collect information that you provide directly to us when you create an account, update your profile, use the interactive features of the platform, participate in assessments, or communicate with us. This may include your name, email address, job title, assessment scores, and platform usage data.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">2. How We Use Data</h2>
            <p>We use the information we collect to operate, maintain, and provide the features and functionality of the platform. We also use it to communicate directly with you, such as to send you email messages regarding your training progress, certificates, and announcements, and to provide personalized competency mapping.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">3. Data Storage and Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. Your data is stored on secure servers and we implement industry-standard encryption practices for data transmission.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">4. Your Rights</h2>
            <p>Under GDPR and similar regulations, you have the right to access, rectify, or erase any personal data we hold about you. You can also restrict or object to certain processing of your data. To exercise these rights, please contact the platform administration through your designated channels.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact your organization's system administrator or our support team directly.</p>
          </section>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-200">
          <p>By using the platform, you also agree to our <Link href="/tos" className="text-blue-600 hover:underline">Terms of Service</Link>.</p>
        </div>
      </main>
    </div>
  );
}
