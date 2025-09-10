
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import type { UserProfile } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export function ProfileClient() {
  const [profile, setProfile] = useLocalStorage<UserProfile>(
    "user-profile",
    {
      age: 25,
      height: 180,
      sex: "male",
    }
  );
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(localProfile);
    toast({
      title: "Profile Saved",
      description: "Your personal information has been updated.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLocalProfile({
      ...localProfile,
      [e.target.name]: e.target.type === 'number' ? +e.target.value : e.target.value,
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your age, height, and sex.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                name="age"
                                type="number"
                                value={localProfile.age || ""}
                                onChange={handleChange}
                                placeholder="e.g. 25"
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input
                                id="height"
                                name="height"
                                type="number"
                                value={localProfile.height || ""}
                                onChange={handleChange}
                                placeholder="e.g. 180"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sex">Sex</Label>
                            <select
                                id="sex"
                                name="sex"
                                value={localProfile.sex || "male"}
                                onChange={handleChange}
                                className="w-full p-2 rounded-md bg-input border"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <Button type="submit">Save Profile</Button>
                    </form>
                </CardContent>
            </Card>
      </div>
      <div className="md:col-span-1">
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>Stay Motivated</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-w-1 aspect-h-1">
                    <Image 
                        src="https://picsum.photos/seed/motivation/600/600" 
                        alt="Motivational Image"
                        width={600}
                        height={600}
                        className="rounded-md object-cover"
                        data-ai-hint="motivational fitness"
                    />
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
