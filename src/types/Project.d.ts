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
  deadline_decision?: "closed" | "continued" | null;
  deadline_decision_date?: string | null;
  };