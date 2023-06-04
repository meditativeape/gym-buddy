import { Workout } from "./interfaces";

export const workouts: Workout[] = [
    {
      id: 1,
      date: new Date(2023, 1, 1),
      name: "Workout 1",
      exercises: [
        {
          id: 1,
          name: "Bench Press",
          sets: [
            {
              id: 1,
              weight: 200,
              reps: 10,
            },
            {
              id: 2,
              weight: 205,
              reps: 8,
            },
          ],
        },
        {
          id: 2,
          name: "Squats",
          sets: [
            {
              id: 1,
              weight: 250,
              reps: 10,
            },
            {
              id: 2,
              weight: 255,
              reps: 8,
            },
          ],
        },
      ],
      supersets: [1, 2],
    },
    {
      id: 2,
      date: new Date(2023, 1, 2),
      name: "Workout 2",
      exercises: [
        {
          id: 1,
          name: "Deadlift",
          sets: [
            {
              id: 1,
              weight: 300,
              reps: 10,
            },
            {
              id: 2,
              weight: 305,
              reps: 8,
            },
          ],
        },
      ],
      supersets: [],
    },
    {
      id: 3,
      date: new Date(2023, 1, 3),
      name: "Workout 3",
      exercises: [
        {
          id: 1,
          name: "Single Arm Dumbbell Row",
          sets: [
            {
              id: 1,
              weight: 30,
              reps: 10,
            },
            {
              id: 2,
              weight: 30,
              reps: 8,
            },
          ],
        },
      ],
      supersets: [],
    },
  ];
