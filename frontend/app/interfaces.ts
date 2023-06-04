export interface ExerciseSet {
  id: number,
  weight: number,
  reps: number,
}

export interface Exercise {
  id: number,
  name: string,
  sets: ExerciseSet[],
}

export interface Workout {
  id: number,
  date: Date,
  name: string,
  exercises: Exercise[],
  supersets: number[],
}

export interface DeleteItemSpec {
  exerciseId: number,
  exerciseSetId: number,
}
