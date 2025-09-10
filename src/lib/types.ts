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
  name: string;
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
}

export interface ProgressLog {
  id: string;
  date: string; // ISO string
  bodyFat: number;
}

export interface UserProfile {
  age?: number;
  height?: number;
  sex?: 'male' | 'female';
}
