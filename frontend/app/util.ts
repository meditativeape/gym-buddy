import { ExerciseSet, Workout } from './interfaces';

export const createWorkout: (id: number, name: string) => Workout = (id, name) => {
  return {
    id: id,
    date: new Date(),
    name: name,
    exercises: [],
    supersets: [],
  };
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

/**
 * Reducer functions.
 */

export const workoutReducer: (workout: Workout, action: any) => Workout = (workout, action) => {
  console.log(action);
  switch (action.type) {
    case 'addExercise':
      const exerciseId = Math.max(...workout.exercises.map(e => e.id)) + 1;
      return {
        ...workout,
        exercises: [
          ...workout.exercises,
          {
            id: exerciseId,
            name: action.exerciseName,
            sets: [],
          }
        ]
      };
    case 'updateExerciseName':
      return {
        ...workout,
        exercises: workout.exercises.map(e => {
          if (e.id == action.exerciseId) {
            return {
              ...e,
              name: action.exerciseName,
            }
          }
          return e;
        }),
      };
    case 'deleteExercise':
      return {
        ...workout,
        exercises: workout.exercises.filter(e => e.id !== action.exerciseId),
      };
    case 'addExerciseSet':
      return {
        ...workout,
        exercises: workout.exercises.map(e => {
          if (e.id == action.exerciseId) {
            return {
              ...e,
              sets: [
                ...e.sets,
                action.exerciseSet,
              ],
            };
          }
          return e;
        }),
      };
    case 'updateExerciseSet':
      return {
        ...workout,
        exercises: workout.exercises.map(e => {
          if (e.id == action.exerciseId) {
            return {
              ...e,
              sets: e.sets.map(s => {
                if (s.id == action.exerciseSet.id) {
                  return action.exerciseSet;
                }
                return s;
              }),
            };
          }
          return e;
        }),
      };
    case 'deleteExerciseSet':
      return {
        ...workout,
        exercises: workout.exercises.map(e => {
          if (e.id == action.exerciseId) {
            return {
              ...e,
              sets: e.sets.filter(s => s.id !== action.exerciseSetId),
            };
          }
          return e;
        }),
      };
    case 'addSuperset':
      return {
        ...workout,
        supersets: [...workout.supersets, action.exerciseId]
      };
    case 'deleteSuperset':
      return {
        ...workout,
        supersets: workout.supersets.filter(e => e !== action.exerciseId),
      };
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export const workoutsReducer: (workouts: Workout[], action: any) => Workout[] = (workouts, action) => {
  console.log(action);
  switch (action.type) {
    case 'updateWorkout':
      const idx = workouts.findIndex(item => item.id == action.workout.id);
      if (idx === -1) {
        return [
          ...workouts,
          action.workout,
        ];
      } else {
        return workouts.map(w => {
          if (w.id === action.workout.id) {
            return action.workout;
          } else {
            return w;
          }
        });
      }
    default: {
        throw Error('Unknown action: ' + action.type);
      }
  }
};
  