"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import type { DietPlan } from "@/lib/types";
import { Beef, Droplets, Flame } from "lucide-react";

export function DietClient() {
  const [dietPlan, setDietPlan] = useLocalStorage<DietPlan>("diet-plan", {
    calories: 2000,
    protein: 150,
    fat: 60,
  });
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDietPlan(dietPlan);
    toast({
      title: "Diet Plan Saved",
      description: "Your nutrition goals have been updated.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDietPlan({
      ...dietPlan,
      [e.target.name]: +e.target.value,
    });
  };

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Daily Nutrition Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="calories" className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              Calories (kcal)
            </Label>
            <Input
              id="calories"
              name="calories"
              type="number"
              value={dietPlan.calories}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="protein" className="flex items-center gap-2">
              <Beef className="h-5 w-5 text-primary" />
              Protein (g)
            </Label>
            <Input
              id="protein"
              name="protein"
              type="number"
              value={dietPlan.protein}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fat" className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              Fat (g)
            </Label>
            <Input
              id="fat"
              name="fat"
              type="number"
              value={dietPlan.fat}
              onChange={handleChange}
            />
          </div>
          <Button type="submit">Save Goals</Button>
        </form>
      </CardContent>
    </Card>
  );
}
