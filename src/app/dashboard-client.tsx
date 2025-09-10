"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import type { ProgressLog, WorkoutLog, DietPlan } from "@/lib/types";
import { Dumbbell, LineChart, UtensilsCrossed, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DashboardClient() {
  const [workouts] = useLocalStorage<WorkoutLog[]>("workouts", []);
  const [progress] = useLocalStorage<ProgressLog[]>("progress", []);
  const [diet] = useLocalStorage<DietPlan>("diet-plan", {
    calories: 2000,
    protein: 150,
    fat: 60,
  });

  const lastWorkout = workouts.length > 0 ? workouts[0] : null;
  const lastBodyFat = progress.length > 0 ? progress[progress.length-1].bodyFat : null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Log New Workout</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Ready to train? Start logging your session now.
          </p>
          <Button asChild>
            <Link href="/workouts">Start Workout</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Workout</CardTitle>
          <Dumbbell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {lastWorkout ? (
            <>
              <div className="text-2xl font-bold">{lastWorkout.name}</div>
              <p className="text-xs text-muted-foreground">
                on {new Date(lastWorkout.date).toLocaleDateString()}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No workouts logged yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Body Fat %</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {lastBodyFat !== null ? (
            <div className="text-2xl font-bold">{lastBodyFat}%</div>
          ) : (
             <p className="text-sm text-muted-foreground">No progress logged yet.</p>
          )}
          <p className="text-xs text-muted-foreground">
            Keep tracking to see your progress.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Diet Goals</CardTitle>
          <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-sm">
            <div>
              <span className="font-medium">Calories: </span>
              <span className="text-muted-foreground">{diet.calories} kcal</span>
            </div>
            <div>
              <span className="font-medium">Protein: </span>
              <span className="text-muted-foreground">{diet.protein} g</span>
            </div>
            <div>
              <span className="font-medium">Fat: </span>
              <span className="text-muted-foreground">{diet.fat} g</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
