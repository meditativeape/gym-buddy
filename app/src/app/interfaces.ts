export interface ExerciseSet {
  weight: number,
  reps: number,
}

export interface Exercise {
  id: number,
  name: string,
  sets: ExerciseSet[],
}

export interface Superset {
  exerciseIds: number[],
}

export interface Workout {
  id: number,
  date: Date,
  name: string,
  exercises: Exercise[],
  supersets: Superset[],
}
