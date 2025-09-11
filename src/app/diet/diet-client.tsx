
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import type { DietPlan, UserProfile, SavedDietPlan } from "@/lib/types";
import { Beef, Droplets, Flame, Sparkles, Loader2, Utensils, Save, Trash2, Leaf } from "lucide-react";
import { useState } from "react";
import { suggestDietPlan, type SuggestDietPlanOutput, type SuggestDietPlanInput } from "@/ai/flows/suggest-diet-plan";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
  const [savedPlans, setSavedPlans] = useLocalStorage<SavedDietPlan[]>("saved-diet-plans", []);
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
    dietaryPreference: 'any',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? +e.target.value : e.target.value;
    setFormState({ ...formState, [e.target.name]: value });
  };
  
  const handleSelectChange = (name: keyof Omit<SuggestDietPlanInput, 'age' | 'height' | 'weight' >) => (value: string) => {
    setFormState({ ...formState, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuggestion(null);

    if (!formState.age || !formState.height || !formState.weight || !formState.sex || !formState.activityLevel || !formState.goal || !formState.dietaryPreference) {
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
        calories: suggestion.dailySummary.calories,
        protein: suggestion.dailySummary.protein,
        fat: suggestion.dailySummary.fat,
        carbohydrates: suggestion.dailySummary.carbohydrates,
      });
      toast({
        title: "Diet Plan Updated!",
        description: "Your daily goals have been updated with the AI suggestion."
      });
    }
  }

  const handleSaveSuggestion = () => {
    if (suggestion) {
      const newSavedPlan: SavedDietPlan = {
        ...suggestion,
        id: crypto.randomUUID(),
        savedAt: new Date().toISOString(),
      };
      setSavedPlans([newSavedPlan, ...savedPlans]);
      toast({
        title: "Suggestion Saved!",
        description: "The AI-generated diet plan has been saved."
      });
    }
  }

  const handleDeletePlan = (id: string) => {
    setSavedPlans(savedPlans.filter(p => p.id !== id));
    toast({
        title: "Plan Deleted",
        variant: "destructive"
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Diet Planner</CardTitle>
          <CardDescription>Get a personalized diet plan based on your profile and goals.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="space-y-2">
                <Label htmlFor="dietaryPreference" className="flex items-center gap-2"><Leaf />Dietary Preference</Label>
                <Select name="dietaryPreference" value={formState.dietaryPreference} onValueChange={handleSelectChange('dietaryPreference')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
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
            <CardDescription>Here's a plan tailored to your profile and goals. You can save it or apply the daily totals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
                <p className="text-sm text-muted-foreground italic mb-4">{suggestion.explanation}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-muted p-3 rounded-lg"><p className="text-sm font-medium">Calories</p><p className="text-2xl font-bold">{suggestion.dailySummary.calories}</p><p className="text-xs text-muted-foreground">kcal</p></div>
                  <div className="bg-muted p-3 rounded-lg"><p className="text-sm font-medium">Protein</p><p className="text-2xl font-bold">{suggestion.dailySummary.protein}</p><p className="text-xs text-muted-foreground">grams</p></div>
                  <div className="bg-muted p-3 rounded-lg"><p className="text-sm font-medium">Carbs</p><p className="text-2xl font-bold">{suggestion.dailySummary.carbohydrates}</p><p className="text-xs text-muted-foreground">grams</p></div>
                  <div className="bg-muted p-3 rounded-lg"><p className="text-sm font-medium">Fat</p><p className="text-2xl font-bold">{suggestion.dailySummary.fat}</p><p className="text-xs text-muted-foreground">grams</p></div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Utensils /> Sample Meal Plan</h3>
                <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                    {suggestion.mealPlan.map((meal, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                           <AccordionTrigger>
                                <div className="flex flex-col text-left">
                                    <span className="font-semibold">{meal.time}</span>
                                    <span className="text-sm text-muted-foreground">{meal.foodName}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm px-2">
                                    <div><span className="font-medium">Calories:</span> {meal.calories} kcal</div>
                                    <div><span className="font-medium">Protein:</span> {meal.protein} g</div>
                                    <div><span className="font-medium">Carbs:</span> {meal.carbohydrates} g</div>
                                    <div><span className="font-medium">Fat:</span> {meal.fat} g</div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            
            <div className="flex gap-2 flex-wrap">
                <Button onClick={handleAcceptSuggestion}>Accept Daily Totals</Button>
                <Button variant="secondary" onClick={handleSaveSuggestion}><Save className="mr-2" /> Save Full Plan</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {savedPlans.length > 0 && (
          <div className="space-y-4">
              <h2 className="text-2xl font-bold">Saved Diet Plans</h2>
              {savedPlans.map(plan => (
                  <Card key={plan.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>AI-Generated Plan</CardTitle>
                                <CardDescription>Saved on {new Date(plan.savedAt).toLocaleDateString()}</CardDescription>
                            </div>
                            <Button variant="destructive" size="icon" onClick={() => handleDeletePlan(plan.id)}>
                                <Trash2 />
                            </Button>
                        </div>
                    </CardHeader>
                     <CardContent className="space-y-6">
                        <div>
                            <p className="text-sm text-muted-foreground italic mb-4">{plan.explanation}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                              <div className="bg-muted p-3 rounded-lg"><p className="text-sm font-medium">Calories</p><p className="text-2xl font-bold">{plan.dailySummary.calories}</p><p className="text-xs text-muted-foreground">kcal</p></div>
                              <div className="bg-muted p-3 rounded-lg"><p className="text-sm font-medium">Protein</p><p className="text-2xl font-bold">{plan.dailySummary.protein}</p><p className="text-xs text-muted-foreground">grams</p></div>
                              <div className="bg-muted p-3 rounded-lg"><p className="text-sm font-medium">Carbs</p><p className="text-2xl font-bold">{plan.dailySummary.carbohydrates}</p><p className="text-xs text-muted-foreground">grams</p></div>
                              <div className="bg-muted p-3 rounded-lg"><p className="text-sm font-medium">Fat</p><p className="text-2xl font-bold">{plan.dailySummary.fat}</p><p className="text-xs text-muted-foreground">grams</p></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Utensils /> Sample Meal Plan</h3>
                            <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                                {plan.mealPlan.map((meal, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                      <AccordionTrigger>
                                            <div className="flex flex-col text-left">
                                                <span className="font-semibold">{meal.time}</span>
                                                <span className="text-sm text-muted-foreground">{meal.foodName}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm px-2">
                                                <div><span className="font-medium">Calories:</span> {meal.calories} kcal</div>
                                                <div><span className="font-medium">Protein:</span> {meal.protein} g</div>
                                                <div><span className="font-medium">Carbs:</span> {meal.carbohydrates} g</div>
                                                <div><span className="font-medium">Fat:</span> {meal.fat} g</div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </CardContent>
                  </Card>
              ))}
          </div>
      )}

    </div>
  )
}

export function DietClient() {
  return (
    <div className="grid gap-8 lg:grid-cols-3 xl:grid-cols-2">
      <div className="lg:col-span-2 xl:col-span-1">
        <AiDietPlanner />
      </div>
      <div className="lg:col-span-1">
        <ManualDietCard />
      </div>
    </div>
  );
}
