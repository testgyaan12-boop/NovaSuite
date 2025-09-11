
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import type { DietPlan, UserProfile } from "@/lib/types";
import { Beef, Droplets, Flame, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { suggestDietPlan, type SuggestDietPlanInput, type SuggestDietPlanOutput } from "@/ai/flows/suggest-diet-plan";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

function ManualDietCard() {
  const [dietPlan, setDietPlan] = useLocalStorage<DietPlan>("diet-plan", {
    calories: 2000,
    protein: 150,
    fat: 60,
    carbohydrates: 250,
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
     <Card>
      <CardHeader>
        <CardTitle>Daily Nutrition Goals</CardTitle>
        <CardDescription>Manually set your daily macro targets.</CardDescription>
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
            <Label htmlFor="carbohydrates" className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              Carbohydrates (g)
            </Label>
            <Input
              id="carbohydrates"
              name="carbohydrates"
              type="number"
              value={dietPlan.carbohydrates}
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
  )
}

function AiDietPlanner() {
  const [userProfile] = useLocalStorage<UserProfile>('user-profile', {});
  const [, setDietPlan] = useLocalStorage<DietPlan>('diet-plan', { calories: 2000, protein: 150, fat: 60, carbohydrates: 250 });
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestDietPlanOutput | null>(null);
  const { toast } = useToast();

  const [formState, setFormState] = useState<Partial<SuggestDietPlanInput>>({
    age: userProfile.age || 25,
    height: userProfile.height || 180,
    sex: userProfile.sex || 'male',
    weight: userProfile.weight || 80,
    activityLevel: 'moderately_active',
    goal: 'maintain_weight',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: +e.target.value });
  };

  const handleSelectChange = (name: keyof SuggestDietPlanInput) => (value: string) => {
    setFormState({ ...formState, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuggestion(null);

    // Basic validation
    if (!formState.age || !formState.height || !formState.weight) {
        toast({ title: "Missing Information", description: "Please fill out all profile fields.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    try {
      const result = await suggestDietPlan(formState as SuggestDietPlanInput);
      setSuggestion(result);
    } catch (error) {
      console.error("AI suggestion failed", error);
      toast({ title: "Suggestion Failed", description: "Could not get AI suggestion. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAcceptSuggestion = () => {
    if (suggestion) {
      setDietPlan({
        calories: suggestion.calories,
        protein: suggestion.protein,
        fat: suggestion.fat,
        carbohydrates: suggestion.carbohydrates,
      });
      toast({
        title: "Diet Plan Updated!",
        description: "Your daily goals have been updated with the AI suggestion."
      });
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Diet Planner</CardTitle>
          <CardDescription>Get a personalized diet plan based on your profile and goals.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" value={formState.age} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" name="height" type="number" value={formState.height} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" name="weight" type="number" value={formState.weight} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Select name="sex" value={formState.sex} onValueChange={handleSelectChange('sex')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select name="activityLevel" value={formState.activityLevel} onValueChange={handleSelectChange('activityLevel')}>
                 <SelectTrigger><SelectValue /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="sedentary">Sedentary</SelectItem>
                   <SelectItem value="lightly_active">Lightly Active</SelectItem>
                   <SelectItem value="moderately_active">Moderately Active</SelectItem>
                   <SelectItem value="very_active">Very Active</SelectItem>
                 </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="goal">Goal</Label>
               <Select name="goal" value={formState.goal} onValueChange={handleSelectChange('goal')}>
                 <SelectTrigger><SelectValue /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="lose_weight">Lose Weight</SelectItem>
                   <SelectItem value="maintain_weight">Maintain Weight</SelectItem>
                   <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                 </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <><Loader2 className="animate-spin mr-2" />Generating...</> : <><Sparkles className="mr-2" />Suggest Diet Plan</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                 <Skeleton className="h-16 w-full" />
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-24" /></div>
                    <div className="space-y-1"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-24" /></div>
                    <div className="space-y-1"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-24" /></div>
                    <div className="space-y-1"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-24" /></div>
                 </div>
                 <Skeleton className="h-10 w-40" />
            </CardContent>
        </Card>
      )}

      {suggestion && (
        <Card>
          <CardHeader>
            <CardTitle>AI Diet Suggestion</CardTitle>
            <CardDescription>Here's a plan tailored to your profile and goals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground italic">{suggestion.explanation}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium">Calories</p>
                <p className="text-2xl font-bold">{suggestion.calories}</p>
                <p className="text-xs text-muted-foreground">kcal</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium">Protein</p>
                <p className="text-2xl font-bold">{suggestion.protein}</p>
                <p className="text-xs text-muted-foreground">grams</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium">Carbs</p>
                <p className="text-2xl font-bold">{suggestion.carbohydrates}</p>
                 <p className="text-xs text-muted-foreground">grams</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium">Fat</p>
                <p className="text-2xl font-bold">{suggestion.fat}</p>
                 <p className="text-xs text-muted-foreground">grams</p>
              </div>
            </div>
            <Button onClick={handleAcceptSuggestion}>Accept this Plan</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function DietClient() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <AiDietPlanner />
      <ManualDietCard />
    </div>
  );
}
