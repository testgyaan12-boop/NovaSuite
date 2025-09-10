"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { TRAINER_ROUTINES } from "@/lib/placeholder-data";
import type { WorkoutPlan } from "@/lib/types";

export function TrainerClient() {
  const [code, setCode] = useState("");
  const [plans, setPlans] = useLocalStorage<WorkoutPlan[]>("workout-plans", []);
  const { toast } = useToast();

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const upperCaseCode = code.toUpperCase();
    const routine = TRAINER_ROUTINES[upperCaseCode];

    if (routine) {
      if (plans.some((p) => p.id === routine.id)) {
        toast({
          title: "Plan Already Added",
          description: `You already have the '${routine.name}' plan.`,
          variant: "default",
        });
      } else {
        setPlans([...plans, routine]);
        toast({
          title: "Plan Added!",
          description: `'${routine.name}' has been added to your workout plans.`,
        });
      }
      setCode("");
    } else {
      toast({
        title: "Invalid Code",
        description: "The plan code you entered was not found.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Add Trainer Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddPlan} className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter plan code (e.g., APEX-START)"
            className="flex-grow"
          />
          <Button type="submit">Add Plan</Button>
        </form>
      </CardContent>
    </Card>
  );
}
