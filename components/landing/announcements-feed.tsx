type Announcement = {
  id: string;
  title: string;
  content: string;
  type: string;
  publishedAt: Date;
};

export function AnnouncementsFeed({ announcements }: { announcements: Announcement[] }) {
  if (!announcements.length) return null;

  return (
    <section className="py-24 bg-[#FAF9F6] px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-12">Latest Announcements</h2>
        
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {announcements.map(item => {
            let badgeClass = "bg-slate-200 text-slate-800";
            if (item.type === "ACHIEVEMENT") badgeClass = "bg-amber-100 text-amber-800";
            if (item.type === "NEW_CONTENT") badgeClass = "bg-teal-100 text-teal-800";

            return (
              <div key={item.id} className="break-inside-avoid bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeClass}`}>
                    {item.type.replace("_", " ")}
                  </span>
                  <span className="text-sm text-slate-500">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm line-clamp-4">{item.content}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
