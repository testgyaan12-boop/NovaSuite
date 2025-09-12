
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import type { WorkoutLog, Exercise, ExerciseSet } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { suggestExercises, type SuggestExercisesOutput } from "@/ai/flows/suggest-exercises";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

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

function WorkoutLogger({ onSave }: { onSave: (log: WorkoutLog) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);

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

  const updateSet = (exId: string, setId: string, newSet: Partial<ExerciseSet>) => {
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
          ? {
              ...ex,
              sets: ex.sets.filter((s) => s.id !== setId),
            }
          : ex
      )
    );
  };

  const handleSave = () => {
    const newLog: WorkoutLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      name,
      exercises,
      notes,
    };
    onSave(newLog);
    setName("");
    setNotes("");
    setExercises([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Log New Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Log a New Workout</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="workout-name">Workout Name</Label>
              <Input
                id="workout-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Morning Push Day"
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
                  <Button variant="ghost" size="icon" onClick={() => removeExercise(ex.id)}>
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
                    <div key={s.id} className="grid grid-cols-4 gap-2 items-center">
                      <div className="col-span-1 font-medium">{setIndex + 1}</div>
                      <Input
                        type="number"
                        value={s.reps}
                        onChange={(e) => updateSet(ex.id, s.id, { reps: +e.target.value })}
                        className="col-span-1"
                      />
                       <Input
                        type="number"
                        value={s.weight}
                        onChange={(e) => updateSet(ex.id, s.id, { weight: +e.target.value })}
                        className="col-span-1"
                      />
                       <Button variant="ghost" size="icon" onClick={() => removeSet(ex.id, s.id)} className="col-span-1">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addSet(ex.id)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Set
                  </Button>
                </CardContent>
              </Card>
            ))}
             <Button variant="secondary" onClick={addExercise} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Exercise
            </Button>
            <div>
              <Label htmlFor="workout-notes">Notes</Label>
              <Textarea id="workout-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes about today's session..." />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Workout</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AiWorkoutSuggestions() {
  const [suggestions, setSuggestions] = useState<Partial<Record<(typeof EXERCISE_CATEGORIES)[number], SuggestExercisesOutput>>>({});
  const [isLoading, setIsLoading] = useState<Partial<Record<(typeof EXERCISE_CATEGORIES)[number], boolean>>>({});
  const { toast } = useToast();

  const getSuggestions = async (category: (typeof EXERCISE_CATEGORIES)[number]) => {
    if (suggestions[category] || isLoading[category]) return;

    setIsLoading(prev => ({ ...prev, [category]: true }));
    try {
      const result = await suggestExercises({ category });
      setSuggestions(prev => ({ ...prev, [category]: result }));
    } catch (error) {
      console.error(error);
      toast({
        title: "Suggestion Failed",
        description: `Could not get suggestions for ${category}.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [category]: false }));
    }
  };
  
  useEffect(() => {
    getSuggestions('Chest');
  }, []);

  return (
     <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles />
          AI Workout Suggestions
        </CardTitle>
        <CardDescription>
          Get AI-powered exercise ideas for your next workout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="Chest" className="w-full" onValueChange={(v) => getSuggestions(v as any)}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 h-auto">
            {EXERCISE_CATEGORIES.map(cat => (
              <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
            ))}
          </TabsList>
           {EXERCISE_CATEGORIES.map(cat => (
            <TabsContent key={cat} value={cat}>
              {isLoading[cat] && (
                <div className="space-y-2 mt-4">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
              )}
              {suggestions[cat] && (
                <Accordion type="single" collapsible className="w-full space-y-2 mt-4">
                  {suggestions[cat]?.exercises.map((ex, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="border-b-0">
                      <Card>
                        <AccordionTrigger className="p-4 hover:no-underline">
                          <div className="flex flex-col text-left">
                            <span className="font-bold">{ex.name}</span>
                            <span className="text-sm text-muted-foreground">{ex.equipment}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 space-y-2">
                          <p className="text-sm">{ex.description}</p>
                          <div className="text-sm font-medium p-2 bg-muted rounded-md">
                            {ex.sets} sets of {ex.reps} reps
                             {ex.weight && ex.weight.toLowerCase() !== 'bodyweight' && ` at ~${ex.weight} kg`}
                          </div>
                        </AccordionContent>
                      </Card>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

export function WorkoutsClient() {
  const [workouts, setWorkouts] = useLocalStorage<WorkoutLog[]>("workouts", []);

  const handleSaveWorkout = (newLog: WorkoutLog) => {
    setWorkouts([newLog, ...workouts]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-start">
        <WorkoutLogger onSave={handleSaveWorkout} />
      </div>
      
      <AiWorkoutSuggestions />

      <div className="space-y-4">
        <h3 className="text-2xl font-bold font-headline">Workout History</h3>
        {workouts.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <p className="text-muted-foreground">No workouts logged yet.</p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {workouts.map((log) => (
              <AccordionItem value={log.id} key={log.id} className="border-b-0">
                <Card>
                    <AccordionTrigger className="p-4 hover:no-underline">
                        <div className="flex flex-col text-left">
                        <span className="font-bold text-lg">{log.name}</span>
                        <span className="text-sm text-muted-foreground">{new Date(log.date).toLocaleString()}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                        {log.notes && <p className="mb-4 text-sm text-muted-foreground italic">"{log.notes}"</p>}
                        {log.exercises.map((ex) => (
                        <div key={ex.id} className="mb-4">
                            <h4 className="font-semibold mb-2">{ex.name}</h4>
                            <ul className="space-y-1 text-sm list-disc list-inside">
                            {ex.sets.map((s, i) => <li key={s.id}>{`Set ${i+1}: ${s.reps} reps @ ${s.weight} kg`}</li>)}
                            </ul>
                        </div>
                        ))}
                    </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
