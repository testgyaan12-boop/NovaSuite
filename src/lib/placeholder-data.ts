import type { WorkoutPlan, MembershipDetails, PersonalTrainer, Trainer } from "./types";

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

export const DUMMY_GYMS = [
  {
    id: 'gym-1',
    name: 'Powerhouse Gym',
    address: '123 Muscle Beach, Venice, CA',
    phone: '555-123-4567',
    plans: [
      { name: 'Basic', price: '$30/mo' },
      { name: 'Premium', price: '$50/mo' },
    ],
    images: [
      {
        src: 'https://picsum.photos/seed/gym1-1/600/400',
        alt: 'Powerhouse Gym interior with weights',
        width: 600,
        height: 400,
        "data-ai-hint": 'modern gym weights'
      },
      {
        src: 'https://picsum.photos/seed/gym1-2/600/400',
        alt: 'Powerhouse Gym cardio area',
        width: 600,
        height: 400,
        "data-ai-hint": 'gym cardio machines'
      },
       {
        src: 'https://picsum.photos/seed/gym1-3/600/400',
        alt: 'Powerhouse Gym yoga studio',
        width: 600,
        height: 400,
        "data-ai-hint": 'yoga studio'
      }
    ]
  },
  {
    id: 'gym-2',
    name: 'Iron Temple Fitness',
    address: '456 Flex Avenue, Austin, TX',
    phone: '555-765-4321',
    plans: [
      { name: 'Standard', price: '$40/mo' },
      { name: 'Elite', price: '$65/mo' },
    ],
     images: [
       {
        src: 'https://picsum.photos/seed/gym2-1/600/400',
        alt: 'Iron Temple Fitness weight room',
        width: 600,
        height: 400,
        "data-ai-hint": 'weightlifting gym'
      },
      {
        src: 'https://picsum.photos/seed/gym2-2/600/400',
        alt: 'Iron Temple Fitness squat racks',
        width: 600,
        height: 400,
        "data-ai-hint": 'gym squat rack'
      }
    ]
  },
];

export const PROMOTIONS = [
  {
    id: 'promo-1',
    title: 'Summer Shred Challenge!',
    description: 'Sign up now and get 2 free personal training sessions.',
    image: {
      src: 'https://picsum.photos/seed/promo1/1200/400',
      alt: 'Promotion for a summer fitness challenge',
      width: 1200,
      height: 400,
      "data-ai-hint": 'fitness promotion'
    }
  }
]

export const DUMMY_MEMBERSHIP: MembershipDetails = {
  gymName: 'Powerhouse Gym',
  gymLocation: '123 Muscle Beach, Venice, CA',
  planName: 'Premium',
  renewalDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
  planPrice: 50,
  trainerName: 'John Doe',
  nextSession: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
  trainerFee: 75,
  attendance: [
    { date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
    { date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString() },
    { date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() },
    { date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString() },
    { date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString() },
    { date: new Date(new Date().setDate(new Date().getDate() - 11)).toISOString() },
    { date: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString() },
    { date: new Date(new Date().setDate(new Date().getDate() - 18)).toISOString() },
  ],
  renewalHistory: [
    { date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), amount: 50 },
    { date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(), amount: 50 },
    { date: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(), amount: 45 },
  ]
}

export const ASSIGNED_TRAINER: PersonalTrainer = {
    name: "Jane Smith",
    specialty: "Strength & Conditioning",
    email: "jane.smith@example.com",
    nextSession: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    fee: 80,
    avatar: {
        src: 'https://picsum.photos/seed/trainer-jane/400/400',
        alt: 'Portrait of Jane Smith',
        "data-ai-hint": "female trainer portrait"
    }
};

export const NEARBY_TRAINERS: Trainer[] = [
    {
        id: 't1',
        name: 'Mike Johnson',
        specialty: 'Powerlifting',
        location: 'Venice, CA',
        rating: 4.8,
        avatar: {
            src: 'https://picsum.photos/seed/trainer-mike/400/400',
            alt: 'Portrait of Mike Johnson',
            "data-ai-hint": "male trainer portrait"
        }
    },
    {
        id: 't2',
        name: 'Emily Williams',
        specialty: 'Yoga & Flexibility',
        location: 'Santa Monica, CA',
        rating: 4.9,
        avatar: {
            src: 'https://picsum.photos/seed/trainer-emily/400/400',
            alt: 'Portrait of Emily Williams',
            "data-ai-hint": "female yoga instructor"
        }
    },
    {
        id: 't3',
        name: 'Chris Lee',
        specialty: 'CrossFit',
        location: 'Venice, CA',
        rating: 4.7,
        avatar: {
            src: 'https://picsum.photos/seed/trainer-chris/400/400',
            alt: 'Portrait of Chris Lee',
            "data-ai-hint": "male crossfit trainer"
        }
    }
];
