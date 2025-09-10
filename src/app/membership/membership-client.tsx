
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { DUMMY_MEMBERSHIP } from "@/lib/placeholder-data";
import { Calendar, Dumbbell, User, Wallet } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";


export function MembershipClient() {
  const membership = DUMMY_MEMBERSHIP;

  const attendanceData = membership.attendance.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    visits: 1
  })).reverse();
  
  const chartConfig = {
    visits: {
      label: "Visits",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Plan & Billing</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Plan</p>
                <p className="font-semibold text-lg">{membership.planName}</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Renews On</p>
                <p className="font-semibold text-lg">{new Date(membership.renewalDate).toLocaleDateString()}</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plan Price</p>
                <p className="font-semibold text-lg">${membership.planPrice.toFixed(2)}/month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Personal Trainer</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trainer</p>
                <p className="font-semibold text-lg">{membership.trainerName}</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Session</p>
                <p className="font-semibold text-lg">{new Date(membership.nextSession).toLocaleDateString()}</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Session Fee</p>
                <p className="font-semibold text-lg">${membership.trainerFee.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1 space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>{membership.gymName}</CardTitle>
                <CardDescription>{membership.gymLocation}</CardDescription>
            </CardHeader>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>Your check-ins for the last month.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <ResponsiveContainer>
                        <BarChart data={attendanceData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={{ stroke: 'hsl(var(--border))' }} />
                            <Tooltip
                                content={<ChartTooltipContent />}
                                cursor={{
                                    fill: "hsl(var(--accent))",
                                }}
                            />
                            <Bar dataKey="visits" fill="hsl(var(--primary))" radius={4} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
