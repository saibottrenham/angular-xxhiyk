import { Timestamp } from '@firebase/firestore-types';


export interface Exercise {
  id: string;
  userID?: string;
  name: string;
  link: string;
  weight: string;
  sets: string;
  reps: string;
  date?: Timestamp;
  lastModified?: Timestamp;
}

export interface WeekPlan {
  id: string;
  userID?: string;
  week: any;
}
