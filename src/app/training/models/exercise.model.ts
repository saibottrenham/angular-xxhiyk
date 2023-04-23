import { Timestamp } from '@firebase/firestore-types';


export interface Exercise {
  id: string;
  userID?: string;
  name: string;
  link: string;
  weight: number;
  sets: number;
  reps: number;
  date?: Timestamp;
  lastModified?: Timestamp;
}

export interface WeekPlan {
  id: string;
  userID?: string;
  week: any;
}
