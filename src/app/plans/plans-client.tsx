
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import type {
  WorkoutPlan,
  Exercise,
  ExerciseSet,
  UserProfile,
  SavedExerciseSuggestion
} from "@/lib/types";
import {
  Plus,
  Sparkles,
  Trash2,
  Search,
  Loader2,
  Save,
  Share2,
  Copy
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { suggestWorkoutModifications } from "@/ai/flows/suggest-workout-modifications";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { suggestExercises, type SuggestExercisesOutput } from "@/ai/flows/suggest-exercises";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

const EXERCISE_CATEGORIES = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Abs',
  'Cardio',
] as const;

function PlanEditor({
  onSave,
  plan,
}: {
  onSave: (plan: WorkoutPlan) => void;
  plan?: WorkoutPlan;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(plan?.name || "");
  const [description, setDescription] = useState(plan?.description || "");
  const [exercises, setExercises] = useState<Exercise[]>(plan?.exercises || []);

  const addExercise = () => {
    setExercises([
      ...exercises,
      { id: crypto.randomUUID(), name: "", sets: [] },
    ]);
  };
  const updateExerciseName = (exId: string, newName: string) => {
    setExercises(
      exercises.map((ex) => (ex.id === exId ? { ...ex, name: newName } : ex))
    );
  };
  const removeExercise = (exId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exId));
  };
  const addSet = (exId: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                { id: crypto.randomUUID(), reps: 10, weight: 20 },
              ],
            }
          : ex
      )
    );
  };
  const updateSet = (
    exId: string,
    setId: string,
    newSet: Partial<ExerciseSet>
  ) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exId
          ? {
              ...ex,
              sets: ex.sets.map((s) =>
                s.id === setId ? { ...s, ...newSet } : s
              ),
            }
          : ex
      )
    );
  };

  const removeSet = (exId: string, setId: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exId
          ? { ...ex, sets: ex.sets.filter((s) => s.id !== setId) }
          : ex
      )
    );
  };

  const handleSave = () => {
    const newPlan: WorkoutPlan = {
      id: plan?.id || crypto.randomUUID(),
      name,
      description,
      exercises,
    };
    onSave(newPlan);
    if (!plan) {
      setName("");
      setDescription("");
      setExercises([]);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {plan ? (
          <Button variant="outline">Edit Plan</Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Plan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {plan ? "Edit Workout Plan" : "Create a New Workout Plan"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Plan Name</Label>
              <Input
                id="plan-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 5-Day Split"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-description">Description</Label>
              <Textarea
                id="plan-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short description of this plan."
              />
            </div>

            {exercises.map((ex, exIndex) => (
              <Card key={ex.id}>
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <Input
                    value={ex.name}
                    onChange={(e) => updateExerciseName(ex.id, e.target.value)}
                    placeholder={`Exercise ${exIndex + 1}`}
                    className="text-lg font-semibold border-0 shadow-none focus-visible:ring-0"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExercise(ex.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <div className="grid grid-cols-4 gap-2 text-sm font-medium text-muted-foreground">
                    <div className="col-span-1">Set</div>
                    <div className="col-span-1">Reps</div>
                    <div className="col-span-1">Weight (kg)</div>
                  </div>
                  {ex.sets.map((s, setIndex) => (
                    <div
                      key={s.id}
                      className="grid grid-cols-4 gap-2 items-center"
                    >
                      <div className="col-span-1 font-medium">
                        {setIndex + 1}
                      </div>
                      <Input
                        type="number"
                        value={s.reps}
                        onChange={(e) =>
                          updateSet(ex.id, s.id, { reps: +e.target.value })
                        }
                        className="col-span-1"
                      />
                      <Input
                        type="number"
                        value={s.weight}
                        onChange={(e) =>
                          updateSet(ex.id, s.id, { weight: +e.target.value })
                        }
                        className="col-span-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSet(ex.id, s.id)}
                        className="col-span-1"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSet(ex.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Set
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button
              variant="secondary"
              onClick={addExercise}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Exercise
            </Button>
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Plan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AiSuggestions({
  plan,
  onUpdatePlan,
}: {
  plan: WorkoutPlan;
  onUpdatePlan: (updatedPlan: WorkoutPlan) => void;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<{
    plan: WorkoutPlan;
    explanation: string;
  } | null>(null);

  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>(
    "user-profile",
    {}
  );
  const [age, setAge] = useState(userProfile.age || 25);
  const [height, setHeight] = useState(userProfile.height || 180);
  const [sex, setSex] = useState<'male'|'female'>(userProfile.sex || "male");

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);
    setUserProfile({ age, height, sex });
    try {
      const result = await suggestWorkoutModifications({
        age,
        height,
        sex,
        currentWorkoutPlan: JSON.stringify(plan),
      });

      const suggestedPlan = JSON.parse(
        result.suggestedWorkoutPlan
      ) as WorkoutPlan;
      setSuggestion({ plan: suggestedPlan, explanation: result.explanation });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not get AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSuggestion = () => {
    if (suggestion) {
      onUpdatePlan({ ...suggestion.plan, id: plan.id });
      toast({
        title: "Plan Updated",
        description: "Your workout plan has been updated with AI suggestions.",
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Sparkles className="mr-2 h-4 w-4" /> AI Suggestion
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>AI-Powered Workout Suggestions</DialogTitle>
          <DialogDescription>
            Get personalized modifications for '{plan.name}' based on your
            profile.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Your Profile</h3>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(+e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(+e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">Sex</Label>
                <select
                  id="sex"
                  value={sex}
                  onChange={(e) => setSex(e.target.value as 'male' | 'female')}
                  className="w-full p-2 rounded-md bg-input border"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <Button onClick={handleGetSuggestion} disabled={isLoading} className="w-full">
                {isLoading ? "Generating..." : "Get Suggestions"}
              </Button>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">AI Suggestion</h3>
              {isLoading && <p>Loading...</p>}
              {suggestion && (
                <Card>
                  <CardHeader>
                    <CardTitle>Suggested Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-4">
                     <p className="italic text-muted-foreground">{suggestion.explanation}</p>
                     <div className="space-y-2">
                         {suggestion.plan.exercises.map(ex => (
                             <div key={ex.id}>
                                 <p className="font-medium">{ex.name}</p>
                                 <ul className="list-disc pl-5 text-muted-foreground">
                                     {ex.sets.map((s,i) => <li key={s.id}>{`Set ${i+1}: ${s.reps} reps @ ${s.weight} kg`}</li>)}
                                 </ul>
                             </div>
                         ))}
                     </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </ScrollArea>
        {suggestion && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Decline
            </Button>
            <Button onClick={handleAcceptSuggestion}>Accept Suggestion</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AiExerciseFinder({
    onSaveSuggestion
}: {
    onSaveSuggestion: (suggestion: SavedExerciseSuggestion) => void;
}) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState<(typeof EXERCISE_CATEGORIES)[number]>('Chest');
    const [suggestions, setSuggestions] = useState<SuggestExercisesOutput | null>(null);

    const handleGetSuggestions = async () => {
        setIsLoading(true);
        setSuggestions(null);
        try {
            const result = await suggestExercises({ category });
            setSuggestions(result);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Could not get AI exercise suggestions. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleSave = () => {
        if (!suggestions) return;
        const newSavedSuggestion: SavedExerciseSuggestion = {
            ...suggestions,
            id: crypto.randomUUID(),
            savedAt: new Date().toISOString(),
            category,
        };
        onSaveSuggestion(newSavedSuggestion);
        toast({ title: "Exercise Ideas Saved!" });
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Search className="mr-2" /> Find New Exercises
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md md:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>AI Exercise Finder</DialogTitle>
                    <DialogDescription>Discover new exercises for any muscle group.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto px-1">
                    <div className="flex gap-2 items-center">
                        <Select value={category} onValueChange={(v) => setCategory(v as any)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                {EXERCISE_CATEGORIES.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleGetSuggestions} disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                        </Button>
                    </div>

                    {isLoading && (
                        <div className="space-y-4">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    )}

                    {suggestions && (
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            {suggestions.exercises.map((ex, index) => (
                                <Card key={index}>
                                    <AccordionItem value={`item-${index}`} className="border-0">
                                        <AccordionTrigger className="p-4 hover:no-underline">
                                             <div className="flex flex-col text-left">
                                                <span className="font-bold">{ex.name}</span>
                                                <span className="text-sm text-muted-foreground">{ex.equipment}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4">
                                            <p className="text-sm">{ex.description}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Card>
                            ))}
                        </Accordion>
                    )}
                </div>
                 {suggestions && (
                    <DialogFooter>
                        <Button variant="secondary" onClick={handleSave}>
                            <Save className="mr-2"/> Save Ideas
                        </Button>
                    </DialogFooter>
                 )}
            </DialogContent>
        </Dialog>
    )
}

function SavedExerciseCard({
    suggestion,
    onDelete,
}: {
    suggestion: SavedExerciseSuggestion;
    onDelete: (id: string) => void;
}) {
    const { toast } = useToast();

    const handleCopy = () => {
        const textToCopy = suggestion.exercises
            .map(ex => `${ex.name}\nEquipment: ${ex.equipment}\n${ex.description}`)
            .join('\n\n');
        navigator.clipboard.writeText(textToCopy);
        toast({ title: "Copied to clipboard!" });
    };
    
    const handleShare = () => {
        const textToShare = `Here are some ${suggestion.category} exercise ideas:\n\n${suggestion.exercises
            .map(ex => `${ex.name} (${ex.equipment})`)
            .join('\n')}`;
            
        if(navigator.share) {
            navigator.share({
                title: `${suggestion.category} Exercise Ideas`,
                text: textToShare,
            }).catch(err => console.error("Share failed", err));
        } else {
            handleCopy();
            toast({ title: "Share not supported, copied instead."})
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{suggestion.category} Ideas</CardTitle>
                        <CardDescription>Saved on {new Date(suggestion.savedAt).toLocaleDateString()}</CardDescription>
                    </div>
                     <Button variant="ghost" size="icon" onClick={() => onDelete(suggestion.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                 <Accordion type="single" collapsible className="w-full space-y-2">
                    {suggestion.exercises.map((ex, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className="border-b-0">
                            <Card className="bg-muted/50">
                                <AccordionTrigger className="p-3 hover:no-underline">
                                        <div className="flex flex-col text-left">
                                        <span className="font-semibold">{ex.name}</span>
                                        <span className="text-sm text-muted-foreground">{ex.equipment}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-3 pb-3">
                                    <p className="text-sm">{ex.description}</p>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}><Share2 className="mr-2"/> Share</Button>
                <Button variant="outline" size="sm" onClick={handleCopy}><Copy className="mr-2"/> Copy</Button>
            </CardFooter>
        </Card>
    )
}

export function PlansClient() {
  const [plans, setPlans] = useLocalStorage<WorkoutPlan[]>("workout-plans", []);
  const [savedSuggestions, setSavedSuggestions] = useLocalStorage<SavedExerciseSuggestion[]>("saved-exercise-suggestions", []);
  const { toast } = useToast();

  const handleSavePlan = (newPlan: WorkoutPlan) => {
    const existingIndex = plans.findIndex((p) => p.id === newPlan.id);
    if (existingIndex > -1) {
      const updatedPlans = [...plans];
      updatedPlans[existingIndex] = newPlan;
      setPlans(updatedPlans);
      toast({ title: "Plan Updated", description: `'${newPlan.name}' has been saved.` });
    } else {
      setPlans([newPlan, ...plans]);
       toast({ title: "Plan Created", description: `'${newPlan.name}' has been added to your plans.` });
    }
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter((p) => p.id !== planId));
    toast({ title: "Plan Deleted", variant: "destructive" });
  };
  
  const handleSaveSuggestion = (suggestion: SavedExerciseSuggestion) => {
      setSavedSuggestions([suggestion, ...savedSuggestions]);
  }
  
  const handleDeleteSuggestion = (id: string) => {
      setSavedSuggestions(savedSuggestions.filter(s => s.id !== id));
      toast({ title: "Suggestion Deleted", variant: "destructive" });
  }

  const requestNotificationPermission = () => {
    if (!("Notification" in window)) {
      toast({ title: "Notifications not supported", variant: "destructive" });
      return;
    }
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        toast({ title: "Notifications enabled!" });
        new Notification("Apex Athletics", { body: "You're all set to receive workout reminders." });
      } else {
        toast({ title: "Notifications not enabled", description: "You can enable them in your browser settings." });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Workout Plans</h2>
        <div className="flex flex-wrap gap-2 mb-6">
            <PlanEditor onSave={handleSavePlan} />
            <AiExerciseFinder onSaveSuggestion={handleSaveSuggestion} />
            <Button variant="outline" onClick={requestNotificationPermission}>Enable Reminders</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.length === 0 ? (
            <Card className="md:col-span-2 lg:col-span-3 flex items-center justify-center p-10">
                <CardContent className="p-0">
                <p className="text-muted-foreground">
                    No workout plans created yet.
                </p>
                </CardContent>
            </Card>
            ) : (
            plans.map((plan) => (
                <Card key={plan.id} className="flex flex-col">
                <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <ul className="space-y-1 text-sm text-muted-foreground">
                    {plan.exercises.slice(0, 3).map((ex) => (
                        <li key={ex.id} className="truncate">{ex.name}</li>
                    ))}
                    {plan.exercises.length > 3 && <li>...and more</li>}
                    </ul>
                </CardContent>
                <CardFooter className="flex justify-between gap-2 flex-wrap">
                    <PlanEditor plan={plan} onSave={handleSavePlan} />
                    <AiSuggestions plan={plan} onUpdatePlan={handleSavePlan} />
                    <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeletePlan(plan.id)}
                    >
                    <Trash2 className="h-4 w-4" />
                    </Button>
                </CardFooter>
                </Card>
            ))
            )}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Saved Exercise Ideas</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {savedSuggestions.length === 0 ? (
                <Card className="md:col-span-2 lg:col-span-3 flex items-center justify-center p-10">
                    <CardContent className="p-0">
                    <p className="text-muted-foreground">
                        No exercise ideas saved yet. Use the "Find New Exercises" tool!
                    </p>
                    </CardContent>
                </Card>
            ) : (
                savedSuggestions.map(suggestion => (
                    <SavedExerciseCard 
                        key={suggestion.id}
                        suggestion={suggestion}
                        onDelete={handleDeleteSuggestion}
                    />
                ))
            )}
        </div>
      </div>
    </div>
  );
}
