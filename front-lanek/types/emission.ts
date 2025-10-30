export interface Emission {
  id: number;
  amount: number;
  calculated_co2e: number;
  created_at: string;
  description: string;
  recorded_at: string;
  source_id: number;
  title: string;
  user_id: number;
}
