"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TrainerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    alert("Profile saved");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-[#FAF9F6]">
        <CardHeader><CardTitle>Trainer Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input 
                value={profile?.fullName || ""} 
                onChange={e => setProfile({...profile, fullName: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio / Experience</label>
              <Textarea 
                value={profile?.experience || ""} 
                onChange={e => setProfile({...profile, experience: e.target.value})} 
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject Tags (comma separated)</label>
              <Input 
                value={(profile?.skills || []).join(", ")} 
                onChange={e => setProfile({...profile, skills: e.target.value.split(",").map((s:string) => s.trim())})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Years of Experience</label>
              <Input 
                type="number"
                value={profile?.yearsExp || 0} 
                onChange={e => setProfile({...profile, yearsExp: parseInt(e.target.value)})} 
              />
            </div>
            <Button type="submit">Save Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
