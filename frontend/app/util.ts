import { DeleteItemSpec, Exercise, ExerciseSet, Workout } from './interfaces';

export const createNewWorkout: (id: number) => Workout = (id) => {
  return {
    id: id,
    date: new Date(),
    name: "New Workout",
    exercises: [],
    supersets: [],
  };
};

export const createNewExercise: (id: number) => Exercise = (id) => {
  return {
    id: id,
    name: "New Exercise",
    sets: [],
  };
};

const copyExerciseSet: (exerciseSet: ExerciseSet) => ExerciseSet = (exerciseSet) => {
  return {...exerciseSet};
};

const copyExercise: (exercise: Exercise) => Exercise = (exercise) => {
  return {
    ...exercise,
    sets: exercise.sets.map(copyExerciseSet),
  };
};

export const copyWorkout: (workout: Workout) => Workout = (workout) => {
  const workoutCopy: Workout = {
    ...workout,
    exercises: workout.exercises.map(copyExercise),
    supersets: [...workout.supersets],
  }
  return workoutCopy;
};

export const copyWorkouts: (workouts: Workout[]) => Workout[] = (workouts) => {
  return workouts.map(copyWorkout);
};

export const addOrUpdateWorkout = (workouts: Workout[], newWorkout: Workout) => {
  const idx = workouts.findIndex(item => item.id == newWorkout.id);
  if (idx === -1) {
    workouts.push(newWorkout);
  } else {
    workouts[idx] = newWorkout;
  }
};

export const addOrUpdateSet = (workout: Workout, exerciseId: number, exerciseSet: ExerciseSet) => {
  const exercise = workout.exercises.find(item => item.id === exerciseId);
  if (!exercise) return;
  const setIdx = exercise.sets.findIndex(item => item.id === exerciseSet.id);
  if (setIdx !== -1) {
    exercise.sets[setIdx] = exerciseSet;
  } else {
    exercise.sets.push(exerciseSet);
  }
};

export const deleteWorkoutItem: (workout: Workout, spec: DeleteItemSpec) => void = (workout, spec) => {
  if (spec.exerciseSetId <= -1) { 
    // Delete exercise
    workout.exercises = workout.exercises.filter(item => item.id != spec.exerciseId);
    workout.supersets = workout.supersets.filter(item => item != spec.exerciseId);
    return;
  }
  // Delete exercise set
  const targetExercise = workout.exercises.find(item => item.id == spec.exerciseId);
  if (!targetExercise) return;
  targetExercise.sets = targetExercise.sets.filter(item => item.id != spec.exerciseSetId);
};

/**
 * Formatting functions.
 */

export const formatDate = (date: Date) => {
  const month = date.getMonth() + 1; // Months are 0-11 in JavaScript
  const day = date.getDate();

  // Pad the month and day with leading zeros if necessary
  const paddedMonth = month.toString().padStart(2, '0');
  const paddedDay = day.toString().padStart(2, '0');

  return paddedMonth + '/' + paddedDay;
};

export const formatExerciseSets = (sets: ExerciseSet[]) => {
  return sets.map((s) => `${s.weight}lbs * ${s.reps}`).join(', ');
};

export const formatWorkoutTitle = (workout: Workout) => {
  return formatDate(workout.date) + " " + workout.name;
};

export const formatWorkoutShortDesc = (workout: Workout) => {
  return workout.exercises.map(exercise => exercise.name).join(', ');
};
