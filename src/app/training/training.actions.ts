import { Action } from '@ngrx/store';
import { Exercise } from './models/exercise.model';

export const SET_AVAILABLE_TRAININGS = '[Training] Set Available Trainings';
export const SET_WEEK_PLAN = '[Training] Set Week Plan';
export const SET_ANALYTICS = '[Training] Set Analytics';

export class SetAvailableTrainings implements Action {
  readonly type = SET_AVAILABLE_TRAININGS;

  constructor(public payload: Exercise[]) {}
}

export class SetWeekPlan implements Action {
  readonly type = SET_WEEK_PLAN;

  constructor(public payload: any) {}
}

export class SetAnalytics implements Action {
  readonly type = SET_ANALYTICS;

  constructor(public payload: any) {}
}

export type TrainingActions =
  SetAvailableTrainings |
  SetWeekPlan | 
  SetAnalytics;
