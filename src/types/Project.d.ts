export type Project = {
  project_id: string;          
  project_name: string;
  status: "Working" | "Done"; 
  owner_id: string;            
  owner_name: string;
  created_at: string;          
  deadline: string;            
  total_tasks: number;
  completed_tasks: number;
  };