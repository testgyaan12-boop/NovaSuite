import type { WorkoutPlan } from "./types";

export const TRAINER_ROUTINES: { [key: string]: WorkoutPlan } = {
  "APEX-START": {
    id: "trainer-1",
    name: "Foundation Builder",
    description: "A 3-day full-body routine perfect for beginners to build a solid strength foundation.",
    exercises: [
      {
        id: "ex1",
        name: "Squats",
        sets: [
          { id: "set1", reps: 10, weight: 20 },
          { id: "set2", reps: 10, weight: 20 },
          { id: "set3", reps: 10, weight: 20 },
        ],
      },
      {
        id: "ex2",
        name: "Bench Press",
        sets: [
          { id: "set1", reps: 10, weight: 30 },
          { id: "set2", reps: 10, weight: 30 },
          { id: "set3", reps: 10, weight: 30 },
        ],
      },
      {
        id: "ex3",
        name: "Deadlift",
        sets: [{ id: "set1", reps: 8, weight: 40 }],
      },
    ],
  },
  "APEX-SHRED": {
    id: "trainer-2",
    name: "Hypertrophy Shred",
    description: "A 5-day split routine focused on muscle growth and definition.",
    exercises: [
      {
        id: "ex1",
        name: "Incline Dumbbell Press",
        sets: [
          { id: "set1", reps: 12, weight: 15 },
          { id: "set2", reps: 12, weight: 15 },
          { id: "set3", reps: 12, weight: 15 },
          { id: "set4", reps: 12, weight: 15 },
        ],
      },
      {
        id: "ex2",
        name: "Lat Pulldowns",
        sets: [
          { id: "set1", reps: 12, weight: 40 },
          { id: "set2", reps: 12, weight: 40 },
          { id: "set3", reps: 12, weight: 40 },
          { id: "set4", reps: 12, weight: 40 },
        ],
      },
    ],
  },
};

export const EXERCISE_SUGGESTIONS = [
    "Squat",
    "Bench Press",
    "Deadlift",
    "Overhead Press",
    "Barbell Row",
    "Pull Up",
    "Chin Up",
    "Dip",
    "Lat Pulldown",
    "Leg Press",
    "Leg Curl",
    "Leg Extension",
    "Bicep Curl",
    "Tricep Extension",
    "Dumbbell Fly",
    "Lateral Raise",
    "Plank",
    "Crunch",
    "Running",
    "Cycling"
]
