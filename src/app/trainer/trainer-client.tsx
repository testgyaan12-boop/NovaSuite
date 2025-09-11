
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
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { TRAINER_ROUTINES, ASSIGNED_TRAINER, NEARBY_TRAINERS } from "@/lib/placeholder-data";
import type { WorkoutPlan, ScheduledSession, Trainer } from "@/lib/types";
import { Calendar, Mail, Star, UserPlus, Search, Phone, MessageSquare, Clock } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

function ScheduleSessionDialog({
  trainer,
  children,
  onSessionScheduled,
}: {
  trainer: Trainer | { name: string, id: string };
  children: React.ReactNode;
  onSessionScheduled: (session: ScheduledSession) => void;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const { toast } = useToast();

  const handleSchedule = () => {
    if (!date) {
        toast({ title: "Please select a date", variant: "destructive" });
        return;
    }
    const newSession: ScheduledSession = {
        id: crypto.randomUUID(),
        trainerId: trainer.id,
        trainerName: trainer.name,
        sessionDate: date.toISOString(),
        sessionTime: time,
        createdAt: new Date().toISOString(),
    };
    onSessionScheduled(newSession);
    toast({ title: "Session Scheduled!", description: `Your session with ${trainer.name} is booked.` });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule a session with {trainer.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                             <Calendar className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                         <CalendarPicker mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>
             <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSchedule}>Confirm Session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TrainerClient() {
  const [code, setCode] = useState("");
  const [plans, setPlans] = useLocalStorage<WorkoutPlan[]>("workout-plans", []);
  const [sessions, setSessions] = useLocalStorage<ScheduledSession[]>("scheduled-sessions", []);
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleSessionScheduled = (session: ScheduledSession) => {
      setSessions([...sessions, session]);
  }

  const filteredTrainers = NEARBY_TRAINERS.filter(trainer => 
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      trainer.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const lastAssignedTrainerSession = sessions
    .filter(s => s.trainerId === 'assigned')
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-8">
        <Card>
            <CardHeader>
            <CardTitle>Your Personal Trainer</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-6">
                <Image 
                    src={ASSIGNED_TRAINER.avatar.src}
                    alt={ASSIGNED_TRAINER.avatar.alt}
                    width={150}
                    height={150}
                    className="rounded-full aspect-square object-cover"
                    data-ai-hint={ASSIGNED_TRAINER.avatar['data-ai-hint']}
                />
                <div className="space-y-4">
                    <div>
                        <h3 className="text-2xl font-bold">{ASSIGNED_TRAINER.name}</h3>
                        <p className="text-muted-foreground">{ASSIGNED_TRAINER.specialty}</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <a href={`mailto:${ASSIGNED_TRAINER.email}`} className="text-sm hover:underline">{ASSIGNED_TRAINER.email}</a>
                        </div>
                         {ASSIGNED_TRAINER.phone && <div className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <a href={`tel:${ASSIGNED_TRAINER.phone}`} className="text-sm hover:underline">{ASSIGNED_TRAINER.phone}</a>
                        </div>}
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <p className="text-sm">Default next session: {new Date(ASSIGNED_TRAINER.nextSession).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <ScheduleSessionDialog trainer={{id: 'assigned', name: ASSIGNED_TRAINER.name}} onSessionScheduled={handleSessionScheduled}>
                        <Button>Reschedule Session</Button>
                    </ScheduleSessionDialog>
                </div>
            </CardContent>
        </Card>
        
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Find a New Trainer</h2>
            <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Search by name or specialty..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
            {filteredTrainers.map(trainer => (
                <Card key={trainer.id}>
                    <CardContent className="flex flex-col items-center text-center p-6">
                    <Avatar className="w-24 h-24 mb-4">
                        <AvatarImage src={trainer.avatar.src} alt={trainer.avatar.alt} data-ai-hint={trainer.avatar['data-ai-hint']} />
                        <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold">{trainer.name}</h3>
                    <p className="text-muted-foreground">{trainer.specialty}</p>
                    <div className="flex items-center gap-1 my-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold">{trainer.rating}</span>
                        <span className="text-sm text-muted-foreground">({trainer.location})</span>
                    </div>
                    {trainer.phone && <div className="flex items-center gap-4 mt-2">
                       <a href={`tel:${trainer.phone}`}><Phone className="w-5 h-5 text-muted-foreground hover:text-primary"/></a>
                       <a href={`https://wa.me/${trainer.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                           <MessageSquare className="w-5 h-5 text-muted-foreground hover:text-primary"/>
                        </a>
                    </div>}
                    </CardContent>
                    <CardFooter>
                        <ScheduleSessionDialog trainer={trainer} onSessionScheduled={handleSessionScheduled}>
                             <Button className="w-full">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Request a Session
                            </Button>
                        </ScheduleSessionDialog>
                    </CardFooter>
                </Card>
            ))}
            </div>
            {filteredTrainers.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    <p>No trainers found matching your search.</p>
                </div>
            )}
        </div>
      </div>
      <div className="lg:col-span-1 space-y-8">
        {lastAssignedTrainerSession && (
            <Card>
                <CardHeader>
                    <CardTitle>Last Scheduled Session</CardTitle>
                    <CardDescription>With {lastAssignedTrainerSession.trainerName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{format(new Date(lastAssignedTrainerSession.sessionDate), "PPP")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{lastAssignedTrainerSession.sessionTime}</span>
                    </div>
                </CardContent>
            </Card>
        )}
        <Card>
            <CardHeader>
            <CardTitle>Add Plan from Trainer</CardTitle>
            <CardDescription>If your trainer gave you a plan code, enter it here.</CardDescription>
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
      </div>
    </div>
  );
}
