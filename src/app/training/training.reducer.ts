import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  TrainingActions,
  SET_AVAILABLE_TRAININGS,
  SET_WEEK_PLAN
} from './training.actions';
import { Exercise } from './models/exercise.model';
import * as fromRoot from '../app.reducer';

export interface TrainingState {
  availableExercises: Exercise[];
  weekPlan: any;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initalState: TrainingState = {
  availableExercises: [],
  weekPlan: []
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
    default:
      return state;
  }
}
export const getTrainingState = createFeatureSelector<TrainingState>('training');
export const getAvailableExercises = createSelector(getTrainingState,  (state: TrainingState) => state.availableExercises);
export const getWeekPlan = createSelector(getTrainingState,  (state: TrainingState) => state.weekPlan);
