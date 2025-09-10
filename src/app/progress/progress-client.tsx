"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import type { ProgressLog } from "@/lib/types";
import { Line, LineChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

export function ProgressClient() {
  const [progressData, setProgressData] = useLocalStorage<ProgressLog[]>(
    "progress",
    []
  );
  const [bodyFat, setBodyFat] = useState<number | string>("");
  const { toast } = useToast();

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof bodyFat === "number" && bodyFat > 0) {
      const newLog: ProgressLog = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        bodyFat: bodyFat,
      };
      const sortedData = [...progressData, newLog].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setProgressData(sortedData);
      setBodyFat("");
      toast({
        title: "Progress Logged!",
        description: `Body fat recorded at ${bodyFat}%.`,
      });
    }
  };

  const handleDeleteLog = (id: string) => {
    setProgressData(progressData.filter(log => log.id !== id));
     toast({
        title: "Log Deleted",
        variant: "destructive",
      });
  }

  const chartData = progressData.map(log => ({
      date: new Date(log.date).toLocaleDateString(),
      bodyFat: log.bodyFat
  }));
  
  const chartConfig = {
    bodyFat: {
      label: "Body Fat %",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Body Fat % Trend</CardTitle>
            <CardDescription>
              Your body fat percentage over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {progressData.length > 1 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={{ stroke: 'hsl(var(--border))' }} />
                    <Tooltip
                        content={<ChartTooltipContent />}
                        cursor={{
                            stroke: "hsl(var(--primary))",
                            strokeWidth: 2,
                            strokeDasharray: "3 3",
                        }}
                    />
                    <Line type="monotone" dataKey="bodyFat" stroke="hsl(var(--primary))" strokeWidth={2} dot={{r: 4, fill: "hsl(var(--primary))"}} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <p>Log at least two entries to see your progress chart.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Log New Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bodyFat">Body Fat (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value === '' ? '' : +e.target.value)}
                  placeholder="e.g. 15.5"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Log
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Body Fat</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {progressData.slice().reverse().map(log => (
                            <TableRow key={log.id}>
                                <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                                <TableCell>{log.bodyFat}%</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteLog(log.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
