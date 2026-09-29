"use client";

import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";

const DATA = {
  courses: ["Digital Governance Basics", "Data Analytics Fundamentals", "Cybersecurity Essentials"],
  trainers: ["Dr. Anita Sharma", "Prof. Rajesh Kumar"]
};

export function DemoSection() {
  const [query, setQuery] = useState("");

  const filteredCourses = DATA.courses.filter(c => c.toLowerCase().includes(query.toLowerCase()));
  const filteredTrainers = DATA.trainers.filter(t => t.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="py-24 bg-[#E8E6E1] px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Try the platform interface</h2>
          <p className="text-lg text-slate-700">Search for courses and trainers.</p>
        </div>

        <div className="bg-[#FAF9F6] rounded-xl overflow-hidden shadow-2xl border border-slate-200">
          <div className="flex items-center px-4 py-3 border-b border-slate-200">
            <IconSearch className="text-slate-400 mr-3" size={24} />
            <input 
              type="text" 
              placeholder="Search courses or trainers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-xl text-slate-800 placeholder-slate-400"
            />
          </div>
          
          <div className="p-4 max-h-[400px] overflow-y-auto">
            {filteredCourses.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Courses</h4>
                {filteredCourses.map(course => (
                  <div key={course} className="p-3 hover:bg-slate-100 rounded-lg cursor-pointer text-slate-800 transition-colors">
                    {course}
                  </div>
                ))}
              </div>
            )}
            
            {filteredTrainers.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Trainers</h4>
                {filteredTrainers.map(trainer => (
                  <div key={trainer} className="p-3 hover:bg-slate-100 rounded-lg cursor-pointer text-slate-800 transition-colors">
                    {trainer}
                  </div>
                ))}
              </div>
            )}

            {filteredCourses.length === 0 && filteredTrainers.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No results found for "{query}"
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
