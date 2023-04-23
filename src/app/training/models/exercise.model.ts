export interface Exercise {
  id: string;
  userID?: string;
  name: string;
  link: string;
  weight: number;
  sets: number;
  reps: number;
  date?: Date;
  lastModified?: Date;
}

export interface WeekPlan {
  id: string;
  userID?: string;
  week: any;
}
