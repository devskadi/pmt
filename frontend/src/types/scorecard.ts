/* Scorecard Types */

export interface Scorecard {
  id: string;
  project_id: string;
  criteria: ScorecardCriteria[];
  created_at: string;
  updated_at: string;
}

export interface ScorecardCriteria {
  name: string;
  weight: number;
  score: number;
}

export interface WeightConfig {
  criteria_name: string;
  weight: number;
}
