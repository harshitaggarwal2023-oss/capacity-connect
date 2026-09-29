import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

export function PortalCards() {
  return (
    <section className="py-24 bg-[#FAF9F6] px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-16">Dedicated Portals</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Large Card Left */}
          <div className="bg-[#2c3e6b] rounded-3xl p-10 text-white flex flex-col h-full min-h-[500px]">
            <h3 className="text-4xl font-bold mb-8">Trainee Portal</h3>
            <ul className="space-y-6 text-lg text-slate-200 mb-auto">
              <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white rounded-full"></span> Take Timed Assessments</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white rounded-full"></span> Access Course Materials</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white rounded-full"></span> Earn Certificates</li>
            </ul>
            <Link href="/trainee/login" className="mt-12 inline-block">
              <button className="px-6 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2">
                Trainee Login <IconArrowRight size={20} />
              </button>
            </Link>
          </div>
          
          {/* Stacked Cards Right */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#1c4a4a] rounded-3xl p-10 text-white flex flex-col flex-1">
              <h3 className="text-3xl font-bold mb-6">Trainer Portal</h3>
              <ul className="space-y-4 text-slate-200 mb-auto">
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white rounded-full"></span> Create Quizzes & Courses</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white rounded-full"></span> Monitor Trainee Progress</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white rounded-full"></span> Manage Resources</li>
              </ul>
              <Link href="/trainer/login" className="mt-8 inline-block">
                <button className="px-6 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2">
                  Trainer Login <IconArrowRight size={20} />
                </button>
              </Link>
            </div>
            
            <div className="bg-[#2d2d2d] rounded-3xl p-10 text-white flex flex-col flex-1">
              <h3 className="text-3xl font-bold mb-6">Admin Portal</h3>
              <ul className="space-y-4 text-slate-200 mb-auto">
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white rounded-full"></span> Global User Management</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white rounded-full"></span> Platform Analytics</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white rounded-full"></span> Publish Announcements</li>
              </ul>
              <Link href="/admin/login" className="mt-8 inline-block">
                <button className="px-6 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2">
                  Admin Login <IconArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
