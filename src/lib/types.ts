import { type SuggestDietPlanOutput } from "@/ai/flows/suggest-diet-plan";

export interface ExerciseSet {
  id: string;
  reps: number;
  weight: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

export interface WorkoutLog {
  id: string;
  date: string; // ISO string
  name:string;
  exercises: Exercise[];
  notes?: string;
}

export interface WorkoutPlan {
  id:string;
  name: string;
  description?: string;
  exercises: Exercise[];
}

export interface ScheduledWorkout {
  id: string;
  planId: string;
  date: string; // YYYY-MM-DD
}

export interface DietPlan {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}

export interface ProgressLog {
  id: string;
  date: string; // ISO string
  bodyFat: number;
}

export interface UserProfile {
  age?: number;
  height?: number;
  weight?: number;
  sex?: 'male' | 'female';
}

export interface MembershipDetails {
  gymName: string;
  gymLocation: string;
  planName: string;
  renewalDate: string;
  planPrice: number;
  trainerName: string;
  nextSession: string;
  trainerFee: number;
  attendance: { date: string }[];
  renewalHistory: { date: string; amount: number }[];
}

export interface SavedDietPlan extends SuggestDietPlanOutput {
    id: string;
    savedAt: string; // ISO string
}