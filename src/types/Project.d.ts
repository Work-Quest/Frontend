export type Project = {
  project_id: string;          
  project_name: string;
  status: "Working" | "Done"; 
  // Backend returns `owner` (BusinessUser id). Some older frontend code used `owner_id`.
  owner?: string;
  owner_id?: string;            
  owner_username: string;
  created_at: string;          
  deadline: string;            
  total_tasks: number;
  completed_tasks: number;
  /** Current project boss display name (from API). */
  boss_name?: string | null;
  /** Sprite folder id, e.g. `b01` — matches `public/assets/sprites/bosses/{id}/`. */
  boss_image?: string | null;
  deadline_decision?: "closed" | "continued" | null;
  deadline_decision_date?: string | null;
  };

export type FinishedProjectSummary = {
  project_id: string;
  project_name: string;
  score: number;
  boss_count: number;
};