
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import type { WorkoutPlan, ScheduledWorkout, UserProfile, SavedSchedule } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format, isSameDay } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Trash2, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { suggestSchedule, type SuggestScheduleInput, type SuggestScheduleOutput } from "@/ai/flows/suggest-schedule";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


function AiScheduleGenerator({
  onApplySchedule,
}: {
  onApplySchedule: (schedule: SuggestScheduleOutput['schedule']) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestScheduleOutput | null>(null);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [goal, setGoal] = useState<SuggestScheduleInput['goal']>('maintain_weight');
  const [plans] = useLocalStorage<WorkoutPlan[]>("workout-plans", []);
  const [userProfile] = useLocalStorage<UserProfile>('user-profile', {});
  const [savedSchedules, setSavedSchedules] = useLocalStorage<SavedSchedule[]>("saved-schedules", []);

  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);

    if (plans.length === 0) {
      toast({
        title: "No Workout Plans",
        description: "Please create at least one workout plan before generating a schedule.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await suggestSchedule({
        goal: userProfile.sex ? goal : 'maintain_weight', // Use saved goal or default
        daysPerWeek,
        availablePlans: plans.map(p => ({ id: p.id, name: p.name })),
      });
      setSuggestion(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Suggestion Failed",
        description: "Could not get AI schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApply = () => {
    if (suggestion) {
      onApplySchedule(suggestion.schedule);
      toast({ title: "Schedule Applied!", description: "Your calendar has been updated for the current week." });
      setOpen(false);
    }
  }

  const handleSave = () => {
    if (suggestion) {
        const newSavedSchedule: SavedSchedule = {
            ...suggestion,
            id: crypto.randomUUID(),
            savedAt: new Date().toISOString(),
            goal: goal,
            daysPerWeek: daysPerWeek,
        };
        setSavedSchedules([newSavedSchedule, ...savedSchedules]);
        toast({ title: "Schedule Saved!", description: "The suggested schedule has been saved." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Sparkles className="mr-2" /> AI Schedule Suggestion
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>AI Weekly Schedule Generator</DialogTitle>
          <DialogDescription>
            Let AI create a balanced workout week for you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="space-y-2">
            <Label>Fitness Goal</Label>
             <Select value={goal} onValueChange={(v) => setGoal(v as any)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                    <SelectItem value="maintain_weight">Maintain Weight</SelectItem>
                    <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                </SelectContent>
             </Select>
          </div>
          <div className="space-y-2">
            <Label>Workout Days Per Week: {daysPerWeek}</Label>
            <Slider
              value={[daysPerWeek]}
              onValueChange={(v) => setDaysPerWeek(v[0])}
              min={1}
              max={7}
              step={1}
            />
          </div>
          <Button onClick={handleGetSuggestion} disabled={isLoading} className="w-full">
            {isLoading ? <><Loader2 className="mr-2 animate-spin"/>Generating...</> : "Generate Schedule"}
          </Button>

          {suggestion && (
            <Card>
              <CardHeader>
                <CardTitle>Suggested Schedule</CardTitle>
                <CardDescription>{suggestion.explanation}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {suggestion.schedule.map(day => {
                    const plan = plans.find(p => p.id === day.planId);
                    return (
                       <li key={day.dayOfWeek} className="flex justify-between items-center text-sm">
                          <span className="font-medium">{day.dayOfWeek}</span>
                          {plan ? <Badge>{plan.name}</Badge> : <Badge variant="secondary">Rest</Badge>}
                       </li>
                    )
                  })}
                </ul>
              </CardContent>
              <CardFooter className="flex-col sm:flex-row gap-2">
                  <Button onClick={handleApply} className="w-full sm:w-auto">Apply to Week</Button>
                  <Button onClick={handleSave} variant="secondary" className="w-full sm:w-auto"><Save className="mr-2"/>Save Schedule</Button>
              </CardFooter>
            </Card>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}

function ScheduleWorkoutDialog({
  day,
  scheduledWorkout,
  onSchedule,
  onRemove,
}: {
  day: Date;
  scheduledWorkout: ScheduledWorkout | undefined;
  onSchedule: (planId: string, date: Date) => void;
  onRemove: (date: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(scheduledWorkout?.planId || "");
  const [plans] = useLocalStorage<WorkoutPlan[]>("workout-plans", []);
  const { toast } = useToast();

  const handleSave = () => {
    if (!selectedPlan) {
      toast({ title: "Please select a plan.", variant: "destructive" });
      return;
    }
    onSchedule(selectedPlan, day);
    setOpen(false);
  };
  
  const handleRemove = () => {
      onRemove(day);
      setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="relative flex h-full w-full flex-col items-center justify-center p-1">
          <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
          {scheduledWorkout && (
            <div className="absolute bottom-1 w-full px-1">
              <Badge className="w-full text-xs truncate block">
                {plans.find((p) => p.id === scheduledWorkout.planId)?.name || "Workout"}
              </Badge>
            </div>
          )}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Schedule Workout for {format(day, "PPP")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select value={selectedPlan} onValueChange={setSelectedPlan}>
            <SelectTrigger>
              <SelectValue placeholder="Select a workout plan" />
            </SelectTrigger>
            <SelectContent>
              {plans.length > 0 ? (
                plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                    </SelectItem>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">No workout plans created yet.</div>
              )
              }
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between w-full">
           {scheduledWorkout && <Button variant="destructive" onClick={handleRemove}><Trash2 className="mr-2"/> Remove</Button>}
           <div className="flex gap-2 justify-end">
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={plans.length === 0}>Save</Button>
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ScheduleClient() {
  const [scheduledWorkouts, setScheduledWorkouts] = useLocalStorage<
    ScheduledWorkout[]
  >("scheduled-workouts", []);
  const [plans] = useLocalStorage<WorkoutPlan[]>("workout-plans", []);
  const [savedSchedules, setSavedSchedules] = useLocalStorage<SavedSchedule[]>("saved-schedules", []);
  const { toast } = useToast();

  const handleSchedule = (planId: string, date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const existing = scheduledWorkouts.find((w) => w.date === dateString);

    if (existing) {
      setScheduledWorkouts(
        scheduledWorkouts.map((w) =>
          w.date === dateString ? { ...w, planId } : w
        )
      );
      toast({ title: "Workout Updated!" });
    } else {
      const newScheduledWorkout = {
        id: crypto.randomUUID(),
        planId,
        date: dateString,
      };
      setScheduledWorkouts([...scheduledWorkouts, newScheduledWorkout]);
      toast({ title: "Workout Scheduled!" });
    }
  };
  
  const handleRemove = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    setScheduledWorkouts(scheduledWorkouts.filter(w => w.date !== dateString));
    toast({ title: "Workout Removed", variant: "destructive" });
  }

  const handleApplySchedule = (schedule: SuggestScheduleOutput['schedule']) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1))); // Monday
    
    let newScheduledWorkouts: ScheduledWorkout[] = [];

    schedule.forEach((day, index) => {
      const date = addDays(startOfWeek, index);
      const dateString = format(date, "yyyy-MM-dd");
      
      const existingWorkoutIndex = scheduledWorkouts.findIndex(w => w.date === dateString);

      if (day.planId) {
        const newWorkout: ScheduledWorkout = {
            id: crypto.randomUUID(),
            planId: day.planId,
            date: dateString
        };
        if(existingWorkoutIndex > -1) {
            // we will just create a new one, but we should remove the old one first
        } else {
           newScheduledWorkouts.push(newWorkout);
        }
      }
    });
    
    // This approach will overwrite existing scheduled workouts for the week
    const nextWeek = addDays(startOfWeek, 7);
    const otherWorkouts = scheduledWorkouts.filter(w => new Date(w.date) < startOfWeek || new Date(w.date) >= nextWeek);

    setScheduledWorkouts([...otherWorkouts, ...newScheduledWorkouts]);
    toast({ title: "Schedule Applied!", description: "Your calendar has been updated for the current week." });
  };

  const handleDeleteSavedSchedule = (id: string) => {
    setSavedSchedules(savedSchedules.filter(s => s.id !== id));
    toast({ title: "Saved Schedule Deleted", variant: "destructive" });
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <AiScheduleGenerator onApplySchedule={handleApplySchedule} />
      </div>
      <Card>
        <CardContent className="p-1 sm:p-2">
          <Calendar
            classNames={{
              day: "h-20 w-full sm:h-24 text-base",
              day_selected: "bg-primary text-primary-foreground",
              cell: "w-1/7",
            }}
            components={{
              DayContent: ({ date }) => {
                const scheduledWorkout = scheduledWorkouts.find((w) =>
                  isSameDay(new Date(w.date), date)
                );
                return (
                  <ScheduleWorkoutDialog
                    day={date}
                    scheduledWorkout={scheduledWorkout}
                    onSchedule={handleSchedule}
                    onRemove={handleRemove}
                  />
                );
              },
            }}
          />
        </CardContent>
      </Card>
      
       <div className="grid gap-6 md:grid-cols-2">
         <div className="space-y-4">
            <h3 className="text-xl font-bold">Upcoming Workouts</h3>
            <div className="space-y-2">
              {scheduledWorkouts
                .filter(w => new Date(w.date) >= new Date(new Date().setHours(0,0,0,0)))
                .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map(workout => {
                    const plan = plans.find(p => p.id === workout.planId);
                    return (
                        <Card key={workout.id}>
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{plan?.name || "Workout"}</p>
                                    <p className="text-sm text-muted-foreground">{format(new Date(workout.date), "PPP")}</p>
                                </div>
                                <Button variant="secondary" size="sm">Start</Button>
                            </CardContent>
                        </Card>
                    )
              })}
              {scheduledWorkouts.filter(w => new Date(w.date) >= new Date(new Date().setHours(0,0,0,0))).length === 0 && (
                <p className="text-muted-foreground text-sm">No upcoming workouts scheduled.</p>
              )}
            </div>
         </div>
          <div className="space-y-4">
              <h3 className="text-xl font-bold">Saved Schedules</h3>
                {savedSchedules.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        {savedSchedules.map(saved => (
                            <Card key={saved.id}>
                                <AccordionItem value={saved.id} className="border-0">
                                    <AccordionTrigger className="p-4 hover:no-underline">
                                        <div className="flex flex-col text-left">
                                            <span className="font-bold">Weekly Schedule</span>
                                            <span className="text-sm text-muted-foreground">Saved on {format(new Date(saved.savedAt), "PPP")}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pb-4 space-y-4">
                                        <p className="text-sm text-muted-foreground italic">{saved.explanation}</p>
                                        <ul className="space-y-2">
                                            {saved.schedule.map(day => {
                                                const plan = plans.find(p => p.id === day.planId);
                                                return (
                                                <li key={day.dayOfWeek} className="flex justify-between items-center text-sm">
                                                    <span className="font-medium">{day.dayOfWeek}</span>
                                                    {plan ? <Badge>{plan.name}</Badge> : <Badge variant="secondary">Rest</Badge>}
                                                </li>
                                                )
                                            })}
                                        </ul>
                                        <div className="flex justify-between items-center pt-2">
                                            <Button size="sm" onClick={() => handleApplySchedule(saved.schedule)}>Apply to Week</Button>
                                             <Button variant="destructive" size="icon" onClick={() => handleDeleteSavedSchedule(saved.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Card>
                        ))}
                    </Accordion>
                ) : (
                    <p className="text-muted-foreground text-sm">No AI schedules saved yet.</p>
                )}
          </div>
       </div>
    </div>
  );
}

    

    