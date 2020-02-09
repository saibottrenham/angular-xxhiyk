export interface Exercise {
  id: string;
  user: string;
  name: string;
  link: string;
  weight: number;
  date?: Date;
  state?: 'completed' | 'cancelled' | null;
}
