export interface Exercise {
  id: string;
  userID: string;
  name: string;
  link: string;
  weight: number;
  date?: Date;
  state?: 'completed' | 'cancelled' | null;
}
