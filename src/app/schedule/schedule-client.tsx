"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import type { WorkoutPlan, ScheduledWorkout, UserProfile } from "@/lib/types";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { suggestSchedule, type SuggestScheduleInput, type SuggestScheduleOutput } from "@/ai/flows/suggest-schedule";
import { Badge } from "@/components/ui/badge";

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
      toast({ title: "Schedule Applied!", description: "Your calendar has been updated with the suggested schedule." });
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Sparkles className="mr-2" /> AI Schedule Suggestion
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Weekly Schedule Generator</DialogTitle>
          <DialogDescription>
            Let AI create a balanced workout week for you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
                       <li key={day.dayOfWeek} className="flex justify-between items-center">
                          <span className="font-medium">{day.dayOfWeek}</span>
                          {plan ? <Badge>{plan.name}</Badge> : <Badge variant="secondary">Rest</Badge>}
                       </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          )}

        </div>
        {suggestion && (
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleApply}>Apply Schedule</Button>
          </DialogFooter>
        )}
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
              {plans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="justify-between sm:justify-between">
           {scheduledWorkout && <Button variant="destructive" onClick={handleRemove}><Trash2 className="mr-2"/> Remove</Button>}
           <div className="flex gap-2">
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Save</Button>
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
    
    const newScheduledWorkouts: ScheduledWorkout[] = [];

    schedule.forEach((day, index) => {
      if (day.planId) {
        const date = addDays(startOfWeek, index);
        const dateString = format(date, "yyyy-MM-dd");
        newScheduledWorkouts.push({
          id: crypto.randomUUID(),
          planId: day.planId,
          date: dateString
        });
      }
    });

    // This simplistic approach will overwrite existing scheduled workouts for the week
    const nextWeek = addDays(startOfWeek, 7);
    const otherWorkouts = scheduledWorkouts.filter(w => new Date(w.date) < startOfWeek || new Date(w.date) >= nextWeek);

    setScheduledWorkouts([...otherWorkouts, ...newScheduledWorkouts]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AiScheduleGenerator onApplySchedule={handleApplySchedule} />
      </div>
      <Card>
        <CardContent className="p-2">
          <Calendar
            classNames={{
              day: "h-24 w-full text-base",
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
      
       <div>
        <h3 className="text-xl font-bold mb-2">Upcoming Workouts</h3>
        <div className="space-y-2">
          {scheduledWorkouts
            .filter(w => new Date(w.date) >= new Date())
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
          {scheduledWorkouts.filter(w => new Date(w.date) >= new Date()).length === 0 && (
            <p className="text-muted-foreground">No upcoming workouts scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
}
