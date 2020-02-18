import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  TrainingActions,
  STOP_TRAINING,
  START_TRAINING,
  SET_AVAILABLE_TRAININGS,
  SET_FINISHED_TRAININGS,
  SET_WEEK_PLAN
} from './training.actions';
import { Exercise } from './exercise.model';
import * as fromRoot from '../app.reducer';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise;
  weekPlan: any;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initalState: TrainingState = {
  availableExercises: [],
  weekPlan: [],
  finishedExercises: [],
  activeTraining: null
};

export function trainingReducer(state = initalState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return {
        ...state,
        availableExercises: action.payload
      };
    case SET_WEEK_PLAN:
      return {
        ...state,
        weekPlan: action.payload
      };
    case SET_FINISHED_TRAININGS:
      return {
        ...state,
        finishedExercises: action.payload
      };
    case START_TRAINING:
      return {
        ...state,
        activeTraining: {...state.availableExercises.find(ex => ex.id === action.payload)}
      };
    case STOP_TRAINING:
      return {
        ...state,
        activeTraining: null
      };
    default:
      return state;
  }
}
export const getTrainingState = createFeatureSelector<TrainingState>('training');
export const getAvailableExercises = createSelector(getTrainingState,  (state: TrainingState) => state.availableExercises);
export const getWeekPlan = createSelector(getTrainingState,  (state: TrainingState) => state.weekPlan);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getActiveTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining);
export const getIsTraining =  createSelector(getTrainingState, (state: TrainingState) => state.activeTraining != null);
