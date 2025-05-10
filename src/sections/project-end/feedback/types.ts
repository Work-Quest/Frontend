export interface UserInfo {
    user_name: string;
    work_category: string;
    team_work: number;
    work_speed: number;
    overall_quality_score: number;
    work_load_per_day: string;
  }
  
  export interface FeedbackResponse {
    assigned_role: string;
    feedback: string;
    overall_quality_score: number;
    role_explanation: string;
    team_work: number;
    user_name: string;
    work_category: string;
    work_load_per_day: string;
    work_speed: number;
  }
  
  export interface FeedbackProps {
    users: UserInfo[];
  }